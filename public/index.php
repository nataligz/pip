<?php
//Husk at start terminalen hver gang, og indsæt dette php -S 127.0.0.1:8000 -t public
require "./.env"; //Husk at ændre hvor env ligger 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$uri = parse_url($_SERVER ['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri );
$pipId = (string) $uri[1];


$requestType = $_SERVER["REQUEST_METHOD"];


$servername = "localhost:3306";
$username = "root";
$password = getenv("PASSWORD");



$conn = new PDO("mysql:host=$servername;dbname=pips", $username, $password);//Husk den rigtige databasr
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if($requestType == "GET"){
    try {
      
      $statement = $conn->query("select * from pips.pips order by idnew_table desc");
        $result = $statement->fetchAll();
    
        echo json_encode($result);
    } catch(PDOException $e) {
      echo "Connection failed: " . $e->getMessage();
    }
    } 
    elseif ($requestType == "POST"){
      // echo "You send a post";


      $input = (array) json_decode(file_get_contents('php://input'), TRUE);
    
      $brugernavn = $input["Brugernavn"];
      $besked = $input["Besked"];
    
      echo print_r($input);
    
      $sql = "INSERT INTO pips.pips VALUES (default, :Brugernavn, :Besked)";
      $statement = $conn->prepare($sql);
      $statement->execute(array('Brugernavn' => $brugernavn, 'Besked' => $besked));
    
      $id = $conn->lastInsertId();
      $data =(object) $input;
      $data->id=$id;
    
    }
  
    
    elseif ($requestType == "PUT") {
      $input = (array) json_decode(file_get_contents('php://input'), TRUE);

      $statement = "
            UPDATE pips
            SET
            Brugernavn = :brugernavn, 
            Besked = :besked 
            WHERE idnew_table = :id;
            ";
    
      try {
        $statement = $conn->prepare($statement);
        $statement->execute(array(
          'id' => (int) $input['id'],
          'brugernavn' => $input['brugernavn'],
          'besked' => $input['besked'],
        ));
      } catch (PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
      }
    }
    
    
     elseif ($requestType == "DELETE") {
      $input = (array) json_decode(file_get_contents('php://input'), TRUE);
      $id = $input["id"];
    
      $statement = "delete from pips.pips WHERE idnew_table = :id";
    
      try {
        $statement = $conn->prepare($statement);
        $statement->execute(array(
          'id' => (int)$id,
        ));
      } catch (PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
      }
    }







  


  

    

?>