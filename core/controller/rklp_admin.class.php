<?php

class rklp_admin extends rklp_controller {

    public $default_templates = [];
    public $styles = [];

	public function __construct() {
		parent::__construct();

		$this->options_name = 'rklp_options';

		add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
		add_action( 'admin_enqueue_scripts', array($this,'plugin_style') );
        add_action( 'wp_ajax_get_templates', array($this, 'get_templates') );
        add_action('wp_enqueue_scripts', array($this, 'front_style'));
        add_action( 'admin_enqueue_scripts', array($this, 'print_options') );

		if (!get_option($this->options_name))
			$this->on_install();

        $this->default_templates = [
            'default' => [
                'name' => 'default',
                'description' => __('Default (Without image)'),
                'styles' => ''
            ],
            'left-image' => [
                'name' => 'left-image',
                'description' => __('Left media'),
                'style' => ''
            ],
            'right-image' => [
                'name' => 'right-image',
                'description' => __('Right media'),
                'style' => ''
            ],
            'large-image' => [
                'name' => 'large-image',
                'description' => __('Large media'),
                'style' => ''
            ]
        ];

        $this->styles = [
            'display_border' => true,
            'border-color' => 'green',
            'font-size' => '16px',
            'title-font-size' => '21px',
            'background-color' => '#ffffff'
        ];
    }

    public function get_templates() {
        echo json_encode($this->default_templates);
        wp_die();
    }

    public function plugin_style() {
		wp_register_style( 'rklp-style', plugins_url('/assets/build/css/style.css?no-cache=' . time(), RKLP_CORE_DIR) );
		wp_enqueue_style( 'rklp-style' );
		wp_enqueue_script( 'media-upload');
		wp_enqueue_media();
		wp_enqueue_script( 'plugin-js',  plugins_url('/assets/build/js/main.js?no-cache=' . time(), RKLP_CORE_DIR));

        $ajax_url = admin_url('admin-ajax.php');
        wp_add_inline_script('plugin-js', "var rklkp_ajax_url = '$ajax_url'");
	}

    public function front_style() {
        wp_register_style( 'rklp-front-style', plugins_url('/assets/build/css/front.css?no-cache=' . time(), RKLP_CORE_DIR) );
        wp_enqueue_style( 'rklp-front-style' );
    }

	/**
	 * Add options page
	 */
	public function add_plugin_page()
	{
		add_options_page(
			'Settings Admin',
			'RK Link Preview',
			'manage_options',
			'rkl-settings',
			array( $this, 'create_options' )
		);
    }

	/**
	 * Options page callback
	 */
	public function create_options()
	{
	    $activeTab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'general';

	    switch ($activeTab) {
            case 'general':
                $this->create_options_general();
                break;
            case 'templates':
                $this->create_options_templates();
                break;
            default:
                $this->create_options_general();
        }
	}

	private function create_options_general() {


        if(!empty($_POST)) {

            $clean_options = [];

            if (isset($_POST['plugin_options']['read_more'])) {
                $clean_options['read_more'] = sanitize_title($_POST['plugin_options']['read_more'], '');
            }
            $this->set_options($clean_options);
        }

        $this->view('options/general',
            array_merge(
                $this->get_options(),
                ['default_templates' => $this->default_templates]
            )
        );
    }
	private function create_options_templates() {

        if(!empty($_POST)) {

            $clean_options = [];
            foreach($_POST['plugin_options'] as $key=>$option) {
                $option = sanitize_text_field($option);
                $clean_options[$key] = $option;
            }
            $this->set_options($clean_options);
        }

        $this->view('options/templates', $this->get_options());
    }

	public function on_install() {
		update_option($this->options_name, json_encode(
			[
				'read_more'  => false,
				'active_template'  => 'default',
				'css'  => '',
			]
		));
	}

	public function print_options() {
        $read_more = $this->get_options('read_more');
	    ?>
        <script>
            window.rk_read_more = '<?php echo esc_js($read_more); ?>'
        </script>
        <?php
    }

}
