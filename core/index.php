<?php

define('RKLP_CORE_DIR', dirname(__FILE__));

function rklp_load_classes($folder, $exclude = "") {
	$classes = [];
	foreach (glob($folder) as $filename) {
		if (strstr($filename, '.class.php')) {
			$classes[] = explode('.', basename($filename))[0];
			require_once $filename;
		}
		else {
			if ($filename != $exclude)
				$classes = array_merge($classes, rklp_load_classes($filename . '/*'));
		}
	}
	return $classes;
}

rklp_load_classes(dirname(__FILE__). '/system/*');
$classes = rklp_load_classes(dirname(__FILE__). '/*', 'system');

foreach($classes as $classname) {
	${$classname} = new $classname();
}
