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

- `/admin`, `/admin/homepage`, `/admin/services`, `/admin/blog`,
  `/admin/testimonials`, `/admin/media`, and `/admin/settings` are protected
  by a server-side administrator check.
- Draft and archived services, testimonials, and blog posts are excluded from
  public pages. Published blog articles appear at `/insights` and
  `/insights/[slug]`.
- Publishing or editing content revalidates the affected public routes.
- If PostgreSQL is unavailable or not initialized, public pages retain their
  existing static content. No migration, seed, login, or persistent CRUD
  operation should be considered verified until tested against a configured
  non-production database.

## Verification

```powershell
npx tsc --noEmit
npm run build
```
