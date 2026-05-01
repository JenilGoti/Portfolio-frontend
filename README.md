# Jenil Portfolio

This is a data-driven Next.js portfolio prepared for Netlify hosting.

## How It Works

- `profile.js` is the app's profile entry point.
- `profile.json` is the current content source used by `profile.js`.
- `lib/profile.ts` defines the expected profile shape and small formatting helpers.
- `components/portfolio-sections.tsx` renders reusable sections from the profile data.
- `app/page.tsx` decides which sections appear on the homepage.
- `netlify.toml` configures the Netlify build.

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Portfolio AI Agent

The `Ask my portfolio directly` section connects to a Socket.IO backend.

Install dependencies first:

```bash
npm install
```

For local development, it uses:

```text
http://localhost:8000
```

If your backend uses a different Socket.IO path, set:

```text
NEXT_PUBLIC_AGENT_SOCKET_PATH=/socket.io
```

For Netlify, set this environment variable to your deployed backend URL:

```text
NEXT_PUBLIC_AGENT_SOCKET_URL=https://your-agent-backend.example.com
```

Do not use `localhost` for the Netlify value. In a deployed site, `localhost` means the visitor's own computer, not your backend server.

Optional thread override:

```text
NEXT_PUBLIC_AGENT_THREAD_ID=portfolio-chat
```

## Deploying On Netlify

1. Push this folder to a GitHub repository.
2. Create a new Netlify site from that repository.
3. Use these build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Netlify will use `@netlify/plugin-nextjs` from `netlify.toml`.

## Updating Content

Most portfolio updates should only need changes in `profile.json`. If you later want computed fields or multiple profile files, update `profile.js` and keep the components unchanged.

## Profile Picture

The homepage uses `personal_info.profile_image` from `profile.json`. It currently points to `/profile-avatar.svg`.

To use your real photo, add the image to the `public` folder, for example `public/profile.jpg`, then update:

```json
"profile_image": "/profile.jpg"
```

## CV Download

The homepage and navbar use `personal_info.cv_file` from `profile.json`. It currently points to:

```text
/jenil-goti-cv.pdf
```

Add your PDF to:

```text
public/jenil-goti-cv.pdf
```

To add a project, append an item to the `projects` array:

```json
{
  "name": "New Project",
  "date": "2026-05",
  "description": "Short project summary",
  "technologies": ["Next.js", "Python"],
  "github": "https://github.com/your/repo"
}
```

The page automatically renders optional fields like `status`, `type`, `concepts`, `features`, and `metrics` when they exist.
