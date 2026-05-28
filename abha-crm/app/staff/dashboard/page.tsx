import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { DashboardShell } from '../../../components/shared/DashboardShell';
import { Header } from '../../../components/shared/Header';
import { Sidebar } from '../../../components/shared/Sidebar';
import { MobileNav } from '../../../components/shared/MobileNav';
import { FollowUpReminders } from '../../../components/leads/FollowUpReminders';
import { BonusSummary } from '../../../components/bonus/BonusSummary';

const staffItems = [
  { label: 'Home', href: '/staff/dashboard' },
  { label: 'Students', href: '/staff/students' },
  { label: 'Leads', href: '/staff/leads' },
  { label: 'B2B', href: '/staff/b2b' },
  { label: 'Goals', href: '/staff/goals' },
  { label: 'Leave', href: '/staff/leave' },
  { label: 'Salary', href: '/staff/salary' },
  { label: 'Profile', href: '/staff/profile' },
];

export default function StaffDashboardPage() {
  return (
    <>
      <Header title="Staff Portal" subtitle="Office overview" userName="Staff User" />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-24 pt-6 lg:px-6 lg:pb-10">
        <Sidebar items={staffItems} title="Staff Portal" />
        <DashboardShell
          title="Staff Dashboard"
          summary="Attendance, milestones, achievement progress, and student focus area."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-saffron">Check-in</p>
              <Button className="w-full">Start Today’s Check-in</Button>
            </Card>
            <BonusSummary />
          </div>

          <FollowUpReminders />
        </DashboardShell>
      </div>
      <MobileNav items={staffItems} />
    </>
  );
}
