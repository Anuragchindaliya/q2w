<?php
header('Content-Type: application/json; charset=utf-8');


$allGetRoutes = [
	"/q2wapi",
	"/api/rooms",
	"/api/room"
];
$allPostRoutes = [
	"/api/createroom",
	"/api/updateroom"
];
function get_client_ip()
{
	$ipaddress = '';
	if (isset($_SERVER['HTTP_CLIENT_IP']))
		$ipaddress = $_SERVER['HTTP_CLIENT_IP'];
	else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
		$ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
	else if (isset($_SERVER['HTTP_X_FORWARDED']))
		$ipaddress = $_SERVER['HTTP_X_FORWARDED'];
	else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
		$ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
	else if (isset($_SERVER['HTTP_FORWARDED']))
		$ipaddress = $_SERVER['HTTP_FORWARDED'];
	else if (isset($_SERVER['REMOTE_ADDR']))
		$ipaddress = $_SERVER['REMOTE_ADDR'];
	else
		$ipaddress = 'UNKNOWN';
	return $ipaddress;
}

function throwJson($result, $successJson, $errorJson)
{
	if ($result > 0) {
		echo json_encode(array_merge(
			[
				'status' => 'success'
			],
			$successJson
		));
	} else {
		echo json_encode(array_merge(
			[
				'status' => 'error'
			],
			$errorJson
		));
	}
}

function app_db()
{
	include_once ABSPATH . '/app-config.php';

	$db_conn = array(
		'host' => DB_HOST,
		'user' => DB_USER,
		'pass' => DB_PASSWORD,
		'database' => DB_NAME,
	);
	$db = new SimpleDBClass($db_conn);

	return $db;
}
$router->map('GET', '/', function () {
	$ajax_url = AJAX_URL;

	include  ABSPATH . '/views/index.php';
});
$router->map('GET', '/api/users', function () {
	$db = app_db();

	// $email =  $db->CleanDBData($_GET['email']);

	$q0 = $db->select("select * from  spark_students");

	if ($q0 > 0) {
		echo json_encode(array(
			'status' => 'success',
			'msg' => 'found records',
			'data' => $q0,
		));
	} else {
		echo json_encode(array(
			'status' => 'error',
			'msg' => 'no records found',
			'data' => $q0,
		));
	}
});




$router->map('GET', '/api/email', function () {
	$db = app_db();

	$email =  $db->CleanDBData($_GET['email']);

	$q0 = $db->select("select * from  t1 where email='$email' ");

	if ($q0 > 0) {
		echo json_encode(array(
			'status' => 'succes',
			'msg' => 'found records',
			'emails' => $q0,
		));
	} else {
		echo json_encode(array(
			'status' => 'error',
			'msg' => 'no records found',
			'emails' => $q0,
		));
	}
});


$router->map('GET', '/v1/api/[*:action]/t1', function ($id) {
	$db = app_db();

	$email =  $db->CleanDBData($id);

	$q0 = $db->select("select * from  t1 where email='$email' ");

	if ($q0 > 0) {
		echo json_encode(array(
			'status' => 'succes',
			'msg' => 'found records',
			'emails' => $q0,
		));
	} else {
		echo json_encode(array(
			'status' => 'error',
			'msg' => 'no records found',
			'emails' => $q0,
		));
	}
});


//get all rooms

if ($_SERVER['REQUEST_METHOD'] === "GET" && !in_array($_SERVER['REQUEST_METHOD'], $allGetRoutes)) {
	$router->map('GET', '/api/rooms', function () {
		$db = app_db();

		// $email =  $db->CleanDBData($_GET['email']);

		$q0 = $db->select("SELECT * FROM  rooms");

		throwJson(
			$q0,
			[
				'msg' => count($q0) . ' records found',
				'data' => $q0,
			],
			[
				'msg' => 'No records found',
				'data' => $q0
			]
		);
	});
	//get room by id
	$router->map('GET', '/api/room', function () {
		$db = app_db();

		$room_id =  $db->CleanDBData($_GET['room_id']);
		if (!$room_id) {
			echo json_encode(array(
				'status' => 'failure',
				'msg' => 'room_id is missing in params',
			));
		} else {
			$result = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id'");

			if ($result > 0) {
				echo json_encode(array(
					'status' => 'success',
					'msg' => count($result) . ' record(s) found',
					'data' => $result[0],
				));
			} else {
				echo json_encode(array(
					'status' => 'error',
					'msg' => 'no records found',
				));
			}
		}
	});
} else if ($_SERVER['REQUEST_METHOD'] === "POST" && !in_array($_SERVER['REQUEST_METHOD'], $allPostRoutes)) {
	//create room by id
	$router->map('POST', '/api/createroom', function () {
		$db = app_db();

		$room_id =  $db->CleanDBData($_POST['room_id']);
		if (!$room_id) {
			echo json_encode(array(
				'status' => 'error',
				'msg' => 'room_id is missing in params',
			));
		} else {
			if (isset($_POST["pass"])) {
				$password = $db->CleanDBData($_POST["pass"]);
				$result = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id' AND pass = '$password'");
				if (!$result) {
					die(json_encode(array(
						'status' => 'failure',
						'msg' => 'wrong password',
						'data' => $result,
					)));
				} else {
					die(json_encode(array(
						'status' => 'already',
						'msg' => 'valid password',
						'data' => $result[0],
					)));
				}
			} else {
				$existRoom = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id'");
				if (gettype($existRoom) === "array") {
					if (empty($existRoom[0]["pass"])) {
						die(json_encode(array(
							'status' => 'already',
							'msg' => 'room is already exist',
							'data' => $existRoom[0],
						)));
					} else {
						die(json_encode(array(
							'status' => 'secure',
							'msg' => 'room is secure password needed',
							'data' => null,
						)));
					}
				} else {
					$insertStatus = $db->Insert("rooms", ["room_id" => $room_id, "ip" => get_client_ip()]);
					$insertResult = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id'");
					if ($insertStatus) {
						die(json_encode(array(
							'status' => 'success',
							'msg' => 'Room Created successfully',
							'data' => $insertResult[0],
						)));
					} else {
						die(json_encode(array(
							'status' => 'failure',
							'msg' => 'Unable to create room',
							'data' => null,
						)));
					}
				}
			}
		}
	});
	// create room id end

	//resuable function 
	function validatePostParams($requiredFields)
	{
		// echo print_r($fields);
		foreach ($requiredFields as $key) {
			if (!isset($_POST[$key]) || is_null($_POST[$key])) {
				echo json_encode(array(
					'status' => 'failure',
					'msg' => "$key is missing in params",
					'data' => null,
				));
				die();
			}
		}
		return true;
	}

	//set password by room id
	$router->map('POST', '/api/setauth', function () {
		$db = app_db();
		$requiredFields = ["room_id", "pass"];

		if (validatePostParams($requiredFields)) {
			$room_id =  $db->CleanDBData($_POST['room_id']);
			$pass =  md5($db->CleanDBData($_POST['pass']));

			$idResult = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id' and (pass IS NULL or pass = ' ')");
			if (!$idResult) {
				echo json_encode(array(
					'status' => 'failure',
					'msg' => 'Room id is not exist or secure',
					'data' => $idResult,
				));
			} else {
				$dataToSend = ["pass" => $pass, "ip" => get_client_ip()];
				if (isset($_POST["email"])) {
					$dataToSend["email"] = $db->CleanDBData($_POST["email"]);
				}
				
				$result = $db->Update("rooms", $dataToSend, ["room_id" => $room_id]);

				if ($result) {
					$response = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id'");
					echo json_encode(array(
						'status' => 'success',
						'msg' => 'password set Successfully',
						'data' => $response,
					));
				} else {
					echo json_encode(array(
						'status' => 'failure',
						'msg' => 'unable to set password',
						'data' => $result,
					));
				}
			}
			die();
		}
	});

	//validate password by room id
	$router->map('POST', '/api/login', function () {
		$db = app_db();
		$requiredFields = ["room_id", "pass"];

		if (validatePostParams($requiredFields)) {
			$room_id =  $db->CleanDBData($_POST['room_id']);
			$pass =  md5($db->CleanDBData($_POST['pass']));

			$idResult = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id'");
			if (gettype($idResult) !== "array") {
				echo json_encode(array(
					'status' => 'error',
					'msg' => 'Room id is not exist',
					'data' => $idResult,
				));
			} else {
				$passResult = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id' AND pass = '$pass'");
				if (gettype($passResult) === "array") {
					echo json_encode(array(
						'status' => 'success',
						'msg' => 'Valid password',
						'data' => $passResult[0],
					));
				} else {
					echo json_encode(array(
						'status' => 'failure',
						'msg' => 'incorrect roomid\'s password',
						'data' => $passResult,
					));
				}
			}
			die();
		}
	});

	//validate password by room id
	$router->map('POST', '/api/checkauth', function () {
		$db = app_db();
		$requiredFields = ["room_id", "pass"];

		if (validatePostParams($requiredFields)) {
			$room_id =  $db->CleanDBData($_POST['room_id']);
			$pass =  $db->CleanDBData($_POST['pass']);

			$idResult = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id'");
			if (gettype($idResult) !== "array") {
				echo json_encode(array(
					'status' => 'error',
					'msg' => 'Room id is not exist',
					'data' => $idResult,
				));
			} else {
				$passResult = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id' AND pass = '$pass'");
				if (gettype($passResult) === "array") {
					echo json_encode(array(
						'status' => 'success',
						'msg' => 'Valid password',
						'data' => $passResult[0],
					));
				} else {
					echo json_encode(array(
						'status' => 'failure',
						'msg' => 'incorrect roomid\'s password',
						'data' => $passResult,
					));
				}
			}
			die();
		}
	});

	//update room by id
	$router->map('POST', '/api/updateroom', function () {
		$db = app_db();
		$requiredFields = ["room_id", "content"];
		if (validatePostParams($requiredFields)) {
			$room_id =  $db->CleanDBData($_POST['room_id']);
			$idResult = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id'");

			if (gettype($idResult) !== "array") {
				echo json_encode(array(
					'status' => 'error',
					'msg' => 'Room id is not exist',
					'data' => $idResult,
				));
			} else {
				// optional fields
				$allFields = ["content", "pass"];
				$dataToSend = [];
				foreach ($allFields as $field) {
					if (isset($_POST[$field])) {
						if ($field === "pass") {
							$dataToSend["pass"] = md5($_POST[$field]);
						} else {
							$dataToSend[$field] = $db->CleanDBData($_POST[$field]);
						}
					}
				}
				$dataToSend["ip"] = get_client_ip();
				// $pass = $db->CleanDBData($_POST['pass']);
				// $last_modified = $_POST['last_modified'];

				// echo print_r($dataToSend);
				// die();
				// echo $last_modified;
				// die();
				// $result = $db->Insert("INSERT INTO rooms (room_id) VALUES('$room_id')");
				$result = $db->Update("rooms", $dataToSend, ["room_id" => $room_id]);

				if ($result > 0) {
					$idResult = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id'");
					echo json_encode(array(
						'status' => 'success',
						'msg' => 'Room is updated',
						'data' => $idResult[0],
					));
				} else {
					echo json_encode(array(
						'status' => 'error',
						'msg' => 'Failed to update room',
						'data' => $result,
					));
				}
			}
		}
	});

	//update content
	$router->map('POST', '/api/updatecontent', function () {
		$db = app_db();

		$requiredFields = ["room_id", "content"];
		if (validatePostParams($requiredFields)) {
			$room_id =  $db->CleanDBData($_POST['room_id']);

			if (isset($_POST["pass"])) {
				$password = $db->CleanDBData($_POST['pass']);
				$secureIdResult = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id' AND pass = '$password'");
				if (gettype($secureIdResult) !== "array") {

					die(json_encode(array(
						'status' => 'error',
						'msg' => 'roomid or password is incorrect',
						'data' => $secureIdResult,
					)));
				} else {
					$dataToSend = ["content" => $db->CleanDBData($_POST['content']), "ip" => get_client_ip()];
					$updateResult = $db->Update("rooms", $dataToSend, ["room_id" => $room_id]);
					if ($updateResult) {
						$newResult = $db->Select("SELECT * FROM rooms WHERE room_id = '$room_id'");
						echo json_encode(array(
							'status' => 'success',
							'msg' => 'updated successfully',
							'data' => $newResult[0],
						));
					} else {
						echo json_encode(array(
							'status' => 'failure',
							'msg' => 'fail to update',
							'data' => $secureIdResult,
						));
					}
				}
			} else {
				//without password
				$idResult = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id' AND ( pass IS NULL OR pass = ' ')");
				if (!$idResult) {
					die(json_encode(array(
						'status' => 'failure',
						'msg' => 'Room is secure password missing',
						'data' => $idResult,
					)));
				} else {
					$dataToSend = ["content" => $db->CleanDBData($_POST['content']), "ip" => get_client_ip()];
					$updateResult = $db->Update("rooms", $dataToSend, ["room_id" => $room_id]);
					$newResult = $db->Select("SELECT * FROM rooms WHERE room_id = '$room_id'");
					if ($updateResult) {
						die(json_encode(array(
							'status' => 'success',
							'msg' => 'updated successfully',
							'data' => $newResult[0],
						)));
					} else {
						die(json_encode(array(
							'status' => 'failure',
							'msg' => 'fail to update',
							'data' => $idResult,
						)));
					}
				}
			}
		}
	});
	// update content end

} else {
	echo json_encode(array(
		'status' => 'error',
		'msg' => 'only get Method is allowed for this route',
	));
}
