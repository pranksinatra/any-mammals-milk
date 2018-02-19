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
if ( empty($data->id) || ! preg_match('/^[a-z-0-9]+\|[0-9]+$/', $data->id) ) {
	return json(['error' => 'Invalid user id']);
}
$id = $data->id;



/**
 * Validate user email
 */
if ( empty($data->email) or ! filter_var($data->email, FILTER_VALIDATE_EMAIL) ) {
	return json(['error' => 'Invalid user email']);
}
$email = $data->email;

/**
 * Validate basic, 1-50 character text fields
 */
if ( empty($data->first_name) or strlen($data->first_name) > 50 ) {
	return json(['error' => 'Invalid user first_name']);
}
if ( empty($data->last_name) or strlen($data->last_name) > 50 ) {
	return json(['error' => 'Invalid user last_name']);
}
if ( empty($data->gender) or strlen($data->gender) > 50 ) {
	return json(['error' => 'Invalid user gender']);
}
$first_name = $data->first_name;
$last_name = $data->last_name;
$gender = $data->gender;

/**
 * Validate image
 */
if ( empty($data->image) or strlen($data->image) > 200 or ! filter_var($data->image, FILTER_VALIDATE_URL) ) {
	return json(['error' => 'Invalid user image']);
}
$image = $data->image;


/**
 * Add user data to database
 */
$conn = getDatabaseConnection(); // new mysqli(...)

if ($conn->connect_error) {
	return json(['error' => "Connection failed: " . $conn->connect_error]);
}

// Ughhhh, so ugly!!! 
// @todo -> refactor this
$stmt = $conn->prepare("
	INSERT INTO users (id, first_name, last_name, email, gender, image) 
	VALUES (?, ?, ?, ?, ?, ?)
	ON DUPLICATE KEY UPDATE first_name = ?, last_name = ?, email = ?, gender = ?, image = ?
");
$stmt->bind_param("sssssssssss", $id, $first_name, $last_name, $email, $gender, $image, $first_name, $last_name, $email, $gender, $image);

$stmt->execute();

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
