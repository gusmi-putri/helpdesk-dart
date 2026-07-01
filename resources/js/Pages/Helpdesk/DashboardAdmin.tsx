/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';

import Sidebar from './AdminComponents/Sidebar';
import Topbar from './AdminComponents/Topbar';
import AnalyticsSection from './AdminComponents/AnalyticsSection';
import UsersTable from './AdminComponents/UsersTable';
import UnitsTable from './AdminComponents/UnitsTable';
import AdminUnitBatchModal from './AdminComponents/AdminUnitBatchModal';
import LogsTable from './AdminComponents/LogsTable';
import ReportsSection from './AdminComponents/ReportsSection';
import ApprovalCenter from './AdminComponents/ApprovalCenter';
import FeedbackTable from './AdminComponents/FeedbackTable';
import MonitoringMap from './AdminComponents/MonitoringMap';
import UserDetailModal from './AdminComponents/UserDetailModal';
import UserDeleteModal from './AdminComponents/UserDeleteModal';
import UserEditModal from './AdminComponents/UserEditModal';
import UnitModal from './AdminComponents/UnitModal';
import UnitDeleteModal from './AdminComponents/UnitDeleteModal';
import UnitHistoryModal from './AdminComponents/UnitHistoryModal';
import SatuansTable from './AdminComponents/SatuansTable';
import SatuanModal from './AdminComponents/SatuanModal';
import SatuanDetailModal from './AdminComponents/SatuanDetailModal';
import SatuanDeleteModal from './AdminComponents/SatuanDeleteModal';
import RecapModal from './AdminComponents/RecapModal';
import RejectConfirmModal from './AdminComponents/RejectConfirmModal';
import LogoutConfirmModal from '@/Components/LogoutConfirmModal';
import { useStore } from '@/store/useStore';
import { router, useForm, usePage, Link } from '@inertiajs/react';

type SubMenuReport = 'KERUSAKAN' | 'PERBAIKAN';
type MenuTab = 'ANALYTICS' | 'MAP' | 'USERS' | 'LOGS' | 'REPORTS' | 'UNITS' | 'SATUANS' | 'APPROVAL_CENTER' | 'FEEDBACK';

const DashboardAdmin = (props: any) => {
  const { dbCases = [], dbUsers = [], dbLogs = [], dbRoles = [], dbUnits = [], dbSatuans = [], dbFeedbacks = [], dbMutations = [], dbArchivedUnits = [] } = props;
  const [activeMenu, setActiveMenu] = useState<MenuTab>('ANALYTICS');
  const [activeSubReport, setActiveSubReport] = useState<SubMenuReport>('KERUSAKAN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [reportStatusFilter, setReportStatusFilter] = useState<'ALL' | 'PENDING' | 'DIVERIFIKASI' | 'DITERIMA TEKNISI' | 'DIPROSES' | 'SELESAI' | 'DITOLAK'>('ALL');
  const [mapFocusSatuan, setMapFocusSatuan] = useState<string | null>(null);

  // Auto-polling untuk real-time sinkronisasi
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases', 'dbUsers', 'dbLogs', 'dbUnits'] });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Internal render functions removed and moved to separate components in AdminComponents/
  const currentUser = useStore(state => state.currentUser);
  const logoutAction = useStore(state => state.logout);

  // State for Add/Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [selectedLogPayload, setSelectedLogPayload] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    username: '',
    password: '',
    email: '',
    nama_lengkap: '',
    nrp_nip: '',
    role_id: '',
    satuan_id: '',
    asal_satuan: '',
    no_wa: '',
    spesialisasi: ''
  });

  const unitForm = useForm({
    nomor_seri: '',
    jenis: 'DART STD',
    asal_satuan: '',
    status_unit: 'Beroperasi',
    document: null as File | null,
  });

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [isUnitAddMode, setIsUnitAddMode] = useState(true);
  const [isUnitDeleteModalOpen, setIsUnitDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<any>(null);
  const [isUnitHistoryModalOpen, setIsUnitHistoryModalOpen] = useState(false);
  const [selectedUnitForHistory, setSelectedUnitForHistory] = useState<any>(null);
  const [unitSearch, setUnitSearch] = useState<string>('');
  const [isAdminBatchModalOpen, setIsAdminBatchModalOpen] = useState(false);
  const [isBatchUploading, setIsBatchUploading] = useState(false);
  const [unitSortConfig, setUnitSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [recapPeriod, setRecapPeriod] = useState<'weekly' | 'monthly' | 'yearly' | 'custom' | 'year_specific'>('monthly');
  const [recapStartDate, setRecapStartDate] = useState<string>('');
  const [recapEndDate, setRecapEndDate] = useState<string>('');
  const [recapYear, setRecapYear] = useState<string>(new Date().getFullYear().toString());
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [userToReject, setUserToReject] = useState<any>(null);

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
    alamat: '',
    latitude: '',
    longitude: ''
  });

  // Handlers
  const handlePrintCasePDF = (caseData: any) => {
    window.open(`/reports/${caseData.db_id}/pdf`, '_blank');
  };

  const handleAddUser = () => {
    setIsAddMode(true);
    setEditingUser(null);
    clearErrors();
    setData({
      username: '',
      password: '',
      email: '',
      nama_lengkap: '',
      nrp_nip: '',
      role_id: '',
      satuan_id: '',
      asal_satuan: '',
      no_wa: '',
      spesialisasi: ''
    });
    setIsEditModalOpen(true);
  };

  const handleShowDetail = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setIsAddMode(false);
    setEditingUser(user);
    clearErrors();
    setData({
      username: user.username || '',
      password: '',
      email: user.email || '',
      nama_lengkap: user.name,
      nrp_nip: user.nrp_nip || '',
      role_id: user.role_id || '',
      satuan_id: user.satuan_id || '',
      asal_satuan: user.asal_satuan || '',
      no_wa: user.no_wa || '',
      spesialisasi: user.spesialisasi || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddMode) {
      post('/users', {
        onSuccess: () => {
          setIsEditModalOpen(false);
          reset();
        },
      });
    } else {
      put(`/users/${editingUser.db_id}`, {
        onSuccess: () => setIsEditModalOpen(false),
      });
    }
  };

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      router.delete(`/users/${userToDelete.db_id}`, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }
      });
    }
  };

  const handleToggleUserStatus = (user: any) => {
    router.post(`/users/${user.db_id}/toggle-status`);
  };

  const handleAddUnit = () => {
    setIsUnitAddMode(true);
    setEditingUnit(null);
    unitForm.reset();
    unitForm.clearErrors();
    setIsUnitModalOpen(true);
  };

  const handleEditUnit = (unit: any) => {
    setIsUnitAddMode(false);
    setEditingUnit(unit);
    unitForm.clearErrors();
    unitForm.setData({
      nomor_seri: unit.nomor_seri,

      jenis: unit.jenis,
      asal_satuan: unit.asal_satuan,
      status_unit: unit.status_unit,
    });
    setIsUnitModalOpen(true);
  };

  const handleDeleteUnit = (unit: any) => {
    setUnitToDelete(unit);
    setIsUnitDeleteModalOpen(true);
  };

  const handleShowUnitHistory = (unit: any) => {
    setSelectedUnitForHistory(unit);
    setIsUnitHistoryModalOpen(true);
  };

  const handleConfirmDeleteUnit = () => {
    if (unitToDelete) {
      router.delete(`/units/${unitToDelete.db_id}`, {
        onSuccess: () => {
          setIsUnitDeleteModalOpen(false);
          setUnitToDelete(null);
        }
      });
    }
  };

  const handleUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnitAddMode) {
      unitForm.post('/units', {
        onSuccess: () => {
          setIsUnitModalOpen(false);
          unitForm.reset();
        }
      });
    } else {
      unitForm.put(`/units/${editingUnit.db_id}`, {
        onSuccess: () => {
          setIsUnitModalOpen(false);
        }
      });
    }
  };

  const handleImportBatchSubmit = (formData: FormData) => {
    setIsBatchUploading(true);
    router.post('/units/import', formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsAdminBatchModalOpen(false);
        setIsBatchUploading(false);
      },
      onError: () => {
        setIsBatchUploading(false);
      }
    });
  };

  const handleApproveUser = (user: any) => {
    router.post(`/users/${user.db_id}/approve`, {}, {
      onSuccess: () => {
        // Notification logic if any
      }
    });
  };

  const handleRejectUser = (user: any) => {
    setUserToReject(user);
    setIsRejectModalOpen(true);
  };

  const confirmRejectUser = () => {
    if (userToReject) {
      router.post(`/users/${userToReject.db_id}/reject`, { reason: 'Ditolak oleh Admin' }, {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setUserToReject(null);
        }
      });
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logoutAction();
    router.visit('/login');
  };

  const handleMenuClick = (menu: MenuTab) => {
    setActiveMenu(menu);
    setIsMobileMenuOpen(false);
    if (menu !== 'MAP') setMapFocusSatuan(null);
  };

  const handleExportRecap = () => {
    let url = `/admin/recap/export?period=${recapPeriod}`;
    if (recapPeriod === 'custom' && recapStartDate && recapEndDate) {
      url += `&start_date=${recapStartDate}&end_date=${recapEndDate}`;
    } else if (recapPeriod === 'year_specific' && recapYear) {
      url += `&year=${recapYear}`;
    }
    window.open(url, '_blank');
    setIsRecapModalOpen(false);
  };

  // --- Satuan Handlers ---
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
        }
      });
    } else {
      satuanForm.put(`/satuans/${editingSatuan.id}`, {
        onSuccess: () => setIsSatuanModalOpen(false)
      });
    }
  };

  // VIEW RENDERERS - MOVED TO AdminComponents/


  // ==========================================

  // ==========================================
  // MAIN RENDER WITH NESTED SIDEBAR LAYOUT
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-cighra-dark flex font-sans selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-gunmetal relative text-slate-800 dark:text-slate-200">

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeMenu={activeMenu}
        handleMenuClick={setActiveMenu}
        dbUsers={dbUsers}
        dbMutations={dbMutations}
        dbSatuans={dbSatuans}
        handleLogout={handleLogout}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

        <Topbar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentUser={currentUser}
        />

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">
            {activeMenu === 'ANALYTICS' && <AnalyticsSection dbCases={dbCases} />}
            {activeMenu === 'MAP' && (
              <MonitoringMap 
                dbUnits={dbUnits} 
                dbCases={dbCases} 
                dbSatuans={dbSatuans} 
                initialFocusSatuan={mapFocusSatuan}
              />
            )}
            {activeMenu === 'REPORTS' && (
              <ReportsSection
                dbCases={dbCases}
                reportStatusFilter={reportStatusFilter}
                setReportStatusFilter={setReportStatusFilter}
                activeSubReport={activeSubReport}
                setActiveSubReport={setActiveSubReport}
                setIsRecapModalOpen={setIsRecapModalOpen}
                handlePrintCasePDF={handlePrintCasePDF}
              />
            )}
            {activeMenu === 'USERS' && (
              <UsersTable
                dbUsers={dbUsers}
                handleAddUser={handleAddUser}
                handleEditUser={handleEditUser}
                handleDeleteUser={handleDeleteUser}
                handleToggleUserStatus={handleToggleUserStatus}
                handleShowDetail={handleShowDetail}
              />
            )}
            {activeMenu === 'LOGS' && (
              <LogsTable
                dbLogs={dbLogs}
                logFilter={logFilter}
                setLogFilter={setLogFilter}
                setSelectedLogPayload={setSelectedLogPayload}
              />
            )}
            {activeMenu === 'UNITS' && (
              <UnitsTable
                dbUnits={dbUnits}
                unitSearch={unitSearch}
                setUnitSearch={setUnitSearch}
                unitSortConfig={unitSortConfig}
                handleUnitSort={(key) => {
                  let direction: 'asc' | 'desc' = 'asc';
                  if (unitSortConfig && unitSortConfig.key === key && unitSortConfig.direction === 'asc') {
                    direction = 'desc';
                  }
                  setUnitSortConfig({ key, direction });
                }}
                handleShowUnitHistory={handleShowUnitHistory}
                handleAddUnit={handleAddUnit}
                handleEditUnit={handleEditUnit}
                handleDeleteUnit={handleDeleteUnit}
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
                handleViewOnMap={(satuan) => {
                  setMapFocusSatuan(satuan.nama_satuan);
                  setActiveMenu('MAP');
                }}
              />
            )}
            {activeMenu === 'APPROVAL_CENTER' && (
              <ApprovalCenter
                dbUsers={dbUsers}
                dbMutations={dbMutations}
                dbSatuans={dbSatuans}
                dbArchivedUnits={dbArchivedUnits}
                handleApproveUser={handleApproveUser}
                handleRejectUser={handleRejectUser}
              />
            )}
            {activeMenu === 'FEEDBACK' && <FeedbackTable dbFeedbacks={dbFeedbacks} />}
          </div>
        </div>
      </main>

      {/* MODAL COMPONENTS */}
      <UnitHistoryModal
        isOpen={isUnitHistoryModalOpen}
        onClose={() => setIsUnitHistoryModalOpen(false)}
        unit={selectedUnitForHistory}
        dbCases={dbCases}
      />

      <RecapModal
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

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={selectedUser}
      />

      <UserDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        user={userToDelete}
      />

      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveUser}
        data={data}
        setData={setData}
        errors={errors}
        processing={processing}
        isAddMode={isAddMode}
        dbRoles={dbRoles}
        dbSatuans={dbSatuans}
      />

      <UnitModal
        isOpen={isUnitModalOpen}
        onClose={() => setIsUnitModalOpen(false)}
        onSubmit={handleUnitSubmit}
        data={unitForm.data}
        setData={unitForm.setData}
        errors={unitForm.errors}
        processing={unitForm.processing}
        isAddMode={isUnitAddMode}
        editingUnit={editingUnit}
        dbSatuans={dbSatuans}
      />

      <AdminUnitBatchModal
        isOpen={isAdminBatchModalOpen}
        onClose={() => setIsAdminBatchModalOpen(false)}
        onSubmit={handleImportBatchSubmit}
        processing={isBatchUploading}
      />

      <UnitDeleteModal
        isOpen={isUnitDeleteModalOpen}
        onClose={() => setIsUnitDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteUnit}
        unit={unitToDelete}
      />

      <RejectConfirmModal
        isOpen={isRejectModalOpen}
        onClose={() => { setIsRejectModalOpen(false); setUserToReject(null); }}
        onConfirm={confirmRejectUser}
        userName={userToReject?.name || ''}
        actionType={userToReject && !userToReject.is_approved ? 'register' : (userToReject?.pending_action || 'register')}
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

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default DashboardAdmin;

