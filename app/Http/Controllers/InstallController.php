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
        return Inertia::render('InstallationStepper', [
            'requirements' => $this->checkRequirements(),
            'permissions' => $this->checkPermissions(),
            'current_step' => $this->stateManager->getCurrentStep()
        ]);
    }

    public function getInitialData()
    {
        return response()->json([
            'requirements' => $this->checkRequirements(),
            'permissions' => $this->checkPermissions(),
        ]);
    }

    public function install(Request $request)
    {
        $this->stateManager->setCurrentStep('database');
        $dbValidated = $request->validate([
            'db_host' => 'required',
            'db_port' => 'required',
            'db_database' => 'required',
            'db_username' => 'required',
            'db_password' => 'required'
        ]);
        $this->checkDatabaseConnection($dbValidated);

        $this->stateManager->setCurrentStep('admin');
        $userValidated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            // Étape 1-2: Vérification des prérequis et permissions
            // (Déjà fait côté client, on pourrait les re-vérifier ici si nécessaire)

            // Étape 3: Configuration de la base de données
            $this->updateEnvFile($dbValidated);

            // Étape 4: Exécution des migrations
            Artisan::call('migrate', ['--force' => true]);

            // Étape 5: Création de l'administrateur
            User::create([
                'name' => $userValidated['name'],
                'email' => $userValidated['email'],
                'password' => Hash::make($userValidated['password']),
                'locale' => session('locale', config('app.locale')),
                'is_admin' => true,
            ]);

            // Étape 6: Finalisation
            $this->stateManager->setCurrentStep('finish');
            file_put_contents(storage_path('installed'), 'Installation completed on ' . date('Y-m-d H:i:s'));
            return route("home");
        } catch (\Exception $e) {
            Log::error('Error during installation: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred during installation: ' . $e->getMessage()], 500);
        }
    }

    public function getStep($step)
    {
        switch ($step) {
            case 0:
                return response()->json([]);
            case 1:
                return response()->json(['requirements' => $this->checkRequirements()]);
            case 2:
                return response()->json(['permissions' => $this->checkPermissions()]);
            case 3:
            case 4:
            case 5:
                return response()->json([]);
            case 6:
                return response()->json([]);
            default:
                return response()->json(['error' => 'Étape invalide'], 400);
        }
    }

    public function postStep(Request $request, $step)
    {
        switch ($step) {
            case 0:
            case 1:
            case 2:
                return response()->json(['success' => true]);
            case 3:
                return $this->setDatabase($request);
            case 4:
                return $this->runMigrations();
            case 5:
                return $this->createAdmin($request);
            case 6:
                return $this->finish();
            default:
                return response()->json(['error' => 'Étape invalide'], 400);
        }
    }

    private function setDatabase(Request $request)
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
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Erreur dans setDatabase: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue: ' . $e->getMessage()], 500);
        }
    }

    private function runMigrations()
    {
        try {
            Artisan::call('migrate', ['--force' => true]);
            $this->stateManager->setCurrentStep('admin');
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Erreur dans runMigrations: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue: ' . $e->getMessage()], 500);
        }
    }

    private function createAdmin(Request $request)
    {
        $validation = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            User::create([
                'name' => $validation['name'],
                'email' => $validation['email'],
                'password' => Hash::make($validation['password']),
                'locale' => session('locale', config('app.locale')),
                'is_admin' => true,
            ]);

            $this->stateManager->setCurrentStep('finish');
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Erreur dans createAdmin: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue: ' . $e->getMessage()], 500);
        }
    }

    private function finish()
    {
        $this->stateManager->setCurrentStep('finish');
        file_put_contents(storage_path('installed'), 'Installation completed on ' . date('Y-m-d H:i:s'));
        return response()->json(['success' => true]);
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

    private function updateEnvFile($data): void
    {
        $path = base_path('.env');

        if (file_exists($path)) {
            $content = file_get_contents($path);

            foreach ($data as $key => $value) {
                $value = str_replace('"', '\\"', $value);
                $envKey = strtoupper(str_replace('db_', 'DB_', $key));

                if (strpos($content, $envKey . '=') !== false) {
                    $content = preg_replace(
                        "/^{$envKey}=.*/m",
                        "{$envKey}=\"{$value}\"",
                        $content
                    );
                } else {
                    $content .= PHP_EOL . "{$envKey}=\"{$value}\"";
                }
            }

            file_put_contents($path, $content);
        }
    }
}
