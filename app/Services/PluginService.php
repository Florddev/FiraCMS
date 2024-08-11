<?php

namespace App\Services;

use App\Models\Plugin;
use App\Models\PluginMigration;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class PluginService
{
    protected $pluginsPath;
    protected $pluginMigrationBackupPath;

    public function __construct()
    {
        $this->pluginsPath = base_path('plugins');
        $this->pluginMigrationBackupPath = storage_path('app/plugin_migrations');
    }

    public function scanPlugins()
    {
        if (!File::isDirectory($this->pluginsPath)) {
            File::makeDirectory($this->pluginsPath, 0755, true);
        }

        $directories = File::directories($this->pluginsPath);
        $existingPlugins = array_map('basename', $directories);

        // Check for new or existing plugins
        foreach ($directories as $directory) {
            $dirName = basename($directory);
            $plugin = Plugin::firstOrCreate(['directory' => $dirName], [
                'name' => $dirName,
                'enabled' => false
            ]);

            if ($plugin->wasRecentlyCreated) {
                $this->runPluginMigrations($plugin);
            }
        }

        // Check for removed plugins
        $removedPlugins = Plugin::whereNotIn('directory', $existingPlugins)->get();
        foreach ($removedPlugins as $plugin) {
            $this->removePlugin($plugin);
        }
    }

    protected function runPluginMigrations(Plugin $plugin)
    {
        $migrationPath = $this->pluginsPath . '/' . $plugin->directory . '/database/migrations';
        if (File::isDirectory($migrationPath)) {
            $migrations = File::glob($migrationPath . '/*.php');
            foreach ($migrations as $migration) {
                $migrationName = pathinfo($migration, PATHINFO_FILENAME);
                if (!PluginMigration::where('plugin_id', $plugin->id)->where('migration', $migrationName)->exists()) {
                    try {
                        // Copy migration file to backup location
                        $this->backupMigrationFile($plugin, $migration);

                        $migrationClass = $this->getMigrationClass($migration);
                        if ($migrationClass === null) {
                            Log::error("Invalid migration file format: $migration");
                            continue;
                        }

                        if (is_object($migrationClass)) {
                            $instance = $migrationClass;
                        } else {
                            $instance = new $migrationClass;
                        }

                        $instance->up();
                        PluginMigration::create([
                            'plugin_id' => $plugin->id,
                            'migration' => $migrationName,
                            'batch' => $this->getNextBatchNumber(),
                        ]);
                        Log::info("Migration $migrationName for plugin {$plugin->name} executed successfully.");
                    } catch (\Exception $e) {
                        Log::error("Error running migration $migrationName for plugin {$plugin->name}: " . $e->getMessage());
                    }
                }
            }
        }
    }

    protected function removePlugin(Plugin $plugin)
    {
        $migrations = PluginMigration::where('plugin_id', $plugin->id)->orderBy('batch', 'desc')->get();
        foreach ($migrations as $migration) {
            $migrationFile = $this->getBackupMigrationPath($plugin, $migration->migration . '.php');
            if (File::exists($migrationFile)) {
                try {
                    $migrationClass = $this->getMigrationClass($migrationFile);
                    if (is_object($migrationClass)) {
                        $instance = $migrationClass;
                    } else {
                        $instance = new $migrationClass;
                    }
                    $instance->down();
                    Log::info("Rolled back migration {$migration->migration} for removed plugin {$plugin->name}");
                } catch (\Exception $e) {
                    Log::error("Error rolling back migration {$migration->migration} for removed plugin {$plugin->name}: " . $e->getMessage());
                }
            } else {
                Log::warning("Backup migration file not found for {$migration->migration} of plugin {$plugin->name}");
            }
            $migration->delete();
        }
        $this->removeBackupMigrations($plugin);
        $plugin->delete();
        Log::info("Plugin {$plugin->name} has been completely removed.");
    }

    protected function backupMigrationFile(Plugin $plugin, $originalPath)
    {
        $backupDir = $this->getBackupMigrationPath($plugin);
        if (!File::isDirectory($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }
        $backupPath = $backupDir . '/' . basename($originalPath);
        File::copy($originalPath, $backupPath);
    }

    protected function getBackupMigrationPath(Plugin $plugin, $filename = '')
    {
        $path = $this->pluginMigrationBackupPath . '/' . $plugin->directory;
        return $filename ? $path . '/' . $filename : $path;
    }

    protected function removeBackupMigrations(Plugin $plugin)
    {
        $backupDir = $this->getBackupMigrationPath($plugin);
        if (File::isDirectory($backupDir)) {
            File::deleteDirectory($backupDir);
        }
    }

    protected function getMigrationClass($migrationFile)
    {
        $migrationContent = File::get($migrationFile);

        // Check for anonymous class
        if (preg_match('/return new class extends Migration/i', $migrationContent)) {
            return require $migrationFile;
        }

        // Check for named class (fallback for older style migrations)
        if (preg_match('/class\s+(\w+)\s+extends\s+Migration/i', $migrationContent, $matches)) {
            require_once $migrationFile;
            return $matches[1];
        }

        Log::warning("Could not find valid migration class in file: $migrationFile");
        return null;
    }

    protected function getNextBatchNumber()
    {
        return PluginMigration::max('batch') + 1;
    }

    public function enablePlugin(Plugin $plugin)
    {
        $plugin->enabled = true;
        $plugin->save();
    }

    public function disablePlugin(Plugin $plugin)
    {
        $plugin->enabled = false;
        $plugin->save();
    }
}
