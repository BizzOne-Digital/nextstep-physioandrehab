# Next Step Physio & Rehab Clinic — Website & Admin

Full-stack rebuild of [nextstepphysioandrehab.com](https://nextstepphysioandrehab.com): a premium, responsive clinic website with a protected admin panel, MongoDB content storage and Vercel-safe image uploads.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · MongoDB + Mongoose · Zod · jose (JWT sessions) · bcryptjs · lucide-react

---

## Quick start (local)

```bash
npm install
cp .env.example .env.local      # then fill in the values (see below)
npm run hash-password -- "a-strong-admin-password"
npm run seed                    # imports the migrated website content
npm run dev                     # http://localhost:3000
```

Admin panel: **/admin** (sign in with `ADMIN_EMAIL` and the password you hashed).

> The public site also works **before** a database is connected — it falls back to the built-in migrated content, so a first deploy never shows an empty site.

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string. Stores content, submissions and uploaded images. |
| `NEXT_PUBLIC_SITE_URL` | Yes | e.g. `https://nextstepphysioandrehab.com` — canonical URLs, sitemap, Open Graph, JSON-LD. |
| `ADMIN_EMAIL` | Yes | Bootstrap admin login. `npm run seed` also creates this admin in MongoDB. |
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash from `npm run hash-password`. **In `.env.local` escape every `$` as `\$`**; paste the unescaped hash into the Vercel dashboard. |
| `AUTH_SECRET` | Yes | ≥ 32 random characters. `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Develop, build and run in production mode |
| `npm run lint` / `typecheck` | ESLint and TypeScript checks |
| `npm run seed` | Fills **empty** collections with the migrated content (safe to re-run) |
| `npm run seed -- --force` | Resets content collections to the defaults (never touches submissions, uploads or admins) |
| `npm run hash-password -- "…"` | Generates `ADMIN_PASSWORD_HASH` |

---

## Deploying to Vercel

1. Create a MongoDB Atlas cluster (free tier is fine to start). Under **Network Access**, allow Vercel (`0.0.0.0/0`, or Atlas's Vercel integration).
2. Import the repository in Vercel and add the five environment variables above (Production + Preview).
3. Deploy. Then either run `npm run seed` locally against the production `MONGODB_URI`, **or** sign in to `/admin` and click **Import content** on the dashboard.
4. Point the domain at Vercel. Old WordPress URLs (service pages, blog posts, `/contact-us`, `/faqs`, team profile) **301-redirect** to their new addresses (see `next.config.ts`), preserving search rankings.

**Why uploads work on Vercel:** nothing is written to the filesystem. Images are stored once in MongoDB (`StoredUpload`) and served by `GET /api/uploads/{folder}/{filename}` with year-long immutable caching. All Mongoose/Buffer routes run on the Node.js runtime. Large photos are resized/re-encoded to WebP in the browser before upload to stay under Vercel's ~4.5 MB request limit (server limit: 8 MB).

---

## Admin panel

| Section | Purpose |
| --- | --- |
| Dashboard | New appointment requests, unread messages, reviews awaiting approval, quick actions |
| Appointments / Contact messages | Review submissions, call/email in one click, set status (New → Contacted → Scheduled → Completed / Cancelled), internal notes |
| Pages | Homepage hero, About, Contact and page headers + SEO title/description per page |
| Services · Conditions · Team · Testimonials · FAQs · Blog posts · Gallery | Full create / edit / delete with validation, image upload, publish toggles and display order |
| Images & media | Every uploaded image, storage used, copy URL, delete (images still used on the site are protected) |
| Site settings | Phone, email, address, hours, map, social links, direct-billing insurers, announcement bar, default SEO |

Saving in the admin refreshes the public site immediately (on-demand revalidation). Pages otherwise refresh every 5 minutes.

**Image cleanup:** when an image is replaced or removed, or its content is deleted, the old upload is deleted — unless another item still uses it. Unsplash and `/images/*` files are never deleted. Legacy `/uploads/...` paths render a placeholder instead of breaking.

**Reviews:** reviews submitted on the website arrive **unpublished** and only appear after approval.

---

## Project structure

```
app/
  (site)/            Public pages (home, about, services/[slug], conditions, our-team/[slug],
                     testimonials, blog/[slug], faq, contact, book-appointment, gallery)
  admin/             Login + protected panel ((panel) route group)
  api/
    upload/          POST upload · DELETE unsaved upload           (admin, Node runtime)
    uploads/[folder]/[filename]   Public image delivery from MongoDB
    admin/…          Resource CRUD, pages, settings, submissions, media, seed
    appointments · contact · reviews · auth/login · auth/logout
  sitemap.ts · robots.ts · opengraph-image.tsx · icon.svg
components/
  ui/  site/  home/  services/  forms/  admin/  seo/
content/             Migrated content (services, conditions, FAQs, team, settings, pages, blog JSON)
lib/                 db, auth/session, data access (with fallback), validation, uploads, SEO helpers
models/              Mongoose models (incl. StoredUpload)
proxy.ts             Admin route protection (Next.js 16 replacement for middleware)
scripts/             seed.ts · hash-password.ts
```

Admin forms are generated from field definitions (`lib/resource-config.ts`, `content/pages.ts`); the same definitions build the server-side Zod validation (`lib/schema-builder.ts`), so the form and API cannot drift apart.

## Security

- bcrypt-hashed passwords; HS256-signed, httpOnly, `SameSite=Lax`, `Secure` (production) session cookies (8 h)
- Every admin API route re-verifies the session; `proxy.ts` also blocks cross-origin writes
- Login rate limiting; timing-safe failed logins
- Public forms: Zod validation, honeypot field, minimum fill time and per-IP rate limiting
- Uploads: folder whitelist, MIME whitelist **and** file-signature check, 8 MB cap, random filenames, traversal-safe lookup
- Blog HTML sanitized on save and on render; JSON-LD escaped; security headers set in `next.config.ts`
- Image URLs restricted to uploads, `/images/*` and `images.unsplash.com`

## Content notes

Content was migrated from the live site and cleaned up. See the handover notes for items that need the clinic's confirmation (testimonials, social media links, insurer list, team, and content that belonged to other clinics and was excluded).
