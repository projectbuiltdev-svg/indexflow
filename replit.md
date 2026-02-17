# IndexFlow - Programmatic SEO Infrastructure SaaS

## Overview
IndexFlow is a multi-tenant Programmatic SEO Infrastructure SaaS platform. It features a marketing landing page and a full dashboard with modules for content engine, keyword rank tracker, 5x5 local search grid, GSC analytics, and leads/CRM. All data is workspace-scoped with a workspace selector in the sidebar.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui components
- **Backend**: Express.js API server
- **Database**: PostgreSQL with Drizzle ORM (varchar UUID primary keys)
- **Routing**: wouter (client-side)
- **State**: TanStack React Query
- **Workspace Context**: WorkspaceProvider wraps DashboardLayout, persists selection to localStorage

## Key Files
- `shared/schema.ts` - All data models (workspaces, blogPosts, domains, contentAssets, campaigns, rankTrackerKeywords, gridKeywords, gridScanResults, leads, gscData, seoSettings)
- `server/db.ts` - Database connection
- `server/storage.ts` - DatabaseStorage class implementing IStorage interface
- `server/routes.ts` - All API endpoints under /api/
- `server/seed.ts` - Seed data for demo (4 workspaces, 12 blog posts, 4 domains, 1 campaign, 12 rank keywords, 5 grid keywords with scans, 10 leads, 40 GSC entries)
- `client/src/App.tsx` - Main router with landing page and dashboard routes
- `client/src/lib/workspace-context.tsx` - Workspace context provider with localStorage persistence
- `client/src/components/app-sidebar.tsx` - Sidebar with workspace selector dropdown
- `client/src/components/dashboard-layout.tsx` - Dashboard layout with active workspace badge
- `client/src/pages/landing.tsx` - Marketing landing page
- `client/src/pages/dashboard/` - All dashboard pages (overview, content, keywords, grid, gsc, leads, settings)

## Design Tokens
- Primary color: HSL 197 90% 50% (sky blue matching IndexFlow logo)
- Font: Inter (sans), Source Serif 4 (serif), JetBrains Mono (mono)
- Dark mode supported via ThemeProvider

## Routes
- `/` - Landing page
- `/dashboard` - Dashboard overview
- `/dashboard/content` - Content engine with post CRUD, MDX editor, campaign cards
- `/dashboard/keywords` - Rank tracker with position history
- `/dashboard/grid` - 5x5 local search grid with colored cells
- `/dashboard/gsc` - GSC analytics with charts
- `/dashboard/leads` - Leads & CRM with status pipeline
- `/dashboard/settings` - Settings (domains, SEO, API keys)

## API Endpoints
All prefixed with `/api/`:

### CRUD Endpoints
- GET/POST `/api/workspaces`, GET/PATCH `/api/workspaces/:id`
- GET/POST `/api/blog-posts`, GET/PUT/DELETE `/api/blog-posts/:id`
- POST `/api/blog-posts/:id/publish-now`, POST `/api/blog-posts/:id/schedule`
- POST `/api/blog-posts/bulk/create`
- GET/POST `/api/domains`, PATCH/DELETE `/api/domains/:id`
- GET/POST `/api/content-assets`, POST `/api/content-asset-usages`
- GET/POST `/api/campaigns`
- GET/POST `/api/rank-keywords`, PATCH/DELETE `/api/rank-keywords/:id`
- GET/POST/DELETE `/api/grid-keywords`
- GET/POST `/api/grid-scan-results`
- GET `/api/grid-scan-results-with-keywords` (combined endpoint)
- GET/POST `/api/leads`, PATCH `/api/leads/:id`
- GET/POST `/api/gsc-data`
- GET/PUT `/api/seo-settings`

### Advanced Endpoints
- POST `/api/mdx-preview` - Render MDX to HTML
- POST `/api/ai/generate-content` - SSE streaming content generation (stub)
- POST `/api/ai/generate-meta` - Meta title/description generation (stub)
- GET `/api/stock-images/search?q=` - Stock image search (stub)

## Recent Changes (Feb 2026)
- Migrated from MVP schema (users/clients/articles) to production schema (workspaces/blogPosts/domains/campaigns)
- Added workspace context with localStorage persistence and sidebar selector
- Built full Content Engine with create/edit/publish/delete flows and MDX editor
- Rebuilt Settings with domain manager and SEO settings
- Added advanced backend stubs (AI content gen, meta gen, MDX preview, stock images)
- All dashboard pages filter by selected workspace
