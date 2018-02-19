<?php

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

require 'credentials.php';

// If browser aborted request (while user is leaving page), process it anyway
ignore_user_abort(true);

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
 * Valid incoming GET or POST and key JSON parameters (user & votes)
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
 * Validate votes, e.g.
 * 	[
 * 		{ mammalId: 'Dama mesopotamica', vote: 1 },
 * 		{ mammalId: 'Okapia johnstoni', vote: -1 }
 * 	]
 */
if ( empty($data->votes) or ! is_array($data->votes) ) {
	return json(['error' => 'No votes provided']);
}
foreach ($data->votes as $vote) {
	if ( empty($vote->mammalId) || ! preg_match('/^[a-z ]+$/i', $vote->mammalId) ) {
		return json(['error' => 'Invalid mammalId', 'vote object' => $vote]);
	}
	if ( empty($vote->vote) || ! in_array($vote->vote, [1, -1]) ) {
		return json(['error' => 'Invalid vote', 'vote object' => $vote]);
	}
}
$votes = $data->votes;

/**
 * Add vote(s) to database
 */
$conn = getDatabaseConnection(); // new mysqli(...)

if ($conn->connect_error) {
	return json(['error' => "Connection failed: " . $conn->connect_error]);
}

$stmt = $conn->prepare("INSERT INTO votes (mammal_id, user_id, vote) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $mammalId, $userId, $vote);

foreach ($votes as $voteObject) {
	
	$mammalId = $voteObject->mammalId;
	$vote = $voteObject->vote;
	
	$stmt->execute();

}

$stmt->close();
$conn->close();

return json(['success' => true]);

/**
 * Helper functions
 */
function json( $object ) {
	header('Content-Type: application/json');
	echo json_encode( $object );
}
