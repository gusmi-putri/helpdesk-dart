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
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/PelaporComponents/ReportForm.tsx',
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/StafComponents/ProofModal.tsx',
  'D:/PROJECT/helpdesk-dart/resources/js/Pages/Helpdesk/AdminComponents/ReportAttachmentModal.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  let modified = false;

  if (content.includes("require('react-dom')")) {
    content = content.replace(/  const \{ createPortal \} = require\('react-dom'\);\n/g, '');
    modified = true;
  }
  
  if (!content.includes("import { createPortal }")) {
    // Inject import at the top right after the last import or just top
    content = "import { createPortal } from 'react-dom';\n" + content;
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(f, content);
    console.log('Fixed imports in ' + path.basename(f));
  }
});
