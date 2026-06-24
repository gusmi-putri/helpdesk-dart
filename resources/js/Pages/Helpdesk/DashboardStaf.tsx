import React, { useState, useEffect } from 'react';
import { FileArchive } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { router, usePage, useForm } from '@inertiajs/react';
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
import ReportRejectModal from './StafComponents/ReportRejectModal';
import StafUnitModal from './StafComponents/StafUnitModal';
import RequestDeleteModal from './StafComponents/RequestDeleteModal';
import MutationHistory from './StafComponents/MutationHistory';
import StafUnitBatchModal from './StafComponents/StafUnitBatchModal';
import RequestDeleteBatchModal from './StafComponents/RequestDeleteBatchModal';

// Reuse Admin components for PersonelTable
import UsersTable from './AdminComponents/UsersTable';
import UserDetailModal from './AdminComponents/UserDetailModal';
import UserDeleteModal from './AdminComponents/UserDeleteModal';
import UserEditModal from './AdminComponents/UserEditModal';
import SatuansTable from './AdminComponents/SatuansTable';
import SatuanModal from './AdminComponents/SatuanModal';
import SatuanDetailModal from './AdminComponents/SatuanDetailModal';
import SatuanDeleteModal from './AdminComponents/SatuanDeleteModal';

type MenuTab = 'MASUK' | 'SELESAI' | 'INVENTARIS' | 'MUTASI' | 'PERSONEL' | 'SATUANS';

const DashboardStaf = (props: any) => {
  const { dbCases = [], dbUsers = [], dbUnits = [], dbMutations = [], dbAllUsers = [], dbRoles = [], dbSatuans = [] } = props;
  const [activeMenu, setActiveMenu] = useState<MenuTab>('MASUK');
  const [assigningReportId, setAssigningReportId] = useState<number | null>(null);
  const [rejectingReportId, setRejectingReportId] = useState<number | null>(null);
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

  // Unit Mutation States
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isDeleteRequestModalOpen, setIsDeleteRequestModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<any>(null);
  const [mutationProcessing, setMutationProcessing] = useState(false);
  // Batch Mutation States
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [isDeleteBatchModalOpen, setIsDeleteBatchModalOpen] = useState(false);
  const [selectedUnitsForDelete, setSelectedUnitsForDelete] = useState<any[]>([]);

  // Satuan States
  const [isSatuanDetailModalOpen, setIsSatuanDetailModalOpen] = useState(false);
  const [selectedSatuan, setSelectedSatuan] = useState<any>(null);
  const [isSatuanModalOpen, setIsSatuanModalOpen] = useState(false);
  const [isSatuanAddMode, setIsSatuanAddMode] = useState(true);
  const [editingSatuan, setEditingSatuan] = useState<any>(null);
  const [isSatuanDeleteModalOpen, setIsSatuanDeleteModalOpen] = useState(false);
  const [satuanToDelete, setSatuanToDelete] = useState<any>(null);
  const satuanForm = useForm({
    kode_satuan: '',
    nama_satuan: '',
    kotama: '',
    alamat: '',
    latitude: '',
    longitude: ''
  });

  // Personel States
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [isAddUserMode, setIsAddUserMode] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const userForm = useForm({
    username: '',
    password: '',
    nama_lengkap: '',
    nrp_nip: '',
    role_id: '',
    asal_satuan: '',
    no_wa: '',
    spesialisasi: ''
  });

  const { auth } = usePage().props as any;
  const currentUser = auth.user;
  const logoutAction = useStore(state => state.logout);
  const addNotification = useStore(state => state.addNotification);

  const selectedReport = dbCases.find((c: any) => c.db_id === selectedReportId);

  // Auto-polling
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases', 'dbUsers', 'dbUnits', 'dbMutations', 'dbAllUsers'] });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignTechnician = (reportId: number, idTeknisi: number) => {
    router.post(`/reports/${reportId}/handle`, { teknisi_id: idTeknisi }, {
      onSuccess: () => {
        setAssigningReportId(null);
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

  const handleVerify = (reportId: number) => {
    router.post(`/reports/${reportId}/verify`, {}, {
      onSuccess: () => {
      },
      onError: () => {
        addNotification('Gagal memverifikasi laporan.', 'error');
      }
    });
  };

  const handleReject = (reportId: number, reason: string) => {
    router.post(`/reports/${reportId}/reject`, { alasan: reason }, {
      onSuccess: () => {
        setRejectingReportId(null);
      },
      onError: () => {
        addNotification('Gagal menolak laporan.', 'error');
      }
    });
  };

  // === Unit Mutation Handlers ===
  const handleAddUnitSubmit = (formData: FormData) => {
    setMutationProcessing(true);
    router.post('/units', formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsAddUnitModalOpen(false);
        setMutationProcessing(false);
        addNotification('Pengajuan penambahan unit telah dikirim. Menunggu persetujuan Admin.');
      },
      onError: () => {
        setMutationProcessing(false);
        addNotification('Gagal mengirim pengajuan. Periksa data yang diisi.', 'error');
      }
    });
  };

  const handleRequestDelete = (unit: any) => {
    setUnitToDelete(unit);
    setIsDeleteRequestModalOpen(true);
  };

  const handleSubmitDeleteRequest = (reason: string, document: File | null) => {
    if (!unitToDelete) return;
    setMutationProcessing(true);
    const formData = new FormData();
    formData.append('reason', reason);
    if (document) formData.append('document', document);

    router.post(`/units/${unitToDelete.db_id}/request-delete`, formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsDeleteRequestModalOpen(false);
        setUnitToDelete(null);
        setMutationProcessing(false);
        addNotification('Pengajuan penghapusan telah dikirim. Menunggu persetujuan Admin.');
      },
      onError: () => {
        setMutationProcessing(false);
        addNotification('Gagal mengirim pengajuan penghapusan.', 'error');
      }
    });
  };

  const handleAddBatchSubmit = (formData: FormData) => {
    setMutationProcessing(true);
    router.post('/units/request-add-batch', formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsAddBatchModalOpen(false);
        setMutationProcessing(false);
      },
      onError: () => {
        setMutationProcessing(false);
        addNotification('Gagal mengirim pengajuan massal.', 'error');
      }
    });
  };

  const handleRequestDeleteBatch = (selectedUnits: any[]) => {
    setSelectedUnitsForDelete(selectedUnits);
    setIsDeleteBatchModalOpen(true);
  };

  const handleSubmitDeleteBatch = (reason: string, document: File) => {
    setMutationProcessing(true);
    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('document', document);
    selectedUnitsForDelete.forEach(unit => {
      formData.append('unit_ids[]', unit.db_id);
    });

    router.post('/units/request-delete-batch', formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsDeleteBatchModalOpen(false);
        setSelectedUnitsForDelete([]);
        setMutationProcessing(false);
      },
      onError: () => {
        setMutationProcessing(false);
        addNotification('Gagal mengirim pengajuan penghapusan massal.', 'error');
      }
    });
  };

  // === Satuan Handlers ===
  const handleShowDetailSatuan = (satuan: any) => {
    setSelectedSatuan(satuan);
    setIsSatuanDetailModalOpen(true);
  };

  const handleAddSatuan = () => {
    setIsSatuanAddMode(true);
    setEditingSatuan(null);
    satuanForm.clearErrors();
    satuanForm.reset();
    setIsSatuanModalOpen(true);
  };

  const handleEditSatuan = (satuan: any) => {
    setIsSatuanAddMode(false);
    setEditingSatuan(satuan);
    satuanForm.clearErrors();
    satuanForm.setData({
      kode_satuan: satuan.kode_satuan || '',
      nama_satuan: satuan.nama_satuan,
      kotama: satuan.kotama || '',
      alamat: satuan.alamat || '',
      latitude: satuan.latitude || '',
      longitude: satuan.longitude || ''
    });
    setIsSatuanModalOpen(true);
  };

  const handleDeleteSatuan = (satuan: any) => {
    setSatuanToDelete(satuan);
    setIsSatuanDeleteModalOpen(true);
  };

  const handleSatuanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSatuanAddMode) {
      satuanForm.post('/satuans', {
        onSuccess: () => {
          setIsSatuanModalOpen(false);
          satuanForm.reset();
          addNotification('Pengajuan penambahan Satuan Kerja dikirim.');
        }
      });
    } else {
      satuanForm.put(`/satuans/${editingSatuan.id}`, {
        onSuccess: () => {
          setIsSatuanModalOpen(false);
          addNotification('Pengajuan perubahan Satuan Kerja dikirim.');
        }
      });
    }
  };

  // === Personel Handlers ===
  const handleAddUser = () => {
    setIsAddUserMode(true);
    setEditingUser(null);
    userForm.clearErrors();
    userForm.reset();
    setIsUserEditModalOpen(true);
  };

  const handleShowDetail = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setIsAddUserMode(false);
    setEditingUser(user);
    userForm.clearErrors();
    userForm.setData({
      username: user.username || '',
      password: '',
      nama_lengkap: user.name,
      nrp_nip: user.nrp_nip || '',
      role_id: user.role_id || '',
      asal_satuan: user.asal_satuan || '',
      no_wa: user.no_wa || '',
      spesialisasi: user.spesialisasi || ''
    });
    setIsUserEditModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddUserMode) {
      userForm.post('/users', {
        onSuccess: () => {
          setIsUserEditModalOpen(false);
          userForm.reset();
          addNotification('Personel berhasil ditambahkan.');
        },
      });
    } else {
      userForm.put(`/users/${editingUser.db_id}`, {
        onSuccess: () => {
          setIsUserEditModalOpen(false);
          addNotification('Data personel berhasil diperbarui.');
        },
      });
    }
  };

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setIsUserDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      router.delete(`/users/${userToDelete.db_id}`, {
        onSuccess: () => {
          setIsUserDeleteModalOpen(false);
          setUserToDelete(null);
          addNotification('Personel berhasil dihapus.');
        }
      });
    }
  };

  const handleToggleUserStatus = (user: any) => {
    router.post(`/users/${user.db_id}/toggle-status`);
  };

  const rejectingReport = dbCases.find((c: any) => c.db_id === rejectingReportId);

  const incomingReports = dbCases.filter((r: any) => r.status !== 'SELESAI' && r.status !== 'DITOLAK');
  const completedReports = dbCases.filter((r: any) => r.status === 'SELESAI' || r.status === 'DITOLAK');
  const pendingMutations = dbMutations.filter((m: any) => m.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-cighra-dark flex font-sans selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-white relative text-gunmetal dark:text-slate-300">

      <StafSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
        pendingCount={incomingReports.filter((r: any) => r.status === 'PENDING').length}
        mutationPendingCount={pendingMutations.length}
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
                      activeMenu === 'INVENTARIS' ? 'DATABASE INVENTARIS PERANGKAT' :
                        activeMenu === 'MUTASI' ? 'MUTASI INVENTARIS' :
                          'DATA PERSONEL'}
                </h2>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-widest">
                  {activeMenu === 'INVENTARIS' ? 'STATUS KESIAPAN ALUTSISTA DART.' :
                    activeMenu === 'MUTASI' ? 'RIWAYAT PENGAJUAN PENAMBAHAN & PENGHAPUSAN UNIT.' :
                      activeMenu === 'PERSONEL' ? 'KELOLA DATA PENGGUNA SISTEM.' :
                        'Sistem Manajemen Pelaporan Kerusakan Dart.'}
                </p>
              </div>

              {(activeMenu === 'MASUK' || activeMenu === 'SELESAI') && (
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
                onVerify={handleVerify}
                onReject={setRejectingReportId}
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
                onAddUnit={() => setIsAddUnitModalOpen(true)}
                onAddBatch={() => setIsAddBatchModalOpen(true)}
                onRequestDelete={handleRequestDelete}
                onRequestDeleteBatch={handleRequestDeleteBatch}
              />
            )}

            {activeMenu === 'MUTASI' && (
              <MutationHistory dbMutations={dbMutations} />
            )}

            {activeMenu === 'PERSONEL' && (
              <UsersTable
                dbUsers={dbAllUsers}
                handleAddUser={handleAddUser}
                handleShowDetail={handleShowDetail}
                handleEditUser={handleEditUser}
                handleDeleteUser={handleDeleteUser}
              />
            )}

            {activeMenu === 'SATUANS' && (
              <SatuansTable
                dbSatuans={dbSatuans}
                dbUnits={dbUnits}
                handleAddSatuan={handleAddSatuan}
                handleEditSatuan={handleEditSatuan}
                handleDeleteSatuan={handleDeleteSatuan}
                handleShowDetailSatuan={handleShowDetailSatuan}
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

      <ReportRejectModal
        isOpen={!!rejectingReportId}
        onClose={() => setRejectingReportId(null)}
        onConfirm={(reason) => rejectingReportId && handleReject(rejectingReportId, reason)}
        caseId={rejectingReport ? rejectingReport.caseId : ''}
      />

      {/* Unit Mutation Modals */}
      <StafUnitModal
        isOpen={isAddUnitModalOpen}
        onClose={() => setIsAddUnitModalOpen(false)}
        onSubmit={handleAddUnitSubmit}
        processing={mutationProcessing}
        dbSatuans={dbSatuans}
      />

      <RequestDeleteModal
        isOpen={isDeleteRequestModalOpen}
        onClose={() => { setIsDeleteRequestModalOpen(false); setUnitToDelete(null); }}
        onSubmit={handleSubmitDeleteRequest}
        unit={unitToDelete}
        processing={mutationProcessing}
      />

      <StafUnitBatchModal
        isOpen={isAddBatchModalOpen}
        onClose={() => setIsAddBatchModalOpen(false)}
        onSubmit={handleAddBatchSubmit}
        processing={mutationProcessing}
      />

      <RequestDeleteBatchModal
        isOpen={isDeleteBatchModalOpen}
        onClose={() => { setIsDeleteBatchModalOpen(false); setSelectedUnitsForDelete([]); }}
        onSubmit={handleSubmitDeleteBatch}
        selectedUnits={selectedUnitsForDelete}
        processing={mutationProcessing}
      />
      {/* Personel Modals */}
      <UserDetailModal
        isOpen={isUserDetailModalOpen}
        onClose={() => setIsUserDetailModalOpen(false)}
        user={selectedUser}
      />

      <UserDeleteModal
        isOpen={isUserDeleteModalOpen}
        onClose={() => setIsUserDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        user={userToDelete}
      />

      <UserEditModal
        isOpen={isUserEditModalOpen}
        onClose={() => setIsUserEditModalOpen(false)}
        onSubmit={handleSaveUser}
        data={userForm.data}
        setData={userForm.setData}
        errors={userForm.errors}
        processing={userForm.processing}
        isAddMode={isAddUserMode}
        dbRoles={dbRoles}
        dbSatuans={dbSatuans}
      />

      <SatuanModal
        isOpen={isSatuanModalOpen}
        onClose={() => setIsSatuanModalOpen(false)}
        onSubmit={handleSatuanSubmit}
        data={satuanForm.data}
        setData={satuanForm.setData}
        errors={satuanForm.errors}
        processing={satuanForm.processing}
        isAddMode={isSatuanAddMode}
      />

      <SatuanDetailModal
        isOpen={isSatuanDetailModalOpen}
        onClose={() => setIsSatuanDetailModalOpen(false)}
        satuan={selectedSatuan}
        dbUnits={dbUnits}
        dbUsers={dbUsers}
        dbCases={dbCases}
      />

      <SatuanDeleteModal
        isOpen={isSatuanDeleteModalOpen}
        onClose={() => setIsSatuanDeleteModalOpen(false)}
        satuan={satuanToDelete}
      />

    </div>
  );
};

export default DashboardStaf;
