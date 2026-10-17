# Groundwork (gym.omranisystems.com)

Beginner strength training: a public exercise library, three weekly plans, and a training app
(today's workout, rest timer, set logging, progress charts), plus member accounts and a back office.
The design comes from the Claude Design project kept in `design/`.

Same stack as Omrani Pass: **Node + Express 5 + Mongoose**, a **Vite**-built vanilla-JS frontend
served from `dist/`, Argon2id passwords, JWT session cookie, helmet, rate limiting. Runs under PM2
behind Nginx on `127.0.0.1:14000`.

## Pages

| URL | Source | What it is |
| --- | --- | --- |
| `/` | `index.html`, `src/client/pages/home.js` | Landing: hero, body parts, sample sessions, BMI, FAQ |
| `/category?cat=chest` | `category.html`, `pages/category.js` | Exercises for one body part, with/without equipment |
| `/plans` | `plans.html`, `pages/plans.js` | The 2/3/5-day weeks; "Use this week" adopts one |
| `/app` | `app.html`, `pages/app.js` | Training app. Works signed out (localStorage) or signed in (synced) |
| `/account` | `account.html`, `pages/account.js` | Sign in, create account, profile, export, delete |
| `/admin` | `admin.html`, `pages/admin.js` | Back office for editors/admins: exercises, categories, plans, users |

## Layout

```
src/server.js            boot (.env, MongoDB, listen)
src/app.js               Express: helmet, origin check, /api, static dist/ with clean URLs
src/config.js            environment validation
src/models/              user, category, exercise, plan (templates + member copies), workoutSession, measurement
src/controllers/         auth, account, catalog, training, admin
src/routes/index.js      every /api route and its guard
src/seed/catalog.js      initial categories, exercises and plan templates (generated from design/)
src/client/              styles.css, lib/ (api, dom, muscle-map, site chrome), pages/
scripts/seed.js          npm run seed: load the catalog (add --reset to overwrite catalog records)
scripts/bootstrap.js     npm run bootstrap: create or promote the first admin
public/                  copied into dist/: exercise images (uploads/), media/, brand/, robots.txt
docs/DATABASE.md         collections and fields
```

## Run locally

```bash
npm install
cp .env.example .env        # MONGO_URI, JWT_SECRET (32+ chars), APP_ORIGIN
npm run seed                # categories, 42 exercises, 3 plan templates
npm run dev                 # API on :14000, Vite on http://127.0.0.1:5173
```

## Deploy (VPS)

```bash
/projects/deploy.sh gym gym          # git reset to origin/main, npm ci, npm run build, pm2 reload
```

First deploy only, after that reload:

```bash
cd /projects/gym
npm run seed
BOOTSTRAP_ADMIN_EMAIL=you@example.com BOOTSTRAP_ADMIN_PASSWORD='a-long-password' npm run bootstrap
curl -s http://127.0.0.1:14000/health          # {"status":"ok","service":"groundwork"}
```

`.env` keys: `NODE_ENV`, `HOST`, `PORT`, `APP_ORIGIN`, `MONGO_URI`, `JWT_SECRET`. In production,
POST/PATCH/DELETE requests whose `Origin` is not in `APP_ORIGIN` are rejected (CSRF protection),
and the session cookie is `Secure` when `APP_ORIGIN` is https.

## How the data works

- **Catalog** (categories, exercises, plan templates) lives in MongoDB and is edited from `/admin`.
  Exercise images are files in `public/uploads/`, referenced by path.
- **Plans are copy-on-adopt**: choosing a week copies the template into a plan the member owns, so
  later template edits never change it. Members swap exercises within the same body part.
- **Workouts** are queued in the browser and uploaded with a client-generated `clientRef`; a retry
  never duplicates a session, and a lost connection never loses one.
- **Signed out**, the training app keeps everything in localStorage on that device.

## Not built yet (shown in the design)

Payments (Stripe subscription and donations: the donate buttons record intent only), Google/Apple
sign-in, password-reset email, notification emails (preferences are stored), blog, contact form,
media uploads from the admin.

## Colours and the design backup

Colours come from the logo (black `#0B0D12`, white, orange `#EA580C`): warm charcoal surfaces and the orange
accent, all as tokens at the top of `src/client/styles.css`. The previous palette (blue-grey surfaces with the
orange accent) is kept on the branch `design-backup-2026-10-17` and the tag `design-v1-orange-accent`.
To bring it back:

```bash
git checkout design-v1-orange-accent -- src/client/styles.css src/client/lib/muscle-map.js src/client/pages/app.js src/client/pages/admin.js '*.html' capacitor.config.json
git commit -m "Restore the previous Groundwork colours"   # then deploy, and bump the version + build:apk for the app
```

## Exercise images

Images live in `public/uploads/`; sources and licences are in `public/uploads/CREDITS.md` (the Everkinetic
drawings are CC BY-SA 4.0, credited in the site footer). `npm run seed` also fills the image of any record that has
none, without replacing images chosen in `/admin`.

## Android app

The same pages are packaged as a sideloaded Android app (Capacitor, `com.omranisystems.gym`), never published to a store.
In the app the pages are bundled, `/api` is called on `https://gym.omranisystems.com` (reachable without the
gate code) and the session is a Bearer token returned when the request carries `X-Client: android`.

```bash
npm run build:apk -- --notes "What changed"   # bump "version" in package.json first
```

- Publishes to `/projects/mobile_builds/gym` (`gym-<version>.apk`, `gym.apk`, `latest.json`), served at
  `gym.omranisystems.com/download/`; the landing and sign-in pages show a download card.
- Needs Java 21 and the Android SDK in `/opt/android-sdk`; signing key in `/root/.gym-keystore/`
  (`android/keystore.properties`, not in git). **Every update must be signed with this key.**
- Icons and splash screens: `scripts/android-assets.sh`.
- New images in `public/uploads` reach the app only with a new APK.
