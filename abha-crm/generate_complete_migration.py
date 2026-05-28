from pathlib import Path

base = Path('supabase/migrations')
combined = Path('supabase/complete_migration.sql')
files = sorted(base.glob('*.sql'))
parts = []
for path in files:
    text = path.read_text(encoding='utf-8').strip()
    if text:
        parts.append(f'-- === {path.name} ===\n{text}\n')
seed = Path('supabase/seed.sql').read_text(encoding='utf-8').strip()
if seed:
    parts.append('\n-- === supabase/seed.sql ===\n' + seed + '\n')
combined.write_text('\n'.join(parts), encoding='utf-8')
print('Wrote', combined)
print('Files included:', len(files) + 1)
