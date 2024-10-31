(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _modal = _interopRequireDefault(require("./modal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(function ($) {
  window.rk_modal = new _modal["default"]($);
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfMzBhZGRiMzAuanMiXSwibmFtZXMiOlsiJCIsIndpbmRvdyIsInJrX21vZGFsIiwiTW9kYWwiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQyxXQUFTQSxDQUFULEVBQVk7QUFDWkMsRUFBQUEsTUFBTSxDQUFDQyxRQUFQLEdBQWtCLElBQUlDLGlCQUFKLENBQVVILENBQVYsQ0FBbEI7QUFDQSxDQUZBLEdBQUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTW9kYWwgZnJvbSAnLi9tb2RhbCc7XG4oZnVuY3Rpb24oJCkge1xuXHR3aW5kb3cucmtfbW9kYWwgPSBuZXcgTW9kYWwoJCk7XG59KCkpO1xuIl19
},{"./modal":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("base-64"));

var _utf = _interopRequireDefault(require("utf8"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Modal = function Modal() {
  var _this = this;

  _classCallCheck(this, Modal);

  _defineProperty(this, "events", function () {
    var self = _this;
    var body = jQuery('body');
    body.delegate('.js-close', 'click', function () {
      _this.closeModal();
    });
    body.delegate('.js-insert-button', 'click', function (e) {
      e.preventDefault();
      self.createPreview();
    });
    body.delegate('.js-url', 'change', function () {
      self.parseLinkData(self.escape_html(jQuery(this).val()));
    });
    body.delegate('.js-template', 'change', function () {
      self.previewData['template'] = jQuery(this).val();
      self.renderPreviewBlock();
    }); // Input

    body.delegate('.js-title', 'input', function () {
      self.previewData['title'] = self.escape_html(jQuery(this).val());
      jQuery('.js-preview-title').html(self.previewData['title']);
    });
    body.delegate('.js-description', 'input', function () {
      self.previewData['description'] = self.escape_html(jQuery(this).val());
      jQuery('.js-preview-description').html(self.previewData['description']);
    });
  });

  _defineProperty(this, "escape_html", function (val) {
    return jQuery('<div/>').text(val).html();
  });

  _defineProperty(this, "createPreview", function () {
    var text = "[rklp_shortcode data='".concat(_this.encodeLink(_this.previewData), "']");

    if (_this.previewData.id) {
      window.e.setContent(_this.replaceShortcodes(window.e.getContent()));
    } else {
      _this.previewData.id = new Date().getTime();
      window.tinyMCE.activeEditor.selection.setContent(text);
    }

    _this.closeModal();

    return _this;
  });

  _defineProperty(this, "replaceShortcodes", function (content) {
    var self = _this;
    return content.replace(/\[rklp_shortcode ([^\]]*)\]/g, function (match, attr) {
      var data = self.decodeLink(attr.split('=')[1].replace("'", '').replace("'", ''));

      if (data.id === self.previewData.id) {
        return "<p>[rklp_shortcode data='".concat(self.encodeLink(self.previewData), "']</p>");
      }

      return match;
    });
  });

  _defineProperty(this, "encodeLink", function (link) {
    return _base["default"].encode(_utf["default"].encode(JSON.stringify(link)));
  });

  _defineProperty(this, "decodeLink", function (encoded) {
    var decoded = '';

    try {
      decoded = JSON.parse(_utf["default"].decode(_base["default"].decode(encoded)));
    } catch (e) {
      decoded = JSON.parse(_base["default"].decode(encoded));
    }

    return decoded;
  });

  _defineProperty(this, "loadTemplates", function () {
    var self = _this;
    var action = 'get_templates';
    jQuery.ajax({
      url: rklkp_ajax_url,
      dataType: 'json',
      type: 'GET',
      data: {
        action: action
      },
      success: function success(response) {
        self.templates = response;
        self.renderModalTemplate().renderPreviewBlock();
      },
      error: function error(_error) {}
    });
    return _this;
  });

  _defineProperty(this, "parseLinkData", function (url) {
    var self = _this;

    if (url.indexOf('http') === -1) {
      url = 'https://' + url;
    }

    fetch("".concat(_this.endpoint).concat(url)).then(function (response) {
      return response.json();
    }).then(function (data) {
      self.showPreview = true;
      Object.keys(data).map(function (key) {
        self.previewData[key] = data[key];
      });
      self.renderPreviewBlock().renderForm().renderImageBlock().renderModalTemplate().renderFooter();
    });
  });

  _defineProperty(this, "openModal", function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.previewData;
    _this.previewData = data;

    _this.render().renderFooter().loadTemplates().renderForm();

    if (_this.previewData.id) {
      _this.renderImageBlock();
    }
  });

  _defineProperty(this, "closeModal", function () {
    _this.previewData = {
      title: '',
      url: '',
      image: '',
      description: '',
      template: 'left-image'
    };
    jQuery('.js-modal').remove();
  });

  _defineProperty(this, "renderView", function (block, content) {
    document.querySelector(block).innerHTML = content;
    return _this;
  });

  _defineProperty(this, "render", function () {
    var template = "<div class=\"rklp-modal js-modal\">\n            <form action=\"\" class=\"js-modal-form\">\n             <div class=\"rklp-modal__wrap\">\n                <div class=\"rklp-modal__header\">\n                    <h2 class=\"rklp-modal__title\">RK Link Preview</h2>\n                    <div class=\"rklp-modal__close js-close\"></div>\n                </div>\n                <div class=\"rklp-modal__content\">\n                   <div class=\"js-form-content\">\n                      <!--form content portal -->\n                   </div>\n                    <div class=\"vi-form-item js-modal-template\"></div>                  \n                    <div class=\"vi-form-item js-preview-block\"></div>\n                </div>\n                <div class=\"rklp-modal__footer js-modal-footer\"></div>\n            </div>\n            </form>\n        </div>";

    _this.renderView('#rkl-root', template);

    return _this;
  });

  _defineProperty(this, "renderForm", function () {
    var _this$previewData = _this.previewData,
        title = _this$previewData.title,
        description = _this$previewData.description,
        url = _this$previewData.url;

    _this.renderView('.js-form-content', " <div class=\"vi-form-item\">\n            <div class=\"vi-label\">Link</div>\n                <input \n                   placeholder=\"https://...\" \n                   type=\"text\" \n                   class=\"vi-input js-url\" \n                   name=\"url\"\n                   value=\"".concat(url, "\"\n                />    \n            </div>\n            <div class=\"vi-form-item js-image-block\"></div>\n            <div class=\"vi-form-item\">\n                <div class=\"vi-label\">Title</div>\n                <input \n                  placeholder=\"Parsed title\" \n                  type=\"text\" \n                  class=\"vi-input js-title\" \n                  name=\"title\"\n                  value=\"").concat(title, "\"\n                  ").concat(!_this.previewData['title'].length ? 'disabled' : '', "\n                />   \n            </div>\n            <div class=\"vi-form-item\">\n                <div class=\"vi-label\">Description</div>\n                <textarea \n                   name=\"description\" \n                   class=\"vi-textarea js-description\" \n                   rows=\"10\" \n                   placeholder=\"Parsed description\"\n                   ").concat(!_this.previewData['title'].length ? 'disabled' : '', "\n                   >").concat(description, "</textarea>   \n        </div>"));

    return _this;
  });

  _defineProperty(this, "renderImageBlock", function () {
    var image = _this.previewData.image;
    var body = jQuery('body');

    _this.renderView('.js-image-block', "\n            <div class=\"rklp-modal__image-block\">\n               <div class=\"rklp-modal__image-wrapper js-image-wrapper\"></div>\n                <div class=\"rklp-modal__button button button-large js-add-image\">\n                     Add image\n                 </div>\n            </div>  \n        ");

    body.find('.js-image-wrapper').css('background-image', "url(".concat(image, ")"));
    return _this;
  });

  _defineProperty(this, "renderPreviewBlock", function () {
    var _this$previewData2 = _this.previewData,
        image = _this$previewData2.image,
        title = _this$previewData2.title,
        description = _this$previewData2.description;
    if (!_this.previewData['url'].length) return _this;

    _this.renderView('.js-preview-block', "<div class=\"rklp-modal__preview\">\n             <div class=\"rklp-preview js-preview ".concat(_this.previewData['template'], "\">\n                <div class=\"rklp-preview__image\">\n                    <img src=\"").concat(image, "\" alt=\"\">\n                </div>\n                <div class=\"rklp-preview__content\">\n                    <h3 class=\"rklp-preview__title js-preview-title\">\n                        ").concat(title, "\n                    </h3>\n                    <p class=\"rklp-preview__description js-preview-description\">\n                        ").concat(description, "\n                    </p>\n                    ").concat(window.rk_read_more ? _this.renderReadMore() : '', "\n                </div>\n             </div>\n        </div>\n        "));

    return _this;
  });

  _defineProperty(this, "renderReadMore", function () {
    var url = _this.previewData.url;
    return "<a href=\"".concat(url, "\" target=\"_blank\" class=\"rklp-preview__more\">Read More</a>");
  });

  _defineProperty(this, "renderModalTemplate", function () {
    var self = _this;

    _this.renderView('.js-modal-template', " \n            <div>\n                <div class=\"vi-label\">Template</div>\n            </div>\n            <select \n                 class=\"vi-select js-template\"\n                 ".concat(!_this.previewData['title'].length ? 'disabled' : '', "\n            >\n                <option value=\"\">test</option>\n            </select>"));

    var $el = jQuery(".js-template");
    $el.empty();
    jQuery.each(Object.keys(self.templates), function (key, value) {
      $el.append(jQuery("<option></option>").attr("value", value).text(self.templates[value].description));
    });
    $el.val(self.previewData['template']);
    return _this;
  });

  _defineProperty(this, "renderFooter", function () {
    _this.renderView('.js-modal-footer', "<button \n                        ".concat(!_this.previewData['title'].length ? 'disabled' : '', "\n                        class=\"rklp-modal__button button button-primary button-large js-insert-button\"\n                    >\n                        Insert link\n                    </button>"));

    return _this;
  });

  _defineProperty(this, "onAddImageClickHandler", function () {
    var self = _this;
    jQuery('body').delegate('.js-add-image', 'click', function (e) {
      e.preventDefault();
      var image = wp.media({
        title: 'Upload Image',
        multiple: false
      }).open().on('select', function () {
        var uploaded_image = image.state().get('selection').first();
        self.previewData['image'] = uploaded_image.toJSON().url;
        self.renderPreviewBlock().renderImageBlock();
      });
    });
  });

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
};

exports["default"] = Modal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGFsLmpzIl0sIm5hbWVzIjpbIk1vZGFsIiwic2VsZiIsImJvZHkiLCJqUXVlcnkiLCJkZWxlZ2F0ZSIsImNsb3NlTW9kYWwiLCJlIiwicHJldmVudERlZmF1bHQiLCJjcmVhdGVQcmV2aWV3IiwicGFyc2VMaW5rRGF0YSIsImVzY2FwZV9odG1sIiwidmFsIiwicHJldmlld0RhdGEiLCJyZW5kZXJQcmV2aWV3QmxvY2siLCJodG1sIiwidGV4dCIsImVuY29kZUxpbmsiLCJpZCIsIndpbmRvdyIsInNldENvbnRlbnQiLCJyZXBsYWNlU2hvcnRjb2RlcyIsImdldENvbnRlbnQiLCJEYXRlIiwiZ2V0VGltZSIsInRpbnlNQ0UiLCJhY3RpdmVFZGl0b3IiLCJzZWxlY3Rpb24iLCJjb250ZW50IiwicmVwbGFjZSIsIm1hdGNoIiwiYXR0ciIsImRhdGEiLCJkZWNvZGVMaW5rIiwic3BsaXQiLCJsaW5rIiwiYmFzZTY0IiwiZW5jb2RlIiwidXRmOCIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmNvZGVkIiwiZGVjb2RlZCIsInBhcnNlIiwiZGVjb2RlIiwiYWN0aW9uIiwiYWpheCIsInVybCIsInJrbGtwX2FqYXhfdXJsIiwiZGF0YVR5cGUiLCJ0eXBlIiwic3VjY2VzcyIsInJlc3BvbnNlIiwidGVtcGxhdGVzIiwicmVuZGVyTW9kYWxUZW1wbGF0ZSIsImVycm9yIiwiaW5kZXhPZiIsImZldGNoIiwiZW5kcG9pbnQiLCJ0aGVuIiwianNvbiIsInNob3dQcmV2aWV3IiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImtleSIsInJlbmRlckZvcm0iLCJyZW5kZXJJbWFnZUJsb2NrIiwicmVuZGVyRm9vdGVyIiwicmVuZGVyIiwibG9hZFRlbXBsYXRlcyIsInRpdGxlIiwiaW1hZ2UiLCJkZXNjcmlwdGlvbiIsInRlbXBsYXRlIiwicmVtb3ZlIiwiYmxvY2siLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lckhUTUwiLCJyZW5kZXJWaWV3IiwibGVuZ3RoIiwiZmluZCIsImNzcyIsInJrX3JlYWRfbW9yZSIsInJlbmRlclJlYWRNb3JlIiwiJGVsIiwiZW1wdHkiLCJlYWNoIiwidmFsdWUiLCJhcHBlbmQiLCJ3cCIsIm1lZGlhIiwibXVsdGlwbGUiLCJvcGVuIiwib24iLCJ1cGxvYWRlZF9pbWFnZSIsInN0YXRlIiwiZ2V0IiwiZmlyc3QiLCJ0b0pTT04iLCJldmVudHMiLCJvbkFkZEltYWdlQ2xpY2tIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O0lBRXFCQSxLLEdBQ2pCLGlCQUFjO0FBQUE7O0FBQUE7O0FBQUEsa0NBY0wsWUFBTTtBQUNYLFFBQU1DLElBQUksR0FBRyxLQUFiO0FBQ0EsUUFBTUMsSUFBSSxHQUFHQyxNQUFNLENBQUMsTUFBRCxDQUFuQjtBQUVBRCxJQUFBQSxJQUFJLENBQUNFLFFBQUwsQ0FBYyxXQUFkLEVBQTJCLE9BQTNCLEVBQW9DLFlBQU07QUFDdEMsTUFBQSxLQUFJLENBQUNDLFVBQUw7QUFDSCxLQUZEO0FBSUFILElBQUFBLElBQUksQ0FBQ0UsUUFBTCxDQUFjLG1CQUFkLEVBQW1DLE9BQW5DLEVBQTRDLFVBQUNFLENBQUQsRUFBTztBQUMvQ0EsTUFBQUEsQ0FBQyxDQUFDQyxjQUFGO0FBQ0FOLE1BQUFBLElBQUksQ0FBQ08sYUFBTDtBQUNILEtBSEQ7QUFLQU4sSUFBQUEsSUFBSSxDQUFDRSxRQUFMLENBQWMsU0FBZCxFQUF5QixRQUF6QixFQUFtQyxZQUFZO0FBQzNDSCxNQUFBQSxJQUFJLENBQUNRLGFBQUwsQ0FBbUJSLElBQUksQ0FBQ1MsV0FBTCxDQUFpQlAsTUFBTSxDQUFDLElBQUQsQ0FBTixDQUFhUSxHQUFiLEVBQWpCLENBQW5CO0FBQ0gsS0FGRDtBQUlBVCxJQUFBQSxJQUFJLENBQUNFLFFBQUwsQ0FBYyxjQUFkLEVBQThCLFFBQTlCLEVBQXdDLFlBQVk7QUFDaERILE1BQUFBLElBQUksQ0FBQ1csV0FBTCxDQUFpQixVQUFqQixJQUErQlQsTUFBTSxDQUFDLElBQUQsQ0FBTixDQUFhUSxH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QUFZO0FBQ3RCLFlBQU1DLGNBQWMsR0FBR3hCLEtBQUssQ0FBQ3lCLEtBQU4sR0FBY0MsR0FBZCxDQUFrQixXQUFsQixFQUErQkMsS0FBL0IsRUFBdkI7QUFDQWpHLFFBQUFBLElBQUksQ0FBQ1csV0FBTCxDQUFpQixPQUFqQixJQUE0Qm1GLGNBQWMsQ0FBQ0ksTUFBZixHQUF3QnJELEdBQXBEO0FBRUE3QyxRQUFBQSxJQUFJLENBQUNZLGtCQUFMLEdBQ0txRCxnQkFETDtBQUVILE9BVk8sQ0FBWjtBQVdILEtBYkQ7QUFjSCxHQTlUYTs7QUFDVixPQUFLVCxRQUFMLEdBQWdCLHVDQUFoQjtBQUNBLE9BQUtMLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxPQUFLZ0QsTUFBTDtBQUNBLE9BQUtDLHNCQUFMO0FBQ0EsT0FBS3pGLFdBQUwsR0FBbUI7QUFDZjBELElBQUFBLEtBQUssRUFBRSxFQURRO0FBRWZ4QixJQUFBQSxHQUFHLEVBQUUsRUFGVTtBQUdmeUIsSUFBQUEsS0FBSyxFQUFFLEVBSFE7QUFJZkMsSUFBQUEsV0FBVyxFQUFFLEVBSkU7QUFLZkMsSUFBQUEsUUFBUSxFQUFFO0FBTEssR0FBbkI7QUFPSCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJhc2U2NCBmcm9tICdiYXNlLTY0JztcbmltcG9ydCB1dGY4IGZyb20gJ3V0ZjgnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZW5kcG9pbnQgPSAnaHR0cHM6Ly9wcmV2aWV3LWFwaS5iYnNwYWNlLnRvcC8/dXJsPSc7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XG4gICAgICAgIHRoaXMuZXZlbnRzKCk7XG4gICAgICAgIHRoaXMub25BZGRJbWFnZUNsaWNrSGFuZGxlcigpO1xuICAgICAgICB0aGlzLnByZXZpZXdEYXRhID0ge1xuICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgdXJsOiAnJyxcbiAgICAgICAgICAgIGltYWdlOiAnJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnbGVmdC1pbWFnZSdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBldmVudHMgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBib2R5ID0galF1ZXJ5KCdib2R5Jyk7XG5cbiAgICAgICAgYm9keS5kZWxlZ2F0ZSgnLmpzLWNsb3NlJywgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbG9zZU1vZGFsKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJvZHkuZGVsZWdhdGUoJy5qcy1pbnNlcnQtYnV0dG9uJywgJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHNlbGYuY3JlYXRlUHJldmlldygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBib2R5LmRlbGVnYXRlKCcuanMtdXJsJywgJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYucGFyc2VMaW5rRGF0YShzZWxmLmVzY2FwZV9odG1sKGpRdWVyeSh0aGlzKS52YWwoKSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBib2R5LmRlbGVnYXRlKCcuanMtdGVtcGxhdGUnLCAnY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5wcmV2aWV3RGF0YVsndGVtcGxhdGUnXSA9IGpRdWVyeSh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgIHNlbGYucmVuZGVyUHJldmlld0Jsb2NrKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElucHV0XG4gICAgICAgIGJvZHkuZGVsZWdhdGUoJy5qcy10aXRsZScsICdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYucHJldmlld0RhdGFbJ3RpdGxlJ10gPSBzZWxmLmVzY2FwZV9odG1sKGpRdWVyeSh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICBqUXVlcnkoJy5qcy1wcmV2aWV3LXRpdGxlJykuaHRtbChzZWxmLnByZXZpZXdEYXRhWyd0aXRsZSddKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYm9keS5kZWxlZ2F0ZSgnLmpzLWRlc2NyaXB0aW9uJywgJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5wcmV2aWV3RGF0YVsnZGVzY3JpcHRpb24nXSA9IHNlbGYuZXNjYXBlX2h0bWwoalF1ZXJ5KHRoaXMpLnZhbCgpKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLmpzLXByZXZpZXctZGVzY3JpcHRpb24nKS5odG1sKHNlbGYucHJldmlld0RhdGFbJ2Rlc2NyaXB0aW9uJ10pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXNjYXBlX2h0bWwgPSAodmFsKSA9PiB7XG4gICAgICAgIHJldHVybiBqUXVlcnkoJzxkaXYvPicpLnRleHQodmFsKS5odG1sKCk7XG4gICAgfVxuICAgIGNyZWF0ZVByZXZpZXcgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBgW3JrbHBfc2hvcnRjb2RlIGRhdGE9JyR7dGhpcy5lbmNvZGVMaW5rKHRoaXMucHJldmlld0RhdGEpfSddYDtcbiAgICAgICAgaWYgKHRoaXMucHJldmlld0RhdGEuaWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5lLnNldENvbnRlbnQodGhpcy5yZXBsYWNlU2hvcnRjb2Rlcyh3aW5kb3cuZS5nZXRDb250ZW50KCkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJldmlld0RhdGEuaWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHdpbmRvdy50aW55TUNFLmFjdGl2ZUVkaXRvci5zZWxlY3Rpb24uc2V0Q29udGVudCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVwbGFjZVNob3J0Y29kZXMgPSAoY29udGVudCkgPT4ge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBjb250ZW50LnJlcGxhY2UoL1xcW3JrbHBfc2hvcnRjb2RlIChbXlxcXV0qKVxcXS9nLCBmdW5jdGlvbihtYXRjaCwgYXR0cikge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHNlbGYuZGVjb2RlTGluayhhdHRyLnNwbGl0KCc9JylbMV0ucmVwbGFjZShcIidcIiwgJycpLnJlcGxhY2UoXCInXCIsICcnKSk7XG5cbiAgICAgICAgICAgIGlmIChkYXRhLmlkID09PSBzZWxmLnByZXZpZXdEYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8cD5bcmtscF9zaG9ydGNvZGUgZGF0YT0nJHtzZWxmLmVuY29kZUxpbmsoc2VsZi5wcmV2aWV3RGF0YSl9J108L3A+YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVuY29kZUxpbmsgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICAgIHJldHVybiBiYXNlNjQuZW5jb2RlKHV0ZjguZW5jb2RlKEpTT04uc3RyaW5naWZ5KGxpbmspKSk7XG4gICAgfVxuXG4gICAgZGVjb2RlTGluayA9IGZ1bmN0aW9uKGVuY29kZWQpIHtcbiAgICAgICAgbGV0IGRlY29kZWQgPSAnJztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRlY29kZWQgPSBKU09OLnBhcnNlKHV0ZjguZGVjb2RlKGJhc2U2NC5kZWNvZGUoZW5jb2RlZCkpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZGVjb2RlZCA9IEpTT04ucGFyc2UoYmFzZTY0LmRlY29kZShlbmNvZGVkKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlY29kZWQ7XG4gICAgfVxuXG4gICAgbG9hZFRlbXBsYXRlcyA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9ICdnZXRfdGVtcGxhdGVzJztcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBya2xrcF9hamF4X3VybCxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb25cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnRlbXBsYXRlcyA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHNlbGYucmVuZGVyTW9kYWxUZW1wbGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgIC5yZW5kZXJQcmV2aWV3QmxvY2soKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwYXJzZUxpbmtEYXRhID0gKHVybCkgPT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAodXJsLmluZGV4T2YoJ2h0dHAnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHVybCA9ICdodHRwczovLycgKyB1cmw7XG4gICAgICAgIH1cblxuICAgICAgICBmZXRjaChgJHt0aGlzLmVuZHBvaW50fSR7dXJsfWApLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBzZWxmLnNob3dQcmV2aWV3ID0gdHJ1ZTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5wcmV2aWV3RGF0YVtrZXldID0gZGF0YVtrZXldO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNlbGYucmVuZGVyUHJldmlld0Jsb2NrKClcbiAgICAgICAgICAgICAgICAucmVuZGVyRm9ybSgpXG4gICAgICAgICAgICAgICAgLnJlbmRlckltYWdlQmxvY2soKVxuICAgICAgICAgICAgICAgIC5yZW5kZXJNb2RhbFRlbXBsYXRlKClcbiAgICAgICAgICAgICAgICAucmVuZGVyRm9vdGVyKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9wZW5Nb2RhbCA9IChkYXRhID0gdGhpcy5wcmV2aWV3RGF0YSkgPT4ge1xuICAgICAgICB0aGlzLnByZXZpZXdEYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgICAgICAgLnJlbmRlckZvb3RlcigpXG4gICAgICAgICAgICAubG9hZFRlbXBsYXRlcygpXG4gICAgICAgICAgICAucmVuZGVyRm9ybSgpO1xuXG4gICAgICAgIGlmICh0aGlzLnByZXZpZXdEYXRhLmlkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckltYWdlQmxvY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb3NlTW9kYWwgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMucHJldmlld0RhdGEgPSB7XG4gICAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgICAgaW1hZ2U6ICcnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICdsZWZ0LWltYWdlJ1xuICAgICAgICB9O1xuICAgICAgICBqUXVlcnkoJy5qcy1tb2RhbCcpLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJlbmRlclZpZXcgPSAoYmxvY2ssIGNvbnRlbnQpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihibG9jaykuaW5uZXJIVE1MID0gY29udGVudDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVuZGVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGA8ZGl2IGNsYXNzPVwicmtscC1tb2RhbCBqcy1tb2RhbFwiPlxuICAgICAgICAgICAgPGZvcm0gYWN0aW9uPVwiXCIgY2xhc3M9XCJqcy1tb2RhbC1mb3JtXCI+XG4gICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJrbHAtbW9kYWxfX3dyYXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1tb2RhbF9faGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cInJrbHAtbW9kYWxfX3RpdGxlXCI+UksgTGluayBQcmV2aWV3PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJrbHAtbW9kYWxfX2Nsb3NlIGpzLWNsb3NlXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJrbHAtbW9kYWxfX2NvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtZm9ybS1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPCEtLWZvcm0gY29udGVudCBwb3J0YWwgLS0+XG4gICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aS1mb3JtLWl0ZW0ganMtbW9kYWwtdGVtcGxhdGVcIj48L2Rpdj4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpLWZvcm0taXRlbSBqcy1wcmV2aWV3LWJsb2NrXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJrbHAtbW9kYWxfX2Zvb3RlciBqcy1tb2RhbC1mb290ZXJcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5gO1xuICAgICAgICB0aGlzLnJlbmRlclZpZXcoJyNya2wtcm9vdCcsIHRlbXBsYXRlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVuZGVyRm9ybSA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qge3RpdGxlLCBkZXNjcmlwdGlvbiwgdXJsfSA9IHRoaXMucHJldmlld0RhdGE7XG4gICAgICAgIHRoaXMucmVuZGVyVmlldygnLmpzLWZvcm0tY29udGVudCcsIGAgPGRpdiBjbGFzcz1cInZpLWZvcm0taXRlbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpLWxhYmVsXCI+TGluazwvZGl2PlxuICAgICAgICAgICAgICAgIDxpbnB1dCBcbiAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImh0dHBzOi8vLi4uXCIgXG4gICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgICAgICAgICBjbGFzcz1cInZpLWlucHV0IGpzLXVybFwiIFxuICAgICAgICAgICAgICAgICAgIG5hbWU9XCJ1cmxcIlxuICAgICAgICAgICAgICAgICAgIHZhbHVlPVwiJHt1cmx9XCJcbiAgICAgICAgICAgICAgICAvPiAgICBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpLWZvcm0taXRlbSBqcy1pbWFnZS1ibG9ja1wiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpLWZvcm0taXRlbVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aS1sYWJlbFwiPlRpdGxlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGlucHV0IFxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJQYXJzZWQgdGl0bGVcIiBcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCIgXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cInZpLWlucHV0IGpzLXRpdGxlXCIgXG4gICAgICAgICAgICAgICAgICBuYW1lPVwidGl0bGVcIlxuICAgICAgICAgICAgICAgICAgdmFsdWU9XCIke3RpdGxlfVwiXG4gICAgICAgICAgICAgICAgICAkeyF0aGlzLnByZXZpZXdEYXRhWyd0aXRsZSddLmxlbmd0aCA/ICdkaXNhYmxlZCcgOiAnJ31cbiAgICAgICAgICAgICAgICAvPiAgIFxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmktZm9ybS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpLWxhYmVsXCI+RGVzY3JpcHRpb248L2Rpdj5cbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgXG4gICAgICAgICAgICAgICAgICAgbmFtZT1cImRlc2NyaXB0aW9uXCIgXG4gICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ2aS10ZXh0YXJlYSBqcy1kZXNjcmlwdGlvblwiIFxuICAgICAgICAgICAgICAgICAgIHJvd3M9XCIxMFwiIFxuICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUGFyc2VkIGRlc2NyaXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAkeyF0aGlzLnByZXZpZXdEYXRhWyd0aXRsZSddLmxlbmd0aCA/ICdkaXNhYmxlZCcgOiAnJ31cbiAgICAgICAgICAgICAgICAgICA+JHtkZXNjcmlwdGlvbn08L3RleHRhcmVhPiAgIFxuICAgICAgICA8L2Rpdj5gKVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW5kZXJJbWFnZUJsb2NrID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB7aW1hZ2V9ID0gdGhpcy5wcmV2aWV3RGF0YTtcbiAgICAgICAgY29uc3QgYm9keSA9IGpRdWVyeSgnYm9keScpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyVmlldygnLmpzLWltYWdlLWJsb2NrJywgYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJrbHAtbW9kYWxfX2ltYWdlLWJsb2NrXCI+XG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1tb2RhbF9faW1hZ2Utd3JhcHBlciBqcy1pbWFnZS13cmFwcGVyXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJrbHAtbW9kYWxfX2J1dHRvbiBidXR0b24gYnV0dG9uLWxhcmdlIGpzLWFkZC1pbWFnZVwiPlxuICAgICAgICAgICAgICAgICAgICAgQWRkIGltYWdlXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+ICBcbiAgICAgICAgYCk7XG4gICAgICAgIGJvZHkuZmluZCgnLmpzLWltYWdlLXdyYXBwZXInKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCBgdXJsKCR7aW1hZ2V9KWApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlbmRlclByZXZpZXdCbG9jayA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qge2ltYWdlLCB0aXRsZSwgZGVzY3JpcHRpb259ID0gdGhpcy5wcmV2aWV3RGF0YTtcblxuICAgICAgICBpZiAoIXRoaXMucHJldmlld0RhdGFbJ3VybCddLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIHRoaXMucmVuZGVyVmlldygnLmpzLXByZXZpZXctYmxvY2snLCBgPGRpdiBjbGFzcz1cInJrbHAtbW9kYWxfX3ByZXZpZXdcIj5cbiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1wcmV2aWV3IGpzLXByZXZpZXcgJHt0aGlzLnByZXZpZXdEYXRhWyd0ZW1wbGF0ZSddfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJya2xwLXByZXZpZXdfX2ltYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtpbWFnZX1cIiBhbHQ9XCJcIj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1wcmV2aWV3X19jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzcz1cInJrbHAtcHJldmlld19fdGl0bGUganMtcHJldmlldy10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHt0aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJya2xwLXByZXZpZXdfX2Rlc2NyaXB0aW9uIGpzLXByZXZpZXctZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICR7ZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgJHt3aW5kb3cucmtfcmVhZF9tb3JlID8gdGhpcy5yZW5kZXJSZWFkTW9yZSgpIDogJyd9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVuZGVyUmVhZE1vcmUgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHt1cmx9ID0gdGhpcy5wcmV2aWV3RGF0YTtcbiAgICAgICAgcmV0dXJuIGA8YSBocmVmPVwiJHt1cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCIgY2xhc3M9XCJya2xwLXByZXZpZXdfX21vcmVcIj5SZWFkIE1vcmU8L2E+YFxuICAgIH1cblxuICAgIHJlbmRlck1vZGFsVGVtcGxhdGUgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlbmRlclZpZXcoJy5qcy1tb2RhbC10ZW1wbGF0ZScsIGAgXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aS1sYWJlbFwiPlRlbXBsYXRlPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWxlY3QgXG4gICAgICAgICAgICAgICAgIGNsYXNzPVwidmktc2VsZWN0IGpzLXRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgJHshdGhpcy5wcmV2aWV3RGF0YVsndGl0bGUnXS5sZW5ndGggPyAnZGlzYWJsZWQnIDogJyd9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPnRlc3Q8L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PmApO1xuXG4gICAgICAgIGNvbnN0ICRlbCA9IGpRdWVyeShcIi5qcy10ZW1wbGF0ZVwiKTtcbiAgICAgICAgJGVsLmVtcHR5KCk7XG4gICAgICAgIGpRdWVyeS5lYWNoKE9iamVjdC5rZXlzKHNlbGYudGVtcGxhdGVzKSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICRlbC5hcHBlbmQoalF1ZXJ5KFwiPG9wdGlvbj48L29wdGlvbj5cIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInZhbHVlXCIsIHZhbHVlKS50ZXh0KHNlbGYudGVtcGxhdGVzW3ZhbHVlXS5kZXNjcmlwdGlvbikpO1xuICAgICAgICB9KTtcbiAgICAgICAgJGVsLnZhbChzZWxmLnByZXZpZXdEYXRhWyd0ZW1wbGF0ZSddKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW5kZXJGb290ZXIgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVuZGVyVmlldygnLmpzLW1vZGFsLWZvb3RlcicsIGA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgICAgICAgJHshdGhpcy5wcmV2aWV3RGF0YVsndGl0bGUnXS5sZW5ndGggPyAnZGlzYWJsZWQnIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInJrbHAtbW9kYWxfX2J1dHRvbiBidXR0b24gYnV0dG9uLXByaW1hcnkgYnV0dG9uLWxhcmdlIGpzLWluc2VydC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICBJbnNlcnQgbGlua1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5gKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkFkZEltYWdlQ2xpY2tIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgalF1ZXJ5KCdib2R5JykuZGVsZWdhdGUoJy5qcy1hZGQtaW1hZ2UnLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIGltYWdlID0gd3AubWVkaWEoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnVXBsb2FkIEltYWdlJyxcbiAgICAgICAgICAgICAgICBtdWx0aXBsZTogZmFsc2VcbiAgICAgICAgICAgIH0pLm9wZW4oKVxuICAgICAgICAgICAgICAgIC5vbignc2VsZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGxvYWRlZF9pbWFnZSA9IGltYWdlLnN0YXRlKCkuZ2V0KCdzZWxlY3Rpb24nKS5maXJzdCgpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnByZXZpZXdEYXRhWydpbWFnZSddID0gdXBsb2FkZWRfaW1hZ2UudG9KU09OKCkudXJsO1xuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVuZGVyUHJldmlld0Jsb2NrKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW5kZXJJbWFnZUJsb2NrKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
},{"base-64":3,"utf8":4}],3:[function(require,module,exports){
(function (global){
/*! https://mths.be/base64 v1.0.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atk’s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function(input) {
		input = String(input)
			.replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (
			length % 4 == 1 ||
			// http://whatwg.org/C#alphanumeric-ascii-characters
			/[^+a-zA-Z0-9/]/.test(input)
		) {
			error(
				'Invalid character: the string to be decoded is not correctly encoded.'
			);
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 characters…
			if (bitCounter++ % 4) {
				// …convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(
					0xFF & bitStorage >> (-2 * bitCounter & 6)
				);
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '1.0.0'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return base64;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = base64;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in base64) {
				base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.base64 = base64;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
/*! https://mths.be/utf8js v3.0.0 by @mathias */
;(function(root) {

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			checkScalarValue(codePoint);
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				checkScalarValue(codePoint);
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	root.version = '3.0.0';
	root.encode = utf8encode;
	root.decode = utf8decode;

}(typeof exports === 'undefined' ? this.utf8 = {} : exports));

},{}]},{},[1])