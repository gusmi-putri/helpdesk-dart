import React, { useState } from 'react';
import { 
  ShieldAlert, Users, Database, FileText, Printer, Search, 
  Edit, Trash2, Shield, Activity, BarChart3, Settings, LogOut,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

type MenuTab = 'USERS' | 'LOGS' | 'REPORTS' | 'SETTINGS';

const DashboardAdmin: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuTab>('REPORTS');
  const navigate = useNavigate();

  // Data dari Global Store
  const currentUser = useStore(state => state.currentUser);
  const MOCK_USERS = useStore(state => state.users);
  const MOCK_LOGS = useStore(state => state.logs);
  const MOCK_REPORTS = useStore(state => state.reports);
  const logoutAction = useStore(state => state.logout);
  
  // Handlers
  const handlePrintPDF = () => {
    console.log("Mempersiapkan dokumen PDF untuk dicetak...");
    window.print();
  };

  const handleEditUser = (name: string) => alert(`Membuka panel edit untuk petugas: ${name}`);
  const handleDeleteUser = (name: string) => {
    const confirm = window.confirm(`PERINGATAN PROTOKOL: Yakin ingin menghapus akses ${name} dari Sistem Utama?`);
    if (confirm) console.log(`Data ${name} dihapus.`);
  };

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };
  // ==========================================
  // VIEW RENDERERS
  // ==========================================

  const renderUsersTable = () => (
    <div className="bg-black/60 border border-gray-700 rounded-sm overflow-hidden shadow-xl mt-6">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-black/40">
        <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-2">
          <Users className="text-olive w-5 h-5" /> REPOSITORI PERSONEL
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
          <input type="text" placeholder="Cari ID / Nama..." className="bg-gunmetal border border-gray-600 pl-9 pr-4 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-camogreen w-64" />
        </div>
      </div>
      <table className="w-full text-left font-sans text-sm">
        <thead className="bg-[#1a2024] text-gray-400 font-tactical tracking-widest border-b border-gray-700">
          <tr>
            <th className="p-4">ID PERSONEL</th>
            <th className="p-4">NAMA LENGKAP</th>
            <th className="p-4">HAK AKSES / ROLE</th>
            <th className="p-4">STATUS AKTIF</th>
            <th className="p-4">JEJAK LOGIN</th>
            <th className="p-4 text-right">TINDAKAN OTO.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {MOCK_USERS.map((u) => (
            <tr key={u.id} className="hover:bg-gray-800/30 transition-colors">
              <td className="p-4 font-mono text-gray-400">{u.id}</td>
              <td className="p-4 text-white font-bold">{u.name}</td>
              <td className="p-4">
                <span className={`px-2 py-0.5 text-xs font-mono font-bold tracking-wider
                  ${u.role === 'Admin' ? 'bg-red-900/50 text-targetred border border-targetred' : 
                    u.role === 'Staf' ? 'bg-olive/40 text-[#b5cb5c] border border-olive' :
                    u.role === 'Teknisi' ? 'bg-blue-900/40 text-blue-400 border border-blue-700' :
                    'bg-gray-800 text-gray-300 border border-gray-600'}
                `}>
                  {u.role.toUpperCase()}
                </span>
              </td>
              <td className="p-4">
                <span className={`flex items-center gap-1.5 ${u.status === 'Aktif' ? 'text-green-500' : 'text-gray-500'}`}>
                   <span className={`w-2 h-2 rounded-full ${u.status === 'Aktif' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                   {u.status}
                </span>
              </td>
              <td className="p-4 text-gray-500 text-xs">{u.lastLogin}</td>
              <td className="p-4 flex gap-2 justify-end">
                <button onClick={() => handleEditUser(u.name)} className="p-1.5 bg-gray-800 hover:bg-olive text-gray-300 hover:text-white transition-colors border border-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteUser(u.name)} className="p-1.5 bg-gray-800 hover:bg-targetred text-gray-300 hover:text-white transition-colors border border-gray-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderLogsTable = () => (
    <div className="bg-black border border-gray-800 rounded-sm overflow-hidden shadow-2xl mt-6 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 z-10"></div>
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#111]">
        <h3 className="text-gray-300 font-mono font-bold text-base tracking-widest flex items-center gap-2">
          <Database className="text-gray-500 w-5 h-5" /> /var/log/system_activity.log
        </h3>
        <span className="text-[10px] text-green-500 border border-green-800 px-2 animate-pulse bg-green-900/20">LIVE TAIL ACTIVE</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#0a0a0a] text-gray-500 border-b border-gray-800">
            <tr>
              <th className="p-3">TIMESTAMP</th>
              <th className="p-3">LEVEL</th>
              <th className="p-3">IDENTITAS (USER)</th>
              <th className="p-3 w-1/2">PAYLOAD AKTIVITAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900 text-gray-400 bg-black">
            {MOCK_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-gray-900/50">
                <td className="p-3">{log.time}</td>
                <td className="p-3">
                  <span className={`
                    ${log.level === 'SUCCESS' ? 'text-green-500' : ''}
                    ${log.level === 'ALERT' ? 'text-targetred font-bold' : ''}
                    ${log.level === 'WARN' ? 'text-yellow-500' : ''}
                    ${log.level === 'INFO' ? 'text-blue-400' : ''}
                  `}>
                    [{log.level}]
                  </span>
                </td>
                <td className="p-3">{log.user}</td>
                <td className="p-3 text-gray-300 break-words">{log.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReportsDashboard = () => (
    <div className="mt-6 space-y-6">
      
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'TOTAL LAPORAN', val: '142', color: 'border-blue-500', text: 'text-blue-400', icon: FileText },
          { title: 'PENDING / KRITIS', val: '12', color: 'border-targetred', text: 'text-targetred', icon: AlertCircle },
          { title: 'SEDANG DIPROSES', val: '28', color: 'border-yellow-500', text: 'text-yellow-500', icon: Activity },
          { title: 'SELESAI (BULAN INI)', val: '102', color: 'border-green-500', text: 'text-green-500', icon: CheckCircle2 },
        ].map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div key={i} className={`bg-black/40 border-t-2 ${stat.color} p-5 shadow-lg relative overflow-hidden group`}>
              <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity w-24 h-24 ${stat.text}`}>
                <IconComponent className="w-full h-full" />
              </div>
              <p className="text-gray-400 font-tactical tracking-widest text-xs mb-1">{stat.title}</p>
              <h3 className={`font-mono text-4xl font-bold ${stat.text}`}>{stat.val}</h3>
            </div>
          );
        })}
      </div>

      {/* REPORTS TABLE */}
      <div className="bg-black/60 border border-gray-700 rounded-sm shadow-xl">
        <div className="p-4 border-b border-gray-700 flex flex-wrap gap-4 justify-between items-center bg-black/40">
          <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-2">
            <BarChart3 className="text-olive w-5 h-5" /> REKAPITULASI LAPORAN GLOBAL
          </h3>
          <button 
            onClick={handlePrintPDF}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-tactical px-4 py-2 text-sm tracking-wider flex items-center gap-2 transition-colors print:hidden"
          >
            <Printer className="w-4 h-4" /> EKSPOR DOKUMEN (PDF)
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-[#1a2024] text-gray-400 font-tactical tracking-widest border-b border-gray-700">
              <tr>
                <th className="p-4">ID TIKET</th>
                <th className="p-4">TANGGAL</th>
                <th className="p-4">LOKASI & OBJEK</th>
                <th className="p-4">TEKNISI PENANGGUNG JAWAB</th>
                <th className="p-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {MOCK_REPORTS.map((r) => (
                <tr key={r.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-mono text-gray-300 border-l-2 border-transparent hover:border-olive">{r.id}</td>
                  <td className="p-4 text-xs font-mono">{r.tanggalLapor}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{r.barangRusak}</div>
                    <div className="text-xs text-gray-500 mt-1">{r.lokasi}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs border ${r.namaTeknisi ? 'bg-black text-gray-300 border-gray-600' : 'bg-red-900/20 text-red-400 border-red-900/50 italic'}`}>
                      {r.namaTeknisi || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 font-mono text-[10px] font-bold tracking-widest border
                      ${r.status === 'SELESAI' ? 'bg-green-900/30 text-green-500 border-green-800' : 
                        r.status === 'DIPROSES' ? 'bg-yellow-900/30 text-yellow-500 border-yellow-800' :
                        'bg-targetred text-white border-transparent animate-pulse'}
                    `}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


  // ==========================================
  // MAIN RENDER WITH SIDEBAR LAYOUT
  // ==========================================
  return (
    <div className="min-h-screen bg-gunmetal flex font-sans selection:bg-olive selection:text-white relative print:bg-white text-gray-200">
      
      {/* SIDEBAR NAVIGATION - Hidden during print */}
      <aside className="w-64 bg-black border-r border-gray-800 relative z-20 flex-shrink-0 flex flex-col print:hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <Shield className="w-8 h-8 text-targetred" />
          <div>
            <h1 className="font-stencil text-2xl tracking-widest text-white leading-none">ROOT</h1>
            <span className="text-[10px] font-mono text-gray-500 block mt-1 tracking-widest">COMMAND DASHBOARD</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="px-2 text-xs font-tactical font-bold tracking-widest text-gray-600 mb-4">MENU LALU LINTAS DATA</p>
          
          <button 
            onClick={() => setActiveMenu('REPORTS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-tactical text-sm font-bold tracking-wider transition-all
              ${activeMenu === 'REPORTS' ? 'bg-olive text-white shadow-[0_0_15px_rgba(75,83,32,0.4)]' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}
            `}
          >
            <BarChart3 className="w-5 h-5" /> PANTAUAN LAPORAN
          </button>
          
          <button 
            onClick={() => setActiveMenu('USERS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-tactical text-sm font-bold tracking-wider transition-all
              ${activeMenu === 'USERS' ? 'bg-olive text-white shadow-[0_0_15px_rgba(75,83,32,0.4)]' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}
            `}
          >
            <Users className="w-5 h-5" /> MANAJEMEN PERSONEL
          </button>
          
          <button 
            onClick={() => setActiveMenu('LOGS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-tactical text-sm font-bold tracking-wider transition-all
              ${activeMenu === 'LOGS' ? 'bg-olive text-white shadow-[0_0_15px_rgba(75,83,32,0.4)]' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}
            `}
          >
            <Database className="w-5 h-5" /> LOG & AKTIVITAS SISTEM
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
           <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-targetred hover:bg-red-950/20 font-tactical text-sm font-bold tracking-wider transition-all rounded-sm">
              <Settings className="w-5 h-5" /> KONFIGURASI
           </button>
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-gray-900 mt-1 font-tactical text-sm font-bold tracking-wider transition-all rounded-sm">
              <LogOut className="w-5 h-5" /> TERMINASI SESI
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 border-b border-gray-800 bg-black/50 backdrop-blur-sm flex items-center justify-between px-8 flex-shrink-0 print:hidden">
           <h2 className="font-mono text-sm text-gray-400 tracking-widest hidden sm:block">STATUS JARINGAN: <span className="text-green-500 font-bold">AMAN & TERENKRIPSI</span></h2>
           <div className="flex items-center gap-3 bg-gray-900 pl-4 border border-gray-700">
             <div className="text-right py-1">
               <span className="block text-xs font-bold text-white uppercase font-sans">{currentUser?.name || 'Komandan Pusat'}</span>
               <span className="block text-[10px] font-mono tracking-widest text-targetred">Otoritas Penuh ({currentUser?.id || 'ROOT'})</span>
             </div>
             <div className="w-10 h-10 bg-gunmetal border-l border-gray-700 flex items-center justify-center">
               <ShieldAlert className="w-5 h-5 text-gray-400" />
             </div>
           </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          
          <div className="max-w-7xl mx-auto print:m-0 print:max-w-none">
            {/* Dynamic Rendering Based on State */}
            {activeMenu === 'REPORTS' && renderReportsDashboard()}
            {activeMenu === 'USERS' && renderUsersTable()}
            {activeMenu === 'LOGS' && renderLogsTable()}
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
