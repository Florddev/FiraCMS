<?php

namespace Plugins\MonNouveauPlugin\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PluginController extends Controller
{
    public function index()
    {
        return Inertia::render('MonNouveauPlugin::PluginComponent', [
            'testProp' => 'Ceci est un test',
            'pluginData' => [
                'name' => 'MonNouveauPlugin',
                'version' => '1.0.0',
            ],
        ]);
    }
}
