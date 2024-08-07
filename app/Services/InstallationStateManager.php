<?php

namespace App\Services;

class InstallationStateManager
{
    private $stateFile;
    private $steps = [
        'start',
        'requirements',
        'permissions',
        'database',
        'migrations',
        'admin',
        'finish'
    ];

    public function __construct()
    {
        $this->stateFile = storage_path('app/installation_state.json');
    }

    public function getCurrentStep()
    {
        if (!file_exists($this->stateFile)) {
            return $this->steps[0];
        }

        $state = json_decode(file_get_contents($this->stateFile), true);
        $currentStepIndex = array_search($state['current_step'], $this->steps);
        return $this->steps[$currentStepIndex] ?? 'finish';
    }

    public function setCurrentStep($step)
    {
        $state = ['current_step' => $step];
        file_put_contents($this->stateFile, json_encode($state));
    }

    public function isInstalled()
    {
        return $this->getCurrentStep() === 'finish';
    }

    public function reset()
    {
        if (file_exists($this->stateFile)) {
            unlink($this->stateFile);
        }
    }
}
