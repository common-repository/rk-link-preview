(function() {
    tinymce.PluginManager.add('rk-mce-button', function( editor, url ) {
        window.e = editor;
        editor.addButton('rklp_mce_button', {
            image : url.slice(0, -18) + '/img/link-preview.svg',
            tooltip: 'RK Link Preview',
            onclick: function() {
                window.rk_modal.openModal();
            }
        });
    });
})();
