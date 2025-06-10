<?php

namespace App\Filament\Pages;

use App\Filament\Admin\Widgets\LatestOrder;
use App\Filament\Admin\Widgets\StatsOverview;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{


    public function getWidgets(): array
    {
        return [
            StatsOverview::class,
            LatestOrder::class,
        ];
    }

    public function getColumns(): int | string | array
    {
        return [
            'md' => 1, // Single column on medium screens and up
            'xl' => 1, // Single column on extra large screens
        ];
    }
}
