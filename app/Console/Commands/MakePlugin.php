<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\Console\Migrations\MigrateCommand;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakePlugin extends Command
{
    protected $signature = 'make:plugin {name}';
    protected $description = 'Create a new plugin';

    public function handle()
    {
        $name = $this->argument('name');

//        $this->call('make:migration', [
//            'name' => $name, '--path' => '/plugin/'
//        ]);

        $pluginPath = base_path("plugins/{$name}");

        if (File::exists($pluginPath)) {
            $this->error("Plugin {$name} already exists!");
            $this->components->error(sprintf('Plugin [%s] already exists.', $name));
            return;
        }

        $this->createPluginStructure($name, $pluginPath);
        $this->components->info(sprintf('Plugin [%s] created successfully.', $name));
    }

    protected function createPluginStructure($name, $path)
    {
        $studlyName = Str::studly($name);

        // Create main directories
        File::makeDirectory($path, 0755, true);
        File::makeDirectory("{$path}/Controllers", 0755, true);
        File::makeDirectory("{$path}/Models", 0755, true);
        File::makeDirectory("{$path}/resources", 0755, true);
        File::makeDirectory("{$path}/resources/js", 0755, true);
        File::makeDirectory("{$path}/resources/js/Components", 0755, true);
        File::makeDirectory("{$path}/resources/js/Pages", 0755, true);
        File::makeDirectory("{$path}/database", 0755, true);
        File::makeDirectory("{$path}/database/migrations", 0755, true);
        File::makeDirectory("{$path}/routes", 0755, true);

        // Create basic files
        $this->createFile("{$path}/plugin.json", $this->getPluginJsonContent($name));
        //$this->createFile("{$path}/PluginServiceProvider.php", $this->getServiceProviderContent($name));
        $this->createFile("{$path}/Controllers/{$studlyName}Controller.php", $this->getControllerContent($name));
        $this->createFile("{$path}/Models/{$studlyName}Model.php", $this->getModelContent($name));
        $this->createFile("{$path}/resources/js/index.js", $this->getIndexJsContent($name));
        $this->createFile("{$path}/resources/js/Components/{$studlyName}Navigation.jsx", $this->getComponentContent($name));
        $this->createFile("{$path}/resources/js/Pages/Index.jsx", $this->getPageContent($name));
        $this->createFile("{$path}/routes/web.php", $this->getRoutesContent($name));
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
        \$this->loadMigrationsFrom(__DIR__ . '/database/migrations');
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

class {$studlyName}Controller extends Controller
{
    public function index()
    {
        return Inertia::render('{$studlyName}::Index');
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

class {$studlyName}Model extends Model
{
    protected \$fillable = [];
}
PHP;
    }

    protected function getPageContent($name)
    {
        $studlyName = Str::studly($name);
        return <<<JSX
import React from 'react';
import AppLayout from "@/Layouts/AppLayout";

export default function Index() {
    return (
        <AppLayout>
            <div>{$name} Plugin</div>
            {/* Add your plugin content here */}
        </AppLayout>
    );
}
JSX;
    }

    protected function getIndexJsContent($name)
    {
        $studlyName = Str::studly($name);
        return <<<JS
import { registerHook } from '/resources/js/hooks';
import {$studlyName}Navigation from './Components/{$studlyName}Navigation';

export default function(pluginName) {
    registerHook('dashboard-navigation', {$studlyName}Navigation, pluginName);
}
JS;
    }

    protected function getComponentContent($name)
    {
        $studlyName = Str::studly($name);
        return <<<JSX
import React from 'react';

export default function {$studlyName}Navigation() {
    return (
        <div>{$name}'s Navigation</div>
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
use Plugins\\{$studlyName}\Controllers\\{$studlyName}Controller;

Route::middleware('auth')->group(function () {
    Route::get('/{$name}', [{$studlyName}Controller::class, 'index'])->name('{$name}.index');
});
PHP;
    }
}
