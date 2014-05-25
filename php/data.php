<?php
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


// read JSon input
$raw_data = file_get_contents('php://input');
$data_back = json_decode($raw_data);
// JSon request format is :
// {"database":"ccr","scale_categ":"2","view":{"left":"10", "top":"10", "right":"100", "bottom":"100"}}

debugvar($data_back);
debugvar($_ENV);
debugvar($_SENV);

// set json string to php variables
$database = 'ccr';
if (array_key_exists("database", $data_back)) {
    $database = $data_back->{"database"};
}
$scale_categ = 1;
if (array_key_exists("scale_categ", $data_back)) {
    $scale_categ = $data_back->{"scale_categ"};
}
$view = NULL;
if (array_key_exists("view", $data_back)) {
    $view = $data_back->{"view"};
}




// Connecting, selecting database

// OPENSHIFT specific
$host = getenv('OPENSHIFT_DB_HOST');
$port = getenv('OPENSHIFT_DB_PORT');
if ($host) {
    if ($port) {
        $host = $host . ":" . $port;
    }
    $link = mysql_connect($host, getenv('OPENSHIFT_DB_USERNAME'), getenv('OPENSHIFT_DB_PASSWORD'))
        or returnError('Could not connect: ' . mysql_error());
} else {
    returnError(json_encode("Unknown environment"));
}
debugmsg('Connected successfully');


mysql_select_db($database) or returnError('Could not select database');
$query = 'SELECT * FROM my_table';
$responses = mysql_query($query) or returnError('Query failed: ' . mysql_error());

while ($line = mysql_fetch_array($responses, MYSQL_ASSOC)) {
    foreach ($line as $col_value) {
        debugmsg($col_value);
    }
}

// Free resultset
mysql_free_result($responses);

// Closing connection
mysql_close($link);




// create json response
$responses = array();
//for ($i = 0; $i < 10; $i++) {
//    $responses[] = array("name" => $i, "email" => $userName . " " . $password . " " . $emailProvider);
//}
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
