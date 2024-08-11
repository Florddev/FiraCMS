<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    /**
     * Affiche une liste paginée des médias.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);
        $medias = Media::latest()->paginate($perPage);

        $medias->getCollection()->transform(function ($media) {
            //$media->path = Storage::url($media->path);
            $media->path = "api/media/{$media->name}";
            return $media;
        });

        return response()->json($medias);
    }

    /**
     * Stocke un nouveau média.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx', // max:5120
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $fileName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '_' . time() . '.' . $extension;

            $path = $file->storeAs('medias', $fileName, 'public');

            $media = Media::create([
                'name' => $originalName,
                'path' => $path, // Stockez le chemin relatif ici
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);

            // Retournez l'URL complète pour l'affichage frontal
            return response()->json([
                'id' => $media->id,
                'name' => $media->name,
                'path' => Storage::url($media->path),
                'mime_type' => $media->mime_type,
                'size' => $media->size,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'upload du fichier: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue lors de l\'upload du fichier.'], 500);
        }
    }

    /**
     * Supprime un média spécifique.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $media = Media::findOrFail($id);
            $filePath = str_replace('/storage/', '', $media->path);

            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }

            $media->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du fichier: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue lors de la suppression du fichier.'], 500);
        }
    }

    public function media(string $fileName)
    {
        $media = Media::where('name', $fileName)->first();
        return response()->file(
            Storage::disk('public')->path($media->path)
        );
    }
}
