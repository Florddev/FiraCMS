<?php

use App\Http\Controllers\MediaController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\InstallController;
use App\Http\Controllers\PluginController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//Route::group(['prefix' => 'install', 'as' => 'install.', 'middleware' => 'web'], function () {
//    Route::get('/', [InstallController::class, 'index'])->name('index');
//    Route::get('/start', [InstallController::class, 'start'])->name('start');
//    Route::get('/requirements', [InstallController::class, 'requirements'])->name('requirements');
//    Route::get('/permissions', [InstallController::class, 'permissions'])->name('permissions');
//    Route::get('/database', [InstallController::class, 'database'])->name('database');
//    Route::post('/database', [InstallController::class, 'setDatabase'])->name('setDatabase');
//    Route::get('/migrations', [InstallController::class, 'migrations'])->name('migrations');
//    Route::post('/migrations', [InstallController::class, 'runMigrations'])->name('runMigrations');
//    Route::get('/admin', [InstallController::class, 'admin'])->name('admin');
//    Route::post('/admin', [InstallController::class, 'createAdmin'])->name('createAdmin');
//    Route::get('/finish', [InstallController::class, 'finish'])->name('finish');
//});

Route::get('/install', [InstallController::class, 'index'])->name('install.index');
Route::get('/install/initial-data', [InstallController::class, 'getInitialData']);
Route::post('/install', [InstallController::class, 'install']);

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/plugins', [PluginController::class, 'index'])->name('plugins.index');
Route::post('/plugins/{plugin}/toggle', [PluginController::class, 'toggle'])->name('plugins.toggle');
Route::get('/plugins/scan', [PluginController::class, 'scan'])->name('plugins.scan');

Route::get('/home', function () {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/change-locale', [LanguageController::class, 'changeLocale'])->name('change.locale');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/users/list', [UserController::class, 'list'])->name('users.list');

    Route::resource('users', UserController::class);
    Route::delete('/users/destroy-multiple', [UserController::class, 'destroyMultiple'])->name('users.destroyMultiple');
});

Route::get('test', function () {
    return Inertia::render('Test');
});

require __DIR__.'/auth.php';
