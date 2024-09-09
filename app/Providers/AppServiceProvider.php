<?php

namespace App\Providers;

use App\Models\Plugin;
use App\Services\InstallationStateManager;
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
    public function boot(
        PluginService $pluginService,
        InstallationStateManager $installationStateManager
    ) {
        try {
            if ($installationStateManager->isInstalled()) {
                if (Schema::hasTable('plugins')) $pluginService->scanPlugins();
            }
        } catch (\Exception){}
    }
}
