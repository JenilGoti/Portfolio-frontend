"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

type ChatMessage = {
  id: string;
  role: "user" | "agent" | "system" | "error";
  text: string;
};

type ParsedListItem = {
  number: string;
  title: string;
  body: string;
};

type ParsedBulletSection = {
  title: string;
  items: Array<{
    title: string;
    body: string;
  }>;
};

const socketUrl = (process.env.NEXT_PUBLIC_AGENT_SOCKET_URL ?? "http://localhost:8000").replace(/\/+$/, "");
const socketPath = `/${(process.env.NEXT_PUBLIC_AGENT_SOCKET_PATH ?? "socket.io").replace(/^\/+/, "")}`;
const threadId = process.env.NEXT_PUBLIC_AGENT_THREAD_ID ?? "portfolio-chat";
const socketTransports = (process.env.NEXT_PUBLIC_AGENT_SOCKET_TRANSPORTS ?? "websocket")
  .split(",")
  .map((transport) => transport.trim())
  .filter(Boolean) as Array<"websocket" | "polling">;

export function PortfolioAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      text: "Ask the portfolio agent about Jenil's projects, AI skills, experience, or education."
    }
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Connecting");
  const [isWaitingForAgent, setIsWaitingForAgent] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const connectionErrorShownRef = useRef(false);

  const suggestions = useMemo(
    () => [
      "List Jenil's AI projects",
      "What agentic AI work has Jenil done?",
      "Summarize Jenil's ML experience"
    ],
    []
  );

  const addMessage = useCallback((role: ChatMessage["role"], text: string) => {
    setMessages((current) => [
      ...current,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role,
        text
      }
    ]);
  }, []);

  useEffect(() => {
    const socket = io(socketUrl, {
      path: socketPath,
      transports: socketTransports
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      connectionErrorShownRef.current = false;
      setIsConnected(true);
      setStatus("Connected");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setIsWaitingForAgent(false);
      setStatus("Disconnected");
    });

    socket.on("connect_error", (error) => {
      setIsConnected(false);
      setIsWaitingForAgent(false);
      setStatus("Connection error");

      if (!connectionErrorShownRef.current) {
        connectionErrorShownRef.current = true;
        addMessage("error", `Could not connect to ${socketUrl}${socketPath}: ${error.message}`);
      }
    });

    socket.on("agent_status", (data: { status?: string }) => {
      setStatus(data.status ?? "Working");
    });

    socket.on("agent_message", (data: { message?: string }) => {
      addMessage("agent", data.message ?? "The agent responded without message text.");
      setIsWaitingForAgent(false);
      setStatus("Connected");
    });

    socket.on("agent_error", (data: { error?: string }) => {
      addMessage("error", data.error ?? "The portfolio agent returned an unknown error.");
      setIsWaitingForAgent(false);
      setStatus("Agent error");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [addMessage]);

  useEffect(() => {
    const messagesElement = messagesRef.current;

    if (!messagesElement) return;

    messagesElement.scrollTo({
      top: messagesElement.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  useEffect(() => {
    document.body.classList.toggle("agent-fullscreen-open", isExpanded);

    return () => {
      document.body.classList.remove("agent-fullscreen-open");
    };
  }, [isExpanded]);

  function sendMessage(message: string) {
    const trimmed = message.trim();

    if (!trimmed) return;

    addMessage("user", trimmed);
    setInput("");
    setIsWaitingForAgent(true);
    setStatus(isConnected ? "Thinking" : "Trying to connect");

    socketRef.current?.emit("user_message", {
      message: trimmed,
      thread_id: threadId
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  function getMessageLabel(role: ChatMessage["role"]) {
    if (role === "agent") return "Agent";
    if (role === "user") return "You";
    if (role === "error") return "Error";

    return "System";
  }

  return (
    <section className={`agent-section shell reveal ${isExpanded ? "agent-section--expanded" : ""}`} id="ai-agent">
      <div className="agent-section__copy">
        <p className="eyebrow">AI Agent</p>
        <h2>Ask my portfolio directly.</h2>
        <p>
          This chat connects to the portfolio agent over Socket.IO and can answer questions from the backend you built.
        </p>
        <div className={`agent-status ${isConnected ? "agent-status--online" : ""}`}>
          <span aria-hidden="true" />
          {status}
        </div>
        {/* <p className="agent-endpoint">Endpoint: {socketUrl}{socketPath}</p> */}
      </div>

      <div className={`agent-chat animated-card ${isExpanded ? "agent-chat--expanded" : ""}`}>
        <div className="agent-chat__topbar">
          <div>
            <span>Portfolio intelligence</span>
            <strong>Live agent console</strong>
          </div>
          <div className="agent-chat__topbar-actions">
            <small>{threadId}</small>
            <button type="button" onClick={() => setIsExpanded((current) => !current)}>
              {isExpanded ? "Close" : "Full screen"}
            </button>
          </div>
        </div>

        <div className="agent-chat__messages" aria-live="polite" ref={messagesRef}>
          {messages.map((message) => (
            <div className={`agent-message agent-message--${message.role}`} key={message.id}>
              <span>{getMessageLabel(message.role)}</span>
              {message.role === "agent" ? <AgentResponse text={message.text} /> : <p>{message.text}</p>}
            </div>
          ))}
        </div>

        <div className="agent-chat__suggestions" aria-label="Suggested questions">
          {suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              disabled={isWaitingForAgent}
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault();
                sendMessage(suggestion);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form className="agent-chat__form" onSubmit={handleSubmit}>
          <input
            aria-label="Message for portfolio agent"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isWaitingForAgent}
            placeholder="Ask about projects, skills, or experience"
          />
          <button type="submit" disabled={isWaitingForAgent || !input.trim()}>
            {isWaitingForAgent ? "Thinking" : "Ask"}
          </button>
        </form>
      </div>
    </section>
  );
}

function AgentResponse({ text }: { text: string }) {
  const parsed = parseAgentText(text);
  const bulletSections = parseBulletSections(text);

  if (!parsed.items.length) {
    if (bulletSections.sections.length) {
      return (
        <div className="agent-rich-text">
          {bulletSections.intro ? <p>{renderInlineText(bulletSections.intro)}</p> : null}
          <div className="agent-section-list">
            {bulletSections.sections.map((section) => (
              <section className="agent-answer-section" key={section.title}>
                <h3>{renderInlineText(section.title.replace(/:$/, ""))}</h3>
                <div className="agent-result-list">
                  {section.items.map((item) => (
                    <article className="agent-result-card agent-result-card--bullet" key={`${section.title}-${item.title}`}>
                      <strong>
                        <span aria-hidden="true" />
                        {renderInlineText(item.title)}
                      </strong>
                      {item.body ? <p>{renderInlineText(item.body)}</p> : null}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
          {bulletSections.outro ? <p>{renderInlineText(bulletSections.outro)}</p> : null}
        </div>
      );
    }

    const compactBullets = parseCompactBullets(text);

    if (compactBullets.length) {
      return (
        <div className="agent-rich-text">
          <div className="agent-result-list agent-result-list--compact">
            {compactBullets.map((item) => (
              <article className="agent-result-card agent-result-card--bullet" key={item}>
                <strong>
                  <span aria-hidden="true" />
                  {renderInlineText(item)}
                </strong>
              </article>
            ))}
          </div>
        </div>
      );
    }

    return <div className="agent-rich-text">{renderInlineText(text)}</div>;
  }

  return (
    <div className="agent-rich-text">
      {parsed.intro ? <p>{renderInlineText(parsed.intro)}</p> : null}
      <div className="agent-result-list">
        {parsed.items.map((item) => (
          <article className="agent-result-card" key={`${item.number}-${item.title}`}>
            <strong>
              <span>{item.number}</span>
              {renderInlineText(item.title)}
            </strong>
            <p>{renderInlineText(item.body)}</p>
          </article>
        ))}
      </div>
      {parsed.outro ? <p>{renderInlineText(parsed.outro)}</p> : null}
    </div>
  );
}

function parseCompactBullets(text: string) {
  const trimmed = text.trim();

  if (!trimmed.startsWith("*")) return [];

  return trimmed
    .split(/\s+\*\s+/)
    .map((item) => item.replace(/^\*\s*/, "").trim())
    .filter(Boolean);
}

function parseBulletSections(text: string) {
  const headingMatches = [...text.matchAll(/((?:Jenil|His|Her|Their|The|These|He|She)[^:*]{0,180}?:)\s*(?=\*)/gi)];

  if (!headingMatches.length || !text.includes("*")) {
    return { intro: "", sections: [] as ParsedBulletSection[], outro: "" };
  }

  const intro = text.slice(0, headingMatches[0].index).trim();
  let outro = "";

  const sections = headingMatches
    .map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const next = headingMatches[index + 1]?.index ?? text.length;
      let sectionText = text.slice(start, next).trim();
      const outroMatch = sectionText.match(/^(.*?)(\s+(?:Overall,|Together,|In summary,|He has also|She has also|Jenil also).*)$/);

      if (outroMatch && index === headingMatches.length - 1) {
        sectionText = outroMatch[1].trim();
        outro = outroMatch[2].trim();
      }

      const bulletItems = [...sectionText.matchAll(/\*\s+(.+?)(?=\s+\*\s+|$)/g)].map((bullet) => {
        const value = bullet[1].trim();
        const splitIndex = value.indexOf(":");

        if (splitIndex > 0 && splitIndex < 80) {
          return {
            title: value.slice(0, splitIndex).trim(),
            body: value.slice(splitIndex + 1).trim()
          };
        }

        return {
          title: value,
          body: ""
        };
      });

      return {
        title: match[1].trim(),
        items: bulletItems
      };
    })
    .filter((section) => section.items.length);

  return { intro, sections, outro };
}

function parseAgentText(text: string) {
  const matches = [...text.matchAll(/(\d+)\.\s+\*\*(.*?)\*\*:\s*/g)];

  if (!matches.length) {
    return { intro: text, items: [] as ParsedListItem[], outro: "" };
  }

  const intro = text.slice(0, matches[0].index).trim();
  const items = matches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const next = matches[index + 1]?.index ?? text.length;
    return {
      number: match[1],
      title: match[2],
      body: text.slice(start, next).trim()
    };
  });

  let outro = "";
  const lastItem = items.at(-1);

  if (lastItem) {
    const outroMatch = lastItem.body.match(/^(.*?)(\s+(?:These projects|This project|Overall,|Together,).*)$/);

    if (outroMatch) {
      lastItem.body = outroMatch[1].trim();
      outro = outroMatch[2].trim();
    }
  }

  return { intro, items, outro };
}

function renderInlineText(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}
