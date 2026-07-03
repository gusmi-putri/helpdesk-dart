<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\UnitMutation;
use App\Models\SystemLog;
use App\Models\Satuan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreUnitRequest;
use App\Services\FileUploadService;

class UnitController extends Controller
{
    protected FileUploadService $fileService;

    public function __construct(FileUploadService $fileService)
    {
        $this->fileService = $fileService;
    }
    /**
     * Store: If Admin → create directly. If Staf → create mutation request (pending).
     */
    public function store(StoreUnitRequest $request)
    {
        $user = auth()->user();
        $isAdmin = $user->role && $user->role->nama_role === 'Admin';

        $documentName = $this->fileService->uploadSingleFile($request->file('document'), 'mutations/documents');
        $documentPath = $documentName ? 'mutations/documents/' . $documentName : null;

        DB::transaction(function () use ($request, $user, $isAdmin, $documentPath) {
            if ($isAdmin) {
                // Admin: langsung buat unit
                $unit = Unit::create($request->only(['nomor_seri', 'jenis', 'asal_satuan', 'satuan_id', 'status_unit']));

                UnitMutation::create([
                    'unit_id' => $unit->id,
                    'type' => 'approved_add',
                    'reason' => 'Ditambahkan langsung oleh Admin.',
                    'document_path' => $documentPath,
                    'requested_by' => $user->id,
                    'approved_by' => $user->id,
                    'status' => 'approved',
                    'unit_data' => $request->only(['nomor_seri', 'jenis', 'asal_satuan', 'satuan_id', 'status_unit']),
                ]);

                SystemLog::log('INFO', $user->id, "Admin menambahkan unit DART baru: {$request->nomor_seri}");
            } else {
                // Staff: buat pengajuan (pending)
                UnitMutation::create([
                    'unit_id' => null,
                    'type' => 'request_add',
                    'reason' => $request->input('reason', 'Pengajuan penambahan unit baru.'),
                    'document_path' => $documentPath,
                    'requested_by' => $user->id,
                    'status' => 'pending',
                    'unit_data' => $request->only(['nomor_seri', 'jenis', 'asal_satuan', 'satuan_id', 'status_unit']),
                ]);

                SystemLog::log('INFO', $user->id, "Staf mengajukan penambahan unit DART baru: {$request->nomor_seri}");
            }
        });

        $message = $isAdmin 
            ? 'Unit DART berhasil ditambahkan.' 
            : 'Pengajuan penambahan unit telah dikirim. Menunggu persetujuan Admin.';

        return redirect()->back()->with('message', $message);
    }

    public function update(Request $request, Unit $unit)
    {
        $request->validate([
            'nomor_seri' => 'required|string|max:50|unique:units,nomor_seri,' . $unit->id,
            'jenis' => 'required|in:DART STD,DART STK,DART Portabel - Swing,DART Portabel - Pop,DART Portabel - Flip,DART Marathon Target,Moving Target',
            'asal_satuan' => 'nullable|string|max:100',
            'satuan_id' => 'required|exists:satuans,id',
            'status_unit' => 'required|in:Beroperasi,Rusak,Perbaikan,Nonaktif',
        ]);

        $user = auth()->user();
        $isAdmin = $user->role && $user->role->nama_role === 'Admin';

        if ($isAdmin) {
            $unit->update($request->all());
            SystemLog::log('INFO', $user->id, "Memperbarui data unit DART secara langsung: {$unit->nomor_seri}");
            return redirect()->back()->with('message', 'Data unit DART telah diperbarui.');
        } else {
            // Staf: Check if there's already a pending edit request for this unit
            $existingPending = UnitMutation::where('unit_id', $unit->id)
                ->where('type', 'request_edit')
                ->where('status', 'pending')
                ->exists();

            if ($existingPending) {
                return redirect()->back()->with('error', 'Sudah ada pengajuan pembaruan yang menunggu persetujuan untuk unit ini.');
            }

            UnitMutation::create([
                'unit_id' => $unit->id,
                'type' => 'request_edit',
                'reason' => $request->input('reason', 'Pengajuan pembaruan data unit.'),
                'requested_by' => $user->id,
                'status' => 'pending',
                'unit_data' => $request->only(['nomor_seri', 'jenis', 'asal_satuan', 'satuan_id', 'status_unit']),
            ]);

            SystemLog::log('INFO', $user->id, "Staf mengajukan pembaruan unit DART: {$unit->nomor_seri}");
            return redirect()->back()->with('message', 'Pengajuan pembaruan unit telah dikirim. Menunggu persetujuan Admin.');
        }
    }

    /**
     * Destroy: Admin langsung soft-delete. Staf harus melalui requestDelete.
     */
    public function destroy(Unit $unit)
    {
        $info = "{$unit->nomor_seri}";

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

    public function destroyBatch(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:units,id',
        ]);

        $userId = auth()->id();
        $unitIds = $request->input('ids');

        DB::transaction(function () use ($unitIds, $userId) {
            $units = Unit::whereIn('id', $unitIds)->get();

            foreach ($units as $unit) {
                UnitMutation::create([
                    'unit_id' => $unit->id,
                    'type' => 'approved_delete',
                    'reason' => 'Dihapus langsung secara massal oleh Admin.',
                    'requested_by' => $userId,
                    'approved_by' => $userId,
                    'status' => 'approved',
                    'unit_data' => $unit->toArray(),
                ]);

                $unit->delete();
            }

            $count = count($unitIds);
            SystemLog::log('ALERT', $userId, "Admin menghapus secara massal {$count} unit DART.");
        });

        return redirect()->back()->with('message', 'Unit DART terpilih telah diarsipkan secara massal.');
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

        DB::transaction(function () use ($unit, $request, $documentPath) {
            UnitMutation::create([
                'unit_id' => $unit->id,
                'type' => 'request_delete',
                'reason' => $request->input('reason'),
                'document_path' => $documentPath,
                'requested_by' => auth()->id(),
                'status' => 'pending',
                'unit_data' => $unit->toArray(),
            ]);

            SystemLog::log('INFO', auth()->id(), "Staf mengajukan penghapusan unit DART: {$unit->nomor_seri}");
        });
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
        $unitIndex = $request->input('unit_index'); // Individual unit index (0-based)
        $unitIndices = $request->input('unit_indices'); // Array of indices (0-based)

        DB::transaction(function () use ($mutation, $adminNotes, $unitIndex, $unitIndices) {
            if ($mutation->type === 'request_add') {
                $unitData = $mutation->unit_data;
                $isBatch = isset($unitData[0]) && is_array($unitData[0]);

                if ($isBatch) {
                    // If a list of indices is provided
                    if (is_array($unitIndices)) {
                        foreach ($unitIndices as $idx) {
                            $idx = (int)$idx;
                            if (isset($unitData[$idx]) && $unitData[$idx]['status'] === 'pending') {
                                $u = $unitData[$idx];
                                $satuan = Satuan::where('nama_satuan', strtoupper($u['asal_satuan']))->first();
                                $unit = Unit::create([
                                    'nomor_seri' => $u['nomor_seri'],
                                    'jenis' => $u['jenis'],
                                    'asal_satuan' => strtoupper($u['asal_satuan']),
                                    'satuan_id' => $satuan ? $satuan->id : null,
                                    'status_unit' => in_array($u['status_unit'] ?? '', ['Beroperasi', 'Rusak', 'Perbaikan', 'Nonaktif']) ? $u['status_unit'] : 'Beroperasi',
                                ]);
                                $unitData[$idx]['status'] = 'approved';
                                $unitData[$idx]['unit_id'] = $unit->id;
                            }
                        }
                    }
                    // If a single index is provided
                    elseif (isset($unitIndex)) {
                        $idx = (int)$unitIndex;
                        if (isset($unitData[$idx]) && $unitData[$idx]['status'] === 'pending') {
                            $u = $unitData[$idx];
                            $satuan = Satuan::where('nama_satuan', strtoupper($u['asal_satuan']))->first();
                            $unit = Unit::create([
                                'nomor_seri' => $u['nomor_seri'],
                                'jenis' => $u['jenis'],
                                'asal_satuan' => strtoupper($u['asal_satuan']),
                                'satuan_id' => $satuan ? $satuan->id : null,
                                'status_unit' => in_array($u['status_unit'] ?? '', ['Beroperasi', 'Rusak', 'Perbaikan', 'Nonaktif']) ? $u['status_unit'] : 'Beroperasi',
                            ]);
                            $unitData[$idx]['status'] = 'approved';
                            $unitData[$idx]['unit_id'] = $unit->id;
                        }
                    }
                    // If nothing is provided, approve all remaining pending units
                    else {
                        foreach ($unitData as $idx => $u) {
                            if ($u['status'] === 'pending') {
                                $satuan = Satuan::where('nama_satuan', strtoupper($u['asal_satuan']))->first();
                                $unit = Unit::create([
                                    'nomor_seri' => $u['nomor_seri'],
                                    'jenis' => $u['jenis'],
                                    'asal_satuan' => strtoupper($u['asal_satuan']),
                                    'satuan_id' => $satuan ? $satuan->id : null,
                                    'status_unit' => in_array($u['status_unit'] ?? '', ['Beroperasi', 'Rusak', 'Perbaikan', 'Nonaktif']) ? $u['status_unit'] : 'Beroperasi',
                                ]);
                                $unitData[$idx]['status'] = 'approved';
                                $unitData[$idx]['unit_id'] = $unit->id;
                            }
                        }
                    }

                    // Check if all items in batch are resolved (no longer pending)
                    $anyPending = false;
                    foreach ($unitData as $u) {
                        if ($u['status'] === 'pending') {
                            $anyPending = true;
                            break;
                        }
                    }

                    $mutation->unit_data = $unitData;
                    if (!$anyPending) {
                        $mutation->status = 'approved';
                        $mutation->approved_by = auth()->id();
                        $mutation->admin_notes = $adminNotes ?: 'Persetujuan massal selesai.';
                    }
                    $mutation->save();

                    SystemLog::log('INFO', auth()->id(), "Admin memproses persetujuan penambahan massal unit DART.");
                } else {
                    // Single unit request
                    $satuanId = isset($unitData['satuan_id']) ? $unitData['satuan_id'] : null;
                    if (!$satuanId && isset($unitData['asal_satuan'])) {
                        $satuan = Satuan::where('nama_satuan', strtoupper($unitData['asal_satuan']))->first();
                        if ($satuan) {
                            $satuanId = $satuan->id;
                        }
                    }
                    $unit = Unit::create([
                        'nomor_seri' => $unitData['nomor_seri'],
                        'jenis' => $unitData['jenis'],
                        'asal_satuan' => strtoupper($unitData['asal_satuan']),
                        'satuan_id' => $satuanId,
                        'status_unit' => in_array($unitData['status_unit'] ?? '', ['Beroperasi', 'Rusak', 'Perbaikan', 'Nonaktif']) ? $unitData['status_unit'] : 'Beroperasi',
                    ]);

                    $mutation->update([
                        'unit_id' => $unit->id,
                        'type' => 'approved_add',
                        'status' => 'approved',
                        'approved_by' => auth()->id(),
                        'admin_notes' => $adminNotes,
                    ]);

                    SystemLog::log('INFO', auth()->id(), "Admin menyetujui penambahan unit DART: {$unit->nomor_seri}");
                }
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
            } elseif ($mutation->type === 'request_edit') {
                $unit = Unit::find($mutation->unit_id);
                if ($unit) {
                    $unitData = $mutation->unit_data;
                    $unit->update([
                        'nomor_seri' => $unitData['nomor_seri'],
                        'jenis' => $unitData['jenis'],
                        'asal_satuan' => strtoupper($unitData['asal_satuan']),
                        'satuan_id' => $unitData['satuan_id'],
                        'status_unit' => $unitData['status_unit'],
                    ]);

                    $mutation->update([
                        'type' => 'approved_edit',
                        'status' => 'approved',
                        'approved_by' => auth()->id(),
                        'admin_notes' => $adminNotes,
                    ]);

                    SystemLog::log('INFO', auth()->id(), "Admin menyetujui pembaruan unit DART: {$unit->nomor_seri}");
                }
            }
        });

        return redirect()->back()->with('message', 'Pengajuan telah diproses.');
    }

    /**
     * Admin menolak pengajuan mutasi.
     */
    public function rejectMutation(Request $request, UnitMutation $mutation)
    {
        if ($mutation->status !== 'pending') {
            return redirect()->back()->with('message', 'Pengajuan ini sudah diproses sebelumnya.');
        }

        $unitIndex = $request->input('unit_index');
        $adminNotes = $request->input('admin_notes', 'Ditolak.');

        if ($mutation->type === 'request_add') {
            $unitData = $mutation->unit_data;
            $isBatch = isset($unitData[0]) && is_array($unitData[0]);

            if ($isBatch) {
                if (isset($unitIndex)) {
                    $idx = (int)$unitIndex;
                    if (isset($unitData[$idx]) && $unitData[$idx]['status'] === 'pending') {
                        $unitData[$idx]['status'] = 'rejected';
                    }
                } else {
                    // Reject all sisa
                    foreach ($unitData as $idx => $u) {
                        if ($u['status'] === 'pending') {
                            $unitData[$idx]['status'] = 'rejected';
                        }
                    }
                }

                // Check if all items in batch are resolved
                $anyPending = false;
                foreach ($unitData as $u) {
                    if ($u['status'] === 'pending') {
                        $anyPending = true;
                        break;
                    }
                }

                $mutation->unit_data = $unitData;
                if (!$anyPending) {
                    $mutation->status = 'rejected';
                    $mutation->approved_by = auth()->id();
                    $mutation->admin_notes = $adminNotes;
                }
                $mutation->save();

                SystemLog::log('INFO', auth()->id(), "Admin menolak penambahan massal unit DART.");
            } else {
                $mutation->update([
                    'type' => 'rejected_add',
                    'status' => 'rejected',
                    'approved_by' => auth()->id(),
                    'admin_notes' => $adminNotes,
                ]);
                SystemLog::log('INFO', auth()->id(), "Admin menolak pengajuan mutasi #{$mutation->id}");
            }
        } elseif ($mutation->type === 'request_delete') {
            $mutation->update([
                'type' => 'rejected_delete',
                'status' => 'rejected',
                'approved_by' => auth()->id(),
                'admin_notes' => $adminNotes,
            ]);
            SystemLog::log('INFO', auth()->id(), "Admin menolak pengajuan penghapusan unit DART.");
        } elseif ($mutation->type === 'request_edit') {
            $mutation->update([
                'type' => 'rejected_edit',
                'status' => 'rejected',
                'approved_by' => auth()->id(),
                'admin_notes' => $adminNotes,
            ]);
            SystemLog::log('INFO', auth()->id(), "Admin menolak pengajuan pembaruan unit DART.");
        }

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
            'document' => 'required|file|mimes:pdf,png,jpg,jpeg|max:10240',
        ], [
            'file.required' => 'Silakan pilih file CSV terlebih dahulu.',
            'file.mimes' => 'Format file tidak didukung. Gunakan format CSV (.csv). Jika menggunakan Excel, simpan dengan "Save As > CSV".',
            'file.max' => 'Ukuran file terlalu besar. Maksimal 5MB.',
            'document.required' => 'Surat pendukung wajib diunggah.',
            'document.mimes' => 'Format file dokumen tidak didukung. Gunakan PDF/PNG/JPG/JPEG.',
            'document.max' => 'Ukuran file dokumen terlalu besar. Maksimal 10MB.',
        ]);

        $file = $request->file('file');
        $documentPath = $request->file('document')->store('mutations/documents', 'public');

        $skipped = 0;
        $parsedUnits = $this->parseUnitCsv($file->getPathname(), $skipped);

        if (empty($parsedUnits) && $skipped === 0) {
            return redirect()->back()->with('import_result', json_encode([
                'success' => false,
                'message' => 'Gagal membaca file atau file kosong/tidak valid.',
            ]));
        }

        $imported = 0;
        $importedUnitsData = [];
        $user = auth()->user();
        $isAdmin = $user->role && $user->role->nama_role === 'Admin';

        DB::transaction(function () use ($parsedUnits, &$imported, &$importedUnitsData, $documentPath, $isAdmin, $user) {
            foreach ($parsedUnits as $u) {
                if ($isAdmin) {
                    $unit = Unit::create([
                        'nomor_seri' => $u['nomor_seri'],
                        'jenis' => $u['jenis'],
                        'asal_satuan' => $u['asal_satuan'],
                        'satuan_id' => $u['satuan_id'],
                        'status_unit' => $u['status_unit']
                    ]);

                    $importedUnitsData[] = array_merge($u, [
                        'status' => 'approved',
                        'unit_id' => $unit->id
                    ]);
                } else {
                    $importedUnitsData[] = array_merge($u, [
                        'status' => 'pending'
                    ]);
                }
                $imported++;
            }

            if ($imported > 0) {
                if ($isAdmin) {
                    UnitMutation::create([
                        'unit_id' => null,
                        'type' => 'approved_add',
                        'reason' => 'Import massal langsung oleh Admin.',
                        'document_path' => $documentPath,
                        'requested_by' => $user->id,
                        'approved_by' => $user->id,
                        'status' => 'approved',
                        'unit_data' => $importedUnitsData,
                    ]);
                    SystemLog::log('INFO', $user->id, "Import massal DART oleh Admin: {$imported} berhasil ditambahkan, {$skipped} duplikat dilewati.");
                } else {
                    UnitMutation::create([
                        'unit_id' => null,
                        'type' => 'request_add',
                        'reason' => 'Import massal unit diajukan oleh Staf.',
                        'document_path' => $documentPath,
                        'requested_by' => $user->id,
                        'status' => 'pending',
                        'unit_data' => $importedUnitsData,
                    ]);
                    SystemLog::log('INFO', $user->id, "Staf mengajukan import massal DART: {$imported} unit diajukan, {$skipped} duplikat dilewati.");
                }
            }
        });

        $resultMsg = $isAdmin 
            ? "Import massal selesai. {$imported} unit berhasil ditambahkan, {$skipped} dilewati." 
            : "Pengajuan import massal {$imported} unit telah dikirim ke Admin. {$skipped} duplikat dilewati.";

        return redirect()->back()->with('import_result', json_encode([
            'success' => true,
            'message' => $resultMsg,
        ]));
    }

    /**
     * Staf mengajukan penambahan massal via CSV
     */
    public function requestAddBatch(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:5120',
            'document' => 'required|file|mimes:pdf,png,jpg,jpeg|max:10240',
            'reason' => 'nullable|string|max:500',
        ], [
            'file.required' => 'Silakan lampirkan file CSV daftar unit.',
            'document.required' => 'Surat pendukung wajib dilampirkan untuk pengajuan massal.',
        ]);

        $documentPath = $request->file('document')->store('mutations/documents', 'public');
        $reason = $request->input('reason', 'Pengajuan penambahan massal DART.');
        $file = $request->file('file');
        
        $skipped = 0;
        $parsedUnits = $this->parseUnitCsv($file->getPathname(), $skipped);

        if (empty($parsedUnits)) {
            SystemLog::log('INFO', auth()->id(), "Staf gagal mengajukan penambahan massal DART: 0 diajukan, {$skipped} dilewati.");
            return redirect()->back()->with('error', 'Semua nomor seri di dalam CSV sudah terdaftar atau tidak valid (satuan tidak terdaftar / unit sudah terdaftar).');
        }

        $unitsToPropose = [];
        foreach ($parsedUnits as $u) {
            $unitsToPropose[] = array_merge($u, [
                'status' => 'pending',
            ]);
        }

        $requested = count($unitsToPropose);

        UnitMutation::create([
            'unit_id' => null,
            'type' => 'request_add',
            'reason' => $reason,
            'document_path' => $documentPath,
            'requested_by' => auth()->id(),
            'status' => 'pending',
            'unit_data' => $unitsToPropose,
        ]);

        SystemLog::log('INFO', auth()->id(), "Staf mengajukan penambahan massal DART: {$requested} diajukan, {$skipped} dilewati.");

        return redirect()->back()->with('message', "Pengajuan penambahan massal unit ({$requested} unit) berhasil dikirim. Menunggu persetujuan Admin.");
    }

    /**
     * Staf mengajukan penghapusan massal
     */
    public function requestDeleteBatch(Request $request)
    {
        $request->validate([
            'unit_ids' => 'required|array',
            'unit_ids.*' => 'exists:units,id',
            'reason' => 'required|string|max:500',
            'document' => 'required|file|mimes:pdf,png,jpg,jpeg|max:10240',
        ], [
            'unit_ids.required' => 'Tidak ada unit yang dipilih untuk dihapus.',
            'document.required' => 'Surat pendukung wajib dilampirkan.',
        ]);

        $documentPath = $request->file('document')->store('mutations/documents', 'public');
        $reason = $request->input('reason');
        $unitIds = $request->input('unit_ids');
        
        $requested = 0;
        $skipped = 0;

        DB::transaction(function () use ($unitIds, $reason, $documentPath, &$requested, &$skipped) {
            foreach ($unitIds as $unitId) {
                $unit = Unit::find($unitId);
                if (!$unit) continue;

                $existingPending = UnitMutation::where('unit_id', $unit->id)
                    ->where('type', 'request_delete')
                    ->where('status', 'pending')
                    ->exists();

                if ($existingPending) {
                    $skipped++;
                    continue;
                }

                UnitMutation::create([
                    'unit_id' => $unit->id,
                    'type' => 'request_delete',
                    'reason' => $reason,
                    'document_path' => $documentPath,
                    'requested_by' => auth()->id(),
                    'status' => 'pending',
                    'unit_data' => $unit->toArray(),
                ]);

                $requested++;
            }
        });

        SystemLog::log('INFO', auth()->id(), "Staf mengajukan penghapusan massal DART: {$requested} diajukan.");

        if ($requested === 0) {
            return redirect()->back()->with('error', 'Unit yang Anda pilih sudah pernah diajukan penghapusannya.');
        }

        return redirect()->back()->with('message', "{$requested} pengajuan penghapusan berhasil dikirim. Menunggu persetujuan Admin.");
    }

    /**
     * Parse and validate CSV file for bulk unit import/mutation.
     */
    private function parseUnitCsv(string $path, int &$skipped): array
    {
        $handle = fopen($path, "r");
        if (!$handle) {
            return [];
        }

        // Detect delimiter
        $firstLine = fgets($handle);
        rewind($handle);
        $delimiter = ",";
        if (strpos($firstLine, ';') !== false && strpos($firstLine, ',') === false) {
            $delimiter = ";";
        } elseif (strpos($firstLine, ';') !== false && strpos($firstLine, ',') !== false) {
            $commaCount = substr_count($firstLine, ',');
            $semicolonCount = substr_count($firstLine, ';');
            if ($semicolonCount > $commaCount) {
                $delimiter = ";";
            }
        }

        $header = true;
        $units = [];
        $validJenis = ['DART STD', 'DART STK', 'DART Portabel - Swing', 'DART Portabel - Pop', 'DART Portabel - Flip', 'DART Marathon Target', 'Moving Target'];
        $statusMap = [
            'siap ops' => 'Beroperasi',
            'beroperasi' => 'Beroperasi',
            'rusak' => 'Rusak',
            'perbaikan' => 'Perbaikan',
            'nonaktif' => 'Nonaktif',
        ];

        while ($row = fgetcsv($handle, 1000, $delimiter)) {
            if ($header) {
                $header = false;
                continue;
            }
            if (count($row) < 4) {
                continue;
            }

            $nomor_seri = trim($row[0]);
            if (empty($nomor_seri) || str_starts_with($nomor_seri, '#')) {
                continue;
            }

            $jenis_raw = trim($row[1]);
            $asal_satuan = trim($row[2]);
            $status_unit_raw = isset($row[3]) ? trim($row[3]) : 'Beroperasi';

            // Check if unit number already exists in DB
            if (Unit::where('nomor_seri', $nomor_seri)->exists()) {
                $skipped++;
                continue;
            }

            // Check if unit number is already in a pending add mutation request
            $isPending = UnitMutation::where('type', 'request_add')
                ->where('status', 'pending')
                ->whereJsonContains('unit_data', ['nomor_seri' => $nomor_seri])
                ->exists();

            if ($isPending) {
                $skipped++;
                continue;
            }

            // Normalize jenis
            $jenis = 'DART STD';
            foreach ($validJenis as $vj) {
                if (strcasecmp($jenis_raw, $vj) === 0) {
                    $jenis = $vj;
                    break;
                }
            }

            // Normalize status
            $status_unit_lower = strtolower($status_unit_raw);
            $status_unit = $statusMap[$status_unit_lower] ?? 'Beroperasi';

            // Find Satuan (MUST already exist in DB)
            $satuan = Satuan::where('nama_satuan', strtoupper($asal_satuan))->first();
            if (!$satuan) {
                $skipped++;
                continue;
            }

            $units[] = [
                'nomor_seri' => $nomor_seri,
                'jenis' => $jenis,
                'asal_satuan' => $satuan->nama_satuan,
                'satuan_id' => $satuan->id,
                'status_unit' => $status_unit,
            ];
        }

        fclose($handle);
        return $units;
    }
}
