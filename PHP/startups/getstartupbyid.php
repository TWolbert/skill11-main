<?php
    header("Access-Control-Allow-Origin: http://localhost:5173");
    require_once("../database/db.php");
    $response = ["status"=>"", "message"=>"", "startup"=>[]];

    if (!isset($_POST["id"])) {
        $response["status"] = "fail";
        $response["message"] = "Startup id wasn't provided";
        http_response_code(400);
        echo json_encode($response);
        return;
    }

    $id = $_POST["id"];

    // Path is a GET path, no post variables required.
    $conn = get_db();
    $sql = "SELECT * FROM startups WHERE startup_id = :id;";
    $query = $conn->prepare($sql);
    $query->execute(["id"=>$id]);

    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        $startup = [
            "startup_id"=>$row["startup_id"],
            "startup_name"=>$row["startup_name"],
            "startup_tagline"=>$row["startup_tagline"],
            "startup_location"=>$row["startup_location"],
            "startup_description"=>$row["startup_description"],
            "startup_category"=>$row["startup_category"],
            "startup_logo_filename"=>$row["startup_logo_filename"],
        ];
        $response["status"] = "success";
        $response["message"] = "Startup found";
        $response["startup"] = $startup;
        echo json_encode($response);
        return;
    }   

    $response["status"] = "fail";
    $response["message"] = "Startup not found!";
    http_response_code(404);
    echo json_encode($response);
    return;
 
?>