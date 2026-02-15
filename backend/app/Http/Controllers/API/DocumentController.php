<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Document::with(['user:id,name,email', 'validator:id,name'])
            ->latest();

        if ($user->role === 'user') {
            $query->where('user_id', $user->id);
        }

        if ($user->role === 'validator') {
            $query->where('status', 'pending');
        }

        return response()->json($query->paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ]);

        $path = $request->file('file')->store('documents', 'public');

        $document = Document::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'file_path' => $path,
            'status' => 'pending',
        ]);

        return response()->json($document, 201);
    }

    public function show(Document $document)
    {
        $document->load(['user:id,name,email', 'validator:id,name']);

        return response()->json($document);
    }

    public function validateDocument(Request $request, Document $document)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:approved,rejected'],
            'validator_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $document->update([
            'status' => $validated['status'],
            'validator_notes' => $validated['validator_notes'] ?? null,
            'validated_by' => $request->user()->id,
            'validated_at' => now(),
        ]);

        return response()->json(['message' => 'Dokumen berhasil divalidasi', 'document' => $document]);
    }

    public function destroy(Document $document)
    {
        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return response()->json(['message' => 'Dokumen dihapus']);
    }
}
