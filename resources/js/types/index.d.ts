export interface User {
  id: number;
  username: string;
  email: string;
  nama_lengkap: string;
  nrp_nip: string;
  asal_satuan: string;
  satuan_id: number;
  no_wa: string;
  spesialisasi: string;
  role_id: number;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  role?: Role;
  satuan?: Satuan;
}

export interface Role {
  id: number;
  name: string;
}

export interface Satuan {
  id: number;
  nama_satuan: string;
  singkatan: string;
  lokasi: string;
  latitude?: number;
  longitude?: number;
  kepala_satuan?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: number;
  nama_unit: string;
  nomor_seri: string;
  satuan_id: number;
  status_kondisi: string;
  kategori: string;
  tahun_pengadaan: number;
  lokasi_spesifik: string;
  is_active: boolean;
  satuan?: Satuan;
}

export interface Report {
  db_id: number;
  caseId: string;
  status: string;
  kerusakan: {
    pelapor: string;
    tanggal: string;
    urgensi: string;
    tingkatKerusakan: string;
    barangRusak: string;
    jenisPerbaikan: string;
    lokasi: string;
    deskripsi: string;
    foto_bukti: string;
    fileBukti?: string[];
    tautan_video?: string;
    pelapor_satuan_id?: number;
    unit_satuan_id?: number;
    dokumen_anggaran?: string;
    keterangan_anggaran?: string;
  };
  perbaikan: {
    teknisi: string | null;
    tanggalDikerjakan?: string;
    tanggalSelesai?: string;
    metodePerbaikan?: string;
    catatan?: string;
    foto_bukti_selesai?: string;
    tautan_video_selesai?: string;
  };
  unit?: Unit;
}

export interface Mutation {
  id: number;
  type: string;
  status: string;
  payload: any;
  requested_by: number;
  reviewed_by?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  requester?: User;
  reviewer?: User;
}

export interface Feedback {
  id: number;
  report_id: number;
  user_id: number;
  rating: number;
  komentar: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  report?: Report;
  user?: User;
}

export interface Log {
  id: number;
  user_id: number;
  action: string;
  model_type: string;
  model_id: number;
  payload: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
  user?: User;
}
