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



// read JSon input
$raw_data = file_get_contents('php://input');
$data_back = json_decode($raw_data);
// JSon request format is :
// {"database":"ccr","scale_categ":"2","view":{"left":"10", "top":"10", "right":"100", "bottom":"100"}}

debugvar($data_back);
//debugvar($_ENV);

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

// Connecting, selecting database

// OPENSHIFT specific
$host = getenv('OPENSHIFT_MYSQL_DB_HOST');
$port = getenv('OPENSHIFT_MYSQL_DB_PORT');
$user = '';
$pass = '';
if ($host) {
    if ($port) {
        $host = $host . ":" . $port;
    }
    $user = getenv('OPENSHIFT_MYSQL_DB_USERNAME');
    $pass = getenv('OPENSHIFT_MYSQL_DB_PASSWORD');
    //$link = mysql_connect($host, $user, $pass)
    //    or returnError('Could not connect: ' . mysql_error());
    $database = getenv('OPENSHIFT_APP_NAME');
} else {
    returnError(json_encode("Unknown environment"));
}

$pdo = new PDO ('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8', $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

debugmsg('Connected successfully');


// mysql_select_db($database) or returnError('Could not select database');

// we define a polygone (a rectangle) and ask for all records that intersect that rectangle
// and are part of specified layer
//$query_base = "SELECT kind,AsText(bbox),assoc_data FROM spatialdata WHERE layer=%5$d AND Intersects( bbox, PolyFromText( 'POLYGON((%1$f %2$f,%3$f %2$f,%3$f %4$f,%1$f %4$f))' ) ) LIMIT 10000000;";
//debugvar($query_base);
//$query = sprintf($query_base, $view->{"left"}, $view->{"top"}, $view->{"right"}, $view->{"bottom"}, $scale_categ);
//debugvar($query);
//$responses = mysql_query($query) or returnError('Query failed: ' . mysql_error());

// create json response
$responses = array();

$query_base = "SELECT kind,AsText(bbox),assoc_data FROM spatialdata WHERE layer=:layer AND Intersects( bbox, PolyFromText( 'POLYGON((:left :top,:right :top,:right :bottom,:left :bottom))' ) ) LIMIT 10000000;";
try {
	$myPDO = $pdo->prepare($query_base, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
    $myPDO->bindParam(':layer', $scale_categ, PDO::PARAM_INT);
    $myPDO->bindParam(':left', $view->{'left'}, PDO::PARAM_STR);
    $myPDO->bindParam(':top', $view->{'top'}, PDO::PARAM_STR);
    $myPDO->bindParam(':right', $view->{'right'}, PDO::PARAM_STR);
    $myPDO->bindParam(':bottom', $view->{'bottom'}, PDO::PARAM_STR);
	if($myPDO->execute()) {
		 
		while($row = $myPDO->fetch(PDO::FETCH_ASSOC)) {
			debugmsg($row["kind"]);
			debugmsg($row["bbox"]);
			debugmsg($row["assoc_data"]);

			$assoc_data = unserialize($row["assoc_data"]); // $row["assoc_data"]) = serialize($assoc_data);
			$coords = getRealNumbers($row["bbox"]);
			$proper_box = array($coords[0], $coords[1], $coords[2], $coords[5]);
			$responses[] = array_merge(array("kind" => $row["kind"], "box" => $proper_box ), $assoc_data);
		}
	}
    
} catch(PDOException $ex) {
	debugvar($ex);
	returnError(json_encode("Failed to query database: " . $ex->getMessage()));
}





//while ($row = mysql_fetch_assoc($responses, MYSQL_ASSOC)) {
    //debugmsg($row["kind"]);
    //debugmsg($row["bbox"]);
    //debugmsg($row["assoc_data"]);

    //$assoc_data = unserialize($row["assoc_data"]); // $row["assoc_data"]) = serialize($assoc_data);
    //$coords = getRealNumbers($row["bbox"]);
    //$proper_box = array($coords[0], $coords[1], $coords[2], $coords[5]);
    //$responses[] = array_merge(array("kind" => $row["kind"], "box" => $proper_box ), $assoc_data);
//}

// Free resultset
// mysql_free_result($responses);

// Closing connection
// mysql_close($link);



// CREATE TABLE IF NOT EXISTS 'spatialdata' (
//   'id' int(10) unsigned NOT NULL AUTO_INCREMENT,
//   'kind' enum('image','vector','html','text') NOT NULL,
//   'layer' int(10) unsigned NOT NULL,
//   'bbox' polygon NOT NULL,
//   'assoc_data' text NOT NULL,
//   PRIMARY KEY ('id'),
//   SPATIAL KEY 'bbox' ('bbox'),
//   KEY 'layer' ('layer')
// ) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='Spatial data for Cosmic Calendar Reloaded application';
// INSERT INTO 'ccr'.'spatialdata' ('id', 'kind', 'layer', 'assoc_data', 'bbox')
//   VALUES (NULL, 'image', '1', '1', '2', '2', '1', '545', PolyFromText('POLYGON((0.123 0.123,10.123 0.123,10.123 10.123,0.123 10.123,0.123 0.123))'));
// SELECT * FROM spatialdata WHERE layer=12 AND Intersects( bbox, PolyFromText( 'POLYGON((0.123 0.123,10.123 0.123,10.123 10.123,0.123 10.123,0.123 0.123))' ) );


$responses[] = array("kind" => "image", "box" => array(10, 10, 50, 50), "url" => "https://www.gravatar.com/avatar/" . "2a32c3039116405612b802f639557ffb?s=32&d=identicon&r=PG");
$responses[] = array("kind" => "vector", "box" => array(20, 10, 50, 50), "vert" => array(20.0,20.2, 3.5,4.4, 100,10), "color" => "blue", "fill" => "transparent", "closed" => "true", "line_width" => "1" );
$responses[] = array("kind" => "vector", "box" => array(200, 10, 50, 50), "vert" => array(200.0,200.2, 250.5,200.4, 250,250, 200,250), "color" => "blue", "fill" => "red", "closed" => "false");
$responses[] = array("kind" => "html", "box" => array(30, 10, 50, 50), "value" => "<h1>Some text</h1>");
$responses[] = array("kind" => "image", "box" => array(100, 100, 150, 150), "url" => "http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg");
$responses[] = array("kind" => "text", "box" => array(30.15, 400.11, 250.45, 50.99), "value" => "<h1>Some text</h1>", "color" => "red", "style" => "fill", "font" => "Verdana", "size" => "1em");
$responses[] = array("kind" => "text", "box" => array(30.15, 450.11, 250.45, 50.99), "value" => "<h1>Some text</h1>", "color" => "red", "style" => "stroke", "orient" => "normal", "weight" => "bold");

// JSon response format is :
// [{"kind":"kind", "box" => "10, 10", ...},
// {"kind":"kind", "box" => "10, 10", ...}]

// set header as json
header("Content-type: application/json");

// send response
echo json_encode($responses);
?>
