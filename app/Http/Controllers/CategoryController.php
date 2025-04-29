<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (FacadesAuth::check() && FacadesAuth::user()->role === 'admin') {
            $categories = Category::all();
            return Inertia::render("Admin/categories/Category", [
                'categories' => $categories,
            ]);
        }
        //
        return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
    }

    /**
     * Show the form for creating a new resource.p[]
     */
    public function create()
    {
        if (FacadesAuth::check() && FacadesAuth::user()->role === 'admin') {
            return Inertia::render("Admin/categories/AddCategories");
        }

        return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $category = new Category();
        $validated_data = $request->validate($category->getRules());
        $category->fill($validated_data);
        $category->save();
        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $category = Category::findOrFail($id);
        $validated_data = $request->validate($category->getRules());
        $category->update($validated_data);
        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $category = Category::findOrFail($id);
        $category->delete();
        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }
}
