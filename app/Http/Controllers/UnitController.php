<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\SystemLog;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nomor_seri' => 'required|string|max:50|unique:units',
            'nama_dart' => 'required|string|max:100',
            'jenis_dart' => 'required|in:DART STD,DART STK,SKE,MOVING TARGET',
            'asal_satuan' => 'required|string|max:100',
            'status_unit' => 'required|in:Siap Ops,Rusak,Perbaikan,Nonaktif',
        ]);

        Unit::create($request->all());

        SystemLog::log('INFO', auth()->id(), "Menambahkan unit DART baru: {$request->nomor_seri} - {$request->nama_dart}");

        return redirect()->back()->with('message', 'Unit DART berhasil ditambahkan.');
    }

    public function update(Request $request, Unit $unit)
    {
        $request->validate([
            'nomor_seri' => 'required|string|max:50|unique:units,nomor_seri,' . $unit->id,
            'nama_dart' => 'required|string|max:100',
            'jenis_dart' => 'required|in:DART STD,DART STK,SKE,MOVING TARGET',
            'asal_satuan' => 'required|string|max:100',
            'status_unit' => 'required|in:Siap Ops,Rusak,Perbaikan,Nonaktif',
        ]);

        $unit->update($request->all());

        SystemLog::log('INFO', auth()->id(), "Memperbarui data unit DART: {$unit->nomor_seri}");

        return redirect()->back()->with('message', 'Data unit DART telah diperbarui.');
    }

    public function destroy(Unit $unit)
    {
        $info = "{$unit->nomor_seri} - {$unit->nama_dart}";
        $unit->delete();

        SystemLog::log('ALERT', auth()->id(), "Menghapus unit DART dari sistem: {$info}");

        return redirect()->back()->with('message', 'Unit DART telah dihapus dari sistem.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:5120', // Max 5MB
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getPathname(), "r");

        $header = true;
        $imported = 0;
        $skipped = 0;

        while ($row = fgetcsv($handle, 1000, ",")) {
            // Kita asumsikan baris pertama adalah header
            if ($header) {
                $header = false;
                continue;
            }

            // Pastikan ada minimal 4 kolom yang terisi
            if (count($row) < 4) continue;

            $nomor_seri = trim($row[0]);
            $nama_dart = trim($row[1]);
            $jenis_dart = trim($row[2]);
            $asal_satuan = trim($row[3]);
            $status_unit = isset($row[4]) ? trim($row[4]) : 'Siap Ops';

            if (empty($nomor_seri)) continue;

            // Aturan No 2: Jika nomor seri sama, lewati baris
            if (Unit::where('nomor_seri', $nomor_seri)->exists()) {
                $skipped++;
                continue;
            }

            // Validasi tipe enum
            $validJenis = ['DART STD', 'DART STK', 'SKE', 'MOVING TARGET'];
            if (!in_array(strtoupper($jenis_dart), $validJenis)) {
                $jenis_dart = 'DART STD';
            } else {
                $jenis_dart = strtoupper($jenis_dart);
            }

            $validStatus = ['Siap Ops', 'Rusak', 'Perbaikan', 'Nonaktif'];
            // Kapitalisasi awal kata agar cocok dengan Enum
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

        // Jika Anda menggunakan flash session Inertia, tambahkan ini. Jika tidak, ini akan cukup.
        return redirect()->back();
    }
}
