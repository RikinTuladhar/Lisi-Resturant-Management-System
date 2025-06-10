<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestOrder extends BaseWidget
{
    // Make table take full width
    protected int | string | array $columnSpan = 'full';

    // Optional: Set custom heading
    protected static ?string $heading = 'Todays Latest Orders';

    // Optional: Control number of records per page
    protected static ?int $recordsPerPage = 10;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()
                    ->where('created_at', '>=', now()->startOfDay())
                    ->where('created_at', '<=', now()->endOfDay())
                    ->latest()
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Order Name')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn($state) => match (is_string($state) ? $state : $state->value) {
                        'pending' => 'warning',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->color('success')
                    ->icon('heroicon-o-clock')
                    ->size('sm')
                    ->weight('bold')
                    ->label('Created At')
                    ->sortable()
                    ->badge()
                    ->searchable()
                    ->dateTime('g:i A'),
            ]);
    }
}
