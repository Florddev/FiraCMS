<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Services\InstallationStateManager;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InstallController extends Controller
{
    private $stateManager;

    public function __construct(InstallationStateManager $stateManager)
    {
        $this->stateManager = $stateManager;

        if (!file_exists(base_path('.env'))) {
            copy(base_path('.env.example'), base_path('.env'));
        }
    }

    public function index()
    {
        $currentStep = $this->stateManager->getCurrentStep();
        return redirect()->route("install.{$currentStep}");
    }

    public function start()
    {
//        $this->stateManager->setCurrentStep('start');
        return Inertia::render('Install/Start');
    }

    public function requirements()
    {
//        $this->stateManager->setCurrentStep('requirements');
        $requirements = $this->checkRequirements();
        return Inertia::render('Install/Requirements', ['requirements' => $requirements]);
    }

    public function permissions()
    {
//        $this->stateManager->setCurrentStep('permissions');
        $permissions = $this->checkPermissions();
        return Inertia::render('Install/Permissions', ['permissions' => $permissions]);
    }

    public function database()
    {
        if($this->stateManager->getCurrentStep() === 'migrations') {
            return redirect()->route('install.index');
        }

//        $this->stateManager->setCurrentStep('database');
        return Inertia::render('Install/Database');
    }

    public function setDatabase(Request $request)
    {
        $validation = $request->validate([
            'db_host' => 'required',
            'db_port' => 'required',
            'db_database' => 'required',
            'db_username' => 'required',
            'db_password' => 'required',
        ]);


        try {
            $this->checkDatabaseConnection($validation);
            $this->updateEnvFile($request->all());

            $this->stateManager->setCurrentStep('migrations');
            return redirect()->route('install.migrations');
        } catch (\Exception $e) {
            Log::error('Erreur dans storeDatabaseSettings: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Une erreur est survenue: ' . $e->getMessage()]);
        }

    }

    private function checkDatabaseConnection($config)
    {
        $connection = config('database.default');

        config([
            "database.connections.{$connection}.host" => $config['db_host'],
            "database.connections.{$connection}.port" => $config['db_port'],
            "database.connections.{$connection}.database" => $config['db_database'],
            "database.connections.{$connection}.username" => $config['db_username'],
            "database.connections.{$connection}.password" => $config['db_password'],
        ]);

        DB::purge($connection);
        DB::reconnect($connection);
        DB::connection()->getPdo();
    }

    public function migrations()
    {
        return Inertia::render('Install/Migrations');
    }

    public function runMigrations()
    {
        try {
            Artisan::call('migrate', ['--force' => true]);
            $this->stateManager->setCurrentStep('admin');
            return redirect()->route('install.admin');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    public function admin()
    {
        return Inertia::render('Install/Admin');
    }

    public function createAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'locale' => session('locale', config('app.locale')),
            'is_admin' => true,
        ]);

        return redirect()->route('install.finish');
    }

    public function finish()
    {
        $this->stateManager->setCurrentStep('finish');
        file_put_contents(storage_path('installed'), 'Installation completed on ' . date('Y-m-d H:i:s'));
        return Inertia::render('Install/Finish');
    }

    private function checkRequirements()
    {
        return [
            'php' => version_compare(PHP_VERSION, '7.4.0', '>='),
            'pdo' => extension_loaded('pdo'),
            'mbstring' => extension_loaded('mbstring'),
            'tokenizer' => extension_loaded('tokenizer'),
            'xml' => extension_loaded('xml'),
            'ctype' => extension_loaded('ctype'),
            'json' => extension_loaded('json'),
            'bcmath' => extension_loaded('bcmath'),
        ];
    }

    private function checkPermissions()
    {
        return [
            'storage/framework/' => is_writable(storage_path('framework')),
            'storage/logs/' => is_writable(storage_path('logs')),
            'bootstrap/cache/' => is_writable(base_path('bootstrap/cache')),
            '.env' => is_writable(base_path('.env')),
        ];
    }

//    private function updateEnvFile($data)
//    {
//        $envFile = base_path('.env');
//        $contents = file_get_contents($envFile);
//
//        foreach ($data as $key => $value) {
//            $contents = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $contents);
//        }
//
//        file_put_contents($envFile, $contents);
//    }

    private function updateEnvFile($data): void
    {
        $path = base_path('.env');

        if (file_exists($path)) {
            $content = file_get_contents($path);

            foreach ($data as $key => $value) {
                // Échapper les caractères spéciaux dans la valeur
                $value = str_replace('"', '\\"', $value);

                // Convertir le nom de la clé au format attendu dans le fichier .env
                $envKey = strtoupper(str_replace('db_', 'DB_', $key));

                if (strpos($content, $envKey . '=') !== false) {
                    // Mettre à jour la valeur existante
                    $content = preg_replace(
                        "/^{$envKey}=.*/m",
                        "{$envKey}=\"{$value}\"",
                        $content
                    );
                } else {
                    // Ajouter une nouvelle variable si elle n'existe pas
                    $content .= PHP_EOL . "{$envKey}=\"{$value}\"";
                }
            }

            file_put_contents($path, $content);
        }
    }
}
