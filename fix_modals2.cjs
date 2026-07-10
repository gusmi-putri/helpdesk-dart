const fs = require('fs');
const path = require('path');
const files = [
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/AdminComponents/AdminUnitBatchModal.tsx',
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/AdminComponents/RecapModal.tsx',
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/AdminComponents/UserDetailModal.tsx',
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/StafComponents/AssignTechnicianModal.tsx',
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/StafComponents/ReportRejectModal.tsx',
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/StafComponents/RequestDeleteBatchModal.tsx',
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/StafComponents/RequestDeleteModal.tsx',
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/StafComponents/StafUnitBatchModal.tsx',
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/PelaporComponents/ReportForm.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('createPortal')) return;
  
  if (content.includes('<div className="fixed inset-0')) {
    // add import at the top
    if (!content.includes('import { createPortal }')) {
        content = "import { createPortal } from 'react-dom';\n" + content;
    }

    // replace return with const modalContent
    content = content.replace(/return \(\s*<div className="fixed inset-0/g, 'const modalContent = (\n    <div className="fixed inset-0');
    // change z-50 to z-[9999]
    content = content.replace(/z-50/g, 'z-[9999]');
    
    // add min-h-0 to flex-1 in modals (just to be safe)
    content = content.replace(/className="overflow-y-auto custom-scrollbar flex-1"/g, 'className="overflow-y-auto custom-scrollbar flex-1 min-h-0"');

    // The component ends with something like:
    //   );
    // };
    // export default Component;
    // We will find the last "  );\n};" or "  );\n}" and replace it
    
    const lastParenMatch = content.match(/  \);\n};\n/g) || content.match(/  \);\n}\n/g);
    if (lastParenMatch) {
      const matchToReplace = lastParenMatch[lastParenMatch.length - 1];
      const newEnding = matchToReplace.replace(
        /  \);\n(};\n|}\n)/, 
        "  );\n\n  if (typeof document === 'undefined') return null;\n  return createPortal(modalContent, document.body);\n$1"
      );
      
      const lastIndex = content.lastIndexOf(matchToReplace);
      content = content.substring(0, lastIndex) + newEnding + content.substring(lastIndex + matchToReplace.length);
      fs.writeFileSync(f, content);
      console.log('Fixed ' + path.basename(f));
    } else {
        console.log('Could not find ending for ' + path.basename(f));
    }
  }
});
