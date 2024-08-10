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

//    public function loadPlugins()
//    {
//        $enabledPlugins = Plugin::where('enabled', true)->get();
//
//        $loadedPlugins = [];
//
//        foreach ($enabledPlugins as $plugin) {
//            $pluginPath = $this->pluginsPath . '/' . $plugin->directory;
//
//            // Load plugin's service provider
//            $providerClass = "Plugins\\{$plugin->directory}\\PluginServiceProvider";
//            if (class_exists($providerClass)) {
//                app()->register($providerClass);
//            }
//
//            // Check for plugin's main JavaScript file
//            $jsPath = "{$pluginPath}/resources/js/PluginComponent.jsx";
//            if (file_exists($jsPath)) {
//                $loadedPlugins[] = [
//                    'name' => $plugin->name,
//                    'directory' => $plugin->directory,
//                ];
//            }
//        }
//
//        // Pass loaded plugins to the frontend
//        Inertia::share('loadedPlugins', $loadedPlugins);
//    }
}
