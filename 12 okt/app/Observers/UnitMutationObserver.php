<?php

namespace App\Observers;

use App\Models\UnitMutation;
use Illuminate\Support\Facades\Storage;

class UnitMutationObserver
{
    /**
     * Handle the UnitMutation "deleted" event.
     */
    public function deleted(UnitMutation $mutation): void
    {
        if ($mutation->document_path && Storage::disk('public')->exists($mutation->document_path)) {
            Storage::disk('public')->delete($mutation->document_path);
        }
    }

    /**
     * Handle the UnitMutation "force deleted" event.
     */
    public function forceDeleted(UnitMutation $mutation): void
    {
        if ($mutation->document_path && Storage::disk('public')->exists($mutation->document_path)) {
            Storage::disk('public')->delete($mutation->document_path);
        }
    }

    /**
     * Handle the UnitMutation "updated" event.
     */
    public function updated(UnitMutation $mutation): void
    {
        if ($mutation->isDirty('document_path')) {
            $original = $mutation->getOriginal('document_path');
            if ($original && Storage::disk('public')->exists($original)) {
                Storage::disk('public')->delete($original);
            }
        }
    }
}
