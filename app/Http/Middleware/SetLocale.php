<?php

namespace App\Http\Middleware;

use App\Helpers\LocaleHelper;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next)
    {
//        $locale = $request->session()->get('locale', config('app.locale'));
//
//        if (Auth::check()) {
//            $locale = Auth::user()->locale ?? $locale;
//        }

        $locale = LocaleHelper::getUserLocale();
        App::setLocale($locale);

        return $next($request);
    }
}
