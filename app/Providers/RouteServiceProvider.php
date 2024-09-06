<?php

namespace App\Providers;

use App\Models\Plugin;
use App\Services\InstallationStateManager;
use App\Services\TemplateManagementService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class RouteServiceProvider extends ServiceProvider
{

    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/nexius-admin/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            if ((new InstallationStateManager())->isInstalled()) {
                if (Schema::hasTable('templates')) $this->loadTemplatesRoutes();
                if (Schema::hasTable('plugins')) $this->loadPluginRoutes();
            }
        });
    }

    protected function loadPluginRoutes()
    {
        $pluginsPath = base_path('plugins');
        $enabledPlugins = Plugin::where('enabled', true)->get();

        foreach ($enabledPlugins as $plugin) {
            $routesPath = "$pluginsPath/{$plugin->directory}/routes/web.php";

            if (file_exists($routesPath)) {
                Route::middleware(['web', 'auth', 'inertia'])  // Ajoutez ici tous les middlewares nécessaires
                ->namespace('Plugins\\' . basename($plugin->directory) . '\Controllers')
                    ->group($routesPath);
            }
        }
    }

    protected function loadTemplatesRoutes()
    {

        Route::middleware(['web', 'inertia'])
            ->group(function () {
                $template = TemplateManagementService::getSelectedTemplate();

                if (empty($template)) {
                    abort(404);
                }

                foreach ($template->pages as $page) {

                    Route::get($page->slug, fn() => Inertia::render("Templates/{$template->name}/Pages/{$page->name}"))
                        ->name('site.' . TemplateManagementService::convertToKebabCase($page->name));

                    //->name("template.{$template->name}.{$page->name}");
                }
            });
    }
}
