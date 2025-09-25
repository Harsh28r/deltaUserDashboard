import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Decode permissions cookie (base64 JSON array)
function getPermissions(req: NextRequest): string[] {
  try {
    const cookie = req.cookies.get('auth_perms')?.value || '';
    if (!cookie) return [];
    const json = Buffer.from(decodeURIComponent(cookie), 'base64').toString('utf-8');
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public assets and auth pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/auth') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  const perms = getPermissions(req);

  // Route → permission map (fine-grained)
  const checks: Array<{ test: (p: string) => boolean; perm: string }> = [
    // Leads
    { test: p => /^\/apps\/leads\/add$/i.test(p), perm: 'leads:create' },
    { test: p => /^\/apps\/leads\/edit\/.+$/i.test(p), perm: 'leads:update' },
    { test: p => /^\/apps\/leads(\/.*)?$/i.test(p), perm: 'leads:read' },

    // CP Sourcing
    { test: p => /^\/apps\/cp-sourcing\/add$/i.test(p), perm: 'cp-sourcing:create' },
    { test: p => /^\/apps\/cp-sourcing\/edit\/.+$/i.test(p), perm: 'cp-sourcing:update' },
    { test: p => /^\/apps\/cp-sourcing(\/.*)?$/i.test(p), perm: 'cp-sourcing:read' },

    // Channel Partners
    { test: p => /^\/apps\/channel-partners\/add$/i.test(p), perm: 'channel-partner:create' },
    { test: p => /^\/apps\/channel-partners\/edit\/.+$/i.test(p), perm: 'channel-partner:update' },
    { test: p => /^\/apps\/channel-partners(\/.*)?$/i.test(p), perm: 'channel-partner:read' },

    // Lead Sources
    { test: p => /^\/apps\/lead-sources\/add$/i.test(p), perm: 'leadssource:create' },
    { test: p => /^\/apps\/lead-sources\/edit\/.+$/i.test(p), perm: 'leadssource:update' },
    { test: p => /^\/apps\/lead-sources(\/.*)?$/i.test(p), perm: 'leadssource:read' },

    // Lead Statuses
    { test: p => /^\/apps\/lead-statuses\/add$/i.test(p), perm: 'leadsstatus:create' },
    { test: p => /^\/apps\/lead-statuses\/edit\/.+$/i.test(p), perm: 'leadsstatus:update' },
    { test: p => /^\/apps\/lead-statuses(\/.*)?$/i.test(p), perm: 'leadsstatus:read' },

    // Notifications & User Management
    { test: p => /^\/apps\/notifications(\/.*)?$/i.test(p), perm: 'notifications:read' },
    { test: p => /^\/apps\/user-management(\/.*)?$/i.test(p), perm: 'user:read_all' },
  ];

  const rule = checks.find(c => c.test(pathname));
  if (!rule) return NextResponse.next();

  if (!perms.includes(rule.perm)) {
    // Fast server-side redirect to first accessible route
    const fallbackOrder: Array<{ route: string; perm?: string }> = [
      { route: '/apps/leads', perm: 'leads:read' },
      { route: '/apps/cp-sourcing', perm: 'cp-sourcing:read' },
      { route: '/apps/channel-partners', perm: 'channel-partner:read' },
      { route: '/apps/lead-sources', perm: 'leadssource:read' },
      { route: '/apps/lead-statuses', perm: 'leadsstatus:read' },
      { route: '/', perm: undefined },
    ];
    const fb = fallbackOrder.find(f => !f.perm || perms.includes(f.perm));
    return NextResponse.redirect(new URL(fb?.route || '/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|public|favicon|auth).*)'],
};


