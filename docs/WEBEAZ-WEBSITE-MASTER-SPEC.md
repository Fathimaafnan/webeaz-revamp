# WEBEAZ-WEBSITE-MASTER-SPEC

Version 1.0 · 1 October 2026 · Strategy and implementation baseline

**Status:** Prepared from the supplied revamp brief. Brief-defined positioning and brand boundaries are requirements; design tokens, URL structure, architecture and delivery targets below are proposed defaults. This document does not constitute stakeholder approval or a completed audit of the existing website.

**Project:** Corporate website revamp for Webeaz Technologies Pvt. Ltd., [webeaz.com](https://www.webeaz.com/).

## 1. Purpose and success criteria

Position Webeaz as a premium corporate technology company helping businesses build, transform, automate and grow through Technology, Digital Growth, Automation and AI. Communicate useful business outcomes, demonstrate credible work and convert suitable visitors into qualified enquiries.

Primary audiences: business owners and SME decision makers seeking growth or digitization; operations and sales leaders seeking automation; founders and product teams seeking engineering support; business leaders exploring practical AI adoption. These audience definitions are planning assumptions to validate during discovery. Geography, priority company sizes and sector weighting remain open.

Success means visitors can identify what Webeaz does, find a relevant solution, assess evidence and contact the team without friction. Measure qualified enquiries, submission conversion, sales acceptance, organic landing-page performance and case-study-to-contact journeys. Establish a baseline before setting numerical business targets; do not invent conversion uplift.

## 2. Scope and brand boundaries

In scope: corporate website, responsive design system, corporate content, service and solution pages, approved case studies, insights CMS, contact journey, lead routing, analytics, SEO migration, accessibility, performance and launch verification.

Out of scope: rebuilding product websites, product documentation, founder personal website, customer portals, authenticated dashboards, a public AI chatbot and additional language sites. Add these only through a documented scope change.

| Entity | Relationship | Website treatment |
| --- | --- | --- |
| Webeaz Technologies Pvt. Ltd. | Corporate company | Primary identity and navigation |
| ERPEaz | Cloud ERP product built by Webeaz | Concise product card linking to [erpeaz.com](https://erpeaz.com/) |
| DGVerse | Digital Growth & Automation Platform built by Webeaz | Concise product card linking to [dgverse.org](https://dgverse.org/) |
| Fasalurahman Moolayil | Founder & CEO, as stated in brief | Leadership profile within Company and homepage |
| FasaluDigital / #FasaluDigital | Separate founder personal brand | Discreet contextual link to [fasaludigital.com](https://fasaludigital.com/) |

The brief states **10+ years of Webeaz** and **22+ years of founder professional experience**. Keep those claims separate, confirm their source and current accuracy before publication, and never present founder experience as company age. Confirm legal spelling, logos, ownership statements and outbound destinations before launch.

## 3. Messaging and editorial rules

Homepage headline: **Build. Transform. Automate. Grow.**

Supporting message: **Technology and digital solutions that help businesses build, transform, automate and grow.**

Capability descriptor: **Technology. Digital Growth. Automation. AI.**

Closing headline: **Let’s Build What’s Next.** Primary CTA: **Let’s Talk** or **Start a Conversation**, both linking to `/contact`. Homepage secondary CTA: **Explore Capabilities**, linking to the capability section with a working fallback URL to `/services`.

Write in confident, clear business language. Explain the problem, approach and useful outcome before naming technologies. Avoid inflated promises, invented awards, unverified client logos, fabricated testimonials, unsupported rankings and claims of guaranteed AI or marketing results. Describe capabilities as capabilities unless delivery evidence establishes a stronger claim.

Each published page needs one clear primary intent, one H1, a concise opening answer, a relevant proof element where available, contextual internal links and a conversion path. Do not impose artificial word counts or pad pages for search. Draft-only content and sample metrics must never appear as real evidence in production.

## 4. Navigation and sitemap

Desktop primary navigation: Solutions · Services · Industries · Our Work · Company · Insights · **Let’s Talk**. Products appear in homepage content and footer, rather than primary navigation. Mobile navigation uses an accessible disclosure menu with the same destinations; avoid hover-only navigation.

Proposed URL conventions: lowercase descriptive slugs, hyphens, no trailing slash except root. Preserve valuable existing URLs where feasible. Final paths depend on the migration audit; the following is the target architecture, not an old-to-new redirect map.

| Route | Purpose / template | Release condition |
| --- | --- | --- |
| `/` | Homepage | Required |
| `/solutions` | Outcome-led solution index | Required |
| `/solutions/digital-transformation` | Digitize your business | Required |
| `/solutions/business-automation` | Automate operations | Required |
| `/solutions/ai-solutions` | Apply AI to useful business workflows | Required |
| `/solutions/digital-growth` | Generate leads, improve sales and digital presence | Required |
| `/solutions/product-development` | Build and launch digital products | Required |
| `/services` | Four-capability index | Required |
| `/services/technology` | Engineering capability page | Required |
| `/services/digital-growth` | Growth capability page | Required |
| `/services/automation` | Automation capability page | Required |
| `/services/ai` | AI capability page | Required |
| `/industries` | Evidence-based sector index | Required; publish supported sectors only |
| `/industries/[slug]` | Sector-specific needs, services and proof | Conditional on distinctive content and evidence |
| `/our-work` | Approved case-study and client-story index | Required; no fabricated project cards |
| `/our-work/[slug]` | Case study or client story | Conditional on publication permission |
| `/products` | Short corporate product overview, outbound links | Required |
| `/company` | About Webeaz, approach and story | Required |
| `/company/our-journey` | Verified milestones | Conditional; can remain a Company section initially |
| `/company/leadership` | Founder profile | Required |
| `/company/careers` | Careers and approved hiring contact | Conditional on maintained hiring content |
| `/insights` | Editorial listing and category filter | Required |
| `/insights/[slug]` | Article | Conditional on editorial approval |
| `/contact` | Enquiry form and verified contact options | Required |
| `/privacy` | Actual privacy practices | Required before collecting personal data |
| `/terms` | Applicable website terms | Publish after company review |
| `/thank-you` | Confirm successful enquiry | Noindex; direct visits are not conversions |

Service-specific pages may follow after keyword and content review. Do not create dozens of near-identical service pages at launch. Case Studies and Client Stories can be filters in `/our-work`, rather than competing duplicate archives.

## 5. Homepage specification

Use this section sequence as the baseline. Keep copy concise and avoid forcing all twelve sections into equal-height blocks.

| Order / section | Content and behavior | Action |
| --- | --- | --- |
| 1. Hero | Exact headline, supporting message, restrained interactive technology visual with static fallback | Let’s Talk; Explore Capabilities |
| 2. Credibility | Separate company/founder experience; permitted logos or sourced statistics only | Optional link to Company |
| 3. What We Do | Four cards: Technology, Digital Growth, Automation, AI; one outcome sentence each | Relevant service category |
| 4. What Can We Help You Achieve? | Leads, sales, digitization, operations, products, AI and digital presence | Relevant solution page |
| 5. Selected Work | Prefer 2–3 approved projects; challenge, intervention, verified result | Case study |
| 6. Technology We Have Built | ERPEaz and DGVerse, short description and distinct logos | Respective product websites |
| 7. Why Webeaz | Integrated capabilities, proprietary products, business focus and long-term partnership; evidence for experience claims | Company or contact |
| 8. Industries | Sectors with confirmed experience, rather than an unsupported exhaustive list | Industry index / approved detail |
| 9. Company Story | Technology → Digital → Digital Growth → Business Technology → Automation → AI; treat as narrative, not dated history until verified | Company |
| 10. Founder | Approved portrait, name, role, distinct professional experience | Leadership; discreet personal-brand link |
| 11. Insights | Up to three approved articles with category and title | Article / insights index |
| 12. Final CTA | Let’s Build What’s Next. Short invitation | Start a Conversation |

Do not display empty carousels, pretend articles or placeholder client evidence. If evidence is unavailable, omit the affected section pending content rather than inventing material. Hero art should express connected systems and progress using restrained nodes, paths or interface fragments; it must not imitate an actual product feature without approval.

## 6. Capability taxonomy and solution mapping

| Capability | Services included |
| --- | --- |
| Technology | Website development, mobile apps, ecommerce, custom software, product engineering, cloud solutions |
| Digital Growth | Digital marketing, SEO, Google Ads, Meta Ads, social media, lead generation, content marketing |
| Automation | CRM, marketing automation, sales automation, WhatsApp automation, workflow automation, business process automation |
| AI | AI consulting, integration, automation, agents and applications |

| Solution | Buyer need | Supporting capabilities |
| --- | --- | --- |
| Digital Transformation | Digitize disconnected business processes | Web, mobile, software, cloud and process discovery |
| Business Automation | Reduce repetitive work and improve handoffs | CRM, workflow, sales/marketing and WhatsApp automation |
| AI Solutions | Identify and implement useful AI applications | Strategy, integration, agents and supervised automation |
| Digital Growth | Build demand and improve conversion | SEO, ads, landing pages, content and CRM handoff |
| Product Development | Build a usable digital product | Discovery, UX, engineering, cloud and launch support |

Solutions answer **what the customer wants to achieve**; Services answer **what Webeaz can deliver**. Cross-link them without duplicating entire passages.

Candidate sectors from the brief: Education, Retail, Ecommerce, Manufacturing, Healthcare, Automotive, Professional Services, Finance and SMEs. SMEs describe business size rather than an industry; use an SME-focused solution or audience section if evidence supports it. Validate sector experience before publishing.

## 7. Page templates and content hierarchy

**Solution detail:** outcome-led hero → buyer problem → desired outcomes without guarantees → combined capabilities → delivery approach → relevant approved work → relevant sectors → practical FAQs → contact CTA. State what discovery must establish before quoting scope.

**Service category:** clear capability description → included services → typical engagements → process and deliverables → supporting technology where relevant → case-study proof → related solutions → CTA.

**Industry detail:** sector needs → applicable use cases → supporting services → approved sector proof → delivery considerations → CTA. Publish only when the page adds substance beyond changing a sector name.

**Case study:** client name or approved anonymized label → industry → challenge → solution → technology → implementation → results → approved testimonial → related capabilities → CTA. Every metric records its baseline, measurement window, source and client permission. If metrics are unavailable, describe verified qualitative results and label them accordingly.

**Company:** company overview → positioning → working approach → verified evolution → products → leadership → CTA. Leadership distinguishes corporate history from personal experience. Careers shows real openings or an approved general application route, never fabricated vacancies.

**Article:** title → summary → author and publication/update dates → readable body → useful references → related content → contextual CTA. Categories: Technology, AI, Digital Growth, Automation, Digital Transformation, Company News and Case Studies. Canonical project detail stays under Our Work; articles referring to a project link to it.

**Contact:** concise invitation → accessible form → verified email/phone/address → optional WhatsApp link → privacy notice. Do not promise a response time until the sales owner confirms it.

## 8. Proposed design system

Visual direction: premium corporate, strong typography, generous spacing, light reading surfaces and selective dark feature sections. Use real product UI and approved company photography when available. Avoid generic agency stock images, rainbow accents, overloaded cards and excessive gradients.

These are proposed tokens, not extracted from the current brand. Confirm compatibility with the official logo before UI approval.

| Token | Proposed value | Use |
| --- | --- | --- |
| `background` | `#F7F9FC` | Default canvas |
| `surface` | `#FFFFFF` | Cards and reading surfaces |
| `ink` | `#111827` | Main text |
| `muted` | `#475569` | Secondary text |
| `dark` | `#0B1220` | Hero / selected feature sections |
| `on-dark` | `#F8FAFC` | Text on dark surfaces |
| `primary` | `#1D4ED8` | CTA, links, focus emphasis |
| `primary-hover` | `#1E40AF` | Hover state |
| `accent` | `#22D3EE` | Restrained decoration on dark backgrounds |
| `border` | `#CBD5E1` | Separators and card boundaries |

Validate final text, controls and focus contrasts; accent color is not a default body-text color. Error and success states must combine an icon or message with color.

Typography default: self-hosted Inter where licensing permits, with `system-ui, sans-serif` fallback. One family, weights 400/500/600/700. Body 16–18 px with 1.5–1.65 line height; H1 fluid 40–72 px; H2 30–48 px; H3 22–28 px. Keep paragraphs around 60–75 characters wide and avoid all-caps body copy.

Layout: content max-width 1200 px; mobile gutters 20 px, tablet 32 px, desktop 40–48 px. Use 4-column mobile, 8-column tablet and 12-column desktop grids. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 px. Section padding typically 48–64 px mobile and 80–112 px desktop. Cards use 16 px radius; controls 8 px; shadows subtle and consistent.

Responsive behavior: stack hero and card content on narrow screens, preserve logical reading order, use two-column grids only when content fits, and avoid horizontal overflow at 320 px. Navigation collapses when labels no longer fit rather than relying only on device names. Test 320, 375, 768, 1024 and 1440 px plus browser zoom.

## 9. Components and motion

Reusable primitives: Container, Section, Stack/Grid, Button, Link, Badge, Input, Textarea, Select, Checkbox, Alert and accessible Disclosure. Composite components: Navbar, MobileMenu, Footer, Hero, SectionHeader, CapabilityCard, SolutionCard, IndustryCard, CaseStudyCard, ProductCard, CredibilityStrip, Testimonial, ArticleCard, Breadcrumbs, FAQAccordion, CTASection and ContactForm.

Define variants through shared tokens and typed props; do not fork a component for each page. Cards are content links, not misleading interactive containers with nested controls. Forms and menus need default, focus, error, disabled and loading states; forms also need success and retry states. Hide unpublished or empty modules cleanly.

Motion defaults: hover/focus transitions 150–200 ms; section entrances 300–450 ms using opacity and a maximum 16 px transform. Show content immediately if animation fails. Respect `prefers-reduced-motion`, remove decorative loops and retain usable static visuals. No scroll hijacking, mandatory smooth scrolling, cursor replacement, autoplay sound or animation that delays navigation. Large canvas/WebGL effects require a demonstrated performance benefit to the design and an accessible fallback; they are not a launch requirement.

## 10. Technical architecture

Proposed baseline: Next.js App Router, React, TypeScript and Tailwind CSS. Pin compatible stable dependency versions during implementation; this spec does not mandate a version number or hosting provider. Prefer server-rendered or prerendered public content and small client components for navigation, forms, filters and genuinely necessary motion. Do not ship the whole site as a client-only application.

Select a headless CMS after checking editor needs, current content export, preview support, roles, operating cost and team familiarity. Requirements: structured entries, media metadata, draft previews, editorial review, version history, export and webhook support. CMS provider, hosting provider and CRM are open decisions, not assumed subscriptions.

Repository areas: `src/app` for routes, `src/components/ui` for primitives, `src/components/sections` for reusable composites, `src/lib` for CMS/CRM/analytics adapters and validation, `src/styles` for tokens, and `content` or CMS schemas for structured content. Keep redirects as versioned data. Secrets remain server-side in managed environment variables; public bundle variables must never contain credentials.

Separate development, preview/staging and production environments. Preview drafts require authenticated access and noindex; robots restrictions alone do not secure private content. Cache approved public content, invalidate affected routes on authenticated CMS webhooks and document publish propagation. A CMS outage should preserve cached public pages where possible. Deployments must support a known-good rollback.

## 11. CMS models and editorial governance

| Model | Required information |
| --- | --- |
| Site settings | Legal name, logo, navigation, verified contact details, social links, default SEO |
| Service / solution | Slug, title, summary, structured sections, related entities, CTA and SEO |
| Industry | Sector description, use cases, related work, evidence status and SEO |
| Case study | Client visibility permission, challenge, solution, technology, implementation, result evidence, testimonial permission, media and SEO |
| Product reference | Name, short approved description, logo, external URL |
| Person | Name, role, biography, approved portrait, verified professional experience |
| Article | Title, slug, summary, author, category, body, dates, related content and SEO |
| Claim / evidence | Claim text, source, owner, verification date and expiry/review date |

Common fields: draft/review/published status, content owner, timestamps, image alt text, title, description, canonical override with validation and social image. Restrict arbitrary HTML/scripts and unrestricted page-builder layouts. Editors use approved section types. Route slugs must be unique and changing a published slug must trigger redirect review.

Workflow: draft → factual and permission review → editorial/SEO review → preview QA → publish. A named company content owner signs off company facts; clients approve project disclosures and quotes. Review time-sensitive claims at least quarterly as a proposed operating cadence.

## 12. Conversion and lead handling

Primary path: relevant landing page → solution/service or evidence → contact → durable lead acceptance → CRM qualification → authorized follow-up → proposal. Product cards send visitors to the separate product sites; track these as outbound intent rather than corporate form conversions.

Form fields: name, email, company optional, phone optional, area of interest, project message and required privacy acknowledgement. Add separate optional marketing/WhatsApp permission only where those follow-ups are offered and the final privacy process requires it; do not bundle promotional consent into enquiry submission. Budget and timeline can be optional qualification fields if sales confirms their usefulness.

Server-side processing: validate and normalize input → check anti-spam/rate limits → create durable submission with unique ID → enqueue CRM/email delivery → return a truthful success state. Retry temporary downstream failures and notify an owner if delivery fails. Prevent duplicate records on retries with idempotency. Never report success solely because a browser request was sent. If durable acceptance fails, retain the visitor’s form state and show a retry option.

Store only necessary personal data, redact it from analytics/logs, restrict access and define retention/deletion with the company owner before launch. CRM mapping includes submission ID, enquiry interest, source page and consent status. Capture campaign attribution only under the configured privacy/consent policy. No secrets in browser requests. WhatsApp availability and DGVerse integration capability must be confirmed; the brief is not proof of an API contract.

## 13. Integrations and analytics

| Integration | Contract / requirement | Decision owner |
| --- | --- | --- |
| CRM, potentially existing Webeaz/DGVerse ecosystem | Auth method, field map, deduplication, retry behavior, delivery visibility | Sales + engineering |
| Transactional email | Verified sender, delivery status and truthful acknowledgement copy | Operations |
| WhatsApp | Approved destination or API/provider, consent process and follow-up ownership | Sales |
| GA4 + GTM | Environment-specific IDs, consent behavior, event validation and duplicate prevention | Marketing |
| Search Console | Verified production property, sitemap and migration monitoring | SEO owner |
| CMS / monitoring | Authenticated webhooks, previews, uptime and actionable error alerts | Engineering |

Event vocabulary: `cta_click`, `form_start`, `form_error`, `generate_lead`, `phone_click`, `whatsapp_click`, `product_outbound_click`, `case_study_view` and `consultation_request` only if a real consultation flow exists. Common non-personal parameters: page path, component location, capability/solution slug, CTA label and product name. Never send email, phone, message text or other personal data to analytics.

Emit `generate_lead` once after durable backend acceptance. Deduplicate by submission ID internally without exposing personal data. A thank-you page view or outbound click is not a successful lead. Track case-study depth only if it answers a reporting question. Verify events in staging with test configuration, then confirm production traffic is not duplicated. Report qualified-lead rate from CRM as well as website conversion; targets follow a baseline period.

## 14. SEO migration and search readiness

The existing site was not successfully fetched during preparation. No current URL inventory, traffic baseline, backlink review or redirect audit is claimed in this document.

Before URL changes: collect existing URLs from a crawl, current sitemap, CMS export, Search Console and analytics; include valuable media and linked downloads. Record existing titles, headings, canonicals, indexability, traffic, backlinks where available and content owner. Classify each URL as Keep, Rewrite, Merge, Redirect or Remove.

Create a versioned redirect table with: old URL, current status, intent/traffic notes, decision, new URL, expected status, owner and test result. Use direct permanent redirects to the closest relevant replacement, preserving query parameters where required. The brief requests 301 redirects; explicitly test actual status rather than assuming framework helpers return 301. Avoid chains, loops and mass redirection to the homepage. Truly removed content without a replacement returns an appropriate 404/410. Preserve redirects for at least a year and longer where links or traffic justify it.

Every indexable page needs a unique useful title and description, absolute canonical, correct status, crawlable internal links, social metadata and descriptive image alt text. XML sitemap contains canonical indexable production URLs only. Exclude previews, thank-you pages, drafts and unhelpful filter combinations. Ensure production has no accidental noindex or staging robots block. Redirect HTTP and alternate hosts to the chosen canonical host, provisionally `https://www.webeaz.com`; confirm the existing canonical strategy during audit.

Structured data: Organization for verified company identity; BreadcrumbList for appropriate inner pages; Article for editorial content; Service where it accurately describes the page. Link the founder with consistent Person information and products with factual ownership references. Do not invent prices, ratings, addresses or offers. FAQs must be visible and accurate; FAQ markup does not guarantee a search feature. Use Product markup only when it accurately fits the corporate reference and supported fields.

AI search readiness means clear entity identity, consistent names, factual answer-first copy, verified biographies, useful original case studies and crawlable HTML. It does not promise AI citations or rankings, and does not require unsupported special files or hidden search text.

At launch, test all mapped redirects, sitemap, canonicals, schema and internal links. Submit sitemap and monitor indexation, unexpected 404s and priority organic landing pages. Same-domain path changes do not imply a domain change-of-address operation.

## 15. Accessibility, performance and security

Accessibility project target: WCAG 2.2 AA, verified through automated checks and manual keyboard/screen-reader review. Provide landmarks, skip link, logical headings, visible focus, labelled inputs, announced validation, meaningful link text and sufficient contrast. Menus manage focus and Escape behavior; form errors identify their field and preserve entered values. Support zoom and reduced motion. Touch controls should aim for at least 44 × 44 CSS px. Decorative visuals must not carry essential meaning.

Performance targets: field Core Web Vitals at the 75th percentile, LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1, assessed separately on mobile and desktop when sufficient data exists. Prelaunch lab checks are diagnostics, not proof of field performance. Provisional project budgets: initial compressed first-party JavaScript ≤ 200 KB and initial homepage transfer ≤ 1.5 MB on a representative mobile run, measured before optional consent-dependent third-party downloads. Revisit budgets only with documented reasons. Lighthouse mobile performance ≥ 90 is a supporting target on agreed test conditions, not a universal guarantee.

Optimize images, reserve media dimensions, use modern formats and responsive sizes, prioritize the actual LCP asset, lazy-load below-fold media and limit font weights. Avoid loading all animations and third-party integrations on initial render. Cache static assets appropriately and monitor real-user performance after launch.

Security requirements: HTTPS, server-side validation, request size limits, spam protection, rate limits, safe CMS rendering, access-controlled previews, least-privilege integration credentials and reviewed dependencies. Apply appropriate security headers and a tested content security policy. Validate webhook signatures, keep administrative actions authenticated, redact logs, back up CMS content and document restoration. Form endpoint failure and integration retry behavior must be tested.

## 16. AI development rules

The following rules are suitable for a future `AI-DEVELOPMENT-RULES.md` and are mandatory implementation requirements within this baseline:

1. Read this spec and existing components before changing a page.
2. Reuse tokens, primitives and templates; do not duplicate components or introduce arbitrary colors/fonts.
3. Keep the exact homepage headline and distinct company/product/personal-brand identities.
4. Use typed structured content and validated external URLs. Never invent company facts, metrics, logos, projects or testimonials.
5. Build mobile-first, preserve semantic HTML and keyboard access, and respect reduced motion.
6. Keep public page content crawlable; preserve audited SEO value and approved redirects.
7. Give every public marketing page an appropriate CTA without intrusive overlays.
8. Keep credentials and lead processing on the server; never place personal data in analytics.
9. Test the actual form-to-CRM journey and failure handling before declaring the integration complete.
10. Keep new dependencies and browser JavaScript justified by a user need.
11. Do not publish placeholders. Missing evidence or permissions remain explicit content tasks.
12. Document changes to approved scope, routes, tokens or integrations in the decision log.

## 17. Delivery plan and gates

Indicative 10–12 weeks from project kickoff, dependent on content, permissions and integration access; this is a planning estimate rather than a committed schedule.

| Phase | Approximate timing | Deliverable / gate |
| --- | --- | --- |
| Audit and discovery | Week 1 | URL/content inventory, analytics baseline, verified assets and claims |
| Strategy and sitemap | Week 2 | Approved positioning, priority audiences, route plan and ownership |
| UX | Week 3 | Homepage and representative inner-page wireframes, mobile journeys |
| UI system | Weeks 4–5 | Tokens, component states, homepage and template designs approved |
| Development | Weeks 5–8 | Reusable templates, CMS preview, responsive implementation |
| Content and integrations | Weeks 7–9 | Approved content, form delivery and analytics validated |
| SEO migration | Week 10 | Complete URL decisions, tested redirects, metadata and schema |
| QA and performance | Week 11 | Accessibility, devices, lead journey and launch defects cleared |
| Launch and monitoring | Week 12 | Production smoke checks, rollback readiness and monitoring |

Design first the homepage, one solution, one service, one case study and contact page. Approve the shared patterns before scaling other pages. Content and integration preparation can proceed alongside UI work.

## 18. Acceptance and launch checklist

| Area | Acceptance evidence |
| --- | --- |
| Brand/content | Approved names/assets; sourced experience claims; project and testimonial permissions; no placeholders |
| Routes | Required routes complete; conditional pages either substantive or withheld; correct 404 handling |
| Responsive UI | Key templates verified at agreed widths and zoom; no overflow or unusable navigation |
| Accessibility | Automated scan plus manual keyboard, menu, form, focus and screen-reader spot checks |
| Forms | Valid/invalid/spam submissions tested; durable storage and CRM mapping confirmed; retries and duplicates tested |
| Analytics | Successful lead emitted once; consent behavior verified; no personal data; production IDs correct |
| SEO | Full redirect inventory tested; canonical, sitemap, indexability, metadata and schema reviewed |
| Performance | Representative mobile lab checks meet agreed budgets; real-user monitoring enabled |
| Operations | Secrets configured, backups/restoration procedure documented, alert owner and rollback identified |
| Launch | Production navigation, forms, outbound products, redirects and tracking smoke-tested |

Blocking issues: broken lead acceptance, exposed credentials/personal data, accidental indexing restrictions, missing migration decisions for important URLs, fabricated evidence, critical accessibility failures or unusable mobile journeys. Optional visual effects and conditional editorial pages must not delay a sound core launch.

After launch: inspect errors and enquiries daily in week one, inspect priority SEO/indexation and conversions weekly in month one, then review qualified enquiries and content performance monthly. If a critical launch defect appears, apply the documented fix or rollback while preserving accepted lead records.

## 19. Open decisions and required inputs

| Item | Proposed owner | Needed before |
| --- | --- | --- |
| Official logo files, existing brand constraints and photography | Company / design | UI approval |
| Company age, founder biography and claim evidence | Company / founder | Content publication |
| Priority audience, markets, sectors and sales qualification | Company / sales | Final messaging and solution copy |
| Current URL crawl, Search Console and analytics access/export | SEO / engineering | Final routes and migration |
| Approved projects, metrics, quotes and client permissions | Account / content owners | Work section publication |
| CMS, hosting and operating budget | Engineering / company | Architecture implementation |
| CRM/DGVerse API, email and WhatsApp contracts | Sales / engineering | Integration implementation |
| Legal contact details, privacy practices and retention | Company owner | Personal-data collection |
| Sales follow-up owner and actual response expectation | Sales | Contact copy and routing |
| Editorial owner and publish cadence | Marketing | CMS handover |

These inputs are dependencies for the relevant implementation stages, not reasons to delay this specification. Begin with asset collection, the URL audit and homepage/template wireframes using the proposed defaults.

## 20. Source and decision record

Primary source: supplied `prompt.txt`, titled “WEBEAZ.COM — COMPLETE WEBSITE REVAMP PROJECT PLAN.” Supplied `website.txt` contains the corporate website URL. Source statements were used as the brief, not independently verified company facts. The live website fetch failed during preparation; the SEO/content audit remains outstanding.

Technical reference links checked during preparation:

- [Next.js App Router documentation](https://nextjs.org/docs/app) — implementation reference for the proposed framework.
- [Google Search Central: site moves with URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) — migration reference.
- [Web Vitals](https://web.dev/articles/vitals) — field performance metric reference.

Decision log baseline: v1.0 introduces proposed routes, tokens, structured templates, CMS contracts, lead reliability requirements and acceptance gates. Future changes record date, owner, decision, rationale and affected sections. A spec revision is required when approved brand messaging, site architecture or integration contracts change.


