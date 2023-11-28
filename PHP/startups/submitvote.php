<?php 
    header("Access-Control-Allow-Origin: http://localhost:5173");
    require_once("../database/db.php");
    $response = ["status"=>"", "message"=>""];

    if (!isset($_POST["user_id"])) {
        $response["status"] = "fail";
        $response["message"] = "User ID wasn't provided";
        http_response_code(400);
        echo json_encode($response);
        return;
    }

    if (!isset($_POST["startup_id"])) {
        $response["status"] = "fail";
        $response["message"] = "Startup ID wasn't provided";
        http_response_code(400);
        echo json_encode($response);
        return;
    }

    if (!isset($_POST["concept"])) {
        $response["status"] = "fail";
        $response["message"] = "Concept score wasn't provided";
        http_response_code(400);
        echo json_encode($response);
        return;
    }

    if (!isset($_POST["presentation"])) {
        $response["status"] = "fail";
        $response["message"] = "Presentation score wasn't provided";
        http_response_code(400);
        echo json_encode($response);
        return;
    }

    $user_id = $_POST["user_id"];
    $startup_id = $_POST["startup_id"];
    $concept_points = $_POST["concept"];
    $presentation_points = $_POST["presentation"];


    $conn = get_db();

    $sql = "SELECT COUNT(vote_id) as voteCount FROM votes WHERE user_id = :user_id AND startup_id = :startup_id";
    $query = $conn->prepare($sql);
    $res = $query->execute([
        "user_id"=>$user_id,
        "startup_id"=>$startup_id,
    ]);

    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        $voteCount = intval($row["voteCount"]);

        if ($voteCount > 0) {
            $response["status"] = "fail";
            $response["message"] = "You've already voted on this startup";
            http_response_code(401);
            echo json_encode($response);
            return;
        }
    }

    $sql = "INSERT INTO votes (user_id, startup_id, concept_points, presentation_points) VALUES (:user_id, :startup_id, :concept_points, :presentation_points);";
    $query = $conn->prepare($sql);
    $res = $query->execute([
        "user_id"=>$user_id,
        "startup_id"=>$startup_id,
        "concept_points"=>$concept_points,
        "presentation_points"=>$presentation_points
    ]);

    if (!$res) {
        $response["status"] = "fail";
        $response["message"] = "Something went wrong!";
        http_response_code(500);
        echo json_encode($response);
        return;
    }

    $response["status"] = "success";
    $response["message"] = "Your vote has been recorded";
    echo json_encode($response);
?>