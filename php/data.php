<?php

// http://stackoverflow.com/questions/12859942/why-shouldnt-i-use-mysql-functions-in-php

function debugmsg($foo)
{
   file_put_contents('php://stderr', print_r(
   "\n=============================================================\n", TRUE));
   file_put_contents('php://stderr', print_r($foo, TRUE));
   file_put_contents('php://stderr', print_r(
   "\n=============================================================\n", TRUE));
}
function debugvar($foo)
{
    debugmsg(var_export($foo, true));
}
// reports the error as json and terminates the execution
function returnError($foo)
{
    $responses = array();
    $responses[] = array("kind" => "error", "value" => $foo);
    die(json_encode($responses));
}
// extracts all real numbers from a string
function getRealNumbers($str)
{
    preg_match_all('/\d+\.*\d*/', $str, $matches);
    return $matches[0];
}

// read JSon input; JSon request format is :
// {"database":"ccr",
//  "scale_categ":"2",
//  "view":{
//    "left":"10", 
//    "top":"10", 
//    "right":"100", 
//    "bottom":"100"}
// }
$raw_data = file_get_contents('php://input');
$data_back = json_decode($raw_data);
debugvar($data_back);

// set json string to php variables
$database = 'ccr';
if (array_key_exists("database", $data_back)) {
    $database = $data_back->{"database"};
}
$scale_categ = 1;
if (array_key_exists("scale_categ", $data_back)) {
    $scale_categ = $data_back->{"scale_categ"};
} else {
    returnError('A layer (scale category) was not provided');
}
$view = NULL;
if (array_key_exists("view", $data_back)) {
    $view = $data_back->{"view"};
    if (!(array_key_exists("left", $view) &&
          array_key_exists("left", $view) &&
          array_key_exists("left", $view) &&
          array_key_exists("left", $view))) {
        returnError('A proper bounding box was not provided');
    }
} else {
    returnError('A bounding box was not provided');
}

// make sure input is numeric
$d_left = 0.0;
$d_top = 0.0;
$d_right = 0.0;
$d_bottom = 0.0;
$i_scale_categ = 1;
try {
	// make sure values are numbers
	$d_left = floatval($view->{'left'});
	$d_top = floatval($view->{'top'});
	$d_right = floatval($view->{'right'});
	$d_bottom = floatval($view->{'bottom'});
	$i_scale_categ = intval($scale_categ);
} catch(Exception $ex) {
	debugvar($view);
	debugvar($ex);
	returnError(json_encode("Input data not properly encoded: " . $ex->getMessage()));
}

debugvar($_ENV);
debugvar($_SERVER);

// get database specific info
$host = getenv('OPENSHIFT_MYSQL_DB_HOST');
$port = NULL;
$user = NULL;
$pass = NULL;
if ($host) { // OPENSHIFT specific
	$port = getenv('OPENSHIFT_MYSQL_DB_PORT');
    if ($port) {
        $host = $host . ":" . $port;
    }
    $user = getenv('OPENSHIFT_MYSQL_DB_USERNAME');
    $pass = getenv('OPENSHIFT_MYSQL_DB_PASSWORD');
    $database = getenv('OPENSHIFT_APP_NAME');
} else {
	
	$host = getenv('CCR_MYSQL_DB_HOST');
	if ($host) { // CCR specific
		$port = getenv('CCR_MYSQL_DB_PORT');
		if ($port) {
			$host = $host . ":" . $port;
		}
		$user = getenv('CCR_MYSQL_DB_USERNAME');
		$pass = getenv('CCR_MYSQL_DB_PASSWORD');
		$database = getenv('CCR_MYSQL_DB_NAME');
	} else {
		returnError(json_encode("Unknown environment"));
	}
}

// attempt a connection with provided information
$pdo = NULL;
try {
	$pdo = new PDO ('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8', $user, $pass);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch(PDOException $ex) {
	debugvar($ex);
	returnError(json_encode("Failed to connect to database database: " . $ex->getMessage()));
}
debugmsg('Connected successfully');

// we accumulate results in this array
$responses = array();

// execute the querry and export in our array
try {
	$query_base = "SELECT kind,AsText(bbox),assoc_data FROM spatialdata WHERE layer=".$i_scale_categ." AND Intersects( bbox, PolyFromText( 'POLYGON((".$d_left." ".$d_top.",".$d_right." ".$d_top.",".$d_right." ".$d_bottom.",".$d_left." ".$d_bottom.",".$d_left." ".$d_top."))', 0) ) LIMIT 10000000;";
	$myPDO = $pdo->query($query_base);
	while($row = $myPDO->fetch(PDO::FETCH_ASSOC)) {
		debugmsg($row["kind"]);
		debugmsg($row["AsText(bbox)"]);
		debugmsg($row["assoc_data"]);

		$assoc_data = unserialize($row["assoc_data"]); // $row["assoc_data"]) = serialize($assoc_data);
		$coords = getRealNumbers($row["AsText(bbox)"]);
		$proper_box = array($coords[0], $coords[1], $coords[2], $coords[5]);
		$responses[] = array_merge(array("kind" => $row["kind"], "box" => $proper_box ), $assoc_data);
	}
} catch(PDOException $ex) {
	debugvar($ex);
	returnError(json_encode("Failed to query database: " . $ex->getMessage()));
}




// some debug values to ensure non-empty
//$responses[] = array("kind" => "image", "box" => array(10, 10, 50, 50), "url" => "https://www.gravatar.com/avatar/" . "2a32c3039116405612b802f639557ffb?s=32&d=identicon&r=PG");
//$responses[] = array("kind" => "vector", "box" => array(20, 10, 50, 50), "vert" => array(20.0,20.2, 3.5,4.4, 100,10), "color" => "blue", "fill" => "transparent", "closed" => "true", "line_width" => "1" );
//$responses[] = array("kind" => "vector", "box" => array(200, 10, 50, 50), "vert" => array(200.0,200.2, 250.5,200.4, 250,250, 200,250), "color" => "blue", "fill" => "red", "closed" => "false");
//$responses[] = array("kind" => "html", "box" => array(30, 10, 50, 50), "value" => "<h1>Some text</h1>");
//$responses[] = array("kind" => "image", "box" => array(100, 100, 150, 150), "url" => "http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg");
//$responses[] = array("kind" => "text", "box" => array(30.15, 400.11, 250.45, 50.99), "value" => "<h1>Some text</h1>", "color" => "red", "style" => "fill", "font" => "Verdana", "size" => "1em");
//$responses[] = array("kind" => "text", "box" => array(30.15, 450.11, 250.45, 50.99), "value" => "<h1>Some text</h1>", "color" => "red", "style" => "stroke", "orient" => "normal", "weight" => "bold");

// JSon response format is :
// [{"kind":"kind", "box" => "10, 10", ...},
// {"kind":"kind", "box" => "10, 10", ...}]

// set header as json
header("Content-type: application/json");

// send response
echo json_encode($responses);
?>
