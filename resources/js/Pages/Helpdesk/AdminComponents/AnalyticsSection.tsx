import React from 'react';
import { Activity } from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  Tooltip as RechartsTooltip, Legend, BarChart,
  CartesianGrid, XAxis, YAxis, Bar
} from 'recharts';

interface AnalyticsSectionProps {
  dbCases: any[];
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ dbCases }) => {
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

  dbCases.forEach((c: any) => {
    // Status
    if (c.status === 'PENDING') statusCounts.PENDING++;
    else if (c.status === 'DIVERIFIKASI') statusCounts.DIVERIFIKASI++;
    else if (c.status === 'DITERIMA TEKNISI') statusCounts.DITERIMA_TEKNISI++;
    else if (c.status === 'DIPROSES') statusCounts.DIPROSES++;
    else if (c.status === 'SELESAI') statusCounts.SELESAI++;
    else if (c.status === 'DITOLAK') statusCounts.DITOLAK++;

    // Urgency
    const urgency = c.kerusakan.urgensi || 'NORMAL';
    urgencyCounts[urgency] = (urgencyCounts[urgency] || 0) + 1;

    // Unit/Lokasi
    const lokasi = c.kerusakan.lokasi || 'Unknown';
    unitCounts[lokasi] = (unitCounts[lokasi] || 0) + 1;
  });

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest flex items-center gap-3 mb-6">
        <Activity className="text-cighra-primary dark:text-cighra-gold w-6 h-6" /> RINGKASAN OPERASIONAL
      </h2>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900"></div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2">Laporan Baru</span>
          <span className="text-4xl font-tactical font-bold text-cighra-primary dark:text-cighra-gold">{statusCounts.PENDING}</span>
        </div>
        <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2">Sedang Diproses</span>
          <span className="text-4xl font-tactical font-bold text-blue-500">{statusCounts.DIVERIFIKASI + statusCounts.DITERIMA_TEKNISI + statusCounts.DIPROSES}</span>
        </div>
        <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-camogreen"></div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2">Telah Selesai</span>
          <span className="text-4xl font-tactical font-bold text-camogreen">{statusCounts.SELESAI}</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 p-6 shadow-lg">
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

        {/* Urgency Chart */}
        <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 p-6 shadow-lg">
          <h3 className="text-xs font-tactical font-bold text-gunmetal dark:text-slate-300 tracking-widest mb-6 uppercase border-b border-slate-200 dark:border-slate-600 pb-2">Klasifikasi Urgensi</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
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

export default AnalyticsSection;
