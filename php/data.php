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
$responses[] = array("kind" => "image", "pos" => "10, 10", "url" => "https://www.gravatar.com/avatar/" . "2a32c3039116405612b802f639557ffb?s=32&d=identicon&r=PG");
$responses[] = array("kind" => "vector", "pos" => "20, 10", "vert" => array(1.0,2.2,3.5,4.4), "color" => "blue");
$responses[] = array("kind" => "html", "pos" => "30, 10", "value" => "<h1>Some text</h1>", "color" => "red");

// JSon response format is :
// [{"kind":"<kind>", "pos" => "10, 10", ...},
// {"kind":"<kind>", "pos" => "10, 10", ...}]

// set header as json
header("Content-type: application/json");

// send response
echo json_encode($responses);
?>
