<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemResource;
use App\Models\item;
use Illuminate\Http\Request;

class ItemController extends BaseController
{

    protected $item;

    public function __construct(Item $item)
    {
        $this->item = $item;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $items = Item::with('category')->get();
        return $this->sendResponse(ItemResource::collection($items), 'Items retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $this->authorize('create', Item::class);
        $validated = $request->validate($this->item->rules());
        $newCategory = Item::create($validated);
        return $this->sendResponse($newCategory, 'Item created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        //
        return $this->sendResponse(new ItemResource($item), 'Item retrieved successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        //
        $this->authorize('update', $item);
        $rule = [
            'name' => 'required|string|max:255',
            'description' => 'string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
        ];

        if ($request->name != $item->name) {
            $rule['name'] = 'required|string|max:255|unique:items,name';
        }
        $validated = $request->validate($rule);
        $item->update($validated);
        return $this->sendResponse(new ItemResource($item), 'Item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        //
        $this->authorize('delete', $item);
        $item->delete();
        return $this->sendResponse(new ItemResource($item), 'Item deleted successfully.');
    }
}
