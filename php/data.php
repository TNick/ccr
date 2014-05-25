<?php
// JSon request format is :
// {"database":"ccr","scale_categ":"2","view":{"left":"10", "top":"10", "right":"100", "bottom":"100"}}

// read JSon input
$data_back = json_decode(file_get_contents('php://input'));

// set json string to php variables
$database = $data_back->{"database"};
$scale_categ = $data_back->{"scale_categ"};
$view = $data_back->{"view"};

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
