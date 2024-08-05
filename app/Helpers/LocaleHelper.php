<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

class LocaleHelper
{
    public static function getUserLocale()
    {
        if (Auth::check() && Auth::user()->locale) {
            return Auth::user()->locale;
        }

        return session('locale', config('app.locale'));
    }
}
