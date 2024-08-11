<?php

use Illuminate\Support\Facades\Route;
use Plugins\MonNouveauPlugin\Controllers\PluginController;

Route::middleware('auth')->prefix('MonNouveauPlugin')->group(function () {
    Route::get('/test', 'PluginController@index')->name('mon-nouveau-plugin.index');
});
