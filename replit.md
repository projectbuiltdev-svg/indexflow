# indexFlow - White-Label SEO & Content Management SaaS

## Overview
indexFlow is a white-label SEO, content management, and client management SaaS platform for agencies, freelancers, and enterprises. It features a marketing landing page, a Super Admin Dashboard, and a Client Dashboard with 13 core modules: Content Engine (AI bulk drafts, quality gates), CMS Integration (WordPress/Webflow/Shopify/Ghost/Wix), SEO Tools (Rank Tracker, Local Search Grid, On-Page Auditor, Schema Markup), CRM & Pipeline, Invoicing, Reports, AI Widget, Twilio, and White Label branding. Four pricing tiers: Solo ($99/mo, 1 user, 1 workspace), Pro ($199/mo, 5 users, 25 workspaces), Agency ($349/mo, 10 users, 50 workspaces), Enterprise ($999/mo, 20 users, unlimited workspaces). All plans: 40 AI posts/workspace/month. All data is workspace-scoped with a workspace selector in the sidebar.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui components
- **Backend**: Express.js API server
- **Database**: PostgreSQL with Drizzle ORM (mix of serial integer IDs and varchar(36) UUID primary keys)
- **Routing**: wouter (client-side)
- **State**: TanStack React Query
- **Workspace Context**: WorkspaceProvider wraps ClientLayout, persists selection to localStorage

## Key Files
- `shared/schema.ts` - All data models (37 tables)
- `server/db.ts` - Database connection
- `server/storage.ts` - DatabaseStorage class implementing IStorage interface (workspace-scoped)
- `server/routes.ts` - All API endpoints under /api/ (workspace-scoped)
- `server/seed.ts` - Seed data
- `client/src/App.tsx` - Main router with 100+ routes (landing, admin, client dashboard)
- `client/src/lib/workspace-context.tsx` - Workspace context provider with localStorage persistence
- `client/src/components/admin-sidebar.tsx` - Super Admin sidebar with 8 collapsible sections
- `client/src/components/client-sidebar.tsx` - Client Dashboard sidebar with 11 collapsible sections
- `client/src/components/admin-layout.tsx` - Admin layout with SidebarProvider + UserAvatarDropdown
- `client/src/components/client-layout.tsx` - Client layout with WorkspaceProvider + UserAvatarDropdown
- `client/src/components/user-avatar-dropdown.tsx` - Avatar dropdown with theme toggle, account, sign out
- `client/src/pages/admin/` - 24 Super Admin pages (dashboard + 23 sub-pages)
- `client/src/pages/dashboard/` - 30+ Client Dashboard pages

## Design Tokens
- Primary color: HSL 197 90% 50% (sky blue)
- Font: Inter (sans), Source Serif 4 (serif), JetBrains Mono (mono)
- Dark mode supported via ThemeProvider

## Database Schema Notes
- Core entity: `venues` table (DB name preserved) with owner_id referencing `users`
- Drizzle exports use workspace naming: `workspaces`, `workspaceBlogPosts`, etc.
- JS property names use `workspaceId` while DB columns remain `venue_id` for backward compatibility
- Primary keys: workspaces/users use varchar(36) UUIDs, most other tables use serial integers
- All resource tables have `venue_id` (DB) / `workspaceId` (JS) foreign key referencing workspaces
- CRITICAL: Do NOT run db:push - database already has correct schema from SQL import

## Routes

### Super Admin Dashboard
- `/admin` - Admin Dashboard overview
- `/admin/agencies` - All Agencies
- `/admin/agencies/detail` - Agency Detail
- `/admin/agencies/pending` - Pending Approvals
- `/admin/content/posts` - All Posts
- `/admin/content/campaigns` - All Campaigns
- `/admin/content/moderation` - Content Moderation
- `/admin/platform-seo/keywords` - Keyword Usage
- `/admin/platform-seo/api-usage` - API Usage
- `/admin/billing/subscriptions` - Subscriptions
- `/admin/billing/revenue` - Revenue
- `/admin/billing/invoices` - Invoices
- `/admin/billing/payouts` - Payouts
- `/admin/system/api-keys` - Platform API Keys
- `/admin/system/twilio` - Twilio Management
- `/admin/system/email` - Email Configuration
- `/admin/system/infrastructure` - Infrastructure
- `/admin/users/all` - All Users
- `/admin/users/admins` - Admin Users
- `/admin/support/tickets` - Support Tickets
- `/admin/support/call-logs` - Call Logs
- `/admin/support/announcements` - System Announcements
- `/admin/settings/config` - Platform Config
- `/admin/settings/branding` - Branding

### Client Dashboard (/:workspaceId prefix)
- `/:workspaceId/today` - Dashboard Overview
- `/:workspaceId/content/posts` - Content Posts
- `/:workspaceId/content/pages` - Content Pages
- `/:workspaceId/content/campaigns` - Campaigns
- `/:workspaceId/content/domains` - Domains
- `/:workspaceId/seo/links` - Internal Links
- `/:workspaceId/seo/health` - SEO Health
- `/:workspaceId/seo/cms` - CMS Integration
- `/:workspaceId/seo/reports` - SEO Reports
- `/:workspaceId/seo/invoices` - SEO Invoices
- `/:workspaceId/rank-tracker/track-keywords` - Track Keywords
- `/:workspaceId/rank-tracker/local-search-grid` - Local Search Grid
- `/:workspaceId/rank-tracker/google-search-console` - Google Search Console
- `/:workspaceId/twilio/call-logs` - Call Logs
- `/:workspaceId/twilio/voice` - Voice Settings
- `/:workspaceId/twilio/sms` - SMS Settings
- `/:workspaceId/widget/monitoring` - Widget Monitoring
- `/:workspaceId/widget/code` - Widget Code
- `/:workspaceId/crm/pipeline` - CRM Pipeline
- `/:workspaceId/crm/contacts` - CRM Contacts
- `/:workspaceId/analytics/overview` - Analytics Overview
- `/:workspaceId/analytics/export` - Export Data
- `/:workspaceId/connections/ai-providers` - AI Provider Connections
- `/:workspaceId/connections/image-banks` - Image Bank Connections
- `/:workspaceId/connections/payments` - Payment Connections
- `/:workspaceId/connections/twilio` - Twilio Account Connection
- `/:workspaceId/ai-training/knowledge-base` - Knowledge Base
- `/:workspaceId/ai-training/channels` - AI Channels
- `/:workspaceId/settings/team` - Team & Invites
- `/:workspaceId/settings/white-label` - White Label
- `/:workspaceId/settings/billing` - Billing & Usage
- `/:workspaceId/settings/setup-guide` - Setup Guide
- `/:workspaceId/support/documentation` - Documentation
- `/:workspaceId/support/tickets` - Support Tickets

### Marketing Pages
- `/` - Landing page / Home
- `/how-it-works` - About
- `/solutions/*` - Solution pages (restaurants, cafes, bars, hotels, multi-location)
- `/platform/*` - Platform feature pages
- `/pricing` - Pricing
- `/blog` - Blog
- `/templates` - Templates
- `/contact` - Contact
- `/select-workspace` - Workspace selector page

## API Endpoints
All prefixed with `/api/`:

### Workspaces & Users
- GET/POST `/api/workspaces`, GET/PATCH `/api/workspaces/:id`
- GET `/api/users`

### Content
- GET/POST `/api/blog-posts` (query: ?workspaceId=), GET/PUT/DELETE `/api/blog-posts/:id`
- POST `/api/blog-posts/:id/publish-now`, POST `/api/blog-posts/:id/schedule`
- GET/POST `/api/domains` (query: ?workspaceId=), PATCH/DELETE `/api/domains/:id`
- GET/POST `/api/content-assets`, POST `/api/content-asset-usages`
- GET/POST `/api/campaigns`

### SEO
- GET/POST `/api/rank-keywords`, PATCH/DELETE `/api/rank-keywords/:id`
- GET/POST/DELETE `/api/grid-keywords`
- GET/POST `/api/grid-scan-results`
- GET/PUT `/api/seo-settings`
- POST `/api/seo/validate/:postId` - SEO validation
- GET `/api/seo/link-suggestions/:postId` - Internal link suggestions
- GET `/api/seo/orphan-report` - Find posts with no internal links
- GET `/api/seo/keyword-cannibalization` - Keyword overlap detection

### CRM & Reservations
- GET/POST `/api/contact-messages`, PATCH `/api/contact-messages/:id`
- GET/POST `/api/reservations` (query: ?workspaceId=), PATCH `/api/reservations/:id`

### Invoices
- GET/POST `/api/invoices` (query: ?workspaceId=)
- GET/PATCH/DELETE `/api/invoices/:id`

### Content Reports
- GET/POST `/api/content-reports` (query: ?workspaceId=)
- GET/PATCH/DELETE `/api/content-reports/:id`

### Advanced Endpoints (stubs)
- POST `/api/mdx-preview` - Render MDX to HTML
- POST `/api/ai/generate-content` - SSE streaming content generation
- POST `/api/ai/generate-meta` - Meta title/description generation

## Naming Convention
- **Code/JS**: workspace, workspaceId, Workspace, WorkspaceBlogPost, etc.
- **Database columns**: venue_id, venue_blog_posts, etc. (preserved for backward compatibility)
- **API paths**: /api/workspaces/, ?workspaceId= (no /api/admin/ prefix)
- **Frontend context**: WorkspaceProvider, useWorkspace, selectedWorkspace
- **localStorage keys**: indexflow_workspace_id, indexflow_admin_session, indexflow_session

## Testing Policy
- Do NOT run Playwright e2e tests (run_test). The user has disabled e2e testing permanently.
- Verify changes via curl, logs, and manual inspection only.

## Recent Changes (Feb 2026)
- **Full platform rebrand**: Removed ALL hospitality/restaurant/booking references across 50+ files
- Rewrote home page: agency pain points, SEO tool replacement, 4-tier pricing preview, agency testimonials, content lifecycle
- Rewrote pricing page: Solo ($99), Professional ($299), White Label ($499), Enterprise (custom) with comparison table and FAQ
- Rewrote 5 solution pages: SEO Agencies, Content Agencies, Digital Marketing, Freelancers, White-Label Resellers
- Rewrote 11 platform feature pages: Content Engine, CMS Integration, SEO Tools, CRM & Pipeline, AI Widget, BYOK, Rank Tracker, Local Search Grid, Search Console, Post-Processing, Client Dashboard
- Rewrote comparison pages: indexFlow vs SEMrush, vs Ahrefs, Best SEO Platforms, Pricing Comparison, Platform Comparison
- Rewrote feature pages: Invoicing & Billing, AI Voice Assistant, SMS & Notifications, Team & Permissions
- Rewrote about page, contact page, FAQ page, blog categories, templates, testimonials, case studies
- Updated header navigation with new solution/platform paths
- Updated site search index with new page names
- Updated SEO metadata across all pages
- Added route aliases in App.tsx for new paths (e.g., /solutions/seo-agencies, /platform/content-engine)
- Cleaned admin dashboard pages: Virtual Concierge → Professional/AI Widget
- Cleaned AI widget: booking references → consultation/demo scheduling
- Complete global rename: venue → workspace across codebase (60+ files, 600+ occurrences)
- Rebuilt Super Admin sidebar with 8 collapsible sections
- Rebuilt Client Dashboard sidebar with 11 collapsible sections
- Created UserAvatarDropdown component with theme toggle, account, sign out
- Logo asset: @assets/image_1771351451425.png (indexFlow logo)
- **White Label Sub-BYOK**: Added per-workspace `aiKeySource` toggle ('agency' | 'client') to workspaces table. Agency Key mode = workspace BYOK key → platform fallback. Client Key mode = client-provided key only, zero fallback. Key resolution via `resolveAiKey()` in server/ai-chat.ts. UI toggle on connections-ai page. AI status endpoint: GET /api/workspaces/:id/ai-status
