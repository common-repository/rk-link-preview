<?php

class rklp_controller
{
	public $options_name = '';

	public function __construct() {

	}

	public function view($viewname, $data = []) {
		extract($data);
		include(RKLP_CORE_DIR . '/view/' . $viewname . '.php');
	}

	public function get_options($option = "") {
		$data = (Array) ( get_option($this->options_name) != null ? json_decode(get_option($this->options_name)) : [] );
		return empty($option) ?  $data : (isset($data[$option]) ? $data[$option] : null);
	}

	public function set_options($data, $option = []) {

		if (is_NULL($data)) {
			update_option($this->options_name, json_encode([]));
		} else {
			update_option($this->options_name, json_encode($data));
		}
	}
}
