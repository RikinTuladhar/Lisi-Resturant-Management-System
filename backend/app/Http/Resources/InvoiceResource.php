<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            'user' => new UserResource($this->user),
            'total_price' => $this->total_price,
            'service_charge' => $this->service_charge,
            'status' => $this->status,
            'discount' => $this->discount,
        ];
    }
}
