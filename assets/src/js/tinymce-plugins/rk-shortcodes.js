import base64 from "base-64";
import utf8 from "utf8";

(function() {
    tinymce.PluginManager.add('rk-shortcodes', function(editor, url) {
        function encodeLink(link) {
            return base64.encode(utf8.encode(JSON.stringify(link)));
        }

        function decodeLink(encoded) {
            let decoded = '';
            try {
                decoded = JSON.parse(utf8.decode(base64.decode(encoded)));
            } catch (e) {
                decoded = JSON.parse(base64.decode(encoded));
            }
            return decoded;
        }

        function replaceShortcodes(content) {
            let id = 0;
           return content.replace(/\[rklp_shortcode ([^\]]*)\]/g, function(match, attr) {
               id++;
               const data = attr.split('=')[1].replace("'", '').replace("'", '')
               return getHtml(decodeLink(data), id);
            });
        }

        function getHtml(data, id) {
            return `<div class="rklp-modal__preview" contenteditable="false" data-id="${id}" data-url="${data.url}">
             <div class="rklp-preview js-preview ${data.template}" data-template="${data.template}">
                <div class="rklp-preview__image">
                    <img src="${data.image}" class="js-image" alt="">
                </div>
                <div class="rklp-preview__content">
                    <h3 class="rklp-preview__title js-preview-title">
                       ${data.title}
                    </h3>
                    <p class="rklp-preview__description js-preview-description">
                        ${data.description}
                    </p>
                    ${window.rk_read_more ? renderReadMore(data) : ''}              
                </div>
             </div>
        </div>
        `;
        }

        function renderReadMore(data) {
            return `<a href="${data.url}" target="_blank" class="rklp-preview__more js-link">Read More</a>`;
        }

        function restoreShortcodes(content) {
            return content.replace(/<div class="rklp-.*?div><\/div><\/div>/g, function(match) {
                const data = collectData(match);
                if (data.title) {
                    return `<p>[rklp_shortcode data='${encodeLink(data)}']</p>`;
                }
                return match;
            });
        }

        function collectData(html) {
            return {
                title: jQuery(html).find('.js-preview-title').html(),
                url: jQuery(html).data('url'),
                image: jQuery(html).find('.js-image').attr('src'),
                description: jQuery(html).find('.js-preview-description').html(),
                template: jQuery(html).find('.js-preview').data('template'),
                id: jQuery(html).data('id')
            }
        }

        editor.on('mouseup', function(event) {
            const node = event.target;
            const data = collectData(jQuery(node).closest('.rklp-modal__preview'));
            if (data.title) {
                window.rk_modal.openModal(data);
            }
        });

        editor.on('BeforeSetContent', function(event) {
            event.content = replaceShortcodes(event.content);
        });

        editor.on('PostProcess', function(event) {
           if (event.get) {
                event.content = restoreShortcodes(event.content);
            }
        });
    });
})();
