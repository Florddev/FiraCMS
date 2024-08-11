<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\Console\Migrations\MigrateCommand;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakePluginModel extends Command
{
    protected $signature = 'make:plugin-model {plugin} {name}';
    protected $description = 'Create a new plugin\'s model';

    public function handle()
    {
        $pluginName = $this->argument('plugin');
        $name = $this->argument('name');

        $studlyName = Str::studly($name);

        $pluginPath = base_path("plugins/{$pluginName}");
        if (File::exists($pluginPath)) {
            $pluginControllerPath = "$pluginPath/Models";
            if (!File::exists($pluginControllerPath)) {
                File::makeDirectory($pluginControllerPath, 0755, true);
            }

            File::put("$pluginControllerPath/{$studlyName}.php", $this->getModelContent($pluginName, $name));
            $this->components->info(sprintf('Plugin model [Plugins/%s/Models/%s] created successfully.', $pluginName, $name));
            return;
        }

        $this->components->error(sprintf('Plugin [%s] does not exist.', $name));
    }

    private function getModelContent($pluginName, $name): string
    {
        $studlyName = Str::studly($name);
        return <<<PHP
<?php

namespace Plugins\\{$pluginName}\Models;

use Illuminate\Database\Eloquent\Model;

class {$studlyName} extends Model
{
    protected \$fillable = [];
}
PHP;
    }
}
