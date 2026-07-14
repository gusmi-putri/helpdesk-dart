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

type MenuTab = 'FORM' | 'HISTORY' | 'WIZARD' | 'VIDEO';

const DashboardPelapor = ({ dbCases = [], dbUnits = [], dbUsers = [], authUser = null }: any) => {
  const [activeMenu, setActiveMenu] = useState<MenuTab>('FORM');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<number | string | null>(null);
  const [filterTime, setFilterTime] = useState<'ALL' | 'TODAY' | 'WEEK'>('ALL');

  const [lastReportedData, setLastReportedData] = useState<any>(null);

  const currentUser = useStore(state => state.currentUser);

  // Find current user's DB ID
  const dbUser = dbUsers.find((u: any) => u.username === currentUser?.username);

  // Filter & Sort History
  const history = dbCases
    .filter((r: any) => r.kerusakan.pelapor_id === dbUser?.db_id)
    .sort((a: any, b: any) => b.db_id - a.db_id);

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
              onSelectItem={setSelectedItemId}
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

    </div>
  );
};

export default DashboardPelapor;


