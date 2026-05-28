export type Role = 'director' | 'admin' | 'staff' | 'hostel_manager';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: Role;
  designation?: string;
  office_id?: string;
}
