<?php 
    header("Access-Control-Allow-Origin: http://localhost:5173");
    require_once("../database/db.php");
    $response = ["status"=>"", "message"=>"", "startups"=>[], "total"=>[
        "concept"=>0,
        "presentation"=>0
    ]];

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
            "concept_points"=>0,
            "presentation_points"=>0
        ];
        array_push($startups, $startup);
    }   

    foreach($startups as &$startup) {
        $sql = "SELECT concept_points, presentation_points FROM votes WHERE startup_id = :id";
        $query = $conn->prepare($sql);
        $query->execute(["id"=>$startup["startup_id"]]);

        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $startup["concept_points"] += intval($row["concept_points"]);
            $startup["presentation_points"] += intval($row["presentation_points"]);
            $response["total"]["concept"] += intval($row["concept_points"]);
            $response["total"]["presentation"] += intval($row["presentation_points"]);
        }
    }
    $response["status"] = "success";
    $response["message"] = "Poll results calculated";
    $response["startups"] = $startups;
    echo json_encode($response);
?>