<?php

namespace App\Http\Middleware;

use Closure;
use App\Services\InstallationStateManager;

class CheckInstallation
{
    protected $stateManager;

    public function __construct(InstallationStateManager $stateManager)
    {
        $this->stateManager = $stateManager;
    }

    public function handle($request, Closure $next)
    {
        if (!$this->stateManager->isInstalled() && !$request->is('install*')) {
            return redirect('/install');
        }

        if ($this->stateManager->isInstalled() && $request->is('install*')) {
            return redirect('/');
        }

        return $next($request);
    }
}
