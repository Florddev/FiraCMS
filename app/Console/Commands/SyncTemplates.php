<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TemplateManagementService;

class SyncTemplates extends Command
{
    protected $signature = 'templates:sync';
    protected $description = 'Synchronize templates with filesystem';

    public function handle(TemplateManagementService $service)
    {
        $service->syncTemplates();
        $this->components->info('Templates synchronized successfully.');
    }
}
