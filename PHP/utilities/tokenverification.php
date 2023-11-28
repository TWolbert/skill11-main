<?php
    require_once("../database/db.php");
    function VerifyToken($user_id, $token) { 
        // Get database connection
        $conn = get_db();

        // Select where token matches the specified parameters
        $sql = "SELECT COUNT(*) as tokens FROM user_tokens WHERE user_id = :id AND user_token = :token";
        $query = $conn->prepare($sql);

        $query->execute(["id"=>$user_id, "token"=>$token]);

        // Read out result and return true if it exists
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $tokens = intval($row["tokens"]);

            if ($tokens > 0) {
                return true;
            }
            return false;
        }

        return false;
    }
?>