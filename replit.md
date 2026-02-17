# Resto - Multi-Tenant Venue Management SaaS

## Overview
Resto is a multi-tenant venue management SaaS platform for restaurants, hotels, and bars. It features a marketing landing page and a full dashboard with modules for content engine (blog), keyword rank tracker, 5x5 local search grid visualization, reservations, contact messages/CRM, and SEO settings. All data is venue-scoped with a venue selector in the sidebar.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui components
- **Backend**: Express.js API server
- **Database**: PostgreSQL with Drizzle ORM (mix of serial integer IDs and varchar(36) UUID primary keys)
- **Routing**: wouter (client-side)
- **State**: TanStack React Query
- **Venue Context**: VenueProvider wraps DashboardLayout, persists selection to localStorage

## Key Files
- `shared/schema.ts` - All data models (37 tables: venues, users, venueBlogPosts, venueDomains, venueContentAssets, venueCampaigns, rankTrackerKeywords, gridKeywords, gridScanResults, contactMessages, seoIntegrations, reservations, etc.)
- `server/db.ts` - Database connection
- `server/storage.ts` - DatabaseStorage class implementing IStorage interface (venue-scoped)
- `server/routes.ts` - All API endpoints under /api/ (venue-scoped)
- `server/seed.ts` - Seed data
- `client/src/App.tsx` - Main router with landing page and dashboard routes
- `client/src/lib/venue-context.tsx` - Venue context provider with localStorage persistence
- `client/src/components/app-sidebar.tsx` - Sidebar with venue selector dropdown
- `client/src/components/dashboard-layout.tsx` - Dashboard layout with active venue badge
- `client/src/pages/landing.tsx` - Marketing landing page
- `client/src/pages/dashboard/` - Dashboard pages (overview, content, keywords, grid, gsc, leads, reservations, settings)

## Design Tokens
- Primary color: HSL 197 90% 50% (sky blue)
- Font: Inter (sans), Source Serif 4 (serif), JetBrains Mono (mono)
- Dark mode supported via ThemeProvider

## Database Schema Notes
- Core entity: `venues` table with owner_id referencing `users`
- Primary keys: venues/users use varchar(36) UUIDs, most other tables use serial integers
- All resource tables have `venue_id` foreign key referencing venues
- Key tables: venues, users, venue_blog_posts, venue_domains, venue_content_assets, venue_campaigns, rank_tracker_keywords, grid_keywords, grid_scan_results, contact_messages, seo_integrations, reservations, venue_menus, venue_menu_items, venue_reviews, venue_social_accounts, venue_hours, venue_amenities, venue_photos, venue_staff, staff_schedules, phone_calls, chat_conversations, chat_messages
- CRITICAL: Do NOT run db:push - database already has correct schema from SQL import

## Routes
- `/` - Landing page
- `/dashboard` - Dashboard overview
- `/dashboard/content` - Content engine with post CRUD
- `/dashboard/keywords` - Rank tracker (keyword list)
- `/dashboard/grid` - 5x5 local search grid with colored cells
- `/dashboard/gsc` - GSC analytics (placeholder/coming soon)
- `/dashboard/reservations` - Reservation management
- `/dashboard/leads` - Contact messages / CRM
- `/dashboard/settings` - Settings (domains, SEO integrations, API keys)

## API Endpoints
All prefixed with `/api/`:

### Venues & Users
- GET/POST `/api/venues`, GET/PATCH `/api/venues/:id`
- GET `/api/users`

### Content
- GET/POST `/api/blog-posts` (query: ?venueId=), GET/PUT/DELETE `/api/blog-posts/:id`
- POST `/api/blog-posts/:id/publish-now`, POST `/api/blog-posts/:id/schedule`
- GET/POST `/api/domains` (query: ?venueId=), PATCH/DELETE `/api/domains/:id`
- GET/POST `/api/content-assets`, POST `/api/content-asset-usages`
- GET/POST `/api/campaigns`

### SEO
- GET/POST `/api/rank-keywords`, PATCH/DELETE `/api/rank-keywords/:id`
- GET/POST/DELETE `/api/grid-keywords`
- GET/POST `/api/grid-scan-results`
- GET/PUT `/api/seo-settings`

### CRM & Reservations
- GET/POST `/api/contact-messages`, PATCH `/api/contact-messages/:id`
- GET/POST `/api/reservations` (query: ?venueId=), PATCH `/api/reservations/:id`

### Advanced Endpoints (stubs)
- POST `/api/mdx-preview` - Render MDX to HTML
- POST `/api/ai/generate-content` - SSE streaming content generation
- POST `/api/ai/generate-meta` - Meta title/description generation

## Recent Changes (Feb 2026)
- Migrated from IndexFlow workspace-based architecture to Resto venue-based architecture
- Imported complete PostgreSQL dump (37 tables, 7 venues, 4 users)
- Rewrote schema.ts, storage.ts, routes.ts for venue-scoped data
- Created VenueProvider (replacing WorkspaceProvider) with localStorage persistence
- Updated all dashboard pages for venue context (overview, content, keywords, grid, leads, settings)
- Created reservations management page
- Updated GSC page to placeholder (no GscData table in new schema)
- Updated admin/client layouts and sidebars to use venue context
- RankKeyword simplified (only id, venueId, keyword, createdAt)
- Lead table replaced with ContactMessage (name, email, phone, company, inquiryType, message)
- Grid scan results changed from 2D array to individual cell records
