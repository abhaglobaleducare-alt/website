-- Seed data for ABHA Global Educare LLP

INSERT INTO offices (id, name, city, country, geo_latitude, geo_longitude, geo_radius_meters, address) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Kolhapur Office', 'Kolhapur', 'India', 16.7050, 74.2433, 300, 'Kolhapur, Maharashtra, India'),
  ('22222222-2222-2222-2222-222222222222', 'Sambhajinagar Office', 'Chhatrapati Sambhajinagar', 'India', 19.8762, 75.3433, 300, 'Chhatrapati Sambhajinagar, Maharashtra, India'),
  ('44444444-4444-4444-4444-444444444444', 'Boisar Office', 'Boisar, Palghar', 'India', 19.8039, 72.7726, 300, 'Boisar, Palghar, Maharashtra, India'),
  ('33333333-3333-3333-3333-333333333333', 'Georgia Hostel', 'Tbilisi', 'Georgia', 41.6941, 44.8337, 500, 'Tbilisi, Georgia');

INSERT INTO achievement_slabs (slab_name, slab_color, slab_icon, admissions_min, admissions_max, base_bonus, extra_bonus, has_annual_reward, annual_reward_description) VALUES
  ('Bronze', '#CD7F32', '🥉', 1, 25, 20000, 0, false, NULL),
  ('Silver', '#C0C0C0', '🥈', 25, 50, 20000, 5000, false, NULL),
  ('Gold', '#FFD700', '🥇', 50, 75, 20000, 10000, false, NULL),
  ('Platinum', '#E5E4E2', '💎', 75, 100, 20000, 15000, false, NULL),
  ('Ruby', '#E5E4E2', '💎', 100, NULL, 20000, 15000, true, 'Annual special reward + recognition ceremony + international trip');

INSERT INTO universities (name, short_name, country, city, status, mbbs_duration_years, sort_order) VALUES
  ('European University', 'EEU', 'Georgia', 'Tbilisi', 'active', 6, 1),
  ('East West University', 'EWU', 'Georgia', 'Tbilisi', 'active', 6, 2),
  ('Alte University', 'ALTE', 'Georgia', 'Tbilisi', 'active', 6, 3),
  ('SEU Georgia', 'SEU', 'Georgia', 'Tbilisi', 'active', 6, 4),
  ('International European University', 'IEU', 'Kyrgyzstan', 'Bishkek', 'active', 6, 5),
  ('Avicenna International Medical University', 'AIMU', 'Kyrgyzstan', 'Bishkek', 'active', 6, 6),
  ('Coming Soon', 'TBA', 'Kyrgyzstan', 'Bishkek', 'coming_soon', 6, 7);
