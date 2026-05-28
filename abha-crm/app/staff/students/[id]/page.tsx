'use client';

import { StudentDetail } from '../../../../components/student/StudentDetail';

interface StaffStudentPageProps {
  params: { id: string };
}

export default function StaffStudentDetailPage({ params }: StaffStudentPageProps) {
  return <StudentDetail studentId={params.id} portalBase="/staff" />;
}
