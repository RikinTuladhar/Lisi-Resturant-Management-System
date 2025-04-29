<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
class TestController extends Controller
{
    //
    public function admin():Response{
        return Inertia::render("Admin/User");
    }

    public function worker():Response{
        return Inertia::render("Worker/WorkerDashboard");
    }
}
