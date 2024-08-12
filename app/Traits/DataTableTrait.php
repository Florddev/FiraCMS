<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

trait DataTableTrait
{
    public function getDataTableData(Request $request, $modelClass, array $options = [])
    {
        /** @var Model $model */
        $model = new $modelClass;

        $query = $model->query();

        // Appliquer les relations à charger
        if (isset($options['with']) && is_array($options['with'])) {
            $query->with($options['with']);
        }

        // Appliquer la recherche globale
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $searchableFields = $options['searchableFields'] ?? ['name', 'email']; // Ajustez selon vos besoins
            $query->where(function ($q) use ($searchableFields, $searchTerm) {
                foreach ($searchableFields as $field) {
                    $q->orWhere($field, 'LIKE', "%{$searchTerm}%");
                }
            });
        }

        // Appliquer les filtres de colonnes
        $filters = json_decode($request->input('filters', '[]'), true);
        foreach ($filters as $filter) {
            if (isset($filter['id']) && isset($filter['value'])) {
                if (isset($options['customFilter'][$filter['id']])) {
                    $options['customFilter'][$filter['id']]($query, $filter['value']);
                } else {
                    $query->where($filter['id'], $filter['value']);
                }
            }
        }

        // Appliquer le tri
        $sorting = $request->input('sort', '');
        $sortParams = explode(',', $sorting);
        foreach ($sortParams as $sortParam) {
            if (!empty($sortParam)) {
                [$field, $direction] = explode(':', $sortParam);
                $query->orderBy($field, $direction);
            }
        }

        // Sélectionner les colonnes spécifiques si elles sont spécifiées
        if (isset($options['columns']) && is_array($options['columns'])) {
            $query->select($options['columns']);
        }

        // Appliquer des conditions supplémentaires si nécessaire
        if (isset($options['conditions']) && is_callable($options['conditions'])) {
            $options['conditions']($query);
        }

        if (isset($options['aggregation'])) {
            foreach ($options['aggregation'] as $field => $function) {
                $query->addSelect(DB::raw("{$function}({$field}) as {$field}_aggregated"));
            }
        }

        // Gérer la sélection
        $selectedIds = $request->input('selected_ids') ? explode(',', $request->input('selected_ids')) : [];

        // Appliquer la pagination
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', $options['defaultPerPage'] ?? 10);

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        // Marquer les lignes sélectionnées
        $data->getCollection()->transform(function ($item) use ($selectedIds) {
            $item->isSelected = in_array($item->id, $selectedIds);
            return $item;
        });

        return response()->json([
            'data' => $data->items(),
            'pageCount' => $data->lastPage(),
            'total' => $data->total(),
            'from' => $data->firstItem(),
            'to' => $data->lastItem(),
            'currentPage' => $data->currentPage(),
            'perPage' => $data->perPage(),
            'selectedIds' => $selectedIds,
        ]);
    }
}
