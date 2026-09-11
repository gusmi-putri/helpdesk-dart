import React, { useState, useMemo } from 'react';
import { Activity, Download, Calendar } from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  Tooltip as RechartsTooltip, Legend, BarChart,
  CartesianGrid, XAxis, YAxis, Bar, AreaChart, Area
} from 'recharts';

interface AnalyticsSectionProps {
  dbCases: any[];
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ dbCases }) => {
  const [timeFilter, setTimeFilter] = useState<'7_DAYS' | '30_DAYS' | 'THIS_YEAR' | 'ALL_TIME'>('30_DAYS');

  const filteredCases = useMemo(() => {
    const now = new Date();
    return dbCases.filter((c: any) => {
      if (timeFilter === 'ALL_TIME') return true;
      if (!c.created_at) return false;
      const createdAt = new Date(c.created_at);
      if (timeFilter === '7_DAYS') {
        const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }
      if (timeFilter === '30_DAYS') {
        const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 30;
      }
      if (timeFilter === 'THIS_YEAR') {
        return createdAt.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [dbCases, timeFilter]);

  const statusCounts = {
    PENDING: 0,
    DIVERIFIKASI: 0,
    DITERIMA_TEKNISI: 0,
    DIPROSES: 0,
    SELESAI: 0,
    DITOLAK: 0
  };
  const urgencyCounts: any = {};
  const unitCounts: any = {};

  // New Analytics variables
  const trendCounts: any = {};
  const techCounts: any = {};
  let totalResolutionTime = 0;
  let resolvedCount = 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  filteredCases.forEach((c: any) => {
    // Status
    if (c.status === 'PENDING') statusCounts.PENDING++;
    else if (c.status === 'DIVERIFIKASI') statusCounts.DIVERIFIKASI++;
    else if (c.status === 'DITERIMA TEKNISI') statusCounts.DITERIMA_TEKNISI++;
    else if (c.status === 'DIPROSES') statusCounts.DIPROSES++;
    else if (c.status === 'SELESAI') statusCounts.SELESAI++;
    else if (c.status === 'DITOLAK') statusCounts.DITOLAK++;

    // Urgency
    const urgency = c.kerusakan?.urgensi || 'NORMAL';
    urgencyCounts[urgency] = (urgencyCounts[urgency] || 0) + 1;

    // Unit/Lokasi
    const lokasi = c.unit?.satuan?.nama_satuan || c.kerusakan?.lokasi || 'Unknown';
    unitCounts[lokasi] = (unitCounts[lokasi] || 0) + 1;

    // 30 Days Trend
    if (c.created_at) {
      const createdAt = new Date(c.created_at);
      if (createdAt >= thirtyDaysAgo) {
        // adjust for timezone offset to get local YYYY-MM-DD reliably
        const offset = createdAt.getTimezoneOffset();
        const localDate = new Date(createdAt.getTime() - (offset * 60 * 1000));
        const dateStr = localDate.toISOString().split('T')[0];
        trendCounts[dateStr] = (trendCounts[dateStr] || 0) + 1;
      }
    }

    // Technician Performance
    if (c.teknisi) {
      const techName = c.teknisi.nama_lengkap;
      if (!techCounts[techName]) {
        techCounts[techName] = { name: techName, Selesai: 0, Proses: 0 };
      }
      if (c.status === 'SELESAI') {
        techCounts[techName].Selesai++;
      } else if (c.status !== 'DITOLAK') {
        techCounts[techName].Proses++;
      }
    }

    // Average Resolution Time
    if (c.status === 'SELESAI' && c.tanggal_selesai_perbaikan && c.created_at) {
      const start = new Date(c.created_at).getTime();
      const end = new Date(c.tanggal_selesai_perbaikan).getTime();
      const diffDays = (end - start) / (1000 * 3600 * 24);
      if (diffDays >= 0) {
        totalResolutionTime += diffDays;
        resolvedCount++;
      }
    }
  });

  const avgResolutionTime = resolvedCount > 0 ? (totalResolutionTime / resolvedCount).toFixed(1) : '0';

  const statusData = [
    { name: 'PENDING', value: statusCounts.PENDING, color: '#f59e0b' },
    { name: 'DIVERIFIKASI', value: statusCounts.DIVERIFIKASI, color: '#3b82f6' },
    { name: 'DITERIMA TEKNISI', value: statusCounts.DITERIMA_TEKNISI, color: '#8b5cf6' },
    { name: 'DIPROSES', value: statusCounts.DIPROSES, color: '#06b6d4' },
    { name: 'SELESAI', value: statusCounts.SELESAI, color: '#10b981' },
    { name: 'DITOLAK', value: statusCounts.DITOLAK, color: '#ef4444' }
  ].filter(s => s.value > 0);

  const urgencyData = Object.keys(urgencyCounts).map(key => ({
    name: key,
    value: urgencyCounts[key]
  }));

  // Formatting Data for New Charts
  // 1. Trend Data (fill missing days within 30 days)
  const trendData = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    const dateStr = localDate.toISOString().split('T')[0];

    // Convert YYYY-MM-DD to DD MMM for display
    const [, month, day] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const displayDate = `${day} ${months[parseInt(month) - 1]}`;

    trendData.push({
      date: displayDate,
      laporan: trendCounts[dateStr] || 0
    });
  }

  // 2. Tech Data (Top 5-10)
  const techData = Object.values(techCounts)
    .sort((a: any, b: any) => (b.Selesai + b.Proses) - (a.Selesai + a.Proses))
    .slice(0, 10);

  // 3. Location Data (Top 5)
  const locationData = Object.keys(unitCounts)
    .map(key => ({ name: key, value: unitCounts[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const handleExportCSV = () => {
    if (filteredCases.length === 0) {
      alert("Tidak ada data untuk diekspor pada rentang waktu ini.");
      return;
    }
    const headers = ["ID Laporan", "Waktu Dibuat", "Satuan", "Barang/Unit", "Pelapor", "Status", "Urgensi", "Teknisi"];
    const rows = filteredCases.map((c: any) => {
      const id = c.case_id || `LPR-${String(c.id).padStart(5, '0')}`;
      const time = c.created_at ? new Date(c.created_at).toLocaleString('id-ID') : '-';
      const satuan = c.unit?.satuan?.nama_satuan || '-';
      const unit = c.unit?.nomor_seri ? `${c.unit.nomor_seri} (${c.unit.jenis})` : c.kerusakan?.lokasi || '-';
      const pelapor = c.pelapor?.nama_lengkap || '-';
      const status = c.status;
      const urgensi = c.kerusakan?.urgensi || 'NORMAL';
      const teknisi = c.teknisi?.nama_lengkap || '-';
      
      return [id, time, satuan, unit, pelapor, status, urgensi, teknisi]
        .map(field => `"${String(field).replace(/"/g, '""')}"`)
        .join(",");
    });
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Laporan_${timeFilter}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest flex items-center gap-3">
          <Activity className="text-cighra-primary dark:text-cighra-gold w-6 h-6" /> RINGKASAN OPERASIONAL
        </h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 rounded-sm overflow-hidden">
            <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-600 text-slate-500">
              <Calendar size={16} />
            </div>
            <select
              value={timeFilter}
              onChange={(e: any) => setTimeFilter(e.target.value)}
              className="bg-transparent text-sm font-mono text-slate-700 dark:text-slate-300 border-none focus:ring-0 py-2 pl-3 pr-8"
            >
              <option value="7_DAYS">7 Hari Terakhir</option>
              <option value="30_DAYS">30 Hari Terakhir</option>
              <option value="THIS_YEAR">Tahun Ini</option>
              <option value="ALL_TIME">Semua Waktu</option>
            </select>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900 px-4 py-2 text-sm font-tactical uppercase tracking-wider hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-colors shadow-md rounded-sm"
          >
            <Download size={16} /> Ekspor CSV
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-cighra-darkcard/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-500/30 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-cighra-primary dark:bg-cighra-gold group-hover:h-1.5 transition-all duration-300"></div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2 group-hover:text-cighra-primary dark:group-hover:text-cighra-gold transition-colors">Laporan Baru</span>
          <span className="text-4xl font-tactical font-bold text-cighra-primary dark:text-cighra-gold drop-shadow-md">{statusCounts.PENDING}</span>
        </div>
        <div className="bg-white/80 dark:bg-cighra-darkcard/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-500/30 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 group-hover:h-1.5 transition-all duration-300"></div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">Sedang Diproses</span>
          <span className="text-4xl font-tactical font-bold text-blue-500 drop-shadow-md">{statusCounts.DIVERIFIKASI + statusCounts.DITERIMA_TEKNISI + statusCounts.DIPROSES}</span>
        </div>
        <div className="bg-white/80 dark:bg-cighra-darkcard/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-500/30 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-camogreen group-hover:h-1.5 transition-all duration-300"></div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2 text-center group-hover:text-camogreen transition-colors">Telah Selesai</span>
          <span className="text-4xl font-tactical font-bold text-camogreen drop-shadow-md">{statusCounts.SELESAI}</span>
        </div>
        <div className="bg-white/80 dark:bg-cighra-darkcard/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-500/30 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-600 dark:bg-amber-500 group-hover:h-1.5 transition-all duration-300"></div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2 text-center group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">Avg. Resolusi (Hari)</span>
          <span className="text-4xl font-tactical font-bold text-amber-600 dark:text-amber-500 drop-shadow-md">{avgResolutionTime}</span>
        </div>
      </div>

      {/* Charts Row 1: Trend & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart (Takes up 2 columns on lg) */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-cighra-darkcard/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-500/30 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:border-cighra-primary/50 dark:hover:border-cighra-gold/50 transition-all duration-300 group">
          <h3 className="text-xs font-tactical font-bold text-gunmetal dark:text-slate-300 tracking-widest mb-6 uppercase border-b border-slate-200 dark:border-slate-600 pb-2">Tren Laporan Masuk (30 Hari Terakhir)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorLaporan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3166" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1E3166" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} minTickGap={20} />
                <YAxis stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} allowDecimals={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1a2024', border: '1px solid #1E3166', color: '#fff' }} />
                <Area type="monotone" dataKey="laporan" stroke="#1E3166" fillOpacity={1} fill="url(#colorLaporan)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Status Chart */}
        <div className="bg-white/80 dark:bg-cighra-darkcard/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-500/30 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:border-cighra-primary/50 dark:hover:border-cighra-gold/50 transition-all duration-300 group">
          <h3 className="text-xs font-tactical font-bold text-gunmetal dark:text-slate-300 tracking-widest mb-6 uppercase border-b border-slate-200 dark:border-slate-600 pb-2">Status Penanganan Laporan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
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
      </div>

      {/* Charts Row 2: Location, Tech, Urgency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Location Chart */}
        <div className="bg-white/80 dark:bg-cighra-darkcard/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-500/30 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:border-cighra-primary/50 dark:hover:border-cighra-gold/50 transition-all duration-300 group">
          <h3 className="text-xs font-tactical font-bold text-gunmetal dark:text-slate-300 tracking-widest mb-6 uppercase border-b border-slate-200 dark:border-slate-600 pb-2">Top 5 Lokasi Kerusakan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={locationData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} width={80} />
                <RechartsTooltip cursor={{ fill: 'rgba(30,49,102,0.1)' }} contentStyle={{ backgroundColor: '#1a2024', border: '1px solid #1E3166', color: '#fff' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Technician Performance Chart */}
        <div className="bg-white/80 dark:bg-cighra-darkcard/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-500/30 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:border-cighra-primary/50 dark:hover:border-cighra-gold/50 transition-all duration-300 group">
          <h3 className="text-xs font-tactical font-bold text-gunmetal dark:text-slate-300 tracking-widest mb-6 uppercase border-b border-slate-200 dark:border-slate-600 pb-2">Beban Kerja Teknisi (Top 10)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={techData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} tick={{ fontSize: 10 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} allowDecimals={false} />
                <RechartsTooltip cursor={{ fill: 'rgba(30,49,102,0.1)' }} contentStyle={{ backgroundColor: '#1a2024', border: '1px solid #1E3166', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Bar dataKey="Proses" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Selesai" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-cighra-darkcard/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-500/30 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:border-cighra-primary/50 dark:hover:border-cighra-gold/50 transition-all duration-300 group">
          <h3 className="text-xs font-tactical font-bold text-gunmetal dark:text-slate-300 tracking-widest mb-6 uppercase border-b border-slate-200 dark:border-slate-600 pb-2">Klasifikasi Urgensi</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={urgencyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} allowDecimals={false} />
                <RechartsTooltip cursor={{ fill: 'rgba(30,49,102,0.1)' }} contentStyle={{ backgroundColor: '#1a2024', border: '1px solid #1E3166', color: '#fff' }} />
                <Bar dataKey="value" className="fill-[#1E3166] dark:fill-[#E6C21F]" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;

