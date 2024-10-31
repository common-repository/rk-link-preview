<?php
class rklp_editor extends rklp_controller {

	public function __construct() {
		$this->options_name = 'rklp_options';
        add_action('admin_head', array($this, 'add_mce_button'));
        add_shortcode( 'rklp_shortcode', array($this, 'create_shortcode') );
        add_action( 'init', array($this, 'add_editor_styles') );
	}

	public function add_editor_styles() {
        add_editor_style( plugins_url('/assets/build/css/front.css?no-cache=' . time(), RKLP_CORE_DIR) );
    }

    public function add_mce_button() {
        if ( !current_user_can( 'edit_posts' ) && !current_user_can( 'edit_pages' ) ) {
            return;
        }
        if ( 'true' == get_user_option( 'rich_editing' ) ) {
            add_filter( 'mce_external_plugins', array($this, 'add_tinymce_plugin') );
            add_filter( 'mce_buttons', array($this, 'register_mce_button') );
        }
    }

    public function register_mce_button( $buttons ) {
        array_push( $buttons, 'rklp_mce_button' );
        return $buttons;
    }

    public function add_tinymce_plugin( $plugin_array ) {
	    $plugin_url  = '/assets/build/js/tinymce-plugins/';

        $plugin_array['rk-mce-button'] =
            plugins_url("$plugin_url/rk-mce-button.js?no-cache=" . time(),
                RKLP_CORE_DIR
            );

        $plugin_array['rk-shortcodes'] =
            plugins_url("$plugin_url/rk-shortcodes.js?no-cache=" . time(),
                RKLP_CORE_DIR
            );

        return $plugin_array;
    }

    public function create_shortcode($args) {
        ob_start(); // start a buffer
        $this->render_content((array)json_decode(base64_decode($args['data'])));
        $wanted = ob_get_clean(); // get the buffer contents and clean it
        return $wanted;

    }

    private function render_content($data) {

	    $read_more = $this->get_options('read_more');
	    if ($read_more) {
            ?>
            <div class="rklp-modal__preview rklp-container" contenteditable="false">
                <?php $this->render_inner($data)?>
            </div>
            <?php
        } else {
            ?>
            <a href="<?php echo esc_url(isset($data['url']) ? $data['url'] : '')?>" class="rklp-modal__preview rklp-container" contenteditable="false">
                <?php $this->render_inner($data)?>
            </a>
            <?php
        }
    }

    private function render_inner($data) {
        $read_more = $this->get_options('read_more');
	    ?>
        <div class="rklp-preview js-preview <?php echo esc_attr(isset($data['template']) ? $data['template'] : '') ?>">
            <div class="rklp-preview__image">
                <img src="<?php echo esc_url(isset($data['image']) ? $data['image'] : '')?>" alt="">
            </div>
            <div class="rklp-preview__content">
                <h3 class="rklp-preview__title js-preview-title">
                    <?php echo esc_attr(isset($data['title']) ? $data['title'] : '')?>
                </h3>
                <p class="rklp-preview__description js-preview-description">
                    <?php echo esc_attr(isset($data['description'])? $data['description'] : '')?>
                </p>
                <?php if($read_more):?>
                    <a href="<?php echo esc_url(isset($data['url']) ? $data['url'] : '')?>" target="_blank" class="rklp-preview__more">Read More</a>
                <?php endif; ?>
            </div>
        </div>
        <?php
    }

}
