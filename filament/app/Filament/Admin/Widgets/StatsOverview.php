<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Invoice;
use App\Models\Order;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Carbon\Carbon;

class StatsOverview extends BaseWidget
{
    protected int | string | array $columnSpan = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Total workers', User::where('role', 'worker')->count())
                ->color('success')
                ->descriptionIcon('heroicon-o-user')
                ->chart($this->getMonthlyWorkerGrowthData()->toArray())
                ->icon('heroicon-o-user'),

            Stat::make('Todays orders', Order::where('created_at', '>=', now()->startOfDay())->where('created_at', '<=', now()->endOfDay())->count())
                ->color('success')
                ->descriptionIcon('heroicon-o-shopping-cart')
                ->chart($this->getTodaysOrderGrowthData()->toArray())
                ->icon('heroicon-o-shopping-cart'),

            Stat::make('Lifetime orders', Order::count())
                ->color('success')
                ->descriptionIcon('heroicon-o-shopping-cart')
                ->chart($this->getLifetimeOrderGrowthData()->toArray())
                ->icon('heroicon-o-shopping-cart'),

            Stat::make('Total Sales', 'Rs ' . number_format(Invoice::sum('total_price')))
                ->color('success')
                ->descriptionIcon('heroicon-o-currency-dollar')
                ->chart($this->getLifetimeOrderGrowthData()->toArray())
                ->icon('heroicon-o-currency-dollar'),
        ];
    }

    // Monthly Worker Growth Data (existing)
    private function getMonthlyWorkerGrowthData()
    {
        $currentDate = Carbon::now();
        $currentDay = $currentDate->day;

        // Get actual worker creation data for the current month
        $workerData = User::where('role', 'worker')
            ->whereMonth('created_at', $currentDate->month)
            ->whereYear('created_at', $currentDate->year)
            ->selectRaw('DAY(created_at) as day, COUNT(*) as count')
            ->groupBy('day')
            ->pluck('count', 'day')
            ->toArray();

        // Create cumulative data for days 1 to current day
        $chartData = [];
        $cumulativeCount = 0;

        for ($day = 1; $day <= $currentDay; $day++) {
            $dailyCount = $workerData[$day] ?? 0;
            $cumulativeCount += $dailyCount;
            $chartData[] = $cumulativeCount;
        }

        // If you want exactly 30 days, pad with projected growth
        if ($currentDay < 30) {
            $averageDailyGrowth = $cumulativeCount > 0 ? $cumulativeCount / $currentDay : 1;

            for ($day = $currentDay + 1; $day <= 30; $day++) {
                // Slightly decrease future projections to keep current date as peak
                $projectedGrowth = $averageDailyGrowth * 0.8;
                $cumulativeCount += max(0, $projectedGrowth);
                $chartData[] = $cumulativeCount;
            }
        }

        return collect($chartData);
    }

    // Today's Orders Growth Data (hourly throughout the day)
    private function getTodaysOrderGrowthData()
    {
        $today = Carbon::now()->startOfDay();
        $currentHour = Carbon::now()->hour;

        // Get hourly order data for today
        $orderData = Order::whereDate('created_at', $today)
            ->selectRaw('HOUR(created_at) as hour, COUNT(*) as count')
            ->groupBy('hour')
            ->pluck('count', 'hour')
            ->toArray();

        // Create cumulative data for hours 0 to current hour
        $chartData = [];
        $cumulativeCount = 0;

        for ($hour = 0; $hour <= $currentHour; $hour++) {
            $hourlyCount = $orderData[$hour] ?? 0;
            $cumulativeCount += $hourlyCount;
            $chartData[] = $cumulativeCount;
        }

        // Project remaining hours of the day with declining trend
        if ($currentHour < 23) {
            $averageHourlyGrowth = $cumulativeCount > 0 ? $cumulativeCount / ($currentHour + 1) : 0.5;

            for ($hour = $currentHour + 1; $hour <= 23; $hour++) {
                // Declining projection for future hours
                $projectedGrowth = $averageHourlyGrowth * 0.7;
                $cumulativeCount += max(0, $projectedGrowth);
                $chartData[] = $cumulativeCount;
            }
        }

        return collect($chartData);
    }

    // Lifetime Orders Monthly Growth Data
    private function getLifetimeOrderGrowthData()
    {
        $currentDate = Carbon::now();
        $currentDay = $currentDate->day;

        // Get daily order data for the current month
        $orderData = Order::whereMonth('created_at', $currentDate->month)
            ->whereYear('created_at', $currentDate->year)
            ->selectRaw('DAY(created_at) as day, COUNT(*) as count')
            ->groupBy('day')
            ->pluck('count', 'day')
            ->toArray();

        // Create cumulative data for days 1 to current day
        $chartData = [];
        $cumulativeCount = 0;

        for ($day = 1; $day <= $currentDay; $day++) {
            $dailyCount = $orderData[$day] ?? 0;
            $cumulativeCount += $dailyCount;
            $chartData[] = $cumulativeCount;
        }

        // Project remaining days of the month
        if ($currentDay < 30) {
            $averageDailyGrowth = $cumulativeCount > 0 ? $cumulativeCount / $currentDay : 1;

            for ($day = $currentDay + 1; $day <= 30; $day++) {
                // Slightly decrease future projections
                $projectedGrowth = $averageDailyGrowth * 0.85;
                $cumulativeCount += max(0, $projectedGrowth);
                $chartData[] = $cumulativeCount;
            }
        }

        return collect($chartData);
    }

    // Alternative: Get last 30 days of lifetime orders
    private function getLifetimeOrderLast30DaysData()
    {
        $endDate = Carbon::now();
        $startDate = $endDate->copy()->subDays(29);

        $orderData = Order::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date')
            ->toArray();

        $chartData = [];
        $currentDate = $startDate->copy();

        for ($i = 0; $i < 30; $i++) {
            $dateString = $currentDate->format('Y-m-d');
            $dailyCount = $orderData[$dateString] ?? 0;
            $chartData[] = $dailyCount;
            $currentDate->addDay();
        }

        return collect($chartData);
    }
}
