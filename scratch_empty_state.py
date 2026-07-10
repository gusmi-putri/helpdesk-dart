import os

files = [
    "resources/js/Pages/Helpdesk/AdminComponents/UnitsTable.tsx",
    "resources/js/Pages/Helpdesk/AdminComponents/UsersTable.tsx",
    "resources/js/Pages/Helpdesk/AdminComponents/ReportsSection.tsx"
]

# We will just write a general find-replace to insert the EmptyState import and change the text
for file in files:
    if not os.path.exists(file): continue
    with open(file, 'r', encoding='utf-8') as f: content = f.read()
    
    if "import { EmptyState }" not in content:
        # insert after lucide-react
        content = content.replace(
            "from 'lucide-react';",
            "from 'lucide-react';\nimport { EmptyState } from '@/Components/ui/EmptyState';"
        )
        
    content = content.replace(
        "className=\"p-10 text-center text-slate-500 dark:text-slate-400 font-mono italic uppercase tracking-widest\">Tidak ada unit yang ditemukan.</td>",
        "className=\"p-0 text-center\"><EmptyState title=\"TIDAK ADA DATA\" description=\"Tidak ada unit yang ditemukan berdasarkan pencarian Anda.\" /></td>"
    )
    
    content = content.replace(
        "className=\"p-10 text-center text-slate-500 dark:text-slate-400 font-mono italic uppercase tracking-widest\">Tidak ada personel yang ditemukan.</td>",
        "className=\"p-0 text-center\"><EmptyState title=\"TIDAK ADA DATA\" description=\"Tidak ada personel yang ditemukan berdasarkan pencarian Anda.\" /></td>"
    )
    
    content = content.replace(
        "className=\"p-10 text-center text-slate-500 dark:text-slate-400 font-mono italic uppercase tracking-widest\">Tidak ada laporan yang ditemukan.</td>",
        "className=\"p-0 text-center\"><EmptyState title=\"TIDAK ADA LAPORAN\" description=\"Belum ada laporan yang sesuai dengan kriteria pencarian.\" /></td>"
    )

    with open(file, 'w', encoding='utf-8') as f: f.write(content)

print("Empty states updated.")
