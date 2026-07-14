import os
import re

def rewrite_dashboard(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine Topbar and Sidebar component names
    topbar_comp_match = re.search(r'<(?:Admin|Staf|Teknisi|Pelapor)?Topbar\b[^>]*/>', content)
    if not topbar_comp_match:
        print(f"Skipping {file_path}, no Topbar found.")
        return
    topbar_source = topbar_comp_match.group(0)

    # Remove the Topbar from its original position inside <main>
    # It might have surrounding whitespace
    content_without_topbar = content.replace(topbar_source, '')

    # Regex to find the <main> start wrapper
    # E.g. <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
    main_regex = re.compile(r'<main className="[^"]*flex-1 flex flex-col h-screen overflow-hidden relative"[^>]*>')
    
    # We change h-screen to h-full for main
    content_refactored = main_regex.sub(r'<main className="flex-1 flex flex-col relative overflow-hidden h-full">', content_without_topbar)

    # Now handle the root div wrapper
    # E.g. <div className="min-h-screen bg... flex font-sans ...">
    root_regex = re.compile(r'(<div className="min-h-screen[^"]*)\bflex\b([^"]*)"([^>]*)>')
    
    def root_repl(m):
        full_class = m.group(1) + "flex flex-col" + m.group(2)
        # replace min-h-screen with h-screen
        full_class = full_class.replace('min-h-screen', 'h-screen')
        return f'{full_class}"{m.group(3)}>\n\n      {topbar_source}\n      <div className="flex-1 flex overflow-hidden">'
    
    content_refactored = root_regex.sub(root_repl, content_refactored, count=1)

    # Finally, close the new wrapper div right after </main>
    content_refactored = content_refactored.replace('</main>', '</main>\n      </div>')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content_refactored)
    print(f"Refactored {file_path}")


dashboards = [
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\DashboardAdmin.tsx',
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\DashboardStaf.tsx',
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\DashboardTeknisi.tsx',
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\DashboardPelapor.tsx'
]

for d in dashboards:
    if os.path.exists(d):
        rewrite_dashboard(d)
    else:
        print("Missing:", d)
