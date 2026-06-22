<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $dokumenAnggaran = $this->dokumen_anggaran
            ? collect(json_decode($this->dokumen_anggaran, true) ?? [$this->dokumen_anggaran])
                ->map(fn($path) => asset('storage/' . $path))
                ->toArray()
            : [];

        return [
            'caseId' => 'LPR-' . str_pad($this->id, 5, '0', STR_PAD_LEFT),
            'db_id' => $this->id,
            'unit_id' => $this->unit_id,
            'status' => strtoupper($this->status_laporan),
            'kerusakan' => [
                'tanggal' => $this->tanggal_lapor ? $this->tanggal_lapor->format('d F Y, H:i') : '-',
                'pelapor_id' => $this->user_id,
                'pelapor' => $this->pelapor ? $this->pelapor->nama_lengkap : 'Unknown',
                'lokasi' => $this->lokasi_laporan ?? ($this->unit ? $this->unit->asal_satuan : 'Unknown'),
                'barangRusak' => $this->unit ? $this->unit->nomor_seri : 'Unknown',
                'deskripsi' => $this->deskripsi_kerusakan,
                'klasifikasi' => $this->klasifikasi ?? ($this->tingkat_kerusakan ?? 'RINGAN'),
                'tingkatKerusakan' => $this->tingkat_kerusakan ?? ($this->klasifikasi ?? '-'),
                'urgensi' => $this->urgensi ?? '-',
                'jenisPerbaikan' => $this->jenis_perbaikan ?? 'Swadaya',
                'dokumenAnggaran' => $dokumenAnggaran,
                'keteranganAnggaran' => $this->keterangan_anggaran,
                'foto_bukti' => $this->file_bukti && !json_decode($this->file_bukti) ? asset('storage/reports/' . $this->file_bukti) : null,
                'fileBukti' => $this->file_bukti ? collect(json_decode($this->file_bukti, true) ?? [])->map(fn($path) => asset('storage/' . $path))->toArray() : [],
            ],
            'perbaikan' => [
                'teknisi_id' => $this->teknisi_id,
                'teknisi' => $this->teknisi ? $this->teknisi->nama_lengkap : null,
                'teknisi_wa' => $this->teknisi ? $this->teknisi->no_wa : null,
                'tanggalPenanganan' => $this->tgl_ditunjuk ? $this->tgl_ditunjuk->format('d F Y, H:i') : null,
                'tanggalSelesai' => $this->tgl_selesai ? $this->tgl_selesai->format('d F Y, H:i') : null,
                'tindakan' => $this->catatan_teknisi,
                'metodePerbaikan' => $this->metode_perbaikan, 
                'foto_bukti_selesai' => $this->file_bukti_selesai ? asset('storage/reports/' . $this->file_bukti_selesai) : null,
                'video_bukti_selesai' => $this->file_bukti_selesai_video ? asset('storage/reports/' . $this->file_bukti_selesai_video) : null,
                'alasanPenolakan' => $this->alasan_penolakan,
                'statusPerbaikan' => strtoupper($this->status_laporan),
            ]
        ];
    }
}
