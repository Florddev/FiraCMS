<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\Console\Migrations\MigrateCommand;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakePluginMigration extends Command
{
    protected $signature = 'make:plugin-migration {plugin} {name}';
    protected $description = 'Create a new plugin\'s migration';

    public function handle()
    {
        $pluginName = $this->argument('plugin');
        $name = $this->argument('name');

        $pluginPath = base_path("plugins/{$pluginName}");
        if (File::exists($pluginPath)) {
            $pluginMigrationPath = "$pluginPath/database/migrations";
            if (!File::exists($pluginMigrationPath)) {
                File::makeDirectory($pluginMigrationPath, 0755, true);
            }

            $this->call('make:migration', [
                '--path' => "Plugins/$pluginName/database/migrations",
                '--fullpath',
                'name' => "$name",
            ]);
            return;
        }

        $this->components->error(sprintf('Plugin [%s] does not exist.', $name));
    }
}
