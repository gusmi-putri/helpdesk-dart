import os

topbars = [
    "resources/js/Pages/Helpdesk/AdminComponents/Topbar.tsx",
    "resources/js/Pages/Helpdesk/StafComponents/StafTopbar.tsx",
    "resources/js/Pages/Helpdesk/TeknisiComponents/TeknisiTopbar.tsx",
    "resources/js/Pages/Helpdesk/PelaporComponents/PelaporTopbar.tsx"
]
for file in topbars:
    if not os.path.exists(file):
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add active scale to Menu.Button
    content = content.replace(
        "hover:bg-black/20 dark:hover:bg-cighra-darkcard transition-colors",
        "hover:bg-black/20 dark:hover:bg-cighra-darkcard transition-all active:scale-95 duration-300"
    )
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Topbars updated.")
