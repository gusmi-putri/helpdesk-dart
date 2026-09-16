import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { router } from '@inertiajs/react';

// Sub-components
import PelaporSidebar from './PelaporComponents/PelaporSidebar';
import PelaporTopbar from './PelaporComponents/PelaporTopbar';
import ReportForm from './PelaporComponents/ReportForm';
import ReportHistory from './PelaporComponents/ReportHistory';
import PelaporReportDetailModal from './PelaporComponents/PelaporReportDetailModal';
import PostReportWizard from './PelaporComponents/PostReportWizard';
import VideoBank from './PelaporComponents/VideoBank';
import MaintenanceReportModal from './StafComponents/MaintenanceReportModal';

type MenuTab = 'FORM' | 'HISTORY' | 'WIZARD' | 'VIDEO';

const DashboardPelapor = ({ dbCases = [], dbUnits = [], dbUsers = [], authUser = null, dbMaintenanceReports = [] }: any) => {
  const [activeMenu, setActiveMenu] = useState<MenuTab>('FORM');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<number | string | null>(null);
  const [filterTime, setFilterTime] = useState<'ALL' | 'TODAY' | 'WEEK'>('ALL');
  const [isMaintenanceFormOpen, setIsMaintenanceFormOpen] = useState(false);

  const [lastReportedData, setLastReportedData] = useState<any>(null);

  const currentUser = useStore(state => state.currentUser);

  // Find current user's DB ID
  const dbUser = dbUsers.find((u: any) => u.username === currentUser?.username);

  // Map and Filter Normal History
  const normalHistory = dbCases
    .filter((r: any) => r.kerusakan.pelapor_id === dbUser?.db_id);

  // Map and Filter Maintenance History
  const maintenanceHistory = dbMaintenanceReports
    .filter((r: any) => r.user_id === dbUser?.db_id)
    .map((r: any) => {
      const dateObj = new Date(r.created_at);
      const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('.', ':');
      return {
        db_id: `maint_${r.id}`,
        is_maintenance: true,
        caseId: `PMH-${String(r.id).padStart(5, '0')}`,
        status: 'SELESAI',
        created_at: r.created_at,
        kerusakan: {
          tanggal: dateStr,
          barangRusak: r.nama_giat,
          deskripsi: `Laporan Pemeliharaan - Periode: ${r.periode} ${r.tahun} | Anggaran: Rp ${r.jumlah_anggaran}`,
          lokasi: r.satuan?.nama_satuan || '-',
        },
        perbaikan: {
          tanggalSelesai: dateStr,
          teknisi: null
        }
      };
    });

  // Combine and Sort History
  const history = [...normalHistory, ...maintenanceHistory].sort((a: any, b: any) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return dateB - dateA;
  });

  const filteredHistory = history.filter((item: any) => {
    if (filterTime === 'ALL') return true;

    const parseDate = (str: string) => {
      try { return new Date(str.replace(',', '')); } catch { return new Date(0); }
    };

    const itemDate = parseDate(item.kerusakan.tanggal);
    const now = new Date();

    if (filterTime === 'TODAY') return itemDate.toDateString() === now.toDateString();
    if (filterTime === 'WEEK') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return itemDate >= oneWeekAgo;
    }
    return true;
  });

  const selectedItem = dbCases.find((c: any) => c.db_id === selectedItemId);

  // Auto-polling
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases', 'dbUnits', 'dbUsers'] });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Guided Tour
  useEffect(() => {
    // Dynamic import to prevent SSR issues if any, but since this is Inertia/React client side, normal import is fine.
    // However, let's keep it safe.
    import('driver.js').then(({ driver }) => {
      import('driver.js/dist/driver.css').then(() => {
        if (localStorage.getItem('tour_pelapor_done') !== 'true') {
          const driverObj = driver({
            showProgress: true,
            animate: true,
            nextBtnText: 'Selanjutnya ➔',
            prevBtnText: '← Sebelumnya',
            doneBtnText: 'Selesai',
            steps: [
              {
                popover: {
                  title: 'Selamat Datang di SISFO DART',
                  description: 'Ini adalah Dashboard Pelapor. Mari ikuti tur singkat untuk mengenal fitur-fitur yang tersedia.',
                }
              },
              {
                element: '#tour-buat-laporan',
                popover: {
                  title: 'Buat Laporan Baru',
                  description: 'Gunakan form ini untuk membuat laporan masalah atau permintaan layanan.',
                  side: 'right',
                  align: 'start'
                }
              },
              {
                element: '#tour-riwayat',
                popover: {
                  title: 'Riwayat Laporan',
                  description: 'Pantau status tiket yang telah Anda buat dan berikan feedback jika sudah selesai.',
                  side: 'right',
                  align: 'start'
                }
              },
              {
                element: '#tour-video',
                popover: {
                  title: 'Bank Video',
                  description: 'Daftar video panduan yang mungkin dapat membantu menyelesaikan masalah Anda secara mandiri.',
                  side: 'right',
                  align: 'start'
                }
              }
            ],
            onDestroyed: () => {
              localStorage.setItem('tour_pelapor_done', 'true');
            }
          });

          // Delay sedikit agar DOM sidebar termuat sepenuhnya
          setTimeout(() => {
            driverObj.drive();
          }, 500);
        }
      });
    });
  }, []);

  return (
    <div className="h-screen bg-slate-50 dark:bg-cighra-dark flex flex-col font-sans selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-gunmetal relative text-slate-800 dark:text-slate-200">

      <PelaporTopbar
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentUser={currentUser}
      />
      <div className="flex-1 flex overflow-hidden">

        <PelaporSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onOpenMaintenanceForm={() => setIsMaintenanceFormOpen(true)}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-cighra-dark">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            {activeMenu === 'WIZARD' && lastReportedData && (
              <PostReportWizard
                reportData={lastReportedData}
                onClose={() => setActiveMenu('HISTORY')}
              />
            )}

            {activeMenu === 'FORM' && (
              <ReportForm
                dbUnits={dbUnits}
                authUser={authUser}
                currentUser={currentUser}
                onSuccess={(reportedData) => {
                  setLastReportedData(reportedData);
                  setActiveMenu('WIZARD');
                }}
              />
            )}

            {activeMenu === 'HISTORY' && (
              <ReportHistory
                history={filteredHistory}
                filterTime={filterTime}
                setFilterTime={setFilterTime}
                onSelectItem={(id) => {
                  if (typeof id === 'string' && id.startsWith('maint_')) return;
                  setSelectedItemId(id);
                }}
              />
            )}

            {activeMenu === 'VIDEO' && (
              <VideoBank />
            )}
          </div>
        </main>
      </div>

      <PelaporReportDetailModal
        isOpen={!!selectedItemId}
        onClose={() => setSelectedItemId(null)}
        report={selectedItem}
      />

      <MaintenanceReportModal
        isOpen={isMaintenanceFormOpen}
        onClose={() => setIsMaintenanceFormOpen(false)}
        currentUser={currentUser}
      />

    </div>
  );
};

export default DashboardPelapor;

