<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('html_errors', 1);

setcookie('XDEBUG_SESSION', 'PHPSTORM', time() + 10 * 365 * 24 * 60 * 60);

$ts = microtime(true);
include "config.php";
include "common.php";

$refresh = false;

// controller part
{ // common
	$addr = (int)$_GET['addr'];
	if (isset($room_name[$addr]))
		$name = $room_name[$addr];
	else
		$name = $addr;
	if (isset($_GET['page'])) {
		$page = cleanString($_GET['page']);
	} else {
		$page = "status";
	}
	$contend_class = "contend_$page";

	if (!file_exists("contend/$page.php")) die('Motherfucker!');

	include "contend/$page.php";
	$contend = new $contend_class($addr);
	$cmd1 = $contend->controller();
	$redirect2queue = false;
	if ($cmd1) {
		if ($page != 'queue') {
			include "contend/queue.php";
			$contend2 = new contend_queue($addr);
			$contend2->add_to_queue($cmd1);
		} else {
			$contend->add_to_queue($cmd1);
		}
		unset($cmd1);
	}
	if ($contend->protect) {
		if ($addr > 0)
			$result = $db->query("SELECT count(*) AS cnt FROM command_queue WHERE addr=$addr");
		else
			$result = $db->query("SELECT count(*) AS cnt FROM command_queue");
		$row = $result->fetchArray();
		if ($row['cnt'] > 0) {

			if (isset($contend2)) $contend = $contend2;
			else {
				include "contend/queue.php";
				$contend = new contend_queue($addr);
			}
			$contend->warning = true;
			$refresh = true;
		}
	}
}

$response = $contend->view();

if ($refresh) {

	$response['refresh'] = true;
}

header("Content-type: application/json");
echo json_encode($response);