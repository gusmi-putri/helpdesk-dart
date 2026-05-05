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
}
