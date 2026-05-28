export function getPortalPath(role: string) {
  switch (role) {
    case 'director':
    case 'admin':
      return '/admin/dashboard';
    case 'hostel_manager':
      return '/hostel/dashboard';
    default:
      return '/staff/dashboard';
  }
}

export function isProtectedRoute(pathname: string) {
  return !['/login', '/forgot-password', '/invite'].some((prefix) => pathname.startsWith(prefix));
}
