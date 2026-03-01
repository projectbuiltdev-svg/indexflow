import { useEffect } from "react";

export default function Docs() {
  useEffect(() => {
    document.title = "Platform Documentation - indexFlow";
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-8 max-w-4xl mx-auto">
      <style>{`@media print { h2 { break-before: page; } }`}</style>
      
      <h1 className="text-3xl font-bold text-center border-b-4 border-amber-500 pb-4 mb-2">INDEXFLOW</h1>
      <p className="text-center text-gray-600 mb-8">Complete Platform Documentation - Page by Page Breakdown</p>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">1. GLOBAL HEADER &amp; NAVIGATION</h2>
      
      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Desktop Header</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Logo</strong> - Links to homepage</li>
        <li><strong>Mega menu navigation</strong> - Multi-column dropdowns with icons, descriptions, and footer CTAs</li>
        <li><strong>Navigation sections:</strong> Solutions, Platform, Features, Comparisons, Resources</li>
        <li><strong>Globe icon</strong> - Translation dropdown (5 languages)</li>
        <li><strong>Theme toggle</strong> - Light/dark mode switch</li>
        <li><strong>"Client Login" button</strong> - Links to /client-login</li>
        <li><strong>"Get Started" button</strong> - Links to /contact</li>
      </ul>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Mobile Header</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>Logo, Globe icon, Theme toggle</li>
        <li>Hamburger menu (expands to show nav links)</li>
      </ul>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Sticky Sub-Navigation</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>Appears after scroll threshold via IntersectionObserver</li>
        <li>Active states indicated by primary text color and underline</li>
      </ul>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">2. PUBLIC MARKETING PAGES</h2>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Home Page <code className="bg-gray-100 px-1 rounded">/</code></h3>
      <ol className="list-decimal pl-6 space-y-2">
        <li><strong>Hero Section</strong> - Rotating video background with frosted glass effects, CTA buttons, stats bar</li>
        <li><strong>"Who We Serve"</strong> - 4 audience cards (SEO Agencies, Content Agencies, Marketing Agencies, Freelancers)</li>
        <li><strong>"The Problem"</strong> - 6 pain points</li>
        <li><strong>"The Solution"</strong> - 6 benefits</li>
        <li><strong>CMS Partners</strong> - Scrolling logos</li>
        <li><strong>Pricing</strong> - Solo ($99/mo), Pro ($199/mo), Agency ($349/mo), Enterprise ($999/mo)</li>
        <li><strong>"Why Choose indexFlow"</strong> - 4 feature cards</li>
        <li><strong>Testimonials</strong> - Customer reviews</li>
        <li><strong>Final CTA</strong></li>
      </ol>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Solutions Pages</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">SEO Agencies</td><td className="border p-2 font-mono text-sm">/solutions/seo-agencies</td></tr>
          <tr><td className="border p-2">Content Agencies</td><td className="border p-2 font-mono text-sm">/solutions/content-agencies</td></tr>
          <tr><td className="border p-2">Marketing Agencies</td><td className="border p-2 font-mono text-sm">/solutions/marketing-agencies</td></tr>
          <tr><td className="border p-2">Freelancers</td><td className="border p-2 font-mono text-sm">/solutions/freelancers</td></tr>
          <tr><td className="border p-2">White-Label Resellers</td><td className="border p-2 font-mono text-sm">/solutions/white-label-resellers</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Platform Pages</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">AI Widget</td><td className="border p-2 font-mono text-sm">/platform/ai-widget</td></tr>
          <tr><td className="border p-2">BYOK (Bring Your Own Key)</td><td className="border p-2 font-mono text-sm">/platform/byok</td></tr>
          <tr><td className="border p-2">Content Engine</td><td className="border p-2 font-mono text-sm">/platform/content-engine</td></tr>
          <tr><td className="border p-2">Client Dashboard</td><td className="border p-2 font-mono text-sm">/platform/client-dashboard</td></tr>
          <tr><td className="border p-2">CMS Integration</td><td className="border p-2 font-mono text-sm">/platform/cms-integration</td></tr>
          <tr><td className="border p-2">Local Search Grid</td><td className="border p-2 font-mono text-sm">/platform/local-search-grid</td></tr>
          <tr><td className="border p-2">Rank Tracker</td><td className="border p-2 font-mono text-sm">/platform/rank-tracker</td></tr>
          <tr><td className="border p-2">Search Console</td><td className="border p-2 font-mono text-sm">/platform/search-console</td></tr>
          <tr><td className="border p-2">SEO Tools</td><td className="border p-2 font-mono text-sm">/platform/seo-tools</td></tr>
          <tr><td className="border p-2">Post-Processing</td><td className="border p-2 font-mono text-sm">/platform/post-processing</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Feature Pages</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">Invoicing & Billing</td><td className="border p-2 font-mono text-sm">/features/invoicing</td></tr>
          <tr><td className="border p-2">AI Voice Assistant</td><td className="border p-2 font-mono text-sm">/features/voice-assistant</td></tr>
          <tr><td className="border p-2">SMS & Notifications</td><td className="border p-2 font-mono text-sm">/features/sms-notifications</td></tr>
          <tr><td className="border p-2">Team & Permissions</td><td className="border p-2 font-mono text-sm">/features/team-permissions</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Comparison Pages</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">vs SEMrush</td><td className="border p-2 font-mono text-sm">/comparisons/semrush</td></tr>
          <tr><td className="border p-2">vs Ahrefs</td><td className="border p-2 font-mono text-sm">/comparisons/ahrefs</td></tr>
          <tr><td className="border p-2">Best SEO Platforms</td><td className="border p-2 font-mono text-sm">/comparisons/best-seo-platforms</td></tr>
          <tr><td className="border p-2">Pricing Comparison</td><td className="border p-2 font-mono text-sm">/comparisons/pricing</td></tr>
          <tr><td className="border p-2">Platform Comparison</td><td className="border p-2 font-mono text-sm">/comparisons/platform</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Other Public Pages</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">How It Works</td><td className="border p-2 font-mono text-sm">/how-it-works</td></tr>
          <tr><td className="border p-2">Portfolio</td><td className="border p-2 font-mono text-sm">/portfolio</td></tr>
          <tr><td className="border p-2">Testimonials</td><td className="border p-2 font-mono text-sm">/testimonials</td></tr>
          <tr><td className="border p-2">Case Studies</td><td className="border p-2 font-mono text-sm">/case-studies</td></tr>
          <tr><td className="border p-2">Pricing</td><td className="border p-2 font-mono text-sm">/pricing</td></tr>
          <tr><td className="border p-2">FAQ</td><td className="border p-2 font-mono text-sm">/faq</td></tr>
          <tr><td className="border p-2">Blog</td><td className="border p-2 font-mono text-sm">/blog</td></tr>
          <tr><td className="border p-2">Templates</td><td className="border p-2 font-mono text-sm">/templates</td></tr>
          <tr><td className="border p-2">Contact</td><td className="border p-2 font-mono text-sm">/contact</td></tr>
          <tr><td className="border p-2">Book Demo</td><td className="border p-2 font-mono text-sm">/book-demo</td></tr>
          <tr><td className="border p-2">Privacy Policy</td><td className="border p-2 font-mono text-sm">/privacy</td></tr>
          <tr><td className="border p-2">Terms of Service</td><td className="border p-2 font-mono text-sm">/terms</td></tr>
        </tbody>
      </table>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">3. PRICING STRUCTURE</h2>
      
      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Service Tiers</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Plan</th><th className="border p-2 text-left">Price</th><th className="border p-2 text-left">Includes</th></tr></thead>
        <tbody>
          <tr><td className="border p-2 font-semibold">Solo</td><td className="border p-2">$99/month</td><td className="border p-2">1 workspace, rank tracking, content engine, CRM, invoicing</td></tr>
          <tr><td className="border p-2 font-semibold">Pro</td><td className="border p-2">$199/month</td><td className="border p-2">3 workspaces, AI widget, voice/SMS, priority support, advanced analytics</td></tr>
          <tr><td className="border p-2 font-semibold">Agency</td><td className="border p-2">$349/month</td><td className="border p-2">7 workspaces, custom branding, custom domain, BYOK support, client portals, white-label reports</td></tr>
          <tr><td className="border p-2 font-semibold">Enterprise</td><td className="border p-2">$999/month</td><td className="border p-2">20 workspaces, dedicated infrastructure, SLA, custom integrations, onboarding</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">SEO Tools Pricing</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Tool</th><th className="border p-2 text-left">Free Tier</th><th className="border p-2 text-left">Credit Packs</th></tr></thead>
        <tbody>
          <tr>
            <td className="border p-2 font-semibold">Rank Tracker</td>
            <td className="border p-2">Free weekly scans for all keywords (up to 1,000), 5 free starter credits</td>
            <td className="border p-2">$10 for 5 checks, $40 for 25 checks (250 keyword cap per credit check)</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">Local Search Grid</td>
            <td className="border p-2">5x5 grid, up to 25 keywords</td>
            <td className="border p-2">Credit-based scanning</td>
          </tr>
          <tr>
            <td className="border p-2 font-semibold">Google Search Console</td>
            <td className="border p-2">Included with all plans</td>
            <td className="border p-2">N/A</td>
          </tr>
        </tbody>
      </table>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">4. AI WIDGET (FLOATING CHAT)</h2>
      <p><strong>Location:</strong> Bottom-right on public pages | <strong>Hidden on:</strong> Dashboard pages</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Chat bubble toggle, message history</li>
        <li>Text input with send button</li>
        <li>Voice input button (microphone) - Browser Web Speech API for STT</li>
        <li>Text-to-speech per message - Browser SpeechSynthesis (demo) or BYOK provider (deployed)</li>
        <li>Voice mode toggle</li>
        <li>Quick actions: Schedule Demo, Learn More, Contact Sales</li>
        <li>"powered by indexFlow." footer</li>
        <li>Widget Chat API: <code className="bg-gray-100 px-1 rounded">POST /api/widget/:workspaceId/chat</code> (public, rate-limited)</li>
      </ul>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">5. CLIENT DASHBOARD</h2>
      <p className="mb-2"><strong>Access:</strong> /client-login &rarr; /select-workspace &rarr; /:workspaceId/*</p>
      
      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Core Pages</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th><th className="border p-2 text-left">Function</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">Login</td><td className="border p-2 font-mono text-sm">/client-login</td><td className="border p-2">Replit Auth (Google SSO)</td></tr>
          <tr><td className="border p-2">Workspace Select</td><td className="border p-2 font-mono text-sm">/select-workspace</td><td className="border p-2">Choose workspace to manage</td></tr>
          <tr><td className="border p-2">Today</td><td className="border p-2 font-mono text-sm">/:workspaceId/today</td><td className="border p-2">Dashboard overview &amp; stats</td></tr>
          <tr><td className="border p-2">Content Posts</td><td className="border p-2 font-mono text-sm">/:workspaceId/content/posts</td><td className="border p-2">Blog posts &amp; content management</td></tr>
          <tr><td className="border p-2">Campaigns</td><td className="border p-2 font-mono text-sm">/:workspaceId/content/campaigns</td><td className="border p-2">Content campaign management</td></tr>
          <tr><td className="border p-2">CRM Pipeline</td><td className="border p-2 font-mono text-sm">/:workspaceId/crm/pipeline</td><td className="border p-2">Deal pipeline &amp; lead tracking</td></tr>
          <tr><td className="border p-2">Analytics</td><td className="border p-2 font-mono text-sm">/:workspaceId/analytics/overview</td><td className="border p-2">Charts &amp; metrics</td></tr>
          <tr><td className="border p-2">Export Data</td><td className="border p-2 font-mono text-sm">/:workspaceId/analytics/export</td><td className="border p-2">CSV downloads</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">SEO &amp; Rank Tracker</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th><th className="border p-2 text-left">Function</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">Track Keywords</td><td className="border p-2 font-mono text-sm">/:workspaceId/rank-tracker/track-keywords</td><td className="border p-2">Keyword rank tracking with DataForSEO integration, free weekly scans, credit-based on-demand checks (250 keyword cap)</td></tr>
          <tr><td className="border p-2">Local Search Grid</td><td className="border p-2 font-mono text-sm">/:workspaceId/rank-tracker/local-search-grid</td><td className="border p-2">5x5 geo-grid rank tracking, up to 25 keywords, Google Maps visibility</td></tr>
          <tr><td className="border p-2">Google Search Console</td><td className="border p-2 font-mono text-sm">/:workspaceId/rank-tracker/google-search-console</td><td className="border p-2">GSC integration for search performance data</td></tr>
          <tr><td className="border p-2">SEO Health</td><td className="border p-2 font-mono text-sm">/:workspaceId/seo/health</td><td className="border p-2">On-page SEO audits &amp; recommendations</td></tr>
          <tr><td className="border p-2">Internal Links</td><td className="border p-2 font-mono text-sm">/:workspaceId/seo/links</td><td className="border p-2">Link suggestions &amp; orphan detection</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Settings Pages</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">Team &amp; Invites</td><td className="border p-2 font-mono text-sm">/:workspaceId/settings/team</td></tr>
          <tr><td className="border p-2">White Label</td><td className="border p-2 font-mono text-sm">/:workspaceId/settings/white-label</td></tr>
          <tr><td className="border p-2">Billing &amp; Usage</td><td className="border p-2 font-mono text-sm">/:workspaceId/settings/billing</td></tr>
          <tr><td className="border p-2">Setup Guide</td><td className="border p-2 font-mono text-sm">/:workspaceId/settings/setup-guide</td></tr>
          <tr><td className="border p-2">Widget Embed Code</td><td className="border p-2 font-mono text-sm">/:workspaceId/widget/code</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Connections (BYOK)</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">AI Providers</td><td className="border p-2 font-mono text-sm">/:workspaceId/connections/ai-providers</td></tr>
          <tr><td className="border p-2">Image Banks</td><td className="border p-2 font-mono text-sm">/:workspaceId/connections/image-banks</td></tr>
          <tr><td className="border p-2">Payments</td><td className="border p-2 font-mono text-sm">/:workspaceId/connections/payments</td></tr>
          <tr><td className="border p-2">Twilio</td><td className="border p-2 font-mono text-sm">/:workspaceId/connections/twilio</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Support &amp; Documentation</h3>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">Documentation</td><td className="border p-2 font-mono text-sm">/:workspaceId/support/documentation</td></tr>
          <tr><td className="border p-2">Support Tickets</td><td className="border p-2 font-mono text-sm">/:workspaceId/support/tickets</td></tr>
        </tbody>
      </table>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">6. ADMIN DASHBOARD</h2>
      <p className="mb-2"><strong>Access:</strong> /admin/* (indexFlow internal staff only)</p>
      <p className="mb-2"><strong>Roles:</strong> super_admin, admin, sales, seo_production, website_production, customer_support - each with specific access levels</p>
      
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th><th className="border p-2 text-left">Function</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">Dashboard</td><td className="border p-2 font-mono text-sm">/admin</td><td className="border p-2">Overview stats, recent agencies, quick actions</td></tr>
          <tr><td className="border p-2">Agencies</td><td className="border p-2 font-mono text-sm">/admin/agencies</td><td className="border p-2">Agency workspace management</td></tr>
          <tr><td className="border p-2">Users</td><td className="border p-2 font-mono text-sm">/admin/users/all</td><td className="border p-2">Platform user accounts</td></tr>
          <tr><td className="border p-2">Billing</td><td className="border p-2 font-mono text-sm">/admin/billing/subscriptions</td><td className="border p-2">Subscription &amp; invoice management</td></tr>
          <tr><td className="border p-2">Content</td><td className="border p-2 font-mono text-sm">/admin/content/posts</td><td className="border p-2">Content moderation &amp; management</td></tr>
          <tr><td className="border p-2">SEO Keywords</td><td className="border p-2 font-mono text-sm">/admin/platform-seo/keywords</td><td className="border p-2">Platform-wide keyword usage</td></tr>
          <tr><td className="border p-2">Twilio</td><td className="border p-2 font-mono text-sm">/admin/system/twilio</td><td className="border p-2">Twilio voice &amp; SMS management</td></tr>
          <tr><td className="border p-2">Support Tickets</td><td className="border p-2 font-mono text-sm">/admin/support/tickets</td><td className="border p-2">Client support ticket management</td></tr>
          <tr><td className="border p-2">Settings</td><td className="border p-2 font-mono text-sm">/admin/settings/config</td><td className="border p-2">Platform configuration</td></tr>
        </tbody>
      </table>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">7. TWILIO INTEGRATION</h2>
      <ul className="list-disc pl-6 space-y-1 mt-4">
        <li><strong>Voice:</strong> AI phone assistant with TwiML, speech recognition, BYOK AI providers, Amazon Polly TTS</li>
        <li><strong>SMS Inbound:</strong> Keyword processing (CANCEL, CONFIRM, STATUS, HOURS, HELP), automatic caller matching</li>
        <li><strong>SMS Outbound:</strong> Template variables for confirmation, reminder, notification messages</li>
        <li><strong>Webhook:</strong> <code className="bg-gray-100 px-1 rounded">/api/twilio/connect/:workspaceId</code> for phone number configuration</li>
        <li><strong>Call Flow:</strong> Greeting &rarr; Speech gathering &rarr; AI response &rarr; Lead capture</li>
      </ul>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">8. DEMO &amp; PREVIEW PAGES</h2>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Page</th><th className="border p-2 text-left">Route</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">Widget Demo</td><td className="border p-2 font-mono text-sm">/widget-demo</td></tr>
          <tr><td className="border p-2">SMS Demo</td><td className="border p-2 font-mono text-sm">/demo-sms</td></tr>
          <tr><td className="border p-2">Email Demo</td><td className="border p-2 font-mono text-sm">/demo-email</td></tr>
          <tr><td className="border p-2">Reminder Demo</td><td className="border p-2 font-mono text-sm">/demo-reminder</td></tr>
          <tr><td className="border p-2">CMS Logos Demo</td><td className="border p-2 font-mono text-sm">/demo-cms</td></tr>
          <tr><td className="border p-2">Chat Widget Demo</td><td className="border p-2 font-mono text-sm">/demo-chat</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Template Previews (Design Showcase)</h3>
      <p className="mt-2 mb-2">Website template previews showing different design styles</p>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Category</th><th className="border p-2 text-left">Styles</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">Agency</td><td className="border p-2 font-mono text-sm">/preview/restaurant-{"{bold|vibrant|simple|minimalistic}"}</td></tr>
          <tr><td className="border p-2">Portfolio</td><td className="border p-2 font-mono text-sm">/preview/cafe-{"{bold|vibrant|simple|minimalistic}"}</td></tr>
          <tr><td className="border p-2">Corporate</td><td className="border p-2 font-mono text-sm">/preview/bar-{"{bold|vibrant|simple|minimalistic}"}</td></tr>
          <tr><td className="border p-2">Landing Page</td><td className="border p-2 font-mono text-sm">/preview/hotel-{"{bold|vibrant|simple|minimalistic}"}</td></tr>
        </tbody>
      </table>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">9. TECHNICAL STACK</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h4 className="font-semibold">Frontend:</h4>
          <ul className="list-disc pl-6 text-sm">
            <li>React + TanStack Query v5</li>
            <li>React Hook Form + Zod validation</li>
            <li>shadcn/ui components</li>
            <li>Wouter routing</li>
            <li>Tailwind CSS with CSS variables</li>
            <li>Embla Carousel, React Day Picker</li>
            <li>Lucide React icons</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Backend:</h4>
          <ul className="list-disc pl-6 text-sm">
            <li>Node.js + TypeScript + Express</li>
            <li>PostgreSQL + Drizzle ORM</li>
            <li>Replit Auth (sessions + users)</li>
            <li>IStorage interface pattern</li>
            <li>RESTful API design</li>
            <li>Express Rate Limit</li>
            <li>Nodemailer, Multer</li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h4 className="font-semibold">Hosting &amp; Infrastructure:</h4>
          <ul className="list-disc pl-6 text-sm">
            <li>Replit - Development environment &amp; testing</li>
            <li>GitHub - Code sync &amp; central repository</li>
            <li>Northflank - Production backend, managed PostgreSQL, custom domains &amp; subdomains, auto-scaling</li>
            <li>Cloudflare Pages - Client website hosting (unlimited sites, global CDN)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">External Services:</h4>
          <ul className="list-disc pl-6 text-sm">
            <li>DataForSEO - Rank tracking (Standard Queue) &amp; Local Search Grid (Live API)</li>
            <li>Twilio - Voice calls and SMS</li>
            <li>OpenAI / Google AI - AI chat responses</li>
            <li>Stripe &amp; PayPal - Client payment processing</li>
            <li>Google Search Console - SEO integration</li>
            <li>Lemon Squeezy (evaluating) - Platform billing &amp; subscriptions (MoR)</li>
          </ul>
        </div>
      </div>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Database Tables</h3>
      <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
        <div>
          <p className="font-semibold mb-1">Auth &amp; Core:</p>
          <ul className="list-disc pl-6">
            <li>users (Replit Auth)</li>
            <li>sessions</li>
            <li>workspaces</li>
            <li>contact_messages</li>
            <li>support_tickets</li>
            <li>team_members</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-1">AI &amp; Comms:</p>
          <ul className="list-disc pl-6">
            <li>knowledge_base_items</li>
            <li>widget_settings</li>
            <li>widget_chat_logs</li>
            <li>ai_provider_settings</li>
            <li>twilio_settings</li>
            <li>call_logs</li>
            <li>payment_settings</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-1">SEO &amp; Content:</p>
          <ul className="list-disc pl-6">
            <li>seo_settings</li>
            <li>rank_tracker_keywords</li>
            <li>rank_tracker_results</li>
            <li>rank_tracker_credits</li>
            <li>rank_tracker_history</li>
            <li>grid_keywords</li>
            <li>grid_scan_results</li>
            <li>grid_refresh_credits</li>
            <li>grid_refresh_history</li>
            <li>blog_posts</li>
            <li>content_assets</li>
            <li>campaigns</li>
            <li>invoices</li>
            <li>content_reports</li>
            <li>admin_users</li>
            <li>admin_settings</li>
          </ul>
        </div>
      </div>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">10. FEATURE STATUS</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h4 className="font-semibold text-green-600">Implemented:</h4>
          <ul className="list-disc pl-6 text-sm">
            <li>Database Integration (PostgreSQL)</li>
            <li>Authentication (Replit Auth + Access Gate)</li>
            <li>Client Dashboard (full CRUD)</li>
            <li>Admin Dashboard (role-based permissions)</li>
            <li>Content Engine (AI bulk drafts, quality gates)</li>
            <li>CMS Integration (WordPress/Webflow/Shopify/Ghost/Wix)</li>
            <li>AI Training Hub UI</li>
            <li>Support Ticket System</li>
            <li>CRM &amp; Pipeline</li>
            <li>Invoicing Engine</li>
            <li>Rank Tracker with DataForSEO</li>
            <li>Local Search Grid (5x5)</li>
            <li>Google Search Console Integration</li>
            <li>Credit-based SEO scanning</li>
            <li>Free weekly rank scans</li>
            <li>Export Data (CSV)</li>
            <li>Website Templates</li>
            <li>Twilio Voice &amp; SMS Webhooks</li>
            <li>BYOK Provider Configuration (7 AI providers)</li>
            <li>Multi-workspace Support</li>
            <li>White-Label Branding</li>
            <li>SEO Component (meta tags, OG, JSON-LD)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-amber-600">Pending / In Progress:</h4>
          <ul className="list-disc pl-6 text-sm">
            <li>Payment Gateway Integration (evaluating Lemon Squeezy)</li>
            <li>Credit Purchase Flow</li>
            <li>Translation System (UI only)</li>
            <li>Real-time AI Chat (widget)</li>
            <li>Voice Input Processing (widget)</li>
            <li>File Upload Processing</li>
            <li>BYOK Key Encryption</li>
            <li>Stripe &amp; PayPal Payment Processing</li>
            <li>Email Notifications (Nodemailer)</li>
          </ul>
        </div>
      </div>

      <h2 className="bg-amber-500 text-white p-3 rounded mt-8 text-xl font-bold">ADDENDUM: HOSTING &amp; SCALING ARCHITECTURE</h2>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Platform Hosting Limits</h3>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Replit Core plan allows <strong>unlimited published apps</strong> but has a hard limit of <strong>20 concurrent running apps</strong></li>
        <li>Subscription cost does not increase based on number of apps — only usage-based compute charges apply when monthly credits are exceeded</li>
        <li>For hosting hundreds or thousands of client websites, a multi-platform architecture is required</li>
      </ul>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Multi-Platform Architecture</h3>
      <p className="mt-2 mb-2">To scale beyond the 20 concurrent app limit, client-facing websites are hosted externally while the core platform remains as a single backend app:</p>
      <div className="bg-gray-50 border border-gray-200 rounded p-4 my-4 font-mono text-sm">
        Replit (develop &amp; backend API) &rarr; GitHub (sync) &rarr; Cloudflare Pages (client websites) + Northflank (production backend)
      </div>
      <table className="w-full border-collapse my-4">
        <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Component</th><th className="border p-2 text-left">Platform</th><th className="border p-2 text-left">Role</th></tr></thead>
        <tbody>
          <tr><td className="border p-2 font-semibold">Development</td><td className="border p-2">Replit</td><td className="border p-2">Source code development, testing, database during dev</td></tr>
          <tr><td className="border p-2 font-semibold">Code Sync</td><td className="border p-2">GitHub</td><td className="border p-2">Central repository, bridges Replit to deployment platforms</td></tr>
          <tr><td className="border p-2 font-semibold">Client Websites</td><td className="border p-2">Cloudflare Pages</td><td className="border p-2">Hosts all client-facing websites (unlimited sites, unlimited bandwidth)</td></tr>
          <tr><td className="border p-2 font-semibold">Production Backend</td><td className="border p-2">Northflank</td><td className="border p-2">Containerised backend API, managed database, auto-scaling for production workloads</td></tr>
        </tbody>
      </table>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">How This Stays Under Replit's 20 App Limit</h3>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Only <strong>1 app runs on Replit</strong> — the core platform backend (API, database, admin dashboard)</li>
        <li>All client websites (hundreds or thousands) are hosted on <strong>Cloudflare Pages</strong> — these are invisible to Replit</li>
        <li>Each platform operates independently — Replit, GitHub, Cloudflare, and Northflank do not need to acknowledge each other</li>
        <li>Replit only counts what runs on Replit, so 1 backend app = well under the 20 limit</li>
      </ul>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Cloudflare Pages - Client Website Hosting</h3>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li><strong>Unlimited sites</strong> on free tier</li>
        <li><strong>Unlimited bandwidth</strong></li>
        <li>500 deployments per month (free), more on paid plans</li>
        <li>Global CDN for fast load times worldwide</li>
        <li>Custom domains per client are straightforward to configure</li>
        <li>Client websites are static/lightweight frontends that call back to the backend API for data and AI</li>
        <li>Scales to thousands of client sites with no concurrent app limits</li>
      </ul>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Northflank - Production Backend &amp; Domain Management</h3>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Containerised deployments from GitHub</li>
        <li>Managed PostgreSQL database</li>
        <li>Auto-scaling for variable traffic</li>
        <li>Environment variables and secrets management</li>
        <li><strong>Custom domain hosting</strong> for client websites (e.g. client-agency.com)</li>
        <li><strong>Subdomain management</strong> (e.g. clientname.indexflow.io)</li>
        <li>SSL/TLS certificates handled automatically for all custom and subdomains</li>
        <li>Production backend from day one — not a later migration</li>
      </ul>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Deployment Strategy</h3>
      <p className="mt-2">The full multi-platform pipeline runs from day one — no phased migration needed:</p>
      <div className="bg-gray-50 border border-gray-200 rounded p-4 my-4 font-mono text-sm">
        Replit (develop) &rarr; GitHub (sync) &rarr; Cloudflare Pages (client websites) + Northflank (production backend)
      </div>

      <h3 className="text-amber-500 border-b border-gray-300 pb-1 mt-6 font-semibold">Initial Setup Steps</h3>

      <h4 className="font-semibold mt-4 mb-2">1. GitHub (Code Sync)</h4>
      <ol className="list-decimal pl-6 space-y-1">
        <li>Connect Replit to GitHub repository (built-in sync)</li>
        <li>All code changes in Replit automatically push to GitHub</li>
        <li>GitHub acts as the central bridge to both Cloudflare and Northflank</li>
      </ol>

      <h4 className="font-semibold mt-4 mb-2">2. Cloudflare Pages (Client Websites)</h4>
      <ol className="list-decimal pl-6 space-y-1">
        <li>Separate client website templates into standalone deployable packages (static frontends that call the backend API)</li>
        <li>Connect GitHub repo to Cloudflare Pages — auto-deploys on every push</li>
        <li>Configure custom domains per client (e.g. client-agency.com)</li>
        <li>Each client website calls back to the Northflank backend API for data and AI</li>
        <li>Updates flow automatically: edit in Replit &rarr; push to GitHub &rarr; Cloudflare auto-deploys to all client sites</li>
      </ol>

      <h4 className="font-semibold mt-4 mb-2">3. Northflank (Production Backend &amp; Domains)</h4>
      <ol className="list-decimal pl-6 space-y-1">
        <li>Deploy backend from GitHub repo to Northflank</li>
        <li>Set up managed PostgreSQL on Northflank</li>
        <li>Configure environment variables and secrets (DataForSEO, Twilio, Stripe, etc.)</li>
        <li>Set up custom domain routing for client sites</li>
        <li>Configure subdomain management (e.g. clientname.indexflow.io)</li>
        <li>SSL/TLS certificates are provisioned automatically per domain</li>
        <li>Point Cloudflare client sites to the Northflank API URL</li>
        <li>Configure CORS to accept requests from all client domains and subdomains</li>
        <li>Replit continues as the development and testing environment</li>
      </ol>

      <hr className="my-8" />
      <p className="text-center text-gray-500 text-sm">Print this page (Ctrl+P) to save as PDF</p>
    </div>
  );
}
