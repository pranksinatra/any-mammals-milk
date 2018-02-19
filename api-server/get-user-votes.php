<?php

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

require 'credentials.php';

// CORS Headers
if ( ! empty($_SERVER['HTTP_ORIGIN']) ) {
	$http_origin = $_SERVER['HTTP_ORIGIN'];

	$allowed_domains = [
	  'http://anymammalsmilk.com',
	  'http://localhost:3333',
	];

	if (in_array($http_origin, $allowed_domains)) {  
	    header("Access-Control-Allow-Origin: $http_origin");
	}
}

/**
 * Valid incoming GET or POST and key JSON parameters (user)
 */
if ( ! empty($_POST['data']) ) {
	$data = json_decode($_POST['data']);
}
else if ( ! empty($_GET['data']) ) {
	$data = json_decode($_GET['data']);
}
if ( empty($data) ) {
	return json(['error' => 'No data provided']);
}

/**
 * Validate user id, e.g.
 * 		facebook|10155462801394385
 * 		google-oauth2|118364659916223055925
 */
if ( empty($data->userId) || ! preg_match('/^[a-z-0-9]+\|[0-9]+$/', $data->userId) ) {
	return json(['error' => 'No userId provided']);
}
$userId = $data->userId;

/**
 * Get votes for user
 */
$conn = getDatabaseConnection(); // new mysqli(...)

if ($conn->connect_error) {
	return json(['error' => "Connection failed: " . $conn->connect_error]);
}

// $stmt = $conn->prepare("SELECT (mammal_id, vote) FROM votes WHERE user_id = ?");
$stmt = $conn->prepare("SELECT mammal_id, vote FROM votes WHERE user_id = ?");
$stmt->bind_param("s", $userId);

$stmt->execute();

$stmt->bind_result($mammalId, $vote);

$votes = [];

while ($stmt->fetch()) {
    $votes[$mammalId] = $vote;
}

$stmt->close();
$conn->close();

return json(['votes' => $votes]);

/**
 * Helper functions
 */
function json( $object ) {
	header('Content-Type: application/json');
	echo json_encode( $object );
}
