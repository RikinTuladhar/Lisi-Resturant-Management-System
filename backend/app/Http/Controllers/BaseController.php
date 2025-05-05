<?php

namespace App\Http\Controllers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class BaseController extends Controller
{
    use AuthorizesRequests;

    //
    public function sendResponse($result,$message){
        $response = [
            'success'=>true,
            'data' => $result,
            'message' => $message
        ];

        return response()->json($response,200);
    }

    public function sendErrorResponse($error,$errorMessage=[],$code=404){
        $response = [
            'success'=> false,
            'message'=>$errorMessage
        ];
        return response()->json($response,$code);
    }
}
