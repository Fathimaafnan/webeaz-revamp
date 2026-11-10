# WebEaz

The public website and the private CMS run in the same Next.js App Router
application. Public content uses published CMS records when the database has
been initialized; the existing site content remains the fallback before that.
CMS routes and mutations require an administrator account.

## Local setup

1. Install the project dependencies:

   ```cmd
   npm.cmd install
   ```

2. Copy `.env.example` to `.env` and set a PostgreSQL `DATABASE_URL`,
   `AUTH_SECRET`, and `NEXTAUTH_URL`. Generate a secret with:

   ```cmd
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Do not commit `.env`. Prisma CLI commands read `.env`; Next.js also reads
   it for local development.

3. Generate the Prisma client, apply the checked-in migrations, and seed
   existing website content:

   ```cmd
   npm.cmd run db:generate
   npx.cmd prisma migrate deploy
   npm.cmd run db:seed
   ```

   The seed script only inserts into empty content tables. It does not replace
   existing CMS edits. Review the target database and migration state before
   running either database-writing command; never point local setup at
   production unintentionally.

4. Bootstrap the first administrator directly from Windows Command Prompt
   (CMD). Open CMD, change to the project folder, and run this exact command:

   ```cmd
   cd /d D:\webeaz\webeaz-revamp\web
   npm.cmd run setup:admin
   ```

   The command interactively asks for your admin email, password, and display
   name. Password input is hidden (no characters or asterisks are displayed).
   Use a password with at least 12 characters and no more than 72 UTF-8 bytes.
   The script hashes it with bcrypt and never logs or returns the password.

   The script requires `DATABASE_URL`, `AUTH_SECRET` (or the
   `NEXTAUTH_SECRET` compatibility alias), and `NEXTAUTH_URL` in `.env`. It
   verifies that migrations are applied and only creates an account when the
   admin table is empty. It does not overwrite or duplicate an existing admin.
   There is no public registration.

5. Start the website:

   ```cmd
   npm.cmd run dev
   ```

   Public pages are available at `/`; the CMS login is
   `http://localhost:3000/admin/login`. Enter the same email and password used
   for bootstrap. Successful login redirects to `/admin`; unauthenticated
   visitors are redirected to the login page. There is no public admin
   registration.

## Admin password changes and recovery

- While signed in, open **Settings → Admin profile**. To change the password,
  enter the current password and the new password, then save.
- If you cannot sign in, use a trusted machine with access to the configured
  database. The `reset:admin-password` command updates only an existing admin
  and does not create accounts; it currently reads `ADMIN_EMAIL` and
  `ADMIN_PASSWORD` from the process environment. Do not put the password in a
  command-line argument or source file. Then sign in using the new password.
- Never send a password over chat, store it in source control, or put it in a
  command-line argument.

## Media uploads

Uploads require an S3-compatible bucket. Configure `S3_BUCKET` and
`S3_PUBLIC_BASE_URL`. Set `S3_ENDPOINT` for compatible providers such as R2;
AWS S3 can omit it. Set `S3_REGION` and either both access-key variables or
neither when the deployment uses an IAM role. The configured public base URL
must serve bucket objects over HTTPS in production. Keep access credentials
server-side and never prefix them with `NEXT_PUBLIC_`.

The CMS accepts JPEG, PNG, WebP, and GIF files up to 5 MB. It stores file
metadata and an object key in PostgreSQL; image bytes stay in object storage.
Images referenced by CMS content cannot be deleted from the media library.

## CMS behavior

- `/admin` and `/admin/homepage` are protected by a server-side administrator
  check. The Homepage CMS manages the existing hero, final CTA, homepage
  sections, both statistics groups, and industries.
- `/admin/services` manages service categories and services. Categories and
  services are created as drafts; publish a category and its services for them
  to appear publicly. Archived or draft categories hide their services even
  when an individual service is marked published. Existing static service
  content is not imported or replaced by the editor.
- In the Services CMS, use **Categories** to edit category copy, artwork,
  icon/accent, order and status; use **Services** to search/filter, select a
  category, edit content and SEO fields, set order/status, or delete after
  confirmation. A category can only be deleted after its services have been
  moved or deleted. Changing a slug changes that route.
- Homepage and industry updates use authenticated, same-origin Route Handler
  mutations. Industry records are draft by default; only published records are
  shown on public pages.
- Services CMS APIs are authenticated Route Handlers:
  `/api/admin/services/categories` and
  `/api/admin/services/categories/[id]` manage categories;
  `/api/admin/services` and `/api/admin/services/[id]` manage individual
  services. Every mutation validates its input, checks same-origin requests,
  and revalidates the affected service pages and sitemap.
- Service images accept a site path or HTTPS URL. Category presentation fields
  include its number, tagline, icon, accent and optional image; service editing
  preserves all existing content lists and includes optional SEO title and
  description. To expose those new category-image and SEO fields in an
  environment, deploy the checked-in additive Services CMS migration with
  `npx prisma migrate deploy` after reviewing the target database. The
  migration is not applied automatically by the CMS.
- Draft and archived services, testimonials, and blog posts are excluded from
  public pages. Published blog articles appear at `/insights` and
  `/insights/[slug]`.
- Homepage changes revalidate `/`; industry changes revalidate `/` and
  `/industries`; service changes revalidate the catalog, affected category
  and detail paths, `/`, and `sitemap.xml`.
- If PostgreSQL is unavailable or not initialized, public pages retain their
  existing static content. No migration, seed, login, or persistent CRUD
  operation should be considered verified until tested against a configured
  non-production database.

## Verification

```powershell
npx tsc --noEmit
npm run build
```
