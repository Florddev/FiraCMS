<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\Console\Migrations\MigrateCommand;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakePluginController extends Command
{
    protected $signature = 'make:plugin-controller {plugin} {name}';
    protected $description = 'Create a new plugin\'s controller';

    public function handle()
    {
        $pluginName = $this->argument('plugin');
        $name = $this->argument('name');

        $studlyName = Str::studly($name);

        $pluginPath = base_path("plugins/{$pluginName}");
        if (File::exists($pluginPath)) {
            $pluginControllerPath = "$pluginPath/Controllers";
            if (!File::exists($pluginControllerPath)) {
                File::makeDirectory($pluginControllerPath, 0755, true);
            }

            File::put("$pluginControllerPath/{$studlyName}.php", $this->getControllerContent($pluginName, $name));
            $this->components->info(sprintf('Plugin controller [Plugins/%s/Controllers/%s] created successfully.', $pluginName, $name));
            return;
        }

        $this->components->error(sprintf('Plugin [%s] does not exist.', $name));
    }

    private function getControllerContent($pluginName, $name)
    {
        $studlyName = Str::studly($name);
        $simpleName = explode("Controller", $name)[0] ?? $studlyName;
        return <<<PHP
<?php

namespace Plugins\\{$pluginName}\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class {$studlyName} extends Controller
{
    public function index()
    {
        return Inertia::render('Blog::$simpleName/Index');
    }
}
PHP;
    }
}
