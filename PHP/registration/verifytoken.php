<?php 
    header("Access-Control-Allow-Origin: http://localhost:5173");
    require_once("../database/db.php");
    require_once('../utilities/tokenverification.php');
    $response = ["status"=>"", "message"=>""];

    // Check if all variables are provided properly
    if (!isset($_POST["token"])) {
        $response["status"] = "fail";
        $response["message"] = "Token wasn't provided";
        http_response_code(400);
        echo json_encode($response);
        return;
    }

    if (!isset($_POST["user_id"])) {
        $response["status"] = "fail";
        $response["message"] = "User ID wasn't provided";
        http_response_code(400);
        echo json_encode($response);
        return;
    }

    // Set variables
    $token = $_POST["token"];
    $user_id = $_POST["user_id"];


    // Verify token is valid
    $validToken = VerifyToken($user_id, $token);

    // Send response
    if (!$validToken) {
        $response["status"] = "fail";
        $response["message"] = "Token invalid";
        http_response_code(401);
        echo json_encode($response);
        return;
    }

    $response["status"] = "success";
    $response["message"] = "Token is valid";
    echo json_encode($response);
    return;
?>