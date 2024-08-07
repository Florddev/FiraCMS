<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\InstallationStateManager;

class CheckInstallation
{
    private $stateManager;

    public function __construct(InstallationStateManager $stateManager)
    {
        $this->stateManager = $stateManager;
    }

    public function handle(Request $request, Closure $next)
    {
        if (!$this->stateManager->isInstalled() && !$request->is('install*')) {
            return redirect()->route('install.index');
        }

        if ($this->stateManager->isInstalled() && $request->is('install*')) {
            return redirect('/');
        }

        return $next($request);
    }
}
