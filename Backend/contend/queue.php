<?php

class contend_queue extends contend {
	public $warning = false;

	public function add_to_queue($r) {
		global $db, $_GET;
		if ($r == null) return;
		$db->query("BEGIN TRANSACTION");
		$t = time();
		foreach ($r as $k => $i) {
			if (is_array($i)) {
				foreach ($i as $j) {
					$db->query("INSERT INTO command_queue (time,addr,data) VALUES ("
						. $t . ',' . $k . ",'$j');");
				}
			} else {
				$db->query("INSERT INTO command_queue (time,addr,data) VALUES ("
					. $t . ',' . $this->addr . ",'$i');");
			}
		}
		$db->query("COMMIT");
	}


	public function controller() {

		$cmd = array();
		// timmers

		if ($_GET['read_timers'] == 1) {
			for ($i = 0; $i < 8; $i++) {
				for ($j = 0; $j < 8; $j++) {
					$cmd[] = "R$i$j";
				}
			}
		}

		if ($_GET['read_eeprom'] == 1) {
			$cmd[] = "Gff";
			for ($i = 0; $i < 0x32; $i++) {
				$cmd[] = sprintf("G%02x", $i);
			}
		}

		if ($_GET['read_trace'] == 1) {
			$cmd[] = "Tff";
			for ($i = 0; $i <= 0x0d; $i++) {
				$cmd[] = sprintf("T%02x", $i);
			}
		}

		if ($_GET['read_info'] == 1) {
			$cmd[] = "D";
			$cmd[] = "V";
		}

		return $cmd;
	}

	public function view() {
		global $db, $refresh_value;
		$response = array();

		$query = "SELECT count(*) AS cnt FROM command_queue";
		if ($this->addr > 0) {
			$response['addr'] = $this->addr;
			$query .= " WHERE addr=$this->addr";
		}
		$result = $db->query($query);
		$row = $result->fetchArray(SQLITE3_ASSOC);

		$response['commands_count'] = $row['cnt'];

		if ($this->warning) {
			$response['refresh'] = $refresh_value;
		}

		return $response;
	}
}
