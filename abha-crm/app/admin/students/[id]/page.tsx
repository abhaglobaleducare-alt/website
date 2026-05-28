'use client';

import { StudentDetail } from '../../../../components/student/StudentDetail';

interface AdminStudentPageProps {
  params: { id: string };
}

export default function AdminStudentDetailPage({ params }: AdminStudentPageProps) {
  return <StudentDetail studentId={params.id} portalBase="/admin" isAdmin />;
}
