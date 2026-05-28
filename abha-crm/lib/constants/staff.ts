export type StaffRole = 'director' | 'admin' | 'staff' | 'hostel_manager';

export interface SeedStaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  designation: string;
  office: string;
  salary: number;
  bonus: number;
  status: 'Active' | 'Invite Sent' | 'Pending';
  achievements: number;
}

export const staffSeed: SeedStaffMember[] = [
  {
    id: 'staff-001',
    name: 'Anandrao Bapu Patil',
    email: 'anandrao@abhaedu.in',
    phone: '+91 7249409376',
    role: 'director',
    designation: 'Founder Director',
    office: 'Head Office',
    salary: 950000,
    bonus: 120000,
    status: 'Active',
    achievements: 18,
  },
  {
    id: 'staff-002',
    name: 'Ashok Sudam Patil Devarde',
    email: 'ashok@abhaedu.in',
    phone: '+91 9876543210',
    role: 'staff',
    designation: 'Office Manager',
    office: 'Kolhapur',
    salary: 450000,
    bonus: 48000,
    status: 'Active',
    achievements: 14,
  },
  {
    id: 'staff-003',
    name: 'Yashwantrao Zamarao Patil',
    email: 'yashwantrao@abhaedu.in',
    phone: '+91 9876543211',
    role: 'staff',
    designation: 'Operations Lead',
    office: 'Chhatrapati Sambhajinagar',
    salary: 420000,
    bonus: 42000,
    status: 'Invite Sent',
    achievements: 11,
  },
  {
    id: 'staff-004',
    name: 'Bhagyashree Anandrao Patil',
    email: 'bhagyashree@abhaedu.in',
    phone: '+91 9876543212',
    role: 'admin',
    designation: 'Operations Head',
    office: 'Head Office',
    salary: 520000,
    bonus: 60000,
    status: 'Active',
    achievements: 16,
  },
];

export const offices = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Kolhapur Office' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Sambhajinagar Office' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Boisar Office' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Georgia Hostel' },
];

export const roles = ['director', 'admin', 'staff', 'hostel_manager'] as const;
