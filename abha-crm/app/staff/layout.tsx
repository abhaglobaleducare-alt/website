import type { ReactNode } from 'react';
import { GoalReminderPopup } from '../../components/goals/GoalReminderPopup';

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <GoalReminderPopup />
    </>
  );
}
