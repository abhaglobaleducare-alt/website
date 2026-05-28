-- Extend notifications.type CHECK to cover Phase 10 Extended notification kinds.
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (type IN (
  'goal_reminder','admin_alert','lead_assigned','bonus_pending','leave_update',
  'student_update','reference_bonus','system','general',
  'expense_approval','low_stock_alert','infrastructure_damage'
));
