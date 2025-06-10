<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\OrderResource\Pages;
use App\Filament\Admin\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-pencil-square';
    protected static ?string $navigationGroup = 'Management';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('total_price')
                    ->required()
                    ->numeric()
                    ->readOnly()
                    ->prefix('Rs')
                    ->afterStateHydrated(function ($component, $state, $set, $get, $record) {
                        // On edit, use the database value initially
                        if ($record) {
                            $set('total_price', $record->total_price);
                        } else {
                            // On create, calculate from order items
                            $orderItems = $get('orderItems') ?? [];
                            $total = collect($orderItems)->sum('order_price');
                            $set('total_price', $total);
                        }
                    })
                    ->reactive(),
                Forms\Components\Select::make('status')
                    ->options(\App\Enums\OrderStatus::class)
                    ->required(),
                Forms\Components\Select::make('user_id')
                    ->label('Worker Name')
                    ->options(\App\Models\User::all()->pluck('name', 'id'))
                    ->searchable()
                    ->preload()
                    ->native(false)
                    ->required(),
                Forms\Components\Repeater::make('orderItems')
                    ->relationship()
                    ->schema([
                        Forms\Components\Select::make('item_id')
                            ->label('Item Name')
                            ->options(\App\Models\Item::all()->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->native(false)
                            ->required()
                            ->live()
                            ->afterStateUpdated(function ($state, $set, $get, $livewire) {
                                static::calculateItemPrice($set, $get);
                                static::calculateTotalPrice($livewire);
                            }),
                        Forms\Components\TextInput::make('units')
                            ->required()
                            ->numeric()
                            ->prefix('Units')
                            ->live()
                            ->afterStateUpdated(function ($state, $set, $get, $livewire) {
                                static::calculateItemPrice($set, $get);
                                static::calculateTotalPrice($livewire);
                            }),
                        Forms\Components\TextInput::make('order_price')
                            ->label('Order Price')
                            ->helperText('This is the total price for this item')
                            ->numeric()
                            ->prefix('Rs')
                            ->readOnly()
                            ->afterStateHydrated(function ($component, $state, $set, $get, $record) {
                                // For edit mode, ensure the price is calculated correctly
                                if ($record) {
                                    $itemId = $get('item_id');
                                    $units = $get('units');
                                    if ($itemId && $units && !$state) {
                                        $item = \App\Models\Item::find($itemId);
                                        if ($item) {
                                            $set('order_price', $item->price * $units);
                                        }
                                    }
                                }
                            }),
                    ])
                    ->live()
                    ->afterStateUpdated(function ($state, $set, $get, $livewire) {
                        static::calculateTotalPrice($livewire);
                    })
                    ->addActionLabel('Add Order Item')
                    ->deleteAction(
                        fn($action) => $action->after(function ($livewire) {
                            static::calculateTotalPrice($livewire);
                        })
                    )
                    ->columnSpanFull(),
            ]);
    }

    protected static function calculateItemPrice($set, $get): void
    {
        $itemId = $get('item_id');
        $units = $get('units');

        if ($itemId && $units) {
            $item = \App\Models\Item::find($itemId);
            if ($item) {
                $set('order_price', $item->price * $units);
            }
        }
    }

    protected static function calculateTotalPrice($livewire): void
    {
        $orderItems = $livewire->data['orderItems'] ?? [];
        $total = collect($orderItems)->sum('order_price');
        $livewire->data['total_price'] = $total;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('total_price')
                    ->numeric()
                    ->sortable()
                    ->prefix('Rs'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(function ($state): string {
                        $value = $state instanceof \App\Enums\OrderStatus ? $state->value : $state;

                        return match ($value) {
                            'pending' => 'warning',
                            'processing' => 'info',
                            'completed' => 'success',
                            'cancelled' => 'danger',
                            default => 'gray',
                        };
                    }),
                Tables\Columns\TextColumn::make('invoice_id')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Worker')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(\App\Enums\OrderStatus::class),
                Tables\Filters\SelectFilter::make('user_id')
                    ->label('Worker')
                    ->options(\App\Models\User::where('role', \App\Enums\UserRole::WORKER)->pluck('name', 'id')),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }

    public static function afterCreate($record, $data)
    {
        // Create an invoice for this order
        $invoice = \App\Models\Invoice::create([
            'user_id' => $record->user_id,
            'total_price' => $record->total_price,
            'service_charge' => 0,
            'discount' => 0,
            'status' => 'pending',
        ]);
        $record->invoice_id = $invoice->id;
        $record->save();
    }
}
