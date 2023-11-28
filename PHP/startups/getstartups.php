<?php 
    header("Access-Control-Allow-Origin: http://localhost:5173");
    require_once("../database/db.php");
    $response = ["status"=>"", "message"=>"", "startups"=>[]];

    // Path is a GET path, no post variables required.
    $conn = get_db();
    $sql = "SELECT * FROM startups;";
    $query = $conn->prepare($sql);
    $query->execute();

    // Loop over provided data and add data to array
    $startups = [];
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
        array_push($startups, $startup);
    }   

    // Check if it found anything
    if (count($startups) == 0) {
        $response["status"] = "fail";
        $response["message"] = "No startups found";
        http_response_code(500);
        echo json_encode($response);
        return;
    }

    // Send response if found, bind all variables
    $response["status"] = "success";
    $response["message"] = "Startups found";
    $response["startups"] = $startups;
    echo json_encode($response);
    return;
?>