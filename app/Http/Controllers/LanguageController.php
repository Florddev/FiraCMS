<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LanguageController extends Controller
{

    public function changeLocale(Request $request)
    {
        $locale = $request->input('locale');

        if (array_key_exists($locale, config('app.available_locales'))) {
            if (Auth::check()) {
                Auth::user()->update(['locale' => $locale]);
            }
            session()->put('locale', $locale);
        }

        return redirect()->back();
    }

}
