import os

sidebars = [
    "resources/js/Pages/Helpdesk/AdminComponents/Sidebar.tsx",
    "resources/js/Pages/Helpdesk/StafComponents/StafSidebar.tsx",
    "resources/js/Pages/Helpdesk/TeknisiComponents/TeknisiSidebar.tsx",
    "resources/js/Pages/Helpdesk/PelaporComponents/PelaporSidebar.tsx"
]

for file in sidebars:
    if not os.path.exists(file):
        print(f"Not found: {file}")
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add duration-300 and group to base button classes
    content = content.replace(
        "transition-all border-l-4",
        "transition-all duration-300 border-l-4 group"
    )
    
    # For submenus
    content = content.replace(
        "transition-colors focus-visible:ring",
        "transition-all duration-300 focus-visible:ring group"
    )
    
    # Icons scale on hover
    icons_to_replace = ["MapIcon", "Activity", "Layers", "Users", "Package", "MapPin", "CheckSquare", "Database", "MessageSquare", "LogOut", "Wrench", "Home"]
    for icon in icons_to_replace:
        content = content.replace(
            f"<{icon} size={{18}} />",
            f"<{icon} size={{18}} className=\"transition-transform duration-300 group-hover:scale-110 group-active:scale-95\" />"
        )
        content = content.replace(
            f"<{icon} size={{14}} />",
            f"<{icon} size={{14}} className=\"transition-transform duration-300 group-hover:scale-110 group-active:scale-95\" />"
        )

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Sidebars updated.")
