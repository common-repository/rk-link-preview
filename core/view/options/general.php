<?php
/**
 * @var array $default_templates
 * @var array $style
 * @var string $css
 *
 */
?>
<div class="container">
	<div class="wrap">
		<h1><?php echo __('RK Link Preview')?></h1>
	</div>
</div>

<div class="container">
	<div class="vi-tabs">
		<div class="vi-tabs-head">
			<div class="vi-tab-title active">
				<a href="?page=rkl-settings&tab=general"><?php echo __('General')?></a>
			</div>
		</div>
		<div class="vi-tabs-body">
			<div class="vi-tab-content active">
				<div class="vi-row">
					<div class="vi-column1">
						<form action="" method="POST">
							<table class="form-table mp-table">
								<tbody>
								<tr>
									<th scope="row"><?php echo __('Use read more button')?></th>
									<td id="front-static-pages">
										<input <?php echo esc_html(!empty($read_more) ? 'checked' : '')?>
                                                id="checkbox"
                                                type="checkbox"
                                                name=plugin_options[read_more]"
                                                class="vi-checkbox"
                                        >
										<label class="vi-label" for="checkbox"></label>
									</td>
								</tr>
								</tbody>
							</table>

                            <table class="form-table mp-table">
                                <tbody>
                                <tr>
                                    <th scope="row">
                                        <p class="submit">
                                            <input
                                                    type="submit"
                                                    name="submit"
                                                    id="submit"
                                                    class="button button-primary"
                                                    value="Save changes"
                                            />
                                        </p>
                                    </th>
                                    <td id="front-static-pages">

                                    </td>
                                </tr>
                                </tbody>
                            </table>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
