<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\JWTGuard;

class OrderController extends BaseController
{
    public $order;
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $order = OrderResource::collection(Order::with(['user', 'orderItems'])->get());
        return $this->sendResponse($order, 'Order retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Step 1: Validate Order Data (excluding items)
        $validator = Validator::make($request->all(), $this->order->rules());

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->all(),
            ], 422);
        }

        // Step 2: Validate Each Order Item Before Any DB Write
        $itemErrors = [];
        $orderItemRules = $this->order->orderItemRules(); // Must be defined in Order model

        foreach ($request->input('items', []) as $index => $item) {
            $itemValidator = Validator::make($item, $orderItemRules);
            if ($itemValidator->fails()) {
                $itemErrors[] = "Item #" . ($index + 1) . ": " . implode(', ', $itemValidator->errors()->all());
            }
        }

        if (!empty($itemErrors)) {
            return response()->json([
                'success' => false,
                'message' => $itemErrors,
            ], 422);
        }

        // Step 3: Proceed with Transaction
        DB::beginTransaction();
        try {
            $auth_user = auth()->user();

            $order = $auth_user->orders()->create($validator->validated());

            foreach ($request->input('items', []) as $item) {
                $order->orderItems()->create([
                    'item_id' => $item['item_id'],
                    'units' => $item['units'],
                    'order_price' => $item['order_price'],
                ]);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Order created successfully.',
                'data' => $order,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Order creation failed: ' . $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //

        $order = new  OrderResource(Order::with(['user', 'orderItems'])->find($order->id));
        return $this->sendResponse($order, 'Order retrieved successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
        $order->delete();
        return $this->sendResponse([], 'Order deleted successfully.');
    }
}
