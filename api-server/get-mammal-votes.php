<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
 * Get votes by mammal
 */
$conn = getDatabaseConnection(); // new mysqli(...)

if ($conn->connect_error) {
	return json(['error' => "Connection failed: " . $conn->connect_error]);
}

$stmt = $conn->prepare("
	SELECT 
		mammal_id, 
		sum(case when vote = 1 then 1 else 0 end) yes_votes,
		sum(case when vote = -1 then 1 else 0 end) no_votes 
	FROM `votes` 
	WHERE user_id NOT LIKE 'test%'
	GROUP BY mammal_id
");

$stmt->execute();

$stmt->bind_result($mammalId, $yes_votes, $no_votes);

$votes = [];

while ($stmt->fetch()) {
    $votes[$mammalId] = [$yes_votes, $no_votes];
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
