import React, { useState, useEffect } from 'react';
import { FileArchive } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { router, usePage } from '@inertiajs/react';
import LogoutConfirmModal from '@/Components/LogoutConfirmModal';

// Sub-components
import StafSidebar from './StafComponents/StafSidebar';
import StafTopbar from './StafComponents/StafTopbar';
import IncomingReportsTable from './StafComponents/IncomingReportsTable';
import CompletedReportsTable from './StafComponents/CompletedReportsTable';
import InventorySection from './StafComponents/InventorySection';
import ProofModal from './StafComponents/ProofModal';
import ReportDetailModal from './StafComponents/ReportDetailModal';
import AssignTechnicianModal from './StafComponents/AssignTechnicianModal';
import StafRecapModal from './StafComponents/StafRecapModal';

type MenuTab = 'MASUK' | 'SELESAI' | 'INVENTARIS';

const DashboardStaf = (props: any) => {
  const { dbCases = [], dbUsers = [], dbUnits = [] } = props;
  const [activeMenu, setActiveMenu] = useState<MenuTab>('MASUK');
  const [assigningReportId, setAssigningReportId] = useState<number | null>(null);
  const [viewingProof, setViewingProof] = useState<any[] | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Recap States
  const [recapPeriod, setRecapPeriod] = useState<'weekly' | 'monthly' | 'yearly' | 'custom' | 'year_specific'>('monthly');
  const [recapStartDate, setRecapStartDate] = useState<string>('');
  const [recapEndDate, setRecapEndDate] = useState<string>('');
  const [recapYear, setRecapYear] = useState<string>(new Date().getFullYear().toString());

  // Inventory States
  const [unitSearch, setUnitSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('ALL');
  const [filterSatuan, setFilterSatuan] = useState('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const { auth } = usePage().props as any;
  const currentUser = auth.user;
  const logoutAction = useStore(state => state.logout);
  const addNotification = useStore(state => state.addNotification);

  const selectedReport = dbCases.find((c: any) => c.db_id === selectedReportId);

  // Auto-polling
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases', 'dbUsers', 'dbUnits'] });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignTechnician = (reportId: number, idTeknisi: number) => {
    router.post(`/reports/${reportId}/handle`, { teknisi_id: idTeknisi }, {
      onSuccess: () => {
        setAssigningReportId(null);
        addNotification('Teknisi berhasil ditugaskan untuk menangani laporan.');
      },
      onError: () => {
        addNotification('Gagal menugaskan teknisi. Silakan periksa kembali koneksi Anda.', 'error');
      }
    });
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logoutAction();
    router.visit('/login');
  };

  const handleExportRecap = () => {
    let url = `/staf/recap/export?period=${recapPeriod}`;
    if (recapPeriod === 'custom' && recapStartDate && recapEndDate) {
      url += `&start_date=${recapStartDate}&end_date=${recapEndDate}`;
    } else if (recapPeriod === 'year_specific' && recapYear) {
      url += `&year=${recapYear}`;
    }
    window.open(url, '_blank');
    setIsRecapModalOpen(false);
  };

  const incomingReports = dbCases.filter((r: any) => r.status === 'PENDING' || r.status === 'PROSES');
  const completedReports = dbCases.filter((r: any) => r.status === 'SELESAI');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-cighra-dark flex font-sans selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-white relative text-gunmetal dark:text-slate-300">

      <StafSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
        pendingCount={incomingReports.filter((r: any) => r.status === 'PENDING').length}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

        <StafTopbar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentUser={currentUser}
        />

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-6 flex justify-between items-end border-b border-slate-200 dark:border-slate-600 pb-4">
              <div>
                <h2 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase">
                  {activeMenu === 'MASUK' ? 'MODUL PENUGASAN TEKNISI' :
                    activeMenu === 'SELESAI' ? 'ARSIP DOKUMEN PENYELESAIAN' :
                      'DATABASE INVENTARIS PERANGKAT'}
                </h2>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-widest">
                  {activeMenu === 'INVENTARIS' ? 'STATUS KESIAPAN ALUTSISTA DART.' : 'Sistem Manajemen Pelaporan Kerusakan Dart.'}
                </p>
              </div>

              {activeMenu !== 'INVENTARIS' && (
                <button
                  onClick={() => setIsRecapModalOpen(true)}
                  className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-5 py-2 font-tactical font-bold text-xs tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-all flex items-center gap-2 shadow-lg"
                >
                  <FileArchive className="w-4 h-4" /> CETAK REKAPITULASI
                </button>
              )}
            </div>

            {activeMenu === 'MASUK' && (
              <IncomingReportsTable
                reports={incomingReports}
                onSelectReport={setSelectedReportId}
                onAssignTechnician={setAssigningReportId}
                onViewProof={setViewingProof}
              />
            )}

            {activeMenu === 'SELESAI' && (
              <CompletedReportsTable
                reports={completedReports}
                onSelectReport={setSelectedReportId}
                onViewProof={setViewingProof}
              />
            )}

            {activeMenu === 'INVENTARIS' && (
              <InventorySection
                dbUnits={dbUnits}
                unitSearch={unitSearch}
                setUnitSearch={setUnitSearch}
                filterJenis={filterJenis}
                setFilterJenis={setFilterJenis}
                filterSatuan={filterSatuan}
                setFilterSatuan={setFilterSatuan}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ProofModal
        isOpen={!!viewingProof}
        onClose={() => setViewingProof(null)}
        viewingProof={viewingProof}
      />

      <ReportDetailModal
        isOpen={!!selectedReportId}
        onClose={() => setSelectedReportId(null)}
        report={selectedReport}
      />

      <AssignTechnicianModal
        isOpen={!!assigningReportId}
        onClose={() => setAssigningReportId(null)}
        technicians={dbUsers}
        onAssign={(techId) => assigningReportId && handleAssignTechnician(assigningReportId, techId)}
      />

      <StafRecapModal
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
        recapPeriod={recapPeriod}
        setRecapPeriod={setRecapPeriod}
        recapStartDate={recapStartDate}
        setRecapStartDate={setRecapStartDate}
        recapEndDate={recapEndDate}
        setRecapEndDate={setRecapEndDate}
        recapYear={recapYear}
        setRecapYear={setRecapYear}
        onExport={handleExportRecap}
      />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />

    </div>
  );
};

export default DashboardStaf;
