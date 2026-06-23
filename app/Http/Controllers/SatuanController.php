<?php

namespace App\Http\Controllers;

use App\Models\Satuan;
use Illuminate\Http\Request;

class SatuanController extends Controller
{
    public function index()
    {
        // Only return verified satuans for the dropdown list
        return response()->json(Satuan::where('is_verified', true)->orderBy('nama_satuan', 'asc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_satuan' => 'required|string|max:100|unique:satuans,nama_satuan',
        ]);

        $satuan = Satuan::create([
            'nama_satuan' => strtoupper($request->nama_satuan),
            'is_verified' => false, // New satker from public/guest starts unverified
            'latitude' => null,
            'longitude' => null,
        ]);

        return response()->json($satuan, 201);
    }

    public function update(Request $request, Satuan $satuan)
    {
        $request->validate([
            'nama_satuan' => 'sometimes|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $updateData = [];
        if ($request->has('nama_satuan')) {
            $updateData['nama_satuan'] = strtoupper($request->nama_satuan);
        }
        if ($request->has('latitude')) {
            $updateData['latitude'] = $request->latitude;
            $updateData['is_verified'] = true; // Auto verify if coords provided
        }
        if ($request->has('longitude')) {
            $updateData['longitude'] = $request->longitude;
            $updateData['is_verified'] = true; // Auto verify if coords provided
        }

        // If admin just wants to verify without coords
        if (!$request->latitude && !$request->longitude) {
            $updateData['is_verified'] = true;
        }

        $satuan->update($updateData);

        return redirect()->back();
    }

    public function destroy(Satuan $satuan)
    {
        $satuan->delete();
        return redirect()->back();
    }
}
