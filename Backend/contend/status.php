<?php
include_once "error.php";

class contend_status extends contend {
	public $protect = true;

	public function controller() {
		global $db, $room_name;
		$cmd = null;
		if ($_POST['type'] == 'addr') {
			$result = $db->query("SELECT * FROM log WHERE addr=$this->addr ORDER BY TIME DESC LIMIT 1");
			// foreach ($_POST as $k=>$p) echo "<div>$k => $p</div>";
			if ($row = $result->fetchArray()) {
				if ((isset($_POST['auto_mode']) && ($row['mode'] != $_POST['auto_mode']))) {
					switch ($_POST['auto_mode']) {
						case 'AUTO':
							$cmd[] = "M01";
							break;
						case 'MANU':
							$cmd[] = "M00";
							break;
					}
				}
				$temp = (int)($_POST['w_temp'] * 2);
				if (($_POST['w_temp'] != '') && ($temp >= 9) && ($temp <= 61) && ((int)($row['wanted'] / 50) != $temp)) {
					$cmd[] = sprintf("A%02x", $temp);
				} else {
					if ($cmd) $cmd[] = 'D'; // update status
				}
			}
		} else if ($_POST['type'] == 'all') {
			foreach ($room_name as $k => $v) {
				$result = $db->query("SELECT * FROM log WHERE addr=$k ORDER BY time DESC LIMIT 1");
				if ($row = $result->fetchArray()) {
					if ((isset($_POST["auto_mode_$k"]) && ($row['mode'] != $_POST["auto_mode_$k"]))) {
						switch ($_POST["auto_mode_$k"]) {
							case 'AUTO':
								$cmd[$k][] = "M01";
								break;
							case 'MANU':
								$cmd[$k][] = "M00";
								break;
						}
					}
					$temp = (int)($_POST["w_temp_$k"] * 2);
					if (($_POST["w_temp_$k"] != '') && ($temp >= 9) && ($temp <= 61) && ((int)($row['wanted'] / 50) != $temp)) {
						$cmd[$k][] = sprintf("A%02x", $temp);
					} else {
						if ($cmd[$k]) $cmd[$k][] = 'D'; // update status
					}
				}
			}
		}
		return $cmd;
	}

	public function view() {
		global $db, $room_name, $chart_hours;

		$response = array();

		if ($this->addr > 0) {

			$response['type'] = 'specific';

			$result = $db->query("SELECT * FROM log WHERE addr=$this->addr ORDER BY time DESC LIMIT 1");

			if ($row = $result->fetchArray()) {

				$valve = $room_name[$row['addr']];

				$response['valves'][$valve]['last_update'] = $row['time'];
				$response['valves'][$valve]['mode'] = $row['mode'];
				$response['valves'][$valve]['wanted'] = $row['wanted'];
				$response['valves'][$valve]['valve_pos'] = $row['valve'];
				$response['valves'][$valve]['real_temp'] = $row['real'];
				$response['valves'][$valve]['name'] = $valve;
				$response['valves'][$valve]['battery'] = array();


				if ($GLOBALS['error_mask']['BAT_E'] & $row['error']) {
					$response['valves'][$valve]['battery']['status'] = 'error';
				} else if ($GLOBALS['error_mask']['BAT_W'] & $row['error']) {
					$response['valves'][$valve]['battery']['status'] = 'warning';
				} else {
					$response['valves'][$valve]['battery']['status'] = 'ok';
				}
				$response['valves'][$valve]['battery']['voltage'] = $row['battery'];
				$response['valves'][$valve]['errors'] = array();

				$response['valves'][$valve]['errors']['status'] = 'ok';
				foreach ($GLOBALS['error_mask'] as $k => $v) {
					if ($v & $row['error']) {
						$response['valves'][$valve]['errors']['status'] = 'error';
						$response['valves'][$valve]['errors'][$v] = $k;
					}
				}
				$response['valves'][$valve]['window'] = $row['window'];

				$result = $db->query("SELECT * FROM versions WHERE addr=$this->addr LIMIT 1");
				if ($row = $result->fetchArray()) {
					$response['valves'][$valve]['version'] = array(
						'data' => $row['data'],
						'update' => $row['time']
					);
				}
			}

		} else {


			$response['type'] = "overview";
			$response["valves"] = array();

			foreach ($room_name as $k => $v) {

				$response['valves'][$v] = array(
					'id' => $k,
					'status' => array()
				);

				$result = $db->query("SELECT * FROM log WHERE addr=$k ORDER BY time DESC LIMIT 1");
				if ($row = $result->fetchArray()) {
					$age = time() - $row['time'];
					if ($age > $GLOBALS['error_age']) {
						$response['valves'][$v]['status']['type'] = 'error';
					} else if ($age > $GLOBALS['warning_age']) {
						$response['valves'][$v]['status']['type'] = 'warning';
					} else {
						$response['valves'][$v]['status']['type'] = 'ok';
					}
					$response['valves'][$v]['last_update'] = $row['time'];
					$response['valves'][$v]['mode'] = $row['mode'];
					$response['valves'][$v]['wanted'] = $row['wanted'];
					$response['valves'][$v]['valve_pos'] = $row['valve'];
					$response['valves'][$v]['real_temp'] = $row['real'];
					$response['valves'][$v]['name'] = $v;
					$response['valves'][$v]['battery'] = array();

					if ($GLOBALS['error_mask']['BAT_E'] & $row['error']) {
						$response['valves'][$v]['battery']['status'] = 'error';
					} else if ($GLOBALS['error_mask']['BAT_W'] & $row['error']) {
						$response['valves'][$v]['battery']['status'] = 'warning';
					} else {
						$response['valves'][$v]['battery']['status'] = 'ok';
					}
					$response['valves'][$v]['battery']['voltage'] = $row['battery'];
					$response['valves'][$v]['errors'] = array();

					$response['valves'][$v]['errors']['status'] = 'ok';
					foreach ($GLOBALS['error_mask'] as $key => $val) {
						if ($val & $row['error']) {
							$response['valves'][$v]['errors']['status'] = 'error';
							$response['valves'][$v]['errors'][$val] = $key;
						}
					}
					$response['valves'][$v]['window'] = $row['window'];
				}
			}
//			global $PLOTS_DIR, $RRD_DAYS, $RRD_ENABLE;
//
//			if ($RRD_ENABLE) {
//				foreach ($room_name as $k => $v) {
//					$rrdgraph = $PLOTS_DIR . '/openhr20_' . $k . '_' . $RRD_DAYS[0] . '.png';
//					if (file_exists($rrdgraph)) {
//						echo '<p>';
//						echo '<div>RRD for last ' . $RRD_DAYS[0] . ' days: ' . $v . '</div>';
//						echo '<img src="' . $rrdgraph . '"/>';
//						echo '</p>';
//					}
//				}
//			}
		}

//		var_dump($response);
		return $response;
	}
}
