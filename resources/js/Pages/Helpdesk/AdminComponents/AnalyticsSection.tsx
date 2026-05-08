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
  const statusCounts = { PENDING: 0, PROSES: 0, SELESAI: 0 };
  const urgencyCounts: any = {};
  const unitCounts: any = {};

  dbCases.forEach((c: any) => {
    // Status
    if (c.status === 'PENDING') statusCounts.PENDING++;
    else if (c.status === 'PROSES') statusCounts.PROSES++;
    else if (c.status === 'SELESAI') statusCounts.SELESAI++;

    // Urgency
    const urgency = c.kerusakan.urgensi || 'NORMAL';
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white tracking-widest flex items-center gap-3 mb-6">
        <Activity className="text-olive w-6 h-6" /> RINGKASAN OPERASIONAL
      </h2>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-sand/30 dark:bg-black/40 border border-soft-gunmetal/10 dark:border-soft-sand/5 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-targetred"></div>
          <span className="text-[10px] font-mono text-soft-gunmetal/60 dark:text-soft-sand/40 uppercase tracking-widest mb-2">Laporan Baru</span>
          <span className="text-4xl font-tactical font-bold text-targetred">{statusCounts.PENDING}</span>
        </div>
        <div className="bg-sand/30 dark:bg-black/40 border border-soft-gunmetal/10 dark:border-soft-sand/5 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <span className="text-[10px] font-mono text-soft-gunmetal/60 dark:text-soft-sand/40 uppercase tracking-widest mb-2">Sedang Diproses</span>
          <span className="text-4xl font-tactical font-bold text-blue-500">{statusCounts.PROSES}</span>
        </div>
        <div className="bg-sand/30 dark:bg-black/40 border border-soft-gunmetal/10 dark:border-soft-sand/5 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-camogreen"></div>
          <span className="text-[10px] font-mono text-soft-gunmetal/60 dark:text-soft-sand/40 uppercase tracking-widest mb-2">Telah Selesai</span>
          <span className="text-4xl font-tactical font-bold text-camogreen">{statusCounts.SELESAI}</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-sand/30 dark:bg-black/40 border border-soft-gunmetal/10 dark:border-soft-sand/5 p-6 shadow-lg">
          <h3 className="text-xs font-tactical font-bold text-gunmetal dark:text-soft-sand tracking-widest mb-6 uppercase border-b border-soft-gunmetal/10 dark:border-soft-sand/5 pb-2">Status Penanganan Laporan</h3>
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
        <div className="bg-sand/30 dark:bg-black/40 border border-soft-gunmetal/10 dark:border-soft-sand/5 p-6 shadow-lg">
          <h3 className="text-xs font-tactical font-bold text-gunmetal dark:text-soft-sand tracking-widest mb-6 uppercase border-b border-soft-gunmetal/10 dark:border-soft-sand/5 pb-2">Klasifikasi Urgensi</h3>
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

export default AnalyticsSection;
