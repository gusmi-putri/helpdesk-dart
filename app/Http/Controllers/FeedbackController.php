<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pengirim' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'kategori' => 'required|string|max:255',
            'pesan' => 'required|string',
        ]);

        Feedback::create($validated);

        return redirect()->back()->with('success', 'Feedback berhasil dikirim.');
    }
}
