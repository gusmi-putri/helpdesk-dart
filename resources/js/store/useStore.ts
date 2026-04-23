import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==========================================
// INTERFACES & TYPES
// ==========================================
export type Role = 'Admin' | 'Pelapor' | 'Staf' | 'Teknisi';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  status: string;
  lastLogin: string;
}

export type ReportStatus = 'PENDING' | 'DIPROSES' | 'SELESAI';

export interface Report {
  id: string;
  tanggalLapor: string;
  pelapor: string;
  lokasi: string;
  barangRusak: string;
  deskripsi: string;
  status: ReportStatus;
  idTeknisi: string | null;
  namaTeknisi: string | null;
  waktuPenyelesaian: string | null;
  catatanTeknisi: string | null;
  isNewUpdate: boolean;
}

export interface ActivityLog {
  id: string;
  time: string;
  level: 'INFO' | 'WARN' | 'ALERT' | 'SUCCESS';
  user: string;
  activity: string;
}

// ==========================================
// MOCK DATA INITIALIZATION
// ==========================================
const MOCK_USERS: User[] = [
  { id: 'USR-001', username: 'admin', name: 'Komandan Pusat', role: 'Admin', status: 'Aktif', lastLogin: 'Baru saja' },
  { id: 'USR-002', username: 'pelapor1', name: 'Pos Pantau Alpha', role: 'Pelapor', status: 'Aktif', lastLogin: '2 Jam lalu' },
  { id: 'USR-003', username: 'staf1', name: 'Staf Komando 01', role: 'Staf', status: 'Aktif', lastLogin: '5 Menit lalu' },
  { id: 'USR-004', username: 'teknisi1', name: 'Teknisi Alfa', role: 'Teknisi', status: 'Aktif', lastLogin: '1 Hari lalu' },
];

const INITIAL_REPORTS: Report[] = [
  {
    id: 'REP-7781',
    tanggalLapor: '21 April 2026, 08:30',
    pelapor: 'Pos Pantau Alpha',
    lokasi: 'Menara Utara',
    barangRusak: 'Kamera Thermal Sektor Utara',
    deskripsi: 'Kamera memberikan tampilan blank memancarkan artefak hitam setelah cuaca buruk.',
    status: 'PENDING',
    idTeknisi: null,
    namaTeknisi: null,
    waktuPenyelesaian: null,
    catatanTeknisi: null,
    isNewUpdate: false,
  },
  {
    id: 'REP-7782',
    tanggalLapor: '21 April 2026, 09:15',
    pelapor: 'Gudang Logistik',
    lokasi: 'Bunker Bawah Tanah',
    barangRusak: 'Sensor Pintu Baja Taktis',
    deskripsi: 'Pintu baja otomatis macet total. Pemindai RF-ID berkedip merah terus-menerus.',
    status: 'PENDING',
    idTeknisi: null,
    namaTeknisi: null,
    waktuPenyelesaian: null,
    catatanTeknisi: null,
    isNewUpdate: false,
  },
];

const INITIAL_LOGS: ActivityLog[] = [
  { id: 'LOG-1087', time: new Date().toLocaleString('id-ID'), level: 'INFO', user: 'Sistem', activity: 'Sistem Command Center DART diaktifkan.' },
];

// ==========================================
// ZUSTAND STORE
// ==========================================
interface AppState {
  // States
  users: User[];
  reports: Report[];
  logs: ActivityLog[];
  currentUser: User | null;
  theme: 'dark' | 'light';
  
  // Actions
  login: (username: string) => User | null;
  logout: () => void;
  
  addReport: (pelapor: string, lokasi: string, barangRusak: string, deskripsi: string) => void;
  assignTechnician: (reportId: string, technicianId: string) => void;
  completeReport: (reportId: string, catatan: string, statusAkhir: string) => void;
  addLog: (level: ActivityLog['level'], user: string, activity: string) => void;
  markReportAsViewed: (reportId: string) => void;
  toggleTheme: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: MOCK_USERS,
      reports: INITIAL_REPORTS,
      logs: INITIAL_LOGS,
      currentUser: null,
      theme: 'dark',

      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      login: (username) => {
        const user = get().users.find((u) => u.username === username);
        if (user) {
          set({ currentUser: user });
          get().addLog('INFO', `${user.role} (${user.id})`, `Berhasil login ke dalam jaringan lokal.`);
          return user;
        }
        get().addLog('ALERT', 'Sistem', `Upaya login gagal untuk kredensial: ${username}`);
        return null;
      },

      logout: () => {
        const user = get().currentUser;
        if (user) {
          get().addLog('INFO', `${user.role} (${user.id})`, `Sesi diakhiri secara manual.`);
        }
        set({ currentUser: null });
      },

      addReport: (pelapor, lokasi, barangRusak, deskripsi) => {
        const newReport: Report = {
          id: `REP-${Math.floor(8000 + Math.random() * 1000)}`,
          tanggalLapor: new Date().toLocaleString('id-ID'),
          pelapor,
          lokasi,
          barangRusak,
          deskripsi,
          status: 'PENDING',
          idTeknisi: null,
          namaTeknisi: null,
          waktuPenyelesaian: null,
          catatanTeknisi: null,
          isNewUpdate: false,
        };
        
        set((state) => ({ reports: [newReport, ...state.reports] }));
        get().addLog('WARN', pelapor, `Mengajukan laporan tiket kerusakan baru: ${newReport.id}`);
      },

      assignTechnician: (reportId, technicianId) => {
        const technician = get().users.find(u => u.id === technicianId);
        if (!technician) return;

        set((state) => ({
          reports: state.reports.map(r => 
            r.id === reportId 
              ? { ...r, status: 'DIPROSES', idTeknisi: technician.id, namaTeknisi: technician.name, isNewUpdate: true }
              : r
          )
        }));

        const user = get().currentUser;
        const actor = user ? `${user.role} (${user.id})` : 'Sistem';
        get().addLog('INFO', actor, `Menugaskan teknisi ${technician.name} untuk tiket ${reportId}`);
      },

      completeReport: (reportId, catatan, statusAkhir) => {
        set((state) => ({
          reports: state.reports.map(r => 
            r.id === reportId 
              ? { ...r, status: 'SELESAI', catatanTeknisi: catatan, waktuPenyelesaian: new Date().toLocaleString('id-ID') }
              : r
          )
        }));

        const user = get().currentUser;
        const actor = user ? `${user.role} (${user.id})` : 'Teknisi Lapangan';
        const lvl = statusAkhir.includes('Tertunda') ? 'WARN' : 'SUCCESS';
        get().addLog(lvl, actor, `Menutup LHK untuk tiket ${reportId} dengan status: ${statusAkhir}`);
      },

      addLog: (level, user, activity) => {
        const log: ActivityLog = {
          id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
          time: new Date().toLocaleString('id-ID'),
          level,
          user,
          activity
        };
        set((state) => ({ logs: [log, ...state.logs] }));
      },

      markReportAsViewed: (reportId) => {
        set((state) => ({
          reports: state.reports.map(r => 
            r.id === reportId ? { ...r, isNewUpdate: false } : r
          )
        }));
      }
    }),
    {
      name: 'helpdesk-dart-storage-v2', 
    }
  )
);
