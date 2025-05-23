<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'name' => $this->name,
            'status' => $this->status,
            'total_price' => $this->total_price,
            'invoice_id' => new InvoiceResource($this->whenLoaded('invoice')),
            'user' => $this->user->email,
            'order_items' => OrderItemResource::collection($this->whenLoaded('orderItems'))
        ];
    }
}
