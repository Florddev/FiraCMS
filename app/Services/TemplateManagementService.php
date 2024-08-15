<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use App\Models\Template;
use App\Models\Page;

class TemplateManagementService
{
    private $templatesPath;

    public function __construct()
    {
        $this->templatesPath = base_path('resources') . "/js/Templates";
    }

    public function syncTemplates()
    {
        $existingTemplates = Template::pluck('name')->toArray();
        $filesystemTemplates = $this->getFilesystemTemplates();

        $this->addNewTemplates($filesystemTemplates, $existingTemplates);
        $this->removeDeletedTemplates($filesystemTemplates, $existingTemplates);
        $this->updateExistingTemplates($filesystemTemplates);
    }

    private function getFilesystemTemplates()
    {
        return collect(File::directories($this->templatesPath))
            ->map(function ($path) {
                return basename($path);
            })
            ->toArray();
    }

    private function addNewTemplates($filesystemTemplates, $existingTemplates)
    {
        $newTemplates = array_diff($filesystemTemplates, $existingTemplates);

        foreach ($newTemplates as $templateName) {
            $this->createOrUpdateTemplate($templateName);
        }
    }

    private function removeDeletedTemplates($filesystemTemplates, $existingTemplates)
    {
        $deletedTemplates = array_diff($existingTemplates, $filesystemTemplates);

        foreach ($deletedTemplates as $templateName) {
            $this->deleteTemplate($templateName);
        }
    }

    private function updateExistingTemplates($filesystemTemplates)
    {
        foreach ($filesystemTemplates as $templateName) {
            $this->createOrUpdateTemplate($templateName);
        }
    }

    private function createOrUpdateTemplate($templateName)
    {
        $configData = $this->getTemplateConfig($templateName);
        $pages = $this->getTemplatePagesFromFiles($templateName);

        $template = Template::updateOrCreate(
            ['name' => $templateName],
            [
                'title' => $configData['title'] ?? '',
                'author' => $configData['author'] ?? '',
                'version' => $configData['version'] ?? '',
                'description' => $configData['description'] ?? '',
            ]
        );

        foreach ($pages as $pageName) {
            $name = self::convertToKebabCase($pageName);
            Page::updateOrCreate(
                [
                    'name' => $pageName,
                    'template_id' => $template->id
                ],
                [
                    'slug' => '/' . ($name != 'index' ? $name : ''),
                    'initial_path' => "$templateName/$pageName",
                    // 'custom_data' => [],
                    // 'sections' => [],
                ]
            );
        }
    }

    public static function getSelectedTemplate()
    {
        $template = Template::where('name', Config::get('app.selected_template'))->with('pages')->first();
        return $template ?? Template::where('name', Config::get('app.default_template'))->with('pages')->first();
        //return Template::where('selected', true)->first();
    }

    public function updateSelectedTemplate($templateName)
    {
        $template = Template::where('name', $templateName)->first();
        Config::set('app.selected_template', $template->name ?? Config::get('app.default_template'));
    }

    private function deleteTemplate($templateName)
    {
        Template::where('name', $templateName)->delete();
    }

    private function getTemplateConfig($templateName)
    {
        $configPath = $this->templatesPath . '/' . $templateName . '/config.json';
        if (File::exists($configPath)) {
            return json_decode(File::get($configPath), true);
        }
        return [];
    }

    // public function getTemplateSections($templateName)
    // {
    //     $sectionsPath = $this->templatesPath . '/' . $templateName . '/Sections';
    //     return collect(File::files($sectionsPath))
    //         ->map(function ($file) {
    //             return pathinfo($file, PATHINFO_FILENAME);
    //         })
    //         ->toArray();
    // }

    private function getTemplateFilesFromPath($templateName, $path)
    {
        $pagesPath = $this->templatesPath . '/' . $templateName . $path;
        return collect(File::files($pagesPath))
            ->map(function ($file) {
                return pathinfo($file, PATHINFO_FILENAME);
            })
            ->toArray();
    }

    private function getTemplatePagesFromFiles($templateName)
    {
        return $this->getTemplateFilesFromPath($templateName, '/Pages');
    }

    private function getTemplateSectionsFromFiles($templateName)
    {
        return $this->getTemplateFilesFromPath($templateName, '/Sections');
    }


    public static function convertToKebabCase($string)
    {
        // Ajoute un espace avant chaque majuscule et convertit en minuscules
        $string = strtolower(preg_replace('/(?<!^)[A-Z]/', ' $0', $string));

        // Remplace les espaces multiples par un seul espace
        $string = preg_replace('/\s+/', ' ', $string);

        // Remplace les espaces par des tirets
        $string = str_replace(' ', '-', $string);

        return $string;
    }
}
