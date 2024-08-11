<?php

namespace App\Services;

use App\Models\Plugin;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class PluginService
{
    protected $pluginsPath;

    public function __construct()
    {
        $this->pluginsPath = base_path('plugins');
    }

    public function scanPlugins()
    {
        if (!File::isDirectory($this->pluginsPath)) {
            File::makeDirectory($this->pluginsPath, 0755, true);
        }

        $directories = File::directories($this->pluginsPath);

        foreach ($directories as $directory) {
            $dirName = basename($directory);
            Plugin::firstOrCreate(['directory' => $dirName], [
                'name' => $dirName,
                'enabled' => false
            ]);
        }

        // Remove plugins that no longer exist in the filesystem
        Plugin::whereNotIn('directory', array_map('basename', $directories))->delete();
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
