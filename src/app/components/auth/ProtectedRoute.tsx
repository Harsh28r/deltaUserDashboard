"use client";

import { useAuth } from "@/app/context/AuthContext";
import { usePermissions } from "@/app/context/PermissionContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { hasPermission } = usePermissions();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/auth/auth1/login");
      return;
    }

    // Route-level permission guard
    // Map routes to required permissions
    const routePermissions: { pattern: RegExp; permission: string }[] = [
      // Leads
      { pattern: /^\/apps\/leads\/add$/i, permission: "leads:create" },
      { pattern: /^\/apps\/leads\/edit\/.+$/i, permission: "leads:update" },
      { pattern: /^\/apps\/leads(\/.*)?$/i, permission: "leads:read" },

      // CP Sourcing
      { pattern: /^\/apps\/cp-sourcing\/add$/i, permission: "cp-sourcing:create" },
      { pattern: /^\/apps\/cp-sourcing\/edit\/.+$/i, permission: "cp-sourcing:update" },
      { pattern: /^\/apps\/cp-sourcing(\/.*)?$/i, permission: "cp-sourcing:read" },

      // Channel Partners
      { pattern: /^\/apps\/channel-partners\/add$/i, permission: "channel-partner:create" },
      { pattern: /^\/apps\/channel-partners\/edit\/.+$/i, permission: "channel-partner:update" },
      { pattern: /^\/apps\/channel-partners(\/.*)?$/i, permission: "channel-partner:read" },

      // Lead Sources
      { pattern: /^\/apps\/lead-sources\/add$/i, permission: "leadssource:create" },
      { pattern: /^\/apps\/lead-sources\/edit\/.+$/i, permission: "leadssource:update" },
      { pattern: /^\/apps\/lead-sources(\/.*)?$/i, permission: "leadssource:read" },

      // Lead Statuses
      { pattern: /^\/apps\/lead-statuses\/add$/i, permission: "leadsstatus:create" },
      { pattern: /^\/apps\/lead-statuses\/edit\/.+$/i, permission: "leadsstatus:update" },
      { pattern: /^\/apps\/lead-statuses(\/.*)?$/i, permission: "leadsstatus:read" },

      // Other modules
      { pattern: /^\/apps\/notifications(\/.*)?$/i, permission: "notifications:read" },
      { pattern: /^\/apps\/user-management(\/.*)?$/i, permission: "user:read_all" },
    ];

    const matched = routePermissions.find(r => r.pattern.test(pathname || ""));
    if (matched && !hasPermission(matched.permission)) {
      // Find a quick fallback allowed route to avoid /unauthorized flicker
      const candidates: { route: string; permission: string }[] = [
        { route: "/apps/leads", permission: "leads:read" },
        { route: "/apps/cp-sourcing", permission: "cp-sourcing:read" },
        { route: "/apps/channel-partners", permission: "channel-partner:read" },
        { route: "/apps/lead-sources", permission: "leadssource:read" },
        { route: "/apps/lead-statuses", permission: "leadsstatus:read" },
        { route: "/apps/notifications", permission: "notifications:read" },
        { route: "/", permission: "" },
      ];
      const fallback = candidates.find(c => !c.permission || hasPermission(c.permission));
      router.replace(fallback?.route || "/");
    }
  }, [user, isLoading, router, pathname, hasPermission]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;





