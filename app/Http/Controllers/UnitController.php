<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\UnitMutation;
use App\Models\SystemLog;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    /**
     * Store: If Admin → create directly. If Staf → create mutation request (pending).
     */
    public function store(Request $request)
    {
        $request->validate([
            'nomor_seri' => 'required|string|max:50|unique:units',
            'nama_dart' => 'required|string|max:100',
            'jenis_dart' => 'required|in:DART STD,DART STK,SKE,MOVING TARGET',
            'asal_satuan' => 'required|string|max:100',
            'status_unit' => 'required|in:Siap Ops,Beroperasi,Rusak,Perbaikan,Nonaktif',
            'document' => 'nullable|file|mimes:pdf,png,jpg,jpeg|max:10240',
        ]);

        $user = auth()->user();
        $isAdmin = $user->role && $user->role->nama_role === 'Admin';

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('mutations/documents', 'public');
        }

        if ($isAdmin) {
            // Admin: langsung buat unit
            $unit = Unit::create($request->only(['nomor_seri', 'nama_dart', 'jenis_dart', 'asal_satuan', 'status_unit']));

            UnitMutation::create([
                'unit_id' => $unit->id,
                'type' => 'approved_add',
                'reason' => 'Ditambahkan langsung oleh Admin.',
                'document_path' => $documentPath,
                'requested_by' => $user->id,
                'approved_by' => $user->id,
                'status' => 'approved',
                'unit_data' => $request->only(['nomor_seri', 'nama_dart', 'jenis_dart', 'asal_satuan', 'status_unit']),
            ]);

            SystemLog::log('INFO', $user->id, "Admin menambahkan unit DART baru: {$request->nomor_seri} - {$request->nama_dart}");
            return redirect()->back()->with('message', 'Unit DART berhasil ditambahkan.');
        } else {
            // Staff: buat pengajuan (pending)
            UnitMutation::create([
                'unit_id' => null,
                'type' => 'request_add',
                'reason' => $request->input('reason', 'Pengajuan penambahan unit baru.'),
                'document_path' => $documentPath,
                'requested_by' => $user->id,
                'status' => 'pending',
                'unit_data' => $request->only(['nomor_seri', 'nama_dart', 'jenis_dart', 'asal_satuan', 'status_unit']),
            ]);

            SystemLog::log('INFO', $user->id, "Staf mengajukan penambahan unit DART baru: {$request->nomor_seri} - {$request->nama_dart}");
            return redirect()->back()->with('message', 'Pengajuan penambahan unit telah dikirim. Menunggu persetujuan Admin.');
        }
    }

    public function update(Request $request, Unit $unit)
    {
        $request->validate([
            'nomor_seri' => 'required|string|max:50|unique:units,nomor_seri,' . $unit->id,
            'nama_dart' => 'required|string|max:100',
            'jenis_dart' => 'required|in:DART STD,DART STK,SKE,MOVING TARGET',
            'asal_satuan' => 'required|string|max:100',
            'status_unit' => 'required|in:Siap Ops,Beroperasi,Rusak,Perbaikan,Nonaktif',
        ]);

        $unit->update($request->all());

        SystemLog::log('INFO', auth()->id(), "Memperbarui data unit DART: {$unit->nomor_seri}");

        return redirect()->back()->with('message', 'Data unit DART telah diperbarui.');
    }

    /**
     * Destroy: Admin langsung soft-delete. Staf harus melalui requestDelete.
     */
    public function destroy(Unit $unit)
    {
        $info = "{$unit->nomor_seri} - {$unit->nama_dart}";

        UnitMutation::create([
            'unit_id' => $unit->id,
            'type' => 'approved_delete',
            'reason' => 'Dihapus langsung oleh Admin.',
            'requested_by' => auth()->id(),
            'approved_by' => auth()->id(),
            'status' => 'approved',
            'unit_data' => $unit->toArray(),
        ]);

        $unit->delete(); // SoftDeletes

        SystemLog::log('ALERT', auth()->id(), "Admin menghapus unit DART: {$info}");
        return redirect()->back()->with('message', 'Unit DART telah diarsipkan.');
    }

    /**
     * Staff mengajukan penghapusan unit (pending approval).
     */
    public function requestDelete(Request $request, Unit $unit)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
            'document' => 'nullable|file|mimes:pdf,png,jpg,jpeg|max:10240',
        ]);

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('mutations/documents', 'public');
        }

        // Check if there's already a pending delete request for this unit
        $existingPending = UnitMutation::where('unit_id', $unit->id)
            ->where('type', 'request_delete')
            ->where('status', 'pending')
            ->exists();

        if ($existingPending) {
            return redirect()->back()->with('message', 'Sudah ada pengajuan penghapusan yang menunggu persetujuan untuk unit ini.');
        }

        UnitMutation::create([
            'unit_id' => $unit->id,
            'type' => 'request_delete',
            'reason' => $request->input('reason'),
            'document_path' => $documentPath,
            'requested_by' => auth()->id(),
            'status' => 'pending',
            'unit_data' => $unit->toArray(),
        ]);

        SystemLog::log('INFO', auth()->id(), "Staf mengajukan penghapusan unit DART: {$unit->nomor_seri} - {$unit->nama_dart}");
        return redirect()->back()->with('message', 'Pengajuan penghapusan telah dikirim. Menunggu persetujuan Admin.');
    }

    /**
     * Admin menyetujui pengajuan mutasi (tambah atau hapus).
     */
    public function approveMutation(Request $request, UnitMutation $mutation)
    {
        if ($mutation->status !== 'pending') {
            return redirect()->back()->with('message', 'Pengajuan ini sudah diproses sebelumnya.');
        }

        $adminNotes = $request->input('admin_notes', '');

        if ($mutation->type === 'request_add') {
            // Create the unit from stored data
            $unitData = $mutation->unit_data;
            $unit = Unit::create([
                'nomor_seri' => $unitData['nomor_seri'],
                'nama_dart' => $unitData['nama_dart'],
                'jenis_dart' => $unitData['jenis_dart'],
                'asal_satuan' => $unitData['asal_satuan'],
                'status_unit' => $unitData['status_unit'] ?? 'Beroperasi',
            ]);

            $mutation->update([
                'unit_id' => $unit->id,
                'type' => 'approved_add',
                'status' => 'approved',
                'approved_by' => auth()->id(),
                'admin_notes' => $adminNotes,
            ]);

            SystemLog::log('INFO', auth()->id(), "Admin menyetujui penambahan unit DART: {$unit->nomor_seri}");
        } elseif ($mutation->type === 'request_delete') {
            $unit = Unit::find($mutation->unit_id);
            if ($unit) {
                $unit->delete(); // SoftDeletes

                $mutation->update([
                    'type' => 'approved_delete',
                    'status' => 'approved',
                    'approved_by' => auth()->id(),
                    'admin_notes' => $adminNotes,
                ]);

                SystemLog::log('ALERT', auth()->id(), "Admin menyetujui penghapusan unit DART: {$unit->nomor_seri}");
            }
        }

        return redirect()->back()->with('message', 'Pengajuan telah disetujui.');
    }

    /**
     * Admin menolak pengajuan mutasi.
     */
    public function rejectMutation(Request $request, UnitMutation $mutation)
    {
        if ($mutation->status !== 'pending') {
            return redirect()->back()->with('message', 'Pengajuan ini sudah diproses sebelumnya.');
        }

        $mutation->update([
            'type' => $mutation->type === 'request_add' ? 'rejected_add' : 'rejected_delete',
            'status' => 'rejected',
            'approved_by' => auth()->id(),
            'admin_notes' => $request->input('admin_notes', 'Ditolak tanpa catatan.'),
        ]);

        SystemLog::log('INFO', auth()->id(), "Admin menolak pengajuan mutasi #{$mutation->id}");

        return redirect()->back()->with('message', 'Pengajuan telah ditolak.');
    }

    /**
     * Admin mengembalikan unit dari arsip (restore soft-deleted unit).
     */
    public function restoreUnit(Request $request, $unitId)
    {
        $unit = Unit::onlyTrashed()->findOrFail($unitId);
        $unit->restore();

        UnitMutation::create([
            'unit_id' => $unit->id,
            'type' => 'restore',
            'reason' => $request->input('reason', 'Dikembalikan dari arsip oleh Admin.'),
            'requested_by' => auth()->id(),
            'approved_by' => auth()->id(),
            'status' => 'approved',
            'unit_data' => $unit->toArray(),
        ]);

        SystemLog::log('INFO', auth()->id(), "Admin mengembalikan unit DART dari arsip: {$unit->nomor_seri}");
        return redirect()->back()->with('message', 'Unit berhasil dikembalikan dari arsip.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:5120',
        ], [
            'file.required' => 'Silakan pilih file CSV terlebih dahulu.',
            'file.mimes' => 'Format file tidak didukung. Gunakan format CSV (.csv). Jika menggunakan Excel, simpan dengan "Save As > CSV".',
            'file.max' => 'Ukuran file terlalu besar. Maksimal 5MB.',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getPathname(), "r");

        if (!$handle) {
            return redirect()->back()->with('import_result', json_encode([
                'success' => false,
                'message' => 'Gagal membaca file. Pastikan file tidak rusak.',
            ]));
        }

        $header = true;
        $imported = 0;
        $skipped = 0;
        $totalRows = 0;

        while ($row = fgetcsv($handle, 1000, ",")) {
            if ($header) {
                $header = false;
                continue;
            }

            $totalRows++;

            if (count($row) < 4) continue;

            $nomor_seri = trim($row[0]);
            $nama_dart = trim($row[1]);
            $jenis_dart = trim($row[2]);
            $asal_satuan = trim($row[3]);
            $status_unit = isset($row[4]) ? trim($row[4]) : 'Siap Ops';

            if (empty($nomor_seri)) continue;

            if (Unit::where('nomor_seri', $nomor_seri)->exists()) {
                $skipped++;
                continue;
            }

            $validJenis = ['DART STD', 'DART STK', 'SKE', 'MOVING TARGET'];
            if (!in_array(strtoupper($jenis_dart), $validJenis)) {
                $jenis_dart = 'DART STD';
            } else {
                $jenis_dart = strtoupper($jenis_dart);
            }

            $validStatus = ['Siap Ops', 'Rusak', 'Perbaikan', 'Nonaktif'];
            $status_unit = ucwords(strtolower($status_unit));
            if (!in_array($status_unit, $validStatus)) {
                $status_unit = 'Siap Ops';
            }

            Unit::create([
                'nomor_seri' => $nomor_seri,
                'nama_dart' => strtoupper($nama_dart),
                'jenis_dart' => $jenis_dart,
                'asal_satuan' => strtoupper($asal_satuan),
                'status_unit' => $status_unit
            ]);

            $imported++;
        }

        fclose($handle);

        SystemLog::log('INFO', auth()->id(), "Import massal DART: {$imported} berhasil ditambahkan, {$skipped} duplikat dilewati.");

        return redirect()->back()->with('import_result', json_encode([
            'success' => true,
            'imported' => $imported,
            'skipped' => $skipped,
            'total' => $totalRows,
        ]));
    }
}
