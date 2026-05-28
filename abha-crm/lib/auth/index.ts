export function isAdminRole(role: string) {
  return role === 'admin' || role === 'director';
}

export function isStaffRole(role: string) {
  return role === 'staff';
}

export function isHostelRole(role: string) {
  return role === 'hostel_manager';
}
