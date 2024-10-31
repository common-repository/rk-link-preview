import base64 from 'base-64';
import utf8 from 'utf8';

export default class Modal {
    constructor() {
        this.endpoint = 'https://preview-api.bbspace.top/?url=';
        this.templates = [];
        this.events();
        this.onAddImageClickHandler();
        this.previewData = {
            title: '',
            url: '',
            image: '',
            description: '',
            template: 'left-image'
        };
    }

    events = () => {
        const self = this;
        const body = jQuery('body');

        body.delegate('.js-close', 'click', () => {
            this.closeModal();
        });

        body.delegate('.js-insert-button', 'click', (e) => {
            e.preventDefault();
            self.createPreview();
        });

        body.delegate('.js-url', 'change', function () {
            self.parseLinkData(self.escape_html(jQuery(this).val()));
        });

        body.delegate('.js-template', 'change', function () {
            self.previewData['template'] = jQuery(this).val();
            self.renderPreviewBlock();
        });

        // Input
        body.delegate('.js-title', 'input', function () {
            self.previewData['title'] = self.escape_html(jQuery(this).val());
            jQuery('.js-preview-title').html(self.previewData['title']);
        });

        body.delegate('.js-description', 'input', function () {
            self.previewData['description'] = self.escape_html(jQuery(this).val());
            jQuery('.js-preview-description').html(self.previewData['description']);
        });
    }
    escape_html = (val) => {
        return jQuery('<div/>').text(val).html();
    }
    createPreview = () => {
        const text = `[rklp_shortcode data='${this.encodeLink(this.previewData)}']`;
        if (this.previewData.id) {
            window.e.setContent(this.replaceShortcodes(window.e.getContent()));
        } else {
            this.previewData.id = new Date().getTime();
            window.tinyMCE.activeEditor.selection.setContent(text);
        }
        this.closeModal();
        return this;
    }

    replaceShortcodes = (content) => {
        let self = this;
        return content.replace(/\[rklp_shortcode ([^\]]*)\]/g, function(match, attr) {
            const data = self.decodeLink(attr.split('=')[1].replace("'", '').replace("'", ''));

            if (data.id === self.previewData.id) {
                return `<p>[rklp_shortcode data='${self.encodeLink(self.previewData)}']</p>`;
            }
            return match;
        });
    }
    encodeLink = function(link) {
        return base64.encode(utf8.encode(JSON.stringify(link)));
    }

    decodeLink = function(encoded) {
        let decoded = '';
        try {
            decoded = JSON.parse(utf8.decode(base64.decode(encoded)));
        } catch (e) {
            decoded = JSON.parse(base64.decode(encoded));
        }
        return decoded;
    }

    loadTemplates = () => {
        const self = this;
        const action = 'get_templates';
        jQuery.ajax({
            url: rklkp_ajax_url,
            dataType: 'json',
            type: 'GET',
            data: {
                action
            },
            success: function (response) {
                self.templates = response;
                self.renderModalTemplate()
                    .renderPreviewBlock();
            },
            error: function (error) {
            }
        });
        return this;
    }

    parseLinkData = (url) => {
        const self = this;

        if (url.indexOf('http') === -1) {
            url = 'https://' + url;
        }

        fetch(`${this.endpoint}${url}`).then((response) => {
            return response.json();
        }).then((data) => {
            self.showPreview = true;
            Object.keys(data).map((key) => {
                self.previewData[key] = data[key];
            });

            self.renderPreviewBlock()
                .renderForm()
                .renderImageBlock()
                .renderModalTemplate()
                .renderFooter();
        });
    }

    openModal = (data = this.previewData) => {
        this.previewData = data;
        this.render()
            .renderFooter()
            .loadTemplates()
            .renderForm();

        if (this.previewData.id) {
            this.renderImageBlock();
        }
    }

    closeModal = () => {
        this.previewData = {
            title: '',
            url: '',
            image: '',
            description: '',
            template: 'left-image'
        };
        jQuery('.js-modal').remove();
    }

    renderView = (block, content) => {
        document.querySelector(block).innerHTML = content;
        return this;
    }

    render = () => {
        const template = `<div class="rklp-modal js-modal">
            <form action="" class="js-modal-form">
             <div class="rklp-modal__wrap">
                <div class="rklp-modal__header">
                    <h2 class="rklp-modal__title">RK Link Preview</h2>
                    <div class="rklp-modal__close js-close"></div>
                </div>
                <div class="rklp-modal__content">
                   <div class="js-form-content">
                      <!--form content portal -->
                   </div>
                    <div class="vi-form-item js-modal-template"></div>                  
                    <div class="vi-form-item js-preview-block"></div>
                </div>
                <div class="rklp-modal__footer js-modal-footer"></div>
            </div>
            </form>
        </div>`;
        this.renderView('#rkl-root', template);
        return this;
    }

    renderForm = () => {
        const {title, description, url} = this.previewData;
        this.renderView('.js-form-content', ` <div class="vi-form-item">
            <div class="vi-label">Link</div>
                <input 
                   placeholder="https://..." 
                   type="text" 
                   class="vi-input js-url" 
                   name="url"
                   value="${url}"
                />    
            </div>
            <div class="vi-form-item js-image-block"></div>
            <div class="vi-form-item">
                <div class="vi-label">Title</div>
                <input 
                  placeholder="Parsed title" 
                  type="text" 
                  class="vi-input js-title" 
                  name="title"
                  value="${title}"
                  ${!this.previewData['title'].length ? 'disabled' : ''}
                />   
            </div>
            <div class="vi-form-item">
                <div class="vi-label">Description</div>
                <textarea 
                   name="description" 
                   class="vi-textarea js-description" 
                   rows="10" 
                   placeholder="Parsed description"
                   ${!this.previewData['title'].length ? 'disabled' : ''}
                   >${description}</textarea>   
        </div>`)
        return this;
    }

    renderImageBlock = () => {
        const {image} = this.previewData;
        const body = jQuery('body');

        this.renderView('.js-image-block', `
            <div class="rklp-modal__image-block">
               <div class="rklp-modal__image-wrapper js-image-wrapper"></div>
                <div class="rklp-modal__button button button-large js-add-image">
                     Add image
                 </div>
            </div>  
        `);
        body.find('.js-image-wrapper').css('background-image', `url(${image})`);

        return this;
    }

    renderPreviewBlock = () => {
        const {image, title, description} = this.previewData;

        if (!this.previewData['url'].length)
            return this;

        this.renderView('.js-preview-block', `<div class="rklp-modal__preview">
             <div class="rklp-preview js-preview ${this.previewData['template']}">
                <div class="rklp-preview__image">
                    <img src="${image}" alt="">
                </div>
                <div class="rklp-preview__content">
                    <h3 class="rklp-preview__title js-preview-title">
                        ${title}
                    </h3>
                    <p class="rklp-preview__description js-preview-description">
                        ${description}
                    </p>
                    ${window.rk_read_more ? this.renderReadMore() : ''}
                </div>
             </div>
        </div>
        `);
        return this;
    }

    renderReadMore = () => {
        const {url} = this.previewData;
        return `<a href="${url}" target="_blank" class="rklp-preview__more">Read More</a>`
    }

    renderModalTemplate = () => {
        const self = this;
        this.renderView('.js-modal-template', ` 
            <div>
                <div class="vi-label">Template</div>
            </div>
            <select 
                 class="vi-select js-template"
                 ${!this.previewData['title'].length ? 'disabled' : ''}
            >
                <option value="">test</option>
            </select>`);

        const $el = jQuery(".js-template");
        $el.empty();
        jQuery.each(Object.keys(self.templates), function (key, value) {
            $el.append(jQuery("<option></option>")
                .attr("value", value).text(self.templates[value].description));
        });
        $el.val(self.previewData['template']);

        return this;
    }

    renderFooter = () => {
        this.renderView('.js-modal-footer', `<button 
                        ${!this.previewData['title'].length ? 'disabled' : ''}
                        class="rklp-modal__button button button-primary button-large js-insert-button"
                    >
                        Insert link
                    </button>`);

        return this;
    }

    onAddImageClickHandler = () => {
        const self = this;
        jQuery('body').delegate('.js-add-image', 'click', function (e) {
            e.preventDefault();
            var image = wp.media({
                title: 'Upload Image',
                multiple: false
            }).open()
                .on('select', function () {
                    const uploaded_image = image.state().get('selection').first();
                    self.previewData['image'] = uploaded_image.toJSON().url;

                    self.renderPreviewBlock()
                        .renderImageBlock();
                });
        });
    }
}
