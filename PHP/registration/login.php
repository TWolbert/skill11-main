<?php 
    header("Access-Control-Allow-Origin: http://localhost:5173");
    require_once("../database/db.php");
    $response = ["status"=>"", "message"=>"", "token"=>"", "user_id"=>""];

    // Verify all variables are provided properly
    if (!isset($_POST["email"])) {
        $response["status"] = "fail";
        $response["message"] = "Email wasn't provided";
        http_response_code(400);
        echo json_encode($response);
        return;
    }

    if (!isset($_POST["password"])) {
        $response["status"] = "fail";
        $response["message"] = "Password wasn't provided";
        http_response_code(400);
        echo json_encode($response);
        return;
    }

    // Set all variables, make updated an @ variable in case it might be unchecked
    $email = $_POST["email"];
    $password = $_POST["password"];
    // Only get connection after validating input
    $conn = get_db();

    // Insert user into database
    $sql = "SELECT * FROM users WHERE user_email = :user_email";
    $query = $conn->prepare($sql);
    $res = $query->execute(["user_email"=>$email]);

    $password_hash = "";
    $userid = -1;
    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        $password_hash = $row["password_hash"];
        $userid = intval($row["user_id"]);
    }

    if ($password_hash == "") {
        $response["status"] = "fail";
        $response["message"] = "Couldn't find user";
        http_response_code(400);
        echo json_encode($response);
        return;
    }

    $passwordCorrect = password_verify($password, $password_hash);

    if (!$passwordCorrect) {
        $response["status"] = "fail";
        $response["message"] = "Password doesn't match";
        http_response_code(401);
        echo json_encode($response);
        return;
    }

    $token = bin2hex(random_bytes(16 / 2));

    $sql = "INSERT INTO user_tokens (user_id, user_token) VALUES (:id, :token)";
    $query = $conn->prepare($sql);
    $res = $query->execute(["id"=>$userid, "token"=>$token]);

    // Send fail code if MySQL rejects
    if (!$res) {
        $response["status"] = "fail";
        $response["message"] = "Something went wrong!";
        http_response_code(500);
        echo json_encode($response);
        return;
    }

    // Send response with implicit 200 response code
    $response["status"] = "success";
    $response["message"] = "Sucessfully logged in!";
    $response["token"] = $token;
    $response["user_id"] = $userid;
    echo json_encode($response);
    return;
?>