export const roleDashboardMap = {
  superadmin: '/dashboard/super-admin',
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
  user: '/dashboard/user',
  associate: '/dashboard/associate',
  firm: '/dashboard/firm',
  client: '/dashboard/client',
  sale: '/dashboard/sale'
};

export function fallbackDashboard(role) {
  return roleDashboardMap[role] || '/dashboard';
}
