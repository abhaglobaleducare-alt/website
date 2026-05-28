from pathlib import Path
import re
files = [
    Path('app/staff/students/page.tsx'),
    Path('app/staff/students/new/page.tsx'),
    Path('components/student/StudentDetail.tsx'),
    Path('app/admin/students/page.tsx'),
]
label_re = re.compile(r'^(?P<prefix>\s*<label[^>]*className="space-y-2 text-sm text-slate-200[^"]*"[^>]*>)(?P<suffix>\s*)$')
name_re = re.compile(r'name="([^"]+)"')
for path in files:
    text = path.read_text(encoding='utf-8')
    lines = text.splitlines()
    changed = False
    i = 0
    while i < len(lines):
        m = label_re.match(lines[i])
        if m and 'htmlFor=' not in lines[i]:
            for j in range(i + 1, min(i + 12, len(lines))):
                if 'name="' in lines[j]:
                    nm = name_re.search(lines[j])
                    if nm:
                        name = nm.group(1)
                        lines[i] = lines[i].replace('>', f' htmlFor="{name}">', 1)
                        if 'id="' not in lines[j]:
                            if ' className="' in lines[j]:
                                lines[j] = lines[j].replace(' className="', f' id="{name}" className="', 1)
                            else:
                                lines[j] = lines[j].replace('>', f' id="{name}">', 1)
                        changed = True
                    break
        i += 1
    if changed:
        path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
        print(f'Updated {path}')
