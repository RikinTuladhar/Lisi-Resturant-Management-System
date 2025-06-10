<x-filament-panels::page>
    <form wire:submit="save">
        {{ $this->form }}

        <div class="mt-10" style="margin-top: 20px;">
            <x-filament::button type="submit">
                Change Password
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>