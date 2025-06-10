<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\InvoiceResource\Pages;
use App\Models\Invoice;
use App\Models\User;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Get;
use Filament\Forms\Set;

class InvoiceResource extends Resource
{
    protected static ?string $model = Invoice::class;
    protected static ?string $navigationIcon = 'heroicon-o-banknotes';
    protected static ?string $navigationGroup = 'Finance';
    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->label('User')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->nullable(),

                Forms\Components\Select::make('order_id')
                    ->label('Order')
                    ->relationship('order', 'name')
                    ->searchable()
                    ->preload()
                    ->nullable()
                    ->live()
                    ->afterStateUpdated(function (Set $set, Get $get, $state) {
                        if ($state) {
                            $order = Order::find($state);
                            if ($order) {
                                $orderPrice = $order->total_price ?? 0;
                                $serviceCharge = $get('service_charge') ?? 0;
                                $discount = $get('discount') ?? 0;

                                $totalPrice = $orderPrice + $serviceCharge - $discount;
                                $set('total_price', $totalPrice);
                            }
                        }
                    }),

                Forms\Components\TextInput::make('discount')
                    ->label('Discount')
                    ->numeric()
                    ->prefix('Rs')
                    ->step(0.01)
                    ->minValue(0)
                    ->default(0.00)
                    ->live()
                    ->afterStateUpdated(function (Set $set, Get $get, $state) {
                        self::calculateTotalPrice($set, $get);
                    }),

                Forms\Components\TextInput::make('service_charge')
                    ->label('Service Charge')
                    ->numeric()
                    ->prefix('Rs')
                    ->step(0.01)
                    ->minValue(0)
                    ->default(0.00)
                    ->live()
                    ->afterStateUpdated(function (Set $set, Get $get, $state) {
                        self::calculateTotalPrice($set, $get);
                    }),

                Forms\Components\TextInput::make('total_price')
                    ->label('Total Price')
                    ->required()
                    ->numeric()
                    ->prefix('Rs')
                    ->step(0.01)
                    ->minValue(0)
                    ->disabled() // Make it read-only since it's calculated
                    ->dehydrated(), // Ensure the value is saved

                Forms\Components\Select::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'canceled' => 'Canceled',
                    ])
                    ->default('pending')
                    ->required(),
            ]);
    }

    protected static function calculateTotalPrice(Set $set, Get $get): void
    {
        $orderId = $get('order_id');
        $serviceCharge = $get('service_charge') ?? 0;
        $discount = $get('discount') ?? 0;

        if ($orderId) {
            $order = Order::find($orderId);
            if ($order) {
                $orderPrice = $order->total_price ?? 0;
                $totalPrice = $orderPrice + $serviceCharge - $discount;
                $set('total_price', max(0, $totalPrice)); // Ensure total is never negative
            }
        }
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('Invoice #')
                    ->sortable(),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Order Created By')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('order.name')
                    ->label('Order Name')
                    ->sortable()
                    ->searchable(),


                // Tables\Columns\TextColumn::make('discount')
                //     ->label('Discount')
                //     ->prefix('Rs')
                //     ->sortable(),

                // Tables\Columns\TextColumn::make('service_charge')
                //     ->label('Service Charge')
                //     ->prefix('Rs')
                //     ->sortable(),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'completed',
                        'danger' => 'canceled',
                    ]),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total Price')
                    ->prefix('Rs')
                    ->sortable(),


                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'canceled' => 'Canceled',
                    ]),

                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from'),
                        Forms\Components\DatePicker::make('created_until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            // You can add relation managers here if needed
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInvoices::route('/'),
            'create' => Pages\CreateInvoice::route('/create'),
            'edit' => Pages\EditInvoice::route('/{record}/edit'),
        ];
    }
}
