<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakePlugin extends Command
{
    protected $signature = 'make:plugin {name}';
    protected $description = 'Create a new plugin';

    public function handle()
    {
        $name = $this->argument('name');
        $pluginPath = base_path("plugins/{$name}");

        if (File::exists($pluginPath)) {
            $this->error("Plugin {$name} already exists!");
            return;
        }

        $this->createPluginStructure($name, $pluginPath);
        $this->info("Plugin {$name} created successfully!");
    }

    protected function createPluginStructure($name, $path)
    {
        // Create main directories
        File::makeDirectory($path, 0755, true);
        File::makeDirectory("{$path}/src", 0755, true);
        File::makeDirectory("{$path}/src/Controllers", 0755, true);
        File::makeDirectory("{$path}/src/Models", 0755, true);
        File::makeDirectory("{$path}/resources", 0755, true);
        File::makeDirectory("{$path}/resources/js", 0755, true);
        File::makeDirectory("{$path}/resources/js/Components", 0755, true);
        File::makeDirectory("{$path}/database", 0755, true);
        File::makeDirectory("{$path}/database/migrations", 0755, true);

        // Create basic files
        $this->createFile("{$path}/plugin.json", $this->getPluginJsonContent($name));
        $this->createFile("{$path}/src/PluginServiceProvider.php", $this->getServiceProviderContent($name));
        $this->createFile("{$path}/src/Controllers/PluginController.php", $this->getControllerContent($name));
        $this->createFile("{$path}/src/Models/PluginModel.php", $this->getModelContent($name));
        $this->createFile("{$path}/resources/js/Components/PluginComponent.jsx", $this->getComponentContent($name));
        $this->createFile("{$path}/routes.php", $this->getRoutesContent($name));
    }

    protected function createFile($path, $content)
    {
        File::put($path, $content);
    }

    protected function getPluginJsonContent($name)
    {
        return json_encode([
            'name' => $name,
            'description' => "A plugin for {$name}",
            'version' => '1.0.0',
            'author' => 'Your Name',
        ], JSON_PRETTY_PRINT);
    }

    protected function getServiceProviderContent($name)
    {
        $studlyName = Str::studly($name);
        return <<<PHP
<?php

namespace Plugins\\{$studlyName};

use Illuminate\Support\ServiceProvider;

class PluginServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        \$this->loadRoutesFrom(__DIR__ . '/../routes.php');
        \$this->loadViewsFrom(__DIR__ . '/../resources/views', '{$name}');
        \$this->loadMigrationsFrom(__DIR__ . '/../database/migrations');
    }
}
PHP;
    }

    protected function getControllerContent($name)
    {
        $studlyName = Str::studly($name);
        return <<<PHP
<?php

namespace Plugins\\{$studlyName}\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PluginController extends Controller
{
    public function index()
    {
        return Inertia::render('{$studlyName}::PluginComponent');
    }
}
PHP;
    }

    protected function getModelContent($name)
    {
        $studlyName = Str::studly($name);
        return <<<PHP
<?php

namespace Plugins\\{$studlyName}\Models;

use Illuminate\Database\Eloquent\Model;

class PluginModel extends Model
{
    protected \$fillable = [];
}
PHP;
    }

    protected function getComponentContent($name)
    {
        return <<<JSX
import React from 'react';

export default function PluginComponent() {
    return (
        <div>
            <h1>{$name} Plugin</h1>
            {/* Add your plugin content here */}
        </div>
    );
}
JSX;
    }

    protected function getRoutesContent($name)
    {
        $studlyName = Str::studly($name);
        return <<<PHP
<?php

use Illuminate\Support\Facades\Route;
use Plugins\\{$studlyName}\Controllers\PluginController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/{$name}', [PluginController::class, 'index'])->name('{$name}.index');
});
PHP;
    }
}
