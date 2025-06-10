<?php

namespace App\Filament\Admin\Resources;

use App\Enums\UserRole;
use App\Filament\Admin\Resources\WorkerResource\Pages;
use App\Filament\Admin\Resources\WorkerResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class WorkerResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-user';
    protected static ?string $navigationLabel = 'Workers';
    protected static ?string $navigationGroup = 'System';
    protected static ?int $navigationSort = 1;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('role', 'worker');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('password')
                    ->password()
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('role')
                    ->options(collect(UserRole::cases())->mapWithKeys(fn($role) => [$role->value => $role->name]))
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table

            ->columns([
                //
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                // Tables\Columns\TextColumn::make('role')
                //     ->searchable()
                //     ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d-m-Y')
                    ->label('Created')
                    ->badge()
                    ->color('success')
                    ->sortable(),
                // Tables\Columns\TextColumn::make('updated_at')
                //     ->dateTime('d-m-Y ')
                //     ->label('Updated')
                //     ->color('warning')
                //     ->badge()
                //     ->sortable(),

            ])
            ->filters([
                //
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
            'index' => Pages\ListWorkers::route('/'),
            'create' => Pages\CreateWorker::route('/create'),
            'edit' => Pages\EditWorker::route('/{record}/edit'),
        ];
    }
}
