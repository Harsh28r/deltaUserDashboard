//  Profile Data
interface MiniiconsType {
  id: number;
  icon: string;
  tooltip: string;
  permission?: string;
}

const Miniicons: MiniiconsType[] = [
  {
    id: 1,
    icon: "solar:home-2-line-duotone",
    tooltip: "Dashboard",
  },
  {
    id: 2,
    icon: "solar:users-group-rounded-line-duotone",
    tooltip: "Leads",
    permission: "leads:read",
  },
  {
    id: 3,
    icon: "solar:bell-line-duotone",
    tooltip: "Notifications",
    permission: "notifications:read",
  },
  {
    id: 4,
    icon: "solar:chart-2-line-duotone",
    tooltip: "Lead Sources",
    permission: "leadssource:read",
  },
  {
    id: 5,
    icon: "solar:layers-line-duotone",
    tooltip: "Lead Status",
    permission: "leadsstatus:read",
  },
  {
    id: 6,
    icon: "solar:user-id-line-duotone",
    tooltip: "User Management",
    permission: "user:read_all",
  },
  {
    id: 7,
    icon: "solar:map-point-line-duotone",
    tooltip: "CP Sourcing",
    permission: "cp-sourcing:read",
  },
  {
    id: 8,
    icon: "solar:palette-round-line-duotone",
    tooltip: "Ui Components",
  },
  {
    id: 9,
    icon: "solar:chart-line-duotone",
    tooltip: "Charts",
  },
  {
    id: 10,
    icon: "solar:widget-6-line-duotone",
    tooltip: "Forms",
  },
  {
    id: 11,
    icon: "solar:lock-keyhole-line-duotone",
    tooltip: "Authentication Pages",
  },
];

export default Miniicons;
