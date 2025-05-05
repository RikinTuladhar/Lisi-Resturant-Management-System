<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CategoryController extends BaseController
{
    /**
     * Display a listing of the resource.
     */

    protected $categorie;

    public function __construct(Category $categorie)
    {
        $this->categorie = $categorie;
    }

    public function index()
    {
        //
        $categories = Category::all();
        return $this->sendResponse($categories, 'Categories retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $this->authorize('create', Category::class);
        $validated = $request->validate($this->categorie->rules());
        $newCategory = Category::create($validated);
        return $this->sendResponse($newCategory, 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $category = Category::find($id);
        if (!$category) {
            throw new NotFoundHttpException('Category not found');
        }
        return $this->sendResponse($category, 'Category retrieved successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $this->authorize('update',$this->categorie);
        $category = Category::findOrFail($id);
        $validated = $request->validate($this->categorie->rules());
        $category->update($validated);
        return $this->sendResponse($category, 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(category $category)
    {
        //
        $this->authorize('delete', $category);
        $category->delete();
        return $this->sendResponse([], 'Category deleted successfully.');
    }
}
