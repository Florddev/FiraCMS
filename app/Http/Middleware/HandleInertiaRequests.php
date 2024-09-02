<?php

namespace App\Http\Middleware;

use App\Helpers\LocaleHelper;
use App\Models\Plugin;
use App\Services\InstallationStateManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $loadedPlugins = null;
        if ((new InstallationStateManager())->isInstalled()) {
            if (Schema::hasTable('plugins')) $loadedPlugins = Plugin::where('enabled', true)->get();
        }

        return [
            ...parent::share($request),
            'csrf' => csrf_token(),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'locale' => LocaleHelper::getUserLocale(),
            'availableLocales' => config('app.available_locales'),
            'loadedPlugins' => $loadedPlugins
        ];
    }
}
