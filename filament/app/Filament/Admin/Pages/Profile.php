<?php

namespace App\Filament\Admin\Pages;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Hash;
use Filament\Notifications\Notification;
use Filament\Actions\Action;
use Filament\Forms\Concerns\InteractsWithForms;
use Illuminate\Support\Facades\Auth;

class Profile extends Page
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-user-circle';
    protected static string $view = 'filament.admin.pages.profile';
    protected static ?string $title = 'Profile';
    protected static ?string $slug = 'profile';

    public ?string $current_password = null;
    public ?string $new_password = null;
    public ?string $new_password_confirmation = null;

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('current_password')
                    ->password()
                    ->revealable()
                    ->required()
                    ->label('Current Password'),
                TextInput::make('new_password')
                    ->password()
                    ->revealable()
                    ->required()
                    ->minLength(8)
                    ->label('New Password'),
                TextInput::make('new_password_confirmation')
                    ->password()
                    ->revealable()
                    ->required()
                    ->same('new_password')
                    ->label('Confirm New Password'),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $user = Auth::user();

        if (!Hash::check($data['current_password'], $user->password)) {
            Notification::make()
                ->title('Current password is incorrect')
                ->danger()
                ->send();
            return;
        }

        $user->password = Hash::make($data['new_password']);
        $user->save();

        Notification::make()
            ->title('Password updated successfully')
            ->success()
            ->send();

        $this->form->fill();
    }
}
