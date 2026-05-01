import type { ReactNode } from "react";
import {
  Certification,
  EducationItem,
  ExperienceItem,
  formatDate,
  Language,
  PersonalInfo,
  Profile,
  Project,
  Publication,
  SkillGroups,
  Testimonial,
  titleFromKey
} from "@/lib/profile";

type HeroProps = {
  profile: Profile;
};

export function NavBar({ info }: { info: PersonalInfo }) {
  const links = [
    { href: "#skills", label: "Skills" },
    { href: "#ai-agent", label: "AI Agent" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <header className="site-header">
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="nav__brand" href="#home" aria-label="Go to home">
          <span>{info.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span>
          <strong>{info.name.split(" ")[0]}</strong>
        </a>
        <div className="nav__links">
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
          {info.cv_file ? (
            <a className="nav__download" href={info.cv_file} download>
              Download CV
            </a>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

export function Hero({ profile }: HeroProps) {
  const info = profile.personal_info;
  const heroStats = [
    { label: "Projects", value: profile.projects.length },
    { label: "Experience", value: profile.experience.length },
    { label: "Skill Areas", value: Object.keys(profile.skills).length }
  ];

  return (
    <section className="hero" id="home">
      <div className="hero__grid shell">
        <div className="hero__content reveal">
          <p className="eyebrow">{info.current_location}</p>
          <h1>{info.name}</h1>
          <p className="hero__highlight">{info.highlight}</p>
          <p className="hero__summary">{profile.summary}</p>
          <div className="hero__actions">
            {info.email ? <a href={`mailto:${info.email}`}>Email me</a> : null}
            {info.cv_file ? (
              <a href={info.cv_file} download>
                Download CV
              </a>
            ) : null}
            {info.github_id ? <a href={info.github_id}>GitHub</a> : null}
            {info.linkedin_id ? <a href={info.linkedin_id}>LinkedIn</a> : null}
          </div>
        </div>
        <aside className="hero-card reveal reveal--late" aria-label="Profile overview">
          <div className="hero-card__image">
            <img src={info.profile_image ?? "/profile-avatar.svg"} alt={`${info.name} profile`} />
          </div>
          <div className="hero-card__body">
            <p className="hero-card__kicker">AI portfolio</p>
            <h2>Agentic AI, ML systems, and production-ready interfaces.</h2>
            <div className="hero-card__stats">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function ContactBar({ info }: { info: PersonalInfo }) {
  const contacts = [
    info.email && { label: "Email", value: info.email, href: `mailto:${info.email}` },
    info.phone && { label: "Phone", value: info.phone, href: `tel:${info.phone.replaceAll(" ", "")}` },
    info.current_location && { label: "Location", value: info.current_location }
  ].filter(Boolean) as Array<{ label: string; value: string; href?: string }>;

  return (
    <section className="contact-strip shell" aria-label="Contact details">
      {contacts.map((item) => (
        <div className="contact-strip__item" key={item.label}>
          <span>{item.label}</span>
          {item.href ? <a href={item.href}>{item.value}</a> : <strong>{item.value}</strong>}
        </div>
      ))}
    </section>
  );
}

export function Skills({ skills }: { skills: SkillGroups }) {
  return (
    <Section eyebrow="Capabilities" title="Skills" id="skills">
      <div className="skill-grid">
        {Object.entries(skills).map(([group, items]) => (
          <article className="panel animated-card" key={group}>
            <h3>{titleFromKey(group)}</h3>
            <div className="tag-list">
              {items.map((skill) => (
                <span className="tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Experience({ experience }: { experience: ExperienceItem[] }) {
  return (
    <Section eyebrow="Work" title="Experience" id="experience">
      <div className="timeline">
        {experience.map((item) => (
          <article className="timeline__item animated-card" key={`${item.company}-${item.role}`}>
            <div>
              <p className="date-range">
                {formatDate(item.start_date)} - {item.end_date ? formatDate(item.end_date) : "Present"}
              </p>
              <h3>{item.role}</h3>
              <p className="muted">
                {item.website ? <a href={item.website}>{item.company}</a> : item.company}
                {item.location ? ` · ${item.location}` : ""}
              </p>
            </div>
            {item.responsibilities?.length ? (
              <ul>
                {item.responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <Section eyebrow="Selected work" title="Projects" id="projects">
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card animated-card" key={project.name}>
            <div className="project-card__meta">
              <span>{project.date ? formatDate(project.date) : project.type ?? "Project"}</span>
              {project.status ? <span>{project.status}</span> : null}
            </div>
            <h3>{project.name}</h3>
            {project.description ? <p>{project.description}</p> : null}
            <PillGroup items={[...(project.technologies ?? []), ...(project.concepts ?? [])]} />
            {project.features?.length ? (
              <ul className="compact-list">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            ) : null}
            <Metrics metrics={project.metrics} />
            {project.github ? (
              <a className="text-link" href={project.github}>
                View repository
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <Section eyebrow="Trust" title="Testimonials" id="testimonials">
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card animated-card" key={`${testimonial.name}-${testimonial.role}`}>
            <span aria-hidden="true">"</span>
            <p>{testimonial.quote}</p>
            <footer>
              <strong>{testimonial.name}</strong>
              {testimonial.role ? <small>{testimonial.role}</small> : null}
            </footer>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Education({ education }: { education: EducationItem[] }) {
  return (
    <Section eyebrow="Learning" title="Education" id="education">
      <div className="stack">
        {education.map((item) => (
          <article className="panel row-panel animated-card" key={`${item.degree}-${item.institution}`}>
            <div>
              <h3>{item.degree}</h3>
              <p className="muted">
                {item.institution}
                {item.location ? ` · ${item.location}` : ""}
              </p>
            </div>
            <div className="row-panel__side">
              {item.status ? <span className="status">{item.status}</span> : null}
              {item.grade ? <span className="status">{item.grade}</span> : null}
            </div>
            <PillGroup items={item.subjects ?? []} />
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Publications({ publications }: { publications: Publication[] }) {
  if (!publications.length) return null;

  return (
    <Section eyebrow="Research" title="Publications" id="publications">
      <div className="stack">
        {publications.map((publication) => (
          <article className="panel animated-card" key={publication.title}>
            <h3>{publication.title}</h3>
            {publication.description ? <p>{publication.description}</p> : null}
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Certifications({ certifications }: { certifications: Certification[] }) {
  if (!certifications.length) return null;

  return (
    <Section eyebrow="Credentials" title="Certifications" id="certifications">
      <div className="mini-grid">
        {certifications.map((certification) => (
          <article className="mini-panel animated-card" key={certification.name}>
            <h3>{certification.name}</h3>
            {certification.provider ? <p>{certification.provider}</p> : null}
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Languages({ languages }: { languages: Language[] }) {
  if (!languages.length) return null;

  return (
    <Section eyebrow="Communication" title="Languages" id="languages">
      <div className="language-list">
        {languages.map((language) => (
          <div className="language-item animated-card" key={language.language}>
            <strong>{language.language}</strong>
            {language.level ? <span>{language.level}</span> : null}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ContactForm({ info }: { info: PersonalInfo }) {
  return (
    <section className="contact-section shell" id="contact">
      <div className="contact-section__copy reveal">
        <p className="eyebrow">Contact</p>
        <h2>Let&apos;s build something intelligent.</h2>
        <p>
          Send a message for AI engineering roles, project collaborations, or research-focused product work.
        </p>
        {info.email ? <a href={`mailto:${info.email}`}>{info.email}</a> : null}
      </div>
      <form className="contact-form reveal reveal--late" name="contact" method="POST" data-netlify="true">
        <input type="hidden" name="form-name" value="contact" />
        <label>
          Name
          <input name="name" type="text" placeholder="Your name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label>
          Message
          <textarea name="message" rows={5} placeholder="Tell me what you want to build" required />
        </label>
        <button type="submit">Send message</button>
      </form>
    </section>
  );
}

function Section({
  eyebrow,
  title,
  id,
  children
}: {
  eyebrow: string;
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section className="section shell reveal" id={id}>
      <div className="section__heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function PillGroup({ items }: { items: string[] }) {
  if (!items.length) return null;

  return (
    <div className="tag-list">
      {items.map((item) => (
        <span className="tag tag--soft" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

function Metrics({ metrics }: { metrics?: Record<string, string> | string[] }) {
  if (!metrics) return null;

  if (Array.isArray(metrics)) {
    return <PillGroup items={metrics} />;
  }

  return (
    <dl className="metrics">
      {Object.entries(metrics).map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
