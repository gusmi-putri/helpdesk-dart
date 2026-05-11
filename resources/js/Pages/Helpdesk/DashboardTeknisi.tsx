import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { router, useForm } from '@inertiajs/react';
import LogoutConfirmModal from '@/Components/LogoutConfirmModal';

// Sub-components
import TeknisiSidebar from './TeknisiComponents/TeknisiSidebar';
import TeknisiTopbar from './TeknisiComponents/TeknisiTopbar';
import TaskList from './TeknisiComponents/TaskList';
import TaskDetailPanel from './TeknisiComponents/TaskDetailPanel';
import CompletionForm from './TeknisiComponents/CompletionForm';
import CompletionSummary from './TeknisiComponents/CompletionSummary';

const DashboardTeknisi = ({ dbCases = [] }: any) => {
  const currentUser = useStore(state => state.currentUser);
  const logoutAction = useStore(state => state.logout);
  const addNotification = useStore(state => state.addNotification);

  // States
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Filter tasks
  const activeTasks = dbCases.filter((r: any) => r.status === 'PROSES' || r.status === 'PENDING');
  const historyTasks = dbCases.filter((r: any) => r.status === 'SELESAI');
  
  const tasksToShow = activeTab === 'ACTIVE' ? activeTasks : historyTasks;
  const filteredTasks = tasksToShow.filter((t: any) => 
    t.kerusakan.barangRusak.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.caseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTask = dbCases.find((t: any) => t.db_id === selectedTaskId) || null;

  // Form handling
  const { data, setData, post, processing, reset, errors } = useForm({
    catatan: '',
    metode: '',
    foto_selesai: null as File | null,
  });

  // Auto-polling
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases'] });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmitLaporan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) return;
    
    if (!data.metode) {
      addNotification('PERINGATAN: METODE PERBAIKAN WAJIB DIPILIH.', 'error');
      return;
    }

    post(`/reports/${selectedTaskId}/complete`, {
      onSuccess: () => {
        addNotification('Laporan penanganan telah berhasil dikirim ke sistem.');
        reset();
        setImagePreview(null);
        setSelectedTaskId(null);
      },
      onError: () => {
        addNotification('Gagal mengirim laporan. Silakan periksa kembali koneksi atau data Anda.', 'error');
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gunmetal flex font-sans selection:bg-olive selection:text-sand relative text-gunmetal dark:text-slate-300">
      
      <TeknisiSidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeMenu="TUGAS"
        activeTasksCount={activeTasks.length}
        handleLogout={handleLogout}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

        <TeknisiTopbar 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentUser={currentUser}
        />

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
              <h2 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase">
                PORTAL PERBAIKAN DART
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-widest">
                Pusat Instruksi & Penyerahan Laporan Perbaikan Unit DART
              </p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in mt-6">
              <TaskList 
                tasks={filteredTasks}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedTaskId={selectedTaskId}
                setSelectedTaskId={setSelectedTaskId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              <TaskDetailPanel selectedTask={selectedTask} activeTab={activeTab}>
                {activeTab === 'HISTORY' && selectedTask ? (
                  <CompletionSummary 
                    selectedTask={selectedTask} 
                    onBack={() => setSelectedTaskId(null)} 
                  />
                ) : (
                  <CompletionForm 
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmitLaporan}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                  />
                )}
              </TaskDetailPanel>
            </div>
          </div>
        </div>
      </main>

      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default DashboardTeknisi;
