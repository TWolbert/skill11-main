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
    @$updated = $_POST["updated"] == null ? 0 : 1;
    $password = password_hash($_POST["password"], PASSWORD_BCRYPT);
    // Only get connection after validating input
    $conn = get_db();

    // Check if email doesn't already exist in database
    $sql = "SELECT count(user_email) as emails FROM users WHERE user_email = :user_email";
    $query = $conn->prepare($sql);
    $query->execute(["user_email"=>$email]);

    // Query
    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        $emailcount = intval($row["emails"]);

        if ($emailcount > 0) {
            $response["status"] = "fail";
            $response["message"] = "Email has already been used to vote!";
            http_response_code(400);
            echo json_encode($response);
            return;
        }
    }

    // Insert user into database
    $sql = "INSERT INTO users (user_email, user_updated, password_hash) VALUES (:user_email, :user_updated, :password_hash);";
    $query = $conn->prepare($sql);
    $res = $query->execute(["user_email"=>$email, "user_updated"=>$updated, "password_hash"=>$password]);

    if (!$res) {
        $response["status"] = "fail";
        $response["message"] = "Something went wrong!";
        http_response_code(500);
        echo json_encode($response);
        return;
    }

    // Get id of last inserted user for inserting the token
    $userid = $conn->lastInsertId();
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
    $response["message"] = "Succesfully registered account!";
    $response["token"] = $token;
    $response["user_id"] = $userid;
    echo json_encode($response);
    return;
?>