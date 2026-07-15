import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { router, useForm } from '@inertiajs/react';


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


  // Filter tasks
  const activeTasks = dbCases.filter((r: any) => r.status === 'DIVERIFIKASI' || r.status === 'DITERIMA TEKNISI' || r.status === 'DIPROSES');
  const historyTasks = dbCases.filter((r: any) => r.status === 'SELESAI' || r.status === 'DITOLAK');

  const tasksToShow = activeTab === 'ACTIVE' ? activeTasks : historyTasks;
  const filteredTasks = tasksToShow.filter((t: any) =>
    (t.kerusakan?.barangRusak || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.kerusakan?.lokasi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.caseId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTask = dbCases.find((t: any) => t.db_id === selectedTaskId) || null;

  // Form handling
  const { data, setData, post, processing, reset, errors } = useForm({
    catatan: '',
    metode: '',
    foto_selesai: null as File | null,
    tautan_video_selesai: '',
  });

  // Auto-polling
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases'] });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptTask = (taskId: number) => {
    router.post(`/reports/${taskId}/accept-task`, {}, {
      onSuccess: () => {
      },
      onError: () => {
        addNotification('Gagal menerima tugas.', 'error');
      }
    });
  };

  const handleStartProgress = (taskId: number) => {
    router.post(`/reports/${taskId}/start-progress`, {}, {
      onSuccess: () => {
      },
      onError: () => {
        addNotification('Gagal memulai perbaikan.', 'error');
      }
    });
  };

  const handleSubmitLaporan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) return;

    if (!data.foto_selesai) {
      addNotification('PERINGATAN: FOTO DOKUMENTASI WAJIB DIUNGGAH.', 'error');
      return;
    }

    post(`/reports/${selectedTaskId}/complete`, {
      onSuccess: () => {
        reset();
        setImagePreview(null);
        setSelectedTaskId(null);
      },
      onError: () => {
        addNotification('Gagal mengirim laporan. Silakan periksa kembali koneksi atau data Anda.', 'error');
      }
    });
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-cighra-dark flex flex-col font-sans selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-white relative text-gunmetal dark:text-slate-300 overflow-hidden">

      <TeknisiTopbar
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentUser={currentUser}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-cighra-dark flex flex-col relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

        <div className="flex-1 flex flex-col max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 gap-6 overflow-hidden h-full z-10">
          
          {/* Header Title */}
          <div className="border-b border-slate-200 dark:border-slate-600 pb-3 shrink-0">
            <h2 className="text-xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase">
              PORTAL PERBAIKAN DART
            </h2>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-widest">
              Pusat Instruksi & Penyerahan Laporan Perbaikan Unit DART
            </p>
          </div>

          {/* Content Grid */}
          <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8 overflow-y-auto md:overflow-hidden h-auto md:h-full items-stretch">
            {/* LEFT PANEL */}
            <div className="w-full md:w-[40%] lg:w-[35%] shrink-0 h-[450px] md:h-full overflow-hidden">
              <TaskList
                tasks={filteredTasks}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedTaskId={selectedTaskId}
                setSelectedTaskId={setSelectedTaskId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 h-auto md:h-full overflow-hidden">
              <TaskDetailPanel selectedTask={selectedTask} activeTab={activeTab}>
                {activeTab === 'HISTORY' && selectedTask ? (
                  <CompletionSummary
                    selectedTask={selectedTask}
                    onBack={() => setSelectedTaskId(null)}
                  />
                ) : selectedTask ? (
                  selectedTask.status === 'DIVERIFIKASI' ? (
                    <div className="flex flex-col items-center justify-center p-8 border border-slate-200 dark:border-slate-600 bg-white/40 dark:bg-cighra-darkcard/30 rounded-sm text-center animate-in fade-in">
                      <h3 className="text-lg font-tactical font-bold mb-4 uppercase text-slate-800 dark:text-white">TERIMA PENUGASAN INI?</h3>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 max-w-sm mb-6 uppercase">
                        Tekan tombol di bawah untuk mengonfirmasi bahwa Anda menerima tugas perbaikan unit DART ini.
                      </p>
                      <button
                        onClick={() => handleAcceptTask(selectedTask.db_id)}
                        className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white font-tactical font-bold px-8 py-3.5 tracking-widest uppercase transition-all shadow-md cursor-pointer"
                      >
                        Terima Tugas
                      </button>
                    </div>
                  ) : selectedTask.status === 'DITERIMA TEKNISI' ? (
                    <div className="flex flex-col items-center justify-center p-8 border border-slate-200 dark:border-slate-600 bg-white/40 dark:bg-cighra-darkcard/30 rounded-sm text-center animate-in fade-in">
                      <h3 className="text-lg font-tactical font-bold mb-4 uppercase text-slate-800 dark:text-white">MULAI PROSES PERBAIKAN?</h3>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 max-w-sm mb-6 uppercase">
                        Tekan tombol di bawah untuk menyatakan bahwa Anda telah mulai memeriksa/memperbaiki unit ini. Status unit akan berubah menjadi 'Perbaikan'.
                      </p>
                      <button
                        onClick={() => handleStartProgress(selectedTask.db_id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-tactical font-bold px-8 py-3.5 tracking-widest uppercase transition-all shadow-md cursor-pointer"
                      >
                        Mulai Perbaikan
                      </button>
                    </div>
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
                  )
                ) : null}
              </TaskDetailPanel>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardTeknisi;
