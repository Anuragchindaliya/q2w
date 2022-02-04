<?php
header('Content-Type: application/json; charset=utf-8');


$allGetRoutes = [
	"/api/rooms",
	"/api/room"
];
$allPostRoutes = [
	"/api/createroom",
	"/api/updateroom"
];

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

if ($_SERVER['REQUEST_METHOD'] === "GET" && !in_array($_SERVER['REDIRECT_URL'], $allGetRoutes)) {
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
} else if ($_SERVER['REQUEST_METHOD'] === "POST" && !in_array($_SERVER['REDIRECT_URL'], $allPostRoutes)) {
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
			$result = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id'");
			if (gettype($result) === "array") {
				echo json_encode(array(
					'status' => 'already',
					'msg' => 'Room id is already exist',
					'data' => $result[0],
				));
			} else {
				// $result = $db->Insert("INSERT INTO rooms (room_id) VALUES('$room_id')");
				$result = $db->Insert("rooms", ["room_id" => $room_id]);

				if ($result > 0) {
					echo json_encode(array(
						'status' => 'success',
						'msg' => 'Room id Created',
						'data' => $result,
					));
				} else {
					echo json_encode(array(
						'status' => 'error',
						'msg' => 'Failed to create room id',
						'data' => $result,
					));
				}
			}
		}
	});

	//update room by id
	$router->map('POST', '/api/updateroom', function () {
		$db = app_db();

		$room_id =  $db->CleanDBData($_POST['room_id']);
		if (!$room_id) {
			echo json_encode(array(
				'status' => 'failure',
				'msg' => 'room_id is missing in params',
				'data' => null,
			));
		} else {
			$result = $db->select("SELECT * FROM rooms WHERE room_id = '$room_id'");

			if (gettype($result) !== "array") {
				echo json_encode(array(
					'status' => 'error',
					'msg' => 'Room id is not exist',
					'data' => $result,
				));
			} else {
				$content = $db->CleanDBData($_POST['content']);
				$last_modified = $_POST['last_modified'];
				// echo $last_modified;
				// die();
				// $result = $db->Insert("INSERT INTO rooms (room_id) VALUES('$room_id')");
				$result = $db->Update("rooms", ["content" => $content, "last_modified" => $last_modified], ["room_id" => $room_id], []);

				if ($result > 0) {
					echo json_encode(array(
						'status' => 'success',
						'msg' => 'Room is updated',
						'data' => $result,
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
} else {
	echo json_encode(array(
		'status' => 'error',
		'msg' => 'only get Method is allowed for this route',
	));
}
