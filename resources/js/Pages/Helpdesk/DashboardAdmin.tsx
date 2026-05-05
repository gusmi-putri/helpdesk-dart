/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Users, Database, Search,
  Edit, Trash2, Shield, Settings, LogOut,
  ChevronDown, ChevronRight, FileArchive, Wrench, Download, AlertTriangle, Radar,
  Menu, CircleUser, Eye, Activity, Info, UserCheck, XCircle, CheckCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store/useStore';
import { router, useForm } from '@inertiajs/react';

type SubMenuReport = 'KERUSAKAN' | 'PERBAIKAN';
type MenuTab = 'ANALYTICS' | 'USERS' | 'LOGS' | 'REPORTS' | 'SETTINGS' | 'APPROVAL';

// ==========================================
// RELATIONAL DATABASE DATA INTERFACES
// ==========================================
interface CaseData {
  caseId: string;
  status: 'PENDING' | 'PROSES' | 'SELESAI';
  kerusakan: {
    tanggal: string;
    pelapor: string;
    lokasi: string;
    barangRusak: string;
    deskripsi: string;
  };
  perbaikan: {
    teknisi: string | null;
    tanggalPenanganan: string | null;
    tindakan: string | null;
    metodePerbaikan: string | null;
    statusPerbaikan: 'MENUNGGU' | 'DIANALISA' | 'PERBAIKAN' | 'TUNTAS';
  };
}

const DashboardAdmin = (props: any) => {
  const { dbCases = [], dbUsers = [], dbLogs = [], dbRoles = [] } = props;
  const [activeMenu, setActiveMenu] = useState<MenuTab>('ANALYTICS');
  const [activeSubReport, setActiveSubReport] = useState<SubMenuReport>('KERUSAKAN');
  const [isReportsExpanded, setIsReportsExpanded] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Auto-polling untuk real-time sinkronisasi
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases', 'dbUsers', 'dbLogs'] });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Data dari Global Store
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
    nama_lengkap: '',
    nrp_nip: '',
    role_id: '',
    asal_satuan: '',
    no_wa: '',
    spesialisasi: ''
  });

  // Handlers
  const handlePrintCasePDF = (caseData: any) => {
    window.open(`/reports/${caseData.db_id}/pdf`, '_blank');
  };

  const handleAddUser = () => {
    setIsAddMode(true);
    setEditingUser(null);
    clearErrors();
    reset();
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
      nama_lengkap: user.name,
      nrp_nip: user.nrp_nip || '',
      role_id: user.role_id || '',
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

  const handleApproveUser = (user: any) => {
    router.post(`/users/${user.db_id}/approve`, {}, {
      onSuccess: () => {
        // Notification logic if any
      }
    });
  };

  const handleRejectUser = (user: any) => {
    if (confirm(`Apakah Anda yakin menolak dan menghapus pendaftaran ${user.name}?`)) {
      router.delete(`/users/${user.db_id}`, {
        onSuccess: () => {
          // Notification logic
        }
      });
    }
  };

  const handleLogout = () => {
    logoutAction();
    router.visit('/login');
  };

  const handleMenuClick = (menu: MenuTab) => {
    setActiveMenu(menu);
    setIsMobileMenuOpen(false);
    if (menu === 'REPORTS') {
      setIsReportsExpanded(true);
    } else {
      setIsReportsExpanded(false);
    }
  };

  // ==========================================
  // VIEW RENDERERS
  // ==========================================

  const renderAnalyticsDashboard = () => {
    // Data Aggregation
    const statusCounts = { PENDING: 0, PROSES: 0, SELESAI: 0 };
    const urgencyCounts: Record<string, number> = {};
    const unitCounts: Record<string, number> = {};

    dbCases.forEach((c: any) => {
      // Status
      if (statusCounts[c.status as keyof typeof statusCounts] !== undefined) {
        statusCounts[c.status as keyof typeof statusCounts]++;
      }
      // Urgency
      const urgency = c.kerusakan.urgensi || 'Normal';
      urgencyCounts[urgency] = (urgencyCounts[urgency] || 0) + 1;
      // Unit/Lokasi
      const lokasi = c.kerusakan.lokasi || 'Unknown';
      unitCounts[lokasi] = (unitCounts[lokasi] || 0) + 1;
    });

    const statusData = [
      { name: 'PENDING', value: statusCounts.PENDING, color: '#dc2626' }, // targetred
      { name: 'PROSES', value: statusCounts.PROSES, color: '#3b82f6' },  // blue
      { name: 'SELESAI', value: statusCounts.SELESAI, color: '#22c55e' } // green
    ];

    const urgencyData = Object.keys(urgencyCounts).map(key => ({
      name: key,
      value: urgencyCounts[key]
    }));

    const unitData = Object.keys(unitCounts).map(key => ({
      name: key,
      value: unitCounts[key]
    }));

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white tracking-widest flex items-center gap-3 mb-6">
          <Activity className="text-olive w-6 h-6" /> TACTICAL OVERVIEW
        </h2>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
             <div className="absolute top-0 left-0 w-full h-1 bg-targetred"></div>
             <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Kasus Tertunda</span>
             <span className="text-4xl font-tactical font-bold text-targetred">{statusCounts.PENDING}</span>
          </div>
          <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
             <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
             <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Kasus Dalam Proses</span>
             <span className="text-4xl font-tactical font-bold text-blue-500">{statusCounts.PROSES}</span>
          </div>
          <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
             <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
             <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Kasus Selesai</span>
             <span className="text-4xl font-tactical font-bold text-green-500">{statusCounts.SELESAI}</span>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Chart */}
          <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xs font-tactical font-bold text-gunmetal dark:text-gray-300 tracking-widest mb-6 uppercase border-b border-gray-300 dark:border-gray-700 pb-2">Status Penanganan Kasus</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1a2024', border: '1px solid #4B5320', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Urgency Chart */}
          <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xs font-tactical font-bold text-gunmetal dark:text-gray-300 tracking-widest mb-6 uppercase border-b border-gray-300 dark:border-gray-700 pb-2">Klasifikasi Urgensi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={urgencyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} allowDecimals={false} />
                  <RechartsTooltip cursor={{ fill: 'rgba(75,83,32,0.1)' }} contentStyle={{ backgroundColor: '#1a2024', border: '1px solid #4B5320', color: '#fff' }} />
                  <Bar dataKey="value" fill="#4B5320" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUsersTable = () => (
    <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden animate-in fade-in relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-olive via-camogreen to-transparent"></div>
      <div className="p-5 border-b border-gray-300 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 dark:bg-black/40">
        <h3 className="text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3">
          <Users className="text-olive w-6 h-6" /> REPOSITORI PERSONEL
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddUser}
            className="bg-olive hover:bg-camogreen text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-olive shadow-[0_0_15px_rgba(75,83,32,0.3)]"
          >
            <Shield className="w-4 h-4" /> TAMBAH PERSONEL
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-600 dark:text-gray-500" />
            <input type="text" placeholder="Cari ID / Nama..." className="bg-sand dark:bg-gunmetal border border-gray-600 pl-9 pr-4 py-2 text-sm font-mono text-gunmetal dark:text-white focus:outline-none focus:border-olive transition-colors w-64 shadow-inner" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#1a2024] text-gray-600 dark:text-gray-400 font-tactical tracking-widest border-b border-gray-300 dark:border-gray-700">
            <tr>
              <th className="p-4">ID PERSONEL</th>
              <th className="p-4">NRP / NIP</th>
              <th className="p-4">NAMA LENGKAP</th>
              <th className="p-4">HAK AKSES</th>
              <th className="p-4">STATUS AKTIF</th>
              <th className="p-4 text-right">TINDAKAN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {dbUsers.filter((u: any) => u.is_approved).map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-200 dark:hover:bg-gray-800/80 transition-colors group">
                <td className="p-4 font-mono text-gray-700 dark:text-gray-300 border-l-2 border-transparent group-hover:border-olive">{u.id}</td>
                <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-400">{u.nrp_nip || '-'}</td>
                <td className="p-4 text-gunmetal dark:text-white font-bold">{u.name}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[10px] font-mono font-bold tracking-widest border
                    ${u.role === 'Admin' ? 'bg-red-900/30 text-targetred border-red-800' :
                      u.role === 'Staf' ? 'bg-olive/20 text-[#b5cb5c] border-olive/50' :
                        u.role === 'Teknisi' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                          'bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600'}
                  `}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-2 text-xs font-bold tracking-wider ${u.status === 'Aktif' ? 'text-green-500' : 'text-gray-500'}`}>
                    <span className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${u.status === 'Aktif' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400 text-xs font-mono">{u.lastLogin}</td>
                <td className="p-4 flex gap-2 justify-end">
                  <button onClick={() => handleShowDetail(u)} className="p-2 bg-gray-300 dark:bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-300 transition-colors border border-gray-400 dark:border-gray-600" title="Detail">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEditUser(u)} className="p-2 bg-gray-300 dark:bg-gray-800 hover:bg-olive hover:text-gunmetal dark:hover:text-white text-gray-700 dark:text-gray-300 transition-colors border border-gray-400 dark:border-gray-600" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteUser(u)} className="p-2 bg-gray-300 dark:bg-gray-800 hover:bg-targetred hover:text-white text-gray-700 dark:text-gray-300 transition-colors border border-gray-400 dark:border-gray-600" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLogsTable = () => {
    const filteredLogs = logFilter === 'ALL' 
      ? dbLogs 
      : dbLogs.filter((l: any) => l.level === logFilter);

    return (
      <div className="space-y-4 animate-in fade-in duration-500">
        <div className="bg-white/60 dark:bg-[#1a2024] border border-gray-300 dark:border-gray-600 p-4 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <Database className="text-yellow-500 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest uppercase">AUDIT LOG SISTEM</h3>
              <p className="text-[10px] font-mono text-gray-500 tracking-widest">RECORDING ALL COMMAND CENTER ACTIVITY</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-black p-1 border border-gray-300 dark:border-gray-800">
            <span className="text-[10px] font-mono font-bold text-gray-500 px-3 uppercase tracking-tighter">Filter Level:</span>
            {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ALERT'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setLogFilter(lvl)}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold transition-all ${logFilter === lvl ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-500 via-yellow-400 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
          <div className="p-3 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center bg-white/40 dark:bg-black/40">
            <h3 className="text-gunmetal dark:text-white font-mono font-bold text-[10px] tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> /var/log/helpdesk_audit.log
            </h3>
            <span className="text-[9px] text-gray-500 font-mono italic">Showing {filteredLogs.length} entries</span>
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="bg-[#111] text-gray-500 font-bold sticky top-0 z-10 border-b border-gray-800 shadow-md">
                <tr>
                  <th className="p-3 w-44 tracking-widest uppercase">Timestamp</th>
                  <th className="p-3 w-28 tracking-widest uppercase text-center">Severity</th>
                  <th className="p-3 w-56 tracking-widest uppercase">Operator</th>
                  <th className="p-3 tracking-widest uppercase">Action Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-800 bg-sand dark:bg-gunmetal">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-500 italic tracking-widest uppercase">No records found for filter: {logFilter}</td>
                  </tr>
                ) : (
                  filteredLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-yellow-500/5 transition-colors group">
                      <td className="p-3 text-gray-500 border-l-2 border-transparent group-hover:border-yellow-500 whitespace-nowrap">{log.time}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-sm inline-block min-w-[70px]
                          ${log.level === 'SUCCESS' ? 'bg-green-900/20 text-green-500 border-green-800' : ''}
                          ${log.level === 'ALERT' ? 'bg-red-900/30 text-targetred border-red-800 animate-pulse' : ''}
                          ${log.level === 'WARN' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-800' : ''}
                          ${log.level === 'INFO' ? 'bg-blue-900/20 text-blue-400 border-blue-800' : ''}
                        `}>
                          {log.level}
                        </span>
                      </td>
                      <td className="p-3 text-gunmetal dark:text-white font-bold flex items-center gap-2">
                         <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-800 flex items-center justify-center text-[10px] text-gray-500">
                           {log.user?.charAt(0) || 'S'}
                         </div>
                         {log.user}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-800 dark:text-gray-300 line-clamp-1 flex-1">{log.activity}</span>
                          <button 
                            onClick={() => setSelectedLogPayload(log.activity)}
                            className="p-1 hover:bg-yellow-500/20 text-yellow-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOG DETAIL MODAL */}
        {selectedLogPayload && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-sand dark:bg-gunmetal border-2 border-yellow-500 w-full max-w-lg shadow-[0_0_50px_rgba(234,179,8,0.3)]">
              <div className="p-4 border-b border-yellow-500 bg-yellow-500/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-tactical font-bold text-yellow-500 tracking-widest uppercase">DETAIL AKTIVITAS SISTEM</h3>
                </div>
                <button onClick={() => setSelectedLogPayload(null)} className="text-gray-500 hover:text-targetred text-xl">✕</button>
              </div>
              <div className="p-6">
                <div className="bg-black/40 border border-yellow-500/30 p-6 font-mono text-sm text-yellow-500/80 leading-relaxed shadow-inner">
                  <span className="text-yellow-500 font-bold block mb-2 tracking-widest uppercase inline-block border-b border-yellow-500/50 pb-1 underline-offset-4">Event Payload:</span>
                  <p className="whitespace-pre-wrap">{selectedLogPayload}</p>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedLogPayload(null)}
                    className="bg-yellow-500 text-black px-8 py-2 font-tactical font-bold tracking-widest hover:bg-yellow-400 transition-colors shadow-lg"
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReportsDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Laporan */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 dark:bg-[#1a2024] border border-gray-300 dark:border-gray-600 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-gray-200 dark:from-gunmetal to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white tracking-widest flex items-center gap-3">
            <Radar className="text-olive w-8 h-8 animate-spin-slow" />
            {activeSubReport === 'KERUSAKAN' ? 'LAPORAN KERUSAKAN' : 'LAPORAN PERBAIKAN'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-mono text-xs mt-2 tracking-widest">
            {activeSubReport === 'KERUSAKAN'
              ? 'Kumpulan pelaporan dart/kerusakan yang disubmit oleh Pelapor.'
              : 'Progres penanganan dan status teknisi pada masing-masing kasus.'}
          </p>
        </div>
      </div>

      {/* Main Relational Table */}
      <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-olive via-camogreen to-transparent"></div>

        <div className="overflow-x-auto p-2">
          <table className="w-full text-left font-sans text-sm break-words">
            <thead className="bg-[#1a2024] text-gray-600 dark:text-gray-400 font-tactical tracking-widest border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="p-4 w-40">KODE KASUS</th>
                {activeSubReport === 'KERUSAKAN' ? (
                  <>
                    <th className="p-4">PELAPOR & WAKTU</th>
                    <th className="p-4 w-1/3">DETAIL KERUSAKAN</th>
                  </>
                ) : (
                  <>
                    <th className="p-4">TEKNISI BERTUGAS</th>
                    <th className="p-4 w-1/3">TINDAKAN & SPAREPART</th>
                  </>
                )}
                <th className="p-4">STATUS KASUS</th>
                <th className="p-4 text-center">UNDUH PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-800">
              {dbCases.map((c: CaseData) => (
                <tr key={c.caseId} className="hover:bg-gray-200 dark:hover:bg-gray-800/60 transition-colors group text-gunmetal dark:text-gray-200">
                  <td className="p-4 font-mono text-olive font-bold border-l-2 border-transparent group-hover:border-olive">
                    {c.caseId}
                  </td>

                  {activeSubReport === 'KERUSAKAN' ? (
                    <>
                      <td className="p-4">
                        <div className="font-bold">{c.kerusakan.pelapor}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">{c.kerusakan.tanggal}</div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-500 mt-2 flex items-center gap-1 font-bold">
                          <AlertTriangle className="w-3 h-3" /> {c.kerusakan.lokasi}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold mb-1">{c.kerusakan.barangRusak}</div>
                        <div className="text-xs text-gray-700 dark:text-gray-400 leading-relaxed">{c.kerusakan.deskripsi}</div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4">
                        {c.perbaikan.teknisi ? (
                          <>
                            <div className="font-bold flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-olive" /> {c.perbaikan.teknisi}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">{c.perbaikan.tanggalPenanganan || '-'}</div>
                          </>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 border border-yellow-700/50 text-[10px] font-tactical tracking-widest inline-block">
                            TEKNISI BELUM DITUGASKAN
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-xs leading-relaxed mb-3">
                          {c.perbaikan.tindakan || 'Belum ada tindakan.'}
                        </div>
                        {c.perbaikan.metodePerbaikan && (
                          <div className="text-[10px] text-green-600 dark:text-green-500 bg-green-900/10 px-2 py-1 border border-green-900/50 inline-block font-mono">
                            METODE PERBAIKAN: {c.perbaikan.metodePerbaikan}
                          </div>
                        )}
                      </td>
                    </>
                  )}

                  <td className="p-4">
                    <span className={`px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest border shadow-inner
                      ${c.status === 'SELESAI' ? 'bg-green-900/30 text-green-500 border-green-800' :
                        c.status === 'PROSES' ? 'bg-blue-900/30 text-blue-500 border-blue-800' :
                          'bg-targetred text-white border-targetred animate-pulse'}
                    `}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handlePrintCasePDF(c)}
                      className="bg-gray-300 dark:bg-gray-800 hover:bg-olive text-gray-600 dark:text-gray-400 hover:text-gunmetal dark:hover:text-white border border-gray-400 dark:border-gray-600 hover:border-olive p-2.5 transition-all flex items-center justify-center mx-auto group-hover:shadow-[0_0_15px_rgba(75,83,32,0.4)] relative overflow-hidden group/btn"
                      title="Unduh PDF Berkas Kasus (2 Halaman)"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-olive/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                      <Download className="w-5 h-5 relative z-10" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


  const renderApprovalTable = () => {
    const pendingUsers = dbUsers.filter((u: any) => !u.is_approved);

    return (
      <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden animate-in fade-in relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-targetred"></div>
        <div className="p-5 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center bg-white/40 dark:bg-black/40">
          <h3 className="text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3">
            <UserCheck className="text-targetred w-6 h-6" /> PERSETUJUAN PERSONEL BARU
          </h3>
          <span className="bg-targetred text-white text-[10px] font-mono font-bold px-3 py-1 tracking-widest">
            {pendingUsers.length} MENUNGGU VERIFIKASI
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-[#1a2024] text-gray-600 dark:text-gray-400 font-tactical tracking-widest border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="p-4">USERNAME</th>
                <th className="p-4">NRP / NIP</th>
                <th className="p-4">NAMA LENGKAP</th>
                <th className="p-4">SATUAN</th>
                <th className="p-4">WHATSAPP</th>
                <th className="p-4 text-right">AKSI VERIFIKASI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-800 bg-sand/30 dark:bg-gunmetal/30">
              {pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-gray-500 italic font-mono uppercase tracking-widest">
                    Tidak ada pendaftaran personel baru yang menunggu persetujuan.
                  </td>
                </tr>
              ) : (
                pendingUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors group">
                    <td className="p-4 font-mono text-gray-700 dark:text-gray-300">{u.username}</td>
                    <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-400">{u.nrp_nip}</td>
                    <td className="p-4 text-gunmetal dark:text-white font-bold">{u.name}</td>
                    <td className="p-4 text-xs font-mono uppercase text-gray-600 dark:text-gray-400">{u.asal_satuan}</td>
                    <td className="p-4 text-xs font-mono text-gray-600 dark:text-gray-400">{u.no_wa}</td>
                    <td className="p-4 flex gap-3 justify-end">
                      <button 
                        onClick={() => handleApproveUser(u)} 
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 text-[10px] font-tactical font-bold tracking-widest transition-all shadow-lg"
                      >
                        <CheckCircle className="w-4 h-4" /> SETUJUI
                      </button>
                      <button 
                        onClick={() => handleRejectUser(u)} 
                        className="flex items-center gap-2 bg-targetred hover:bg-red-500 text-white px-4 py-2 text-[10px] font-tactical font-bold tracking-widest transition-all shadow-lg"
                      >
                        <XCircle className="w-4 h-4" /> TOLAK
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ==========================================
  // MAIN RENDER WITH NESTED SIDEBAR LAYOUT
  // ==========================================
  return (
    <div className="min-h-screen bg-sand dark:bg-gunmetal flex font-sans selection:bg-olive selection:text-gunmetal relative text-gunmetal dark:text-gray-200">

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAN SIDEBAR - TACTICAL */}
      <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-white dark:bg-black border-r border-gray-300 dark:border-gray-800 z-50 flex-shrink-0 flex flex-col shadow-2xl`}>
        {/* Brand */}
        <div className="p-6 border-b border-gray-300 dark:border-gray-800 flex items-center gap-4 bg-gray-100 dark:bg-[#111]">
          <div className="relative">
            <img src="/logo.png" alt="DART Logo" className="w-12 h-14 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
          </div>
          <div>
            <h1 className="font-stencil text-2xl tracking-widest text-gunmetal dark:text-white leading-none">HELPDESK-DART</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6">

          <div className="space-y-1">
            {/* Analytics Dashboard */}
            <button
              onClick={() => handleMenuClick('ANALYTICS')}
              className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
                ${activeMenu === 'ANALYTICS' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive shadow-[inset_0_0_20px_rgba(75,83,32,0.05)]' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}
              `}
            >
              <Radar className="w-5 h-5" /> TACTICAL OVERVIEW
            </button>

            {/* Manajemen Personel */}
            <button
              onClick={() => handleMenuClick('USERS')}
              className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
                ${activeMenu === 'USERS' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive shadow-[inset_0_0_20px_rgba(75,83,32,0.05)]' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}
              `}
            >
              <Users className="w-5 h-5" /> MANAJEMEN PERSONEL
            </button>

            {/* Persetujuan Personel Baru */}
            <button
              onClick={() => handleMenuClick('APPROVAL')}
              className={`w-full flex items-center justify-between px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
                ${activeMenu === 'APPROVAL' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive shadow-[inset_0_0_20px_rgba(75,83,32,0.05)]' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}
              `}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5" /> PERSETUJUAN PERSONEL
              </div>
              {dbUsers.filter((u: any) => !u.is_approved).length > 0 && (
                <span className="bg-targetred text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {dbUsers.filter((u: any) => !u.is_approved).length}
                </span>
              )}
            </button>

            {/* Log Sistem */}
            <button
              onClick={() => handleMenuClick('LOGS')}
              className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
                ${activeMenu === 'LOGS' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive shadow-[inset_0_0_20px_rgba(75,83,32,0.05)]' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}
              `}
            >
              <Database className="w-5 h-5" /> LOG & AKTIVITAS SISTEM
            </button>

            {/* Manajemen Laporan w/ Nested Sidebar Items */}
            <div>
              <button
                onClick={() => handleMenuClick('REPORTS')}
                className={`w-full flex items-center justify-between px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
                  ${activeMenu === 'REPORTS' ? 'bg-white dark:bg-[#1a2024] text-gunmetal dark:text-white border-olive' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <FileArchive className={`w-5 h-5 ${activeMenu === 'REPORTS' ? 'text-olive' : ''}`} />
                  MANAJEMEN LAPORAN
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isReportsExpanded ? 'rotate-180 text-olive' : ''}`} />
              </button>

              {/* Nested Sidebar Items (Sub-Menu) */}
              <div className={`overflow-hidden transition-all duration-300 bg-gray-100 dark:bg-[#111] border-y border-gray-300 dark:border-gray-800/50 ${isReportsExpanded ? 'max-h-40 py-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                <button
                  onClick={() => { setActiveMenu('REPORTS'); setActiveSubReport('KERUSAKAN'); }}
                  className={`w-full flex items-center gap-3 pl-14 pr-6 py-3 text-xs font-mono tracking-widest transition-colors
                    ${activeMenu === 'REPORTS' && activeSubReport === 'KERUSAKAN' ? 'text-olive bg-gray-200 dark:bg-gray-800/50' : 'text-gray-600 dark:text-gray-500 hover:text-gunmetal dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900/50'}
                  `}
                >
                  <ChevronRight className={`w-3 h-3 ${activeMenu === 'REPORTS' && activeSubReport === 'KERUSAKAN' ? 'opacity-100' : 'opacity-0'}`} />
                  LAPORAN KERUSAKAN
                </button>
                <button
                  onClick={() => { setActiveMenu('REPORTS'); setActiveSubReport('PERBAIKAN'); }}
                  className={`w-full flex items-center gap-3 pl-14 pr-6 py-3 text-xs font-mono tracking-widest transition-colors
                    ${activeMenu === 'REPORTS' && activeSubReport === 'PERBAIKAN' ? 'text-olive bg-gray-200 dark:bg-gray-800/50' : 'text-gray-600 dark:text-gray-500 hover:text-gunmetal dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900/50'}
                  `}
                >
                  <ChevronRight className={`w-3 h-3 ${activeMenu === 'REPORTS' && activeSubReport === 'PERBAIKAN' ? 'opacity-100' : 'opacity-0'}`} />
                  LAPORAN PERBAIKAN
                </button>
              </div>
            </div>

          </div>
        </nav>

        {/* Utilities */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-[#111]">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-500 hover:text-targetred hover:bg-red-900/20 mt-1 font-tactical text-sm tracking-wider transition-all rounded-sm">
            <LogOut className="w-5 h-5" /> LOGOUT
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Tactical Grid Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        {/* Topbar */}
        <header className="h-16 border-b border-gray-300 dark:border-gray-800 bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gunmetal dark:hover:text-white transition-colors -ml-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            
          </div>

          <div className="flex items-center gap-0 border border-gray-300 dark:border-gray-700 rounded overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-900 ml-auto">
            <div className="bg-white dark:bg-black px-4 py-1.5 text-right flex flex-col justify-center">
              <span className="block text-xs font-bold text-gunmetal dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'KOMANDAN PUSAT'}</span>
              <span className="block text-[9px] font-mono tracking-widest text-targetred">{currentUser?.id || 'ROOT-ACCESS'}</span>
            </div>
            <div className="w-10 h-full bg-sand dark:bg-gunmetal border-l border-gray-300 dark:border-gray-700 flex items-center justify-center p-2">
              <CircleUser className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">
            {activeMenu === 'ANALYTICS' && renderAnalyticsDashboard()}
            {activeMenu === 'REPORTS' && renderReportsDashboard()}
            {activeMenu === 'USERS' && renderUsersTable()}
            {activeMenu === 'LOGS' && renderLogsTable()}
            {activeMenu === 'APPROVAL' && renderApprovalTable()}
          </div>
        </div>
      </main>

      {/* DETAIL USER MODAL */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-sand dark:bg-gunmetal border-2 border-olive w-full max-w-lg shadow-[0_0_50px_rgba(75,83,32,0.4)]">
            <div className="p-4 border-b border-olive bg-olive/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-olive" />
                <h3 className="font-tactical font-bold text-olive tracking-widest uppercase">DETAIL DATA PERSONEL</h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-500 hover:text-targetred">✕</button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div className="col-span-2 flex items-center gap-4 mb-4 pb-4 border-b border-gray-300 dark:border-gray-800">
                  <div className="w-16 h-16 bg-olive/20 border border-olive flex items-center justify-center">
                    <Users className="w-8 h-8 text-olive" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-tighter">{selectedUser.id}</p>
                    <h4 className="text-xl font-bold text-gunmetal dark:text-white uppercase">{selectedUser.name}</h4>
                    <span className="text-[10px] font-mono bg-olive text-white px-2 py-0.5 tracking-widest">{selectedUser.role.toUpperCase()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-1 tracking-widest uppercase">Username</label>
                  <p className="text-sm font-mono font-bold text-gunmetal dark:text-white">{selectedUser.username}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-1 tracking-widest uppercase">NRP / NIP</label>
                  <p className="text-sm font-mono font-bold text-gunmetal dark:text-white">{selectedUser.nrp_nip || '-'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-1 tracking-widest uppercase">No. WhatsApp</label>
                  <p className="text-sm font-mono font-bold text-gunmetal dark:text-white">{selectedUser.no_wa || '-'}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-1 tracking-widest uppercase">Asal Satuan</label>
                  <p className="text-sm font-mono font-bold text-gunmetal dark:text-white uppercase">{selectedUser.asal_satuan || '-'}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-1 tracking-widest uppercase">Spesialisasi</label>
                  <p className={`text-sm font-mono font-bold p-2 bg-gray-200 dark:bg-black/40 border border-gray-300 dark:border-gray-800 ${selectedUser.role !== 'Teknisi' ? 'text-gray-500 italic' : 'text-gunmetal dark:text-blue-400'}`}>
                    {selectedUser.role === 'Teknisi' ? (selectedUser.spesialisasi || 'BELUM DIATUR') : 'TIDAK TERSEDIA (NON-TEKNISI)'}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-800 flex justify-end">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="bg-gunmetal dark:bg-black text-white px-8 py-2 font-tactical font-bold tracking-widest hover:bg-gray-800 transition-colors border border-gray-600"
                >
                  TUTUP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-sand dark:bg-gunmetal border-2 border-targetred w-full max-w-sm shadow-[0_0_50px_rgba(200,30,30,0.4)] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-targetred bg-targetred/10 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-targetred animate-pulse" />
              <h3 className="font-tactical font-bold text-targetred tracking-widest uppercase">KONFIRMASI PENGHAPUSAN</h3>
            </div>
            <div className="p-6">
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed uppercase">
                PERINGATAN: Anda akan menghapus akses personil <span className="text-targetred font-bold underline">{userToDelete.name}</span> dari basis data sistem utama. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  onClick={confirmDeleteUser}
                  className="bg-targetred text-white py-2 font-tactical font-bold tracking-widest hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(200,30,30,0.3)]"
                >
                  HAPUS AKSES
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-transparent border border-gray-500 text-gray-500 py-2 font-tactical font-bold tracking-widest hover:bg-gray-500/10 transition-all"
                >
                  BATAL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-sand dark:bg-gunmetal border-2 border-olive w-full max-w-md shadow-[0_0_50px_rgba(75,83,32,0.3)] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-olive bg-olive/10 flex justify-between items-center">
              <h3 className="font-tactical font-bold text-olive tracking-widest uppercase">PENGATURAN PERSONEL</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-targetred">✕</button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-600 dark:text-gray-400 mb-1 tracking-widest uppercase">NRP / NIP</label>
                  <input
                    type="text"
                    value={data.nrp_nip}
                    onChange={(e) => setData('nrp_nip', e.target.value)}
                    className={`w-full bg-white dark:bg-black border ${errors.nrp_nip ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} p-2 text-sm font-mono focus:border-olive outline-none uppercase`}
                    placeholder="MASUKKAN NRP/NIP"
                    required
                    minLength={8}
                  />
                  {errors.nrp_nip && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.nrp_nip}</p>}
                </div>

                {isAddMode ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-600 dark:text-gray-400 mb-1 tracking-widest uppercase">Username</label>
                      <input
                        type="text"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        className={`w-full bg-white dark:bg-black border ${errors.username ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} p-2 text-sm font-mono focus:border-olive outline-none uppercase`}
                        required
                        autoComplete="off"
                      />
                      {errors.username && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.username}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-600 dark:text-gray-400 mb-1 tracking-widest uppercase">Password</label>
                      <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={`w-full bg-white dark:bg-black border ${errors.password ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} p-2 text-sm font-mono focus:border-olive outline-none`}
                        required={isAddMode}
                        autoComplete="new-password"
                        minLength={8}
                      />
                      {errors.password && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.password}</p>}
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-900/50 p-2 border border-gray-300 dark:border-gray-800 flex flex-col justify-center">
                    <label className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest">Username (Locked)</label>
                    <p className="text-xs font-mono font-bold text-gray-600 dark:text-gray-400">{data.username}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono text-gray-600 dark:text-gray-400 mb-1 tracking-widest uppercase">Nama Lengkap</label>
                  <input
                    type="text"
                    value={data.nama_lengkap}
                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                    className={`w-full bg-white dark:bg-black border ${errors.nama_lengkap ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} p-2 text-sm font-mono focus:border-olive outline-none`}
                    required
                  />
                  {errors.nama_lengkap && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.nama_lengkap}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-600 dark:text-gray-400 mb-1 tracking-widest uppercase">Hak Akses (Role)</label>
                  <select
                    value={data.role_id}
                    onChange={(e) => setData('role_id', e.target.value)}
                    className={`w-full bg-white dark:bg-black border ${errors.role_id ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} p-2 text-sm font-mono focus:border-olive outline-none`}
                    required
                  >
                    <option value="">PILIH ROLE</option>
                    {dbRoles?.map((role: any) => (
                      <option key={role.id} value={role.id}>{role.name.toUpperCase()}</option>
                    ))}
                  </select>
                  {errors.role_id && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.role_id}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-600 dark:text-gray-400 mb-1 tracking-widest uppercase">No. WhatsApp</label>
                  <input
                    type="text"
                    value={data.no_wa}
                    onChange={(e) => setData('no_wa', e.target.value)}
                    className="w-full bg-white dark:bg-black border border-gray-400 dark:border-gray-700 p-2 text-sm font-mono focus:border-olive outline-none"
                    placeholder="08..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-600 dark:text-gray-400 mb-1 tracking-widest uppercase">Asal Satuan</label>
                  <input
                    type="text"
                    value={data.asal_satuan}
                    onChange={(e) => setData('asal_satuan', e.target.value)}
                    className="w-full bg-white dark:bg-black border border-gray-400 dark:border-gray-700 p-2 text-sm font-mono focus:border-olive outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-600 dark:text-gray-400 mb-1 tracking-widest uppercase">
                    Spesialisasi {dbRoles?.find((r: any) => r.id == data.role_id)?.name !== 'Teknisi' && '(KHUSUS TEKNISI)'}
                  </label>
                  <input
                    type="text"
                    value={data.spesialisasi}
                    onChange={(e) => setData('spesialisasi', e.target.value)}
                    disabled={dbRoles?.find((r: any) => r.id == data.role_id)?.name !== 'Teknisi'}
                    className={`w-full bg-white dark:bg-black border border-gray-400 dark:border-gray-700 p-2 text-sm font-mono focus:border-olive outline-none ${dbRoles?.find((r: any) => r.id == data.role_id)?.name !== 'Teknisi' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder={dbRoles?.find((r: any) => r.id == data.role_id)?.name !== 'Teknisi' ? 'NON-TEKNISI' : 'MISAL: JARINGAN / HARDWARE'}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-olive text-white py-2 font-tactical font-bold tracking-widest hover:bg-camogreen transition-colors disabled:opacity-50"
                >
                  {processing ? 'MEMPROSES...' : (isAddMode ? 'DAFTARKAN PERSONEL' : 'SIMPAN PERUBAHAN')}
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-transparent border border-gray-500 text-gray-500 py-2 font-tactical font-bold tracking-widest hover:bg-gray-500/10 transition-colors">
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
