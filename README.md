# Jenil Portfolio

A dark, animated, data-driven portfolio built with Next.js and prepared for Netlify deployment. The site is designed so most content updates can happen from `profile.json` without rewriting React components.

## Features

- Next.js App Router project structure
- Dynamic portfolio sections generated from `profile.json`
- Dark responsive UI with animations
- Sticky navigation
- Profile image support
- CV download button
- Projects, skills, experience, education, certifications, languages, publications, and testimonials
- Socket.IO based portfolio AI agent chat
- Full-screen AI agent mode
- Netlify contact form
- Netlify deployment config
- Favicon folder support

## Project Structure

```text
app/
  layout.tsx              App metadata and root layout
  page.tsx                Homepage section order
  globals.css             Global styling and animations

components/
  portfolio-sections.tsx  Portfolio UI sections
  portfolio-agent-chat.tsx Socket.IO AI agent chat

lib/
  profile.ts              Profile types and formatting helpers

public/
  favicon/                Favicon package
  profile_picuture.png    Current profile image
  neural-field.svg        Background visual
  profile-avatar.svg      Fallback avatar

profile.json              Main editable portfolio data
profile.js                Profile entry point
netlify.toml              Netlify build config
```

## Requirements

- Node.js 18 or newer
- npm

## Local Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Useful Commands

```bash
npm run dev
```

Runs the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build locally after `npm run build`.

```bash
npm run lint
```

Runs ESLint.

## Updating Portfolio Content

Most portfolio content lives in:

```text
profile.json
```

Update this file when you want to change:

- name, email, phone, location, links
- summary and headline
- skills
- work experience
- projects
- education
- publications
- certifications
- languages
- testimonials
- profile picture path
- CV file path

Example project entry:

```json
{
  "name": "New Project",
  "date": "2026-05",
  "description": "Short project summary",
  "technologies": ["Next.js", "Python"],
  "github": "https://github.com/your/repo"
}
```

The project card automatically supports optional fields like:

- `status`
- `type`
- `technologies`
- `concepts`
- `features`
- `metrics`
- `github`

## Profile Picture

The profile image is controlled by:

```json
"profile_image": "/profile_picuture.png"
```

The file is currently expected at:

```text
public/profile_picuture.png
```

To change it, add another image to `public`, then update `profile.json`.

Example:

```json
"profile_image": "/profile.jpg"
```

## CV Download

The CV download link is controlled by:

```json
"cv_file": "/jenil-goti-cv.pdf"
```

Add your CV PDF here:

```text
public/jenil-goti-cv.pdf
```

The navbar and hero section will use that file for the `Download CV` button.

## Favicon

The favicon files are stored in:

```text
public/favicon/
```

Current expected files:

```text
favicon.ico
favicon-16x16.png
favicon-32x32.png
apple-touch-icon.png
android-chrome-192x192.png
android-chrome-512x512.png
site.webmanifest
```

Recommended favicon builders:

- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

If you replace the favicon package, keep the same file names or update `app/layout.tsx` metadata if you add custom paths.

## Portfolio AI Agent

The `AI Agent` section connects to a Socket.IO backend.

Local default:

```text
NEXT_PUBLIC_AGENT_SOCKET_URL=http://localhost:8000
NEXT_PUBLIC_AGENT_SOCKET_PATH=/socket.io
NEXT_PUBLIC_AGENT_THREAD_ID=portfolio-chat
NEXT_PUBLIC_AGENT_SOCKET_TRANSPORTS=websocket
```

Create or update `.env`:

```bash
NEXT_PUBLIC_AGENT_SOCKET_URL=http://localhost:8000
NEXT_PUBLIC_AGENT_SOCKET_PATH=/socket.io
NEXT_PUBLIC_AGENT_THREAD_ID=portfolio-chat
NEXT_PUBLIC_AGENT_SOCKET_TRANSPORTS=websocket
```

If testing from another device on the same Wi-Fi, do not use `localhost`. Use your machine IP:

```text
NEXT_PUBLIC_AGENT_SOCKET_URL=http://YOUR_LOCAL_IP:8000
```

For deployment, use the deployed backend URL:

```text
NEXT_PUBLIC_AGENT_SOCKET_URL=https://your-agent-backend.example.com
NEXT_PUBLIC_AGENT_SOCKET_PATH=/socket.io
NEXT_PUBLIC_AGENT_SOCKET_TRANSPORTS=websocket
```

Important:

- `NEXT_PUBLIC_*` values are baked into the frontend at build time.
- After changing env variables on Netlify, trigger a new deploy.
- A deployed HTTPS portfolio should connect to an HTTPS/WSS backend, not an HTTP backend.
- Your backend must allow the Netlify site origin in CORS.
- For ngrok, remove trailing slashes from the URL. Use `https://your-ngrok-domain.ngrok-free.dev`, not `https://your-ngrok-domain.ngrok-free.dev/`.
- The frontend defaults to `websocket` transport to avoid ngrok XHR polling errors.

## Contact Form

The contact form uses Netlify Forms.

Because this project uses the Netlify Next.js runtime, the form is registered through a static file:

```text
public/__forms.html
```

The visible React form posts to Netlify using the same form name:

```tsx
name="contact"
method="POST"
action="/contact-success"
```

Do not add `data-netlify="true"` directly to the React/Next form. The Netlify Next.js runtime can fail the build when it discovers forms inside prerendered Next content.

After deployment, submissions should appear in your Netlify site dashboard under Forms.

## Netlify Deployment

### 1. Push The Project To GitHub

Create a GitHub repository and push this project:

```bash
git init
git add .
git commit -m "Initial portfolio project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If the repository already exists locally, only commit and push:

```bash
git add .
git commit -m "Update portfolio"
git push
```

### 2. Create A Netlify Site

1. Go to [Netlify](https://app.netlify.com/).
2. Select `Add new site`.
3. Choose `Import an existing project`.
4. Connect GitHub.
5. Select your portfolio repository.

### 3. Build Settings

Use these settings:

```text
Build command: npm run build
Publish directory: .next
```

This project already includes:

```text
netlify.toml
```

with:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 4. Environment Variables

In Netlify:

```text
Site configuration -> Environment variables
```

Add these if you use the AI agent:

```text
NEXT_PUBLIC_AGENT_SOCKET_URL=https://your-agent-backend.example.com
NEXT_PUBLIC_AGENT_SOCKET_PATH=/socket.io
NEXT_PUBLIC_AGENT_THREAD_ID=portfolio-chat
NEXT_PUBLIC_AGENT_SOCKET_TRANSPORTS=websocket
```

Do not set the deployed backend URL to `localhost`.

### 5. Deploy

Click `Deploy site`.

After deployment, Netlify gives you a URL like:

```text
https://your-site-name.netlify.app
```

### 6. Custom Domain

In Netlify:

```text
Domain management -> Add a domain
```

Then follow Netlify's DNS instructions.

## Deployment Checklist

Before deploying, confirm:

- `npm run build` works locally
- `profile.json` has the correct name, links, profile image, and CV path
- CV PDF exists in `public` if the download button is enabled
- favicon files exist in `public/favicon`
- AI backend URL is not `localhost` on Netlify
- backend CORS allows your Netlify domain
- contact form appears in Netlify Forms after the first deploy

## Troubleshooting

### AI Agent Does Not Connect

Check the endpoint shown in the AI Agent section.

For local testing, this should usually be:

```text
http://localhost:8000/socket.io
```

For deployed testing, it should be your deployed backend:

```text
https://your-agent-backend.example.com/socket.io
```

If testing locally, open:

```text
http://localhost:8000/socket.io/?EIO=4&transport=polling
```

A working Socket.IO server usually returns text starting with:

```text
0{"sid":
```

### Next.js Dev WebSocket Warning

If you open the dev site through a LAN IP, Next.js may block dev hot reload. Add the IP to `next.config.mjs`:

```js
allowedDevOrigins: ["YOUR_LOCAL_IP"]
```

Then restart:

```bash
npm run dev
```

### Hydration Warning From Grammarly

Browser extensions such as Grammarly can add attributes to the page before React loads. The layout already includes hydration warning suppression for this common case.

## Notes

- Keep secrets out of `NEXT_PUBLIC_*` variables because they are visible in the browser.
- Use `profile.json` for content changes.
- Use `components/portfolio-sections.tsx` for section layout changes.
- Use `components/portfolio-agent-chat.tsx` for AI chat behavior changes.
