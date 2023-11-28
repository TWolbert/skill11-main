<?php 
    function get_db() {
        $PDO = new PDO("mysql:host=localhost;dbname=skills11", "root", "");
        try {
            $PDO->setAttribute(PDO::ERRMODE_EXCEPTION, PDO::ERRMODE_WARNING);
            return $PDO;
        }
        catch (PDOException $e) {
            throw $e;
        }
    }
?>