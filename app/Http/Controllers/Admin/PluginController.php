<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plugin;
use App\Services\PluginService;
use Inertia\Inertia;

class PluginController extends Controller
{
    protected $pluginService;

    public function __construct(PluginService $pluginService)
    {
        $this->pluginService = $pluginService;
    }

    public function index()
    {
        $this->pluginService->scanPlugins();
        $plugins = Plugin::all();
        return Inertia::render('Plugins/PluginManagement', ['plugins' => $plugins]);
    }

    public function toggle(Plugin $plugin)
    {
        try {
            if ($plugin->enabled) {
                $this->pluginService->disablePlugin($plugin);
                $message = "Plugin {$plugin->name} has been disabled.";
            } else {
                $this->pluginService->enablePlugin($plugin);
                $message = "Plugin {$plugin->name} has been enabled.";
            }
            return redirect()->back()->with('flash', ['type' => 'success', 'message' => $message]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', ['type' => 'error', 'message' => "Error: {$e->getMessage()}"]);
        }
    }

    public function scan()
    {
        try {
            $this->pluginService->scanPlugins();
            return redirect()->route('plugins.index')->with('flash', ['type' => 'success', 'message' => 'Plugin scan completed successfully.']);
        } catch (\Exception $e) {
            return redirect()->route('plugins.index')->with('flash', ['type' => 'error', 'message' => "Error during plugin scan: {$e->getMessage()}"]);
        }
    }
}
