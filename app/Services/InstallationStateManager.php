<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class InstallationStateManager
{
    private $stateFile = 'installation_state.json';

    public function getCurrentStep()
    {
        if (!Storage::exists($this->stateFile)) {
            return 'start';
        }

        $state = json_decode(Storage::get($this->stateFile), true);
        return $state['current_step'] ?? 'start';
    }

    public function setCurrentStep($step)
    {
        $state = ['current_step' => $step];
        Storage::put($this->stateFile, json_encode($state));
    }

    public function isInstalled()
    {
        return $this->getCurrentStep() === 'finish';
    }

    public function reset()
    {
        if (Storage::exists($this->stateFile)) {
            Storage::delete($this->stateFile);
        }
    }
}
