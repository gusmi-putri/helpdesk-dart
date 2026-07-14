import os
import re

def refactor_sidebar(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to match the Brand section
    # Note: Using DOTALL to match across lines
    brand_regex = re.compile(r'\{\s*/\*\s*Brand\s*\*/\s*\}(.*?)<nav ', re.DOTALL)
    
    def repl(m):
        # We replace the entire Brand section, bringing the `<nav ` back
        return '<nav '

    content_new = brand_regex.sub(repl, content)

    # Some might not have exactly that comment, let's try a fallback:
    if content == content_new:
        # Fallback regex, find the div containing img src="/logo.png"
        brand_regex_fallback = re.compile(r'<div className="p-6 border-b[^>]*>.*?<img src="/logo.png".*?SISFO DART</h1>\s*</div>\s*</div>', re.DOTALL)
        content_new = brand_regex_fallback.sub('', content)

    # Note: If there's an empty <div className="p-6"> we might need a general approach, but the previous one should catch it.
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content_new)
    print(f"Refactored Sidebar: {file_path}")

def refactor_topbar(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to inject the logo into <div className="flex items-center gap-4">
    target = '<div className="flex items-center gap-4">'
    injection = '''<div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="DART Logo" className="w-8 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
          <h1 className="font-stencil text-xl tracking-widest text-white hidden sm:block leading-none mt-1">SISFO DART</h1>
        </div>'''
    
    if target in content and "SISFO DART" not in content:
        content_new = content.replace(target, injection, 1)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content_new)
        print(f"Refactored Topbar: {file_path}")
    else:
        print(f"Skipped Topbar (already refactored or target not found): {file_path}")


sidebars = [
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\AdminComponents\Sidebar.tsx',
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\StafComponents\StafSidebar.tsx',
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\TeknisiComponents\TeknisiSidebar.tsx',
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\PelaporComponents\PelaporSidebar.tsx'
]

topbars = [
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\AdminComponents\Topbar.tsx',
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\StafComponents\StafTopbar.tsx',
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\TeknisiComponents\TeknisiTopbar.tsx',
    r'c:\INFORMATIKA\PROJEK\DART-u1\resources\js\Pages\Helpdesk\PelaporComponents\PelaporTopbar.tsx'
]

for s in sidebars:
    refactor_sidebar(s)

for t in topbars:
    refactor_topbar(t)
