<?php

namespace App\Providers;

use App\Models\Plugin;
use App\Services\PluginService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(PluginService $pluginService)
    {
        $pluginService->scanPlugins();
//        $enabledPlugins = Plugin::where('enabled', true)->get();
//
//        foreach ($enabledPlugins as $plugin) {
//            $providerClass = "Plugins\\{$plugin->directory}\\PluginServiceProvider";
//            if (class_exists($providerClass)) {
//                $this->app->register($providerClass);
//            } else {
//                Log::warning("Provider non trouvé : $providerClass");
//            }
//        }
    }
}
