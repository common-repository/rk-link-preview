<?php
/*
Plugin Name: RK Link Preview
Plugin URI:
Description: Get basic website information from any given URL, in JSON format, and creating visual preview for inserting into content
Author: Ruslan Kolibabchuk
Author URI: https://www.linkedin.com/in/ruslan-kolibabchuk-b3341372/
Version: 1.0
*/
include dirname(__FILE__) . '/core/index.php';

function is_edit_page($new_edit = null){
    global $pagenow;

    if (!is_admin()) return false;

    if($new_edit == "edit")
        return in_array( $pagenow, array( 'post.php',  ) );
    elseif($new_edit == "new")
        return in_array( $pagenow, array( 'post-new.php' ) );
    else
        return in_array( $pagenow, array( 'post.php', 'post-new.php' ) );
}

if (is_admin() && !wp_doing_ajax() && is_edit_page()) {
    echo "<div id='rkl-root'></div>";
}

