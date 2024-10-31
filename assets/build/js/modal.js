(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfYzQ5ZmVkMjguanMiXSwibmFtZXMiOlsiTW9kYWwiLCJzZWxmIiwiYm9keSIsImpRdWVyeSIsImRlbGVnYXRlIiwiY2xvc2VNb2RhbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImNyZWF0ZVByZXZpZXciLCJwYXJzZUxpbmtEYXRhIiwiZXNjYXBlX2h0bWwiLCJ2YWwiLCJwcmV2aWV3RGF0YSIsInJlbmRlclByZXZpZXdCbG9jayIsImh0bWwiLCJ0ZXh0IiwiZW5jb2RlTGluayIsImlkIiwid2luZG93Iiwic2V0Q29udGVudCIsInJlcGxhY2VTaG9ydGNvZGVzIiwiZ2V0Q29udGVudCIsIkRhdGUiLCJnZXRUaW1lIiwidGlueU1DRSIsImFjdGl2ZUVkaXRvciIsInNlbGVjdGlvbiIsImNvbnRlbnQiLCJyZXBsYWNlIiwibWF0Y2giLCJhdHRyIiwiZGF0YSIsImRlY29kZUxpbmsiLCJzcGxpdCIsImxpbmsiLCJiYXNlNjQiLCJlbmNvZGUiLCJ1dGY4IiwiSlNPTiIsInN0cmluZ2lmeSIsImVuY29kZWQiLCJkZWNvZGVkIiwicGFyc2UiLCJkZWNvZGUiLCJhY3Rpb24iLCJhamF4IiwidXJsIiwicmtsa3BfYWpheF91cmwiLCJkYXRhVHlwZSIsInR5cGUiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJ0ZW1wbGF0ZXMiLCJyZW5kZXJNb2RhbFRlbXBsYXRlIiwiZXJyb3IiLCJpbmRleE9mIiwiZmV0Y2giLCJlbmRwb2ludCIsInRoZW4iLCJqc29uIiwic2hvd1ByZXZpZXciLCJPYmplY3QiLCJrZXlzIiwibWFwIiwia2V5IiwicmVuZGVyRm9ybSIsInJlbmRlckltYWdlQmxvY2siLCJyZW5kZXJGb290ZXIiLCJyZW5kZXIiLCJsb2FkVGVtcGxhdGVzIiwidGl0bGUiLCJpbWFnZSIsImRlc2NyaXB0aW9uIiwidGVtcGxhdGUiLCJyZW1vdmUiLCJibG9jayIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImlubmVySFRNTCIsInJlbmRlclZpZXciLCJsZW5ndGgiLCJmaW5kIiwiY3NzIiwicmtfcmVhZF9tb3JlIiwicmVuZGVyUmVhZE1vcmUiLCIkZWwiLCJlbXB0eSIsImVhY2giLCJ2YWx1ZSIsImFwcGVuZCIsIndwIiwibWVkaWEiLCJtdWx0aXBsZSIsIm9wZW4iLCJvbiIsInVwbG9hZGVkX2ltYWdlIiwic3RhdGUiLCJnZXQiLCJmaXJzdCIsInRvSlNPTiIsImV2ZW50cyIsIm9uQWRkSW1hZ2VDbGlja0hhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7SUFFcUJBLEssR0FDakIsaUJBQWM7QUFBQTs7QUFBQTs7QUFBQSxrQ0FjTCxZQUFNO0FBQ1gsUUFBTUMsSUFBSSxHQUFHLEtBQWI7QUFDQSxRQUFNQyxJQUFJLEdBQUdDLE1BQU0sQ0FBQyxNQUFELENBQW5CO0FBRUFELElBQUFBLElBQUksQ0FBQ0UsUUFBTCxDQUFjLFdBQWQsRUFBMkIsT0FBM0IsRUFBb0MsWUFBTTtBQUN0QyxNQUFBLEtBQUksQ0FBQ0MsVUFBTDtBQUNILEtBRkQ7QUFJQUgsSUFBQUEsSUFBSSxDQUFDRSxRQUFMLENBQWMsbUJBQWQsRUFBbUMsT0FBbkMsRUFBNEMsVUFBQ0UsQ0FBRCxFQUFPO0FBQy9DQSxNQUFBQSxDQUFDLENBQUNDLGNBQUY7QUFDQU4sTUFBQUEsSUFBSSxDQUFDTyxhQUFMO0FBQ0gsS0FIRDtBQUtBTixJQUFBQSxJQUFJLENBQUNFLFFBQUwsQ0FBYyxTQUFkLEVBQXlCLFFBQXpCLEVBQW1DLFlBQVk7QUFDM0NILE1BQUFBLElBQUksQ0FBQ1EsYUFBTCxDQUFtQlIsSUFBSSxDQUFDUyxXQUFMLENBQWlCUCxNQUFNLENBQUMsSUFBRCxDQUFOLENBQWFRLEdBQWIsRUFBakIsQ0FBbkI7QUFDSCxLQUZEO0FBSUFULElBQUFBLElBQUksQ0FBQ0UsUUFBTCxDQUFjLGNBQWQsRUFBOEIsUUFBOUIsRUFBd0MsWUFBWTtBQUNoREgsTUFBQUEsSUFBSSxDQUFDVyxXQUFMLENBQWlCLFVBQWpCLElBQStCVCxNQUFNLENBQUMsSUFBRCxDQUFO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SSxFQUlNLFlBQVk7QUFDdEIsWUFBTUMsY0FBYyxHQUFHeEIsS0FBSyxDQUFDeUIsS0FBTixHQUFjQyxHQUFkLENBQWtCLFdBQWxCLEVBQStCQyxLQUEvQixFQUF2QjtBQUNBakcsUUFBQUEsSUFBSSxDQUFDVyxXQUFMLENBQWlCLE9BQWpCLElBQTRCbUYsY0FBYyxDQUFDSSxNQUFmLEdBQXdCckQsR0FBcEQ7QUFFQTdDLFFBQUFBLElBQUksQ0FBQ1ksa0JBQUwsR0FDS3FELGdCQURMO0FBRUgsT0FWTyxDQUFaO0FBV0gsS0FiRDtBQWNILEdBOVRhOztBQUNWLE9BQUtULFFBQUwsR0FBZ0IsdUNBQWhCO0FBQ0EsT0FBS0wsU0FBTCxHQUFpQixFQUFqQjtBQUNBLE9BQUtnRCxNQUFMO0FBQ0EsT0FBS0Msc0JBQUw7QUFDQSxPQUFLekYsV0FBTCxHQUFtQjtBQUNmMEQsSUFBQUEsS0FBSyxFQUFFLEVBRFE7QUFFZnhCLElBQUFBLEdBQUcsRUFBRSxFQUZVO0FBR2Z5QixJQUFBQSxLQUFLLEVBQUUsRUFIUTtBQUlmQyxJQUFBQSxXQUFXLEVBQUUsRUFKRTtBQUtmQyxJQUFBQSxRQUFRLEVBQUU7QUFMSyxHQUFuQjtBQU9ILEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmFzZTY0IGZyb20gJ2Jhc2UtNjQnO1xuaW1wb3J0IHV0ZjggZnJvbSAndXRmOCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lbmRwb2ludCA9ICdodHRwczovL3ByZXZpZXctYXBpLmJic3BhY2UudG9wLz91cmw9JztcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5ldmVudHMoKTtcbiAgICAgICAgdGhpcy5vbkFkZEltYWdlQ2xpY2tIYW5kbGVyKCk7XG4gICAgICAgIHRoaXMucHJldmlld0RhdGEgPSB7XG4gICAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgICAgaW1hZ2U6ICcnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICdsZWZ0LWltYWdlJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGV2ZW50cyA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBqUXVlcnkoJ2JvZHknKTtcblxuICAgICAgICBib2R5LmRlbGVnYXRlKCcuanMtY2xvc2UnLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYm9keS5kZWxlZ2F0ZSgnLmpzLWluc2VydC1idXR0b24nLCAnY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2VsZi5jcmVhdGVQcmV2aWV3KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJvZHkuZGVsZWdhdGUoJy5qcy11cmwnLCAnY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5wYXJzZUxpbmtEYXRhKHNlbGYuZXNjYXBlX2h0bWwoalF1ZXJ5KHRoaXMpLnZhbCgpKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJvZHkuZGVsZWdhdGUoJy5qcy10ZW1wbGF0ZScsICdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLnByZXZpZXdEYXRhWyd0ZW1wbGF0ZSddID0galF1ZXJ5KHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgc2VsZi5yZW5kZXJQcmV2aWV3QmxvY2soKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSW5wdXRcbiAgICAgICAgYm9keS5kZWxlZ2F0ZSgnLmpzLXRpdGxlJywgJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5wcmV2aWV3RGF0YVsndGl0bGUnXSA9IHNlbGYuZXNjYXBlX2h0bWwoalF1ZXJ5KHRoaXMpLnZhbCgpKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLmpzLXByZXZpZXctdGl0bGUnKS5odG1sKHNlbGYucHJldmlld0RhdGFbJ3RpdGxlJ10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBib2R5LmRlbGVnYXRlKCcuanMtZGVzY3JpcHRpb24nLCAnaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLnByZXZpZXdEYXRhWydkZXNjcmlwdGlvbiddID0gc2VsZi5lc2NhcGVfaHRtbChqUXVlcnkodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgalF1ZXJ5KCcuanMtcHJldmlldy1kZXNjcmlwdGlvbicpLmh0bWwoc2VsZi5wcmV2aWV3RGF0YVsnZGVzY3JpcHRpb24nXSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlc2NhcGVfaHRtbCA9ICh2YWwpID0+IHtcbiAgICAgICAgcmV0dXJuIGpRdWVyeSgnPGRpdi8+JykudGV4dCh2YWwpLmh0bWwoKTtcbiAgICB9XG4gICAgY3JlYXRlUHJldmlldyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGBbcmtscF9zaG9ydGNvZGUgZGF0YT0nJHt0aGlzLmVuY29kZUxpbmsodGhpcy5wcmV2aWV3RGF0YSl9J11gO1xuICAgICAgICBpZiAodGhpcy5wcmV2aWV3RGF0YS5pZCkge1xuICAgICAgICAgICAgd2luZG93LmUuc2V0Q29udGVudCh0aGlzLnJlcGxhY2VTaG9ydGNvZGVzKHdpbmRvdy5lLmdldENvbnRlbnQoKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcmV2aWV3RGF0YS5pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgd2luZG93LnRpbnlNQ0UuYWN0aXZlRWRpdG9yLnNlbGVjdGlvbi5zZXRDb250ZW50KHRleHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xvc2VNb2RhbCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXBsYWNlU2hvcnRjb2RlcyA9IChjb250ZW50KSA9PiB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZSgvXFxbcmtscF9zaG9ydGNvZGUgKFteXFxdXSopXFxdL2csIGZ1bmN0aW9uKG1hdGNoLCBhdHRyKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gc2VsZi5kZWNvZGVMaW5rKGF0dHIuc3BsaXQoJz0nKVsxXS5yZXBsYWNlKFwiJ1wiLCAnJykucmVwbGFjZShcIidcIiwgJycpKTtcblxuICAgICAgICAgICAgaWYgKGRhdGEuaWQgPT09IHNlbGYucHJldmlld0RhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxwPltya2xwX3Nob3J0Y29kZSBkYXRhPScke3NlbGYuZW5jb2RlTGluayhzZWxmLnByZXZpZXdEYXRhKX0nXTwvcD5gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZW5jb2RlTGluayA9IGZ1bmN0aW9uKGxpbmspIHtcbiAgICAgICAgcmV0dXJuIGJhc2U2NC5lbmNvZGUodXRmOC5lbmNvZGUoSlNPTi5zdHJpbmdpZnkobGluaykpKTtcbiAgICB9XG5cbiAgICBkZWNvZGVMaW5rID0gZnVuY3Rpb24oZW5jb2RlZCkge1xuICAgICAgICBsZXQgZGVjb2RlZCA9ICcnO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGVjb2RlZCA9IEpTT04ucGFyc2UodXRmOC5kZWNvZGUoYmFzZTY0LmRlY29kZShlbmNvZGVkKSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBkZWNvZGVkID0gSlNPTi5wYXJzZShiYXNlNjQuZGVjb2RlKGVuY29kZWQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVjb2RlZDtcbiAgICB9XG5cbiAgICBsb2FkVGVtcGxhdGVzID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgYWN0aW9uID0gJ2dldF90ZW1wbGF0ZXMnO1xuICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHJrbGtwX2FqYXhfdXJsLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGFjdGlvblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHNlbGYudGVtcGxhdGVzID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgc2VsZi5yZW5kZXJNb2RhbFRlbXBsYXRlKClcbiAgICAgICAgICAgICAgICAgICAgLnJlbmRlclByZXZpZXdCbG9jaygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHBhcnNlTGlua0RhdGEgPSAodXJsKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICh1cmwuaW5kZXhPZignaHR0cCcpID09PSAtMSkge1xuICAgICAgICAgICAgdXJsID0gJ2h0dHBzOi8vJyArIHVybDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZldGNoKGAke3RoaXMuZW5kcG9pbnR9JHt1cmx9YCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHNlbGYuc2hvd1ByZXZpZXcgPSB0cnVlO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoZGF0YSkubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLnByZXZpZXdEYXRhW2tleV0gPSBkYXRhW2tleV07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2VsZi5yZW5kZXJQcmV2aWV3QmxvY2soKVxuICAgICAgICAgICAgICAgIC5yZW5kZXJGb3JtKClcbiAgICAgICAgICAgICAgICAucmVuZGVySW1hZ2VCbG9jaygpXG4gICAgICAgICAgICAgICAgLnJlbmRlck1vZGFsVGVtcGxhdGUoKVxuICAgICAgICAgICAgICAgIC5yZW5kZXJGb290ZXIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb3Blbk1vZGFsID0gKGRhdGEgPSB0aGlzLnByZXZpZXdEYXRhKSA9PiB7XG4gICAgICAgIHRoaXMucHJldmlld0RhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgICAgICAgICAucmVuZGVyRm9vdGVyKClcbiAgICAgICAgICAgIC5sb2FkVGVtcGxhdGVzKClcbiAgICAgICAgICAgIC5yZW5kZXJGb3JtKCk7XG5cbiAgICAgICAgaWYgKHRoaXMucHJldmlld0RhdGEuaWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVySW1hZ2VCbG9jaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xvc2VNb2RhbCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5wcmV2aWV3RGF0YSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgICAgIHVybDogJycsXG4gICAgICAgICAgICBpbWFnZTogJycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ2xlZnQtaW1hZ2UnXG4gICAgICAgIH07XG4gICAgICAgIGpRdWVyeSgnLmpzLW1vZGFsJykucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyVmlldyA9IChibG9jaywgY29udGVudCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGJsb2NrKS5pbm5lckhUTUwgPSBjb250ZW50O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW5kZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYDxkaXYgY2xhc3M9XCJya2xwLW1vZGFsIGpzLW1vZGFsXCI+XG4gICAgICAgICAgICA8Zm9ybSBhY3Rpb249XCJcIiBjbGFzcz1cImpzLW1vZGFsLWZvcm1cIj5cbiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1tb2RhbF9fd3JhcFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJya2xwLW1vZGFsX19oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzPVwicmtscC1tb2RhbF9fdGl0bGVcIj5SSyBMaW5rIFByZXZpZXc8L2gyPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1tb2RhbF9fY2xvc2UganMtY2xvc2VcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1tb2RhbF9fY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1mb3JtLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8IS0tZm9ybSBjb250ZW50IHBvcnRhbCAtLT5cbiAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpLWZvcm0taXRlbSBqcy1tb2RhbC10ZW1wbGF0ZVwiPjwvZGl2PiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmktZm9ybS1pdGVtIGpzLXByZXZpZXctYmxvY2tcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1tb2RhbF9fZm9vdGVyIGpzLW1vZGFsLWZvb3RlclwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PmA7XG4gICAgICAgIHRoaXMucmVuZGVyVmlldygnI3JrbC1yb290JywgdGVtcGxhdGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW5kZXJGb3JtID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB7dGl0bGUsIGRlc2NyaXB0aW9uLCB1cmx9ID0gdGhpcy5wcmV2aWV3RGF0YTtcbiAgICAgICAgdGhpcy5yZW5kZXJWaWV3KCcuanMtZm9ybS1jb250ZW50JywgYCA8ZGl2IGNsYXNzPVwidmktZm9ybS1pdGVtXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmktbGFiZWxcIj5MaW5rPC9kaXY+XG4gICAgICAgICAgICAgICAgPGlucHV0IFxuICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiaHR0cHM6Ly8uLi5cIiBcbiAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiIFxuICAgICAgICAgICAgICAgICAgIGNsYXNzPVwidmktaW5wdXQganMtdXJsXCIgXG4gICAgICAgICAgICAgICAgICAgbmFtZT1cInVybFwiXG4gICAgICAgICAgICAgICAgICAgdmFsdWU9XCIke3VybH1cIlxuICAgICAgICAgICAgICAgIC8+ICAgIFxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmktZm9ybS1pdGVtIGpzLWltYWdlLWJsb2NrXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmktZm9ybS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpLWxhYmVsXCI+VGl0bGU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlBhcnNlZCB0aXRsZVwiIFxuICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVwidmktaW5wdXQganMtdGl0bGVcIiBcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJ0aXRsZVwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT1cIiR7dGl0bGV9XCJcbiAgICAgICAgICAgICAgICAgICR7IXRoaXMucHJldmlld0RhdGFbJ3RpdGxlJ10ubGVuZ3RoID8gJ2Rpc2FibGVkJyA6ICcnfVxuICAgICAgICAgICAgICAgIC8+ICAgXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aS1mb3JtLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmktbGFiZWxcIj5EZXNjcmlwdGlvbjwvZGl2PlxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBcbiAgICAgICAgICAgICAgICAgICBuYW1lPVwiZGVzY3JpcHRpb25cIiBcbiAgICAgICAgICAgICAgICAgICBjbGFzcz1cInZpLXRleHRhcmVhIGpzLWRlc2NyaXB0aW9uXCIgXG4gICAgICAgICAgICAgICAgICAgcm93cz1cIjEwXCIgXG4gICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJQYXJzZWQgZGVzY3JpcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICR7IXRoaXMucHJldmlld0RhdGFbJ3RpdGxlJ10ubGVuZ3RoID8gJ2Rpc2FibGVkJyA6ICcnfVxuICAgICAgICAgICAgICAgICAgID4ke2Rlc2NyaXB0aW9ufTwvdGV4dGFyZWE+ICAgXG4gICAgICAgIDwvZGl2PmApXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlbmRlckltYWdlQmxvY2sgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHtpbWFnZX0gPSB0aGlzLnByZXZpZXdEYXRhO1xuICAgICAgICBjb25zdCBib2R5ID0galF1ZXJ5KCdib2R5Jyk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJWaWV3KCcuanMtaW1hZ2UtYmxvY2snLCBgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1tb2RhbF9faW1hZ2UtYmxvY2tcIj5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJya2xwLW1vZGFsX19pbWFnZS13cmFwcGVyIGpzLWltYWdlLXdyYXBwZXJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1tb2RhbF9fYnV0dG9uIGJ1dHRvbiBidXR0b24tbGFyZ2UganMtYWRkLWltYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgICBBZGQgaW1hZ2VcbiAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj4gIFxuICAgICAgICBgKTtcbiAgICAgICAgYm9keS5maW5kKCcuanMtaW1hZ2Utd3JhcHBlcicpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsIGB1cmwoJHtpbWFnZX0pYCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVuZGVyUHJldmlld0Jsb2NrID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB7aW1hZ2UsIHRpdGxlLCBkZXNjcmlwdGlvbn0gPSB0aGlzLnByZXZpZXdEYXRhO1xuXG4gICAgICAgIGlmICghdGhpcy5wcmV2aWV3RGF0YVsndXJsJ10ubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJWaWV3KCcuanMtcHJldmlldy1ibG9jaycsIGA8ZGl2IGNsYXNzPVwicmtscC1tb2RhbF9fcHJldmlld1wiPlxuICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJya2xwLXByZXZpZXcganMtcHJldmlldyAke3RoaXMucHJldmlld0RhdGFbJ3RlbXBsYXRlJ119XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJrbHAtcHJldmlld19faW1hZ2VcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2ltYWdlfVwiIGFsdD1cIlwiPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJya2xwLXByZXZpZXdfX2NvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzPVwicmtscC1wcmV2aWV3X190aXRsZSBqcy1wcmV2aWV3LXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAke3RpdGxlfVxuICAgICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInJrbHAtcHJldmlld19fZGVzY3JpcHRpb24ganMtcHJldmlldy1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHtkZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAke3dpbmRvdy5ya19yZWFkX21vcmUgPyB0aGlzLnJlbmRlclJlYWRNb3JlKCkgOiAnJ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIGApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW5kZXJSZWFkTW9yZSA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qge3VybH0gPSB0aGlzLnByZXZpZXdEYXRhO1xuICAgICAgICByZXR1cm4gYDxhIGhyZWY9XCIke3VybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cInJrbHAtcHJldmlld19fbW9yZVwiPlJlYWQgTW9yZTwvYT5gXG4gICAgfVxuXG4gICAgcmVuZGVyTW9kYWxUZW1wbGF0ZSA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVuZGVyVmlldygnLmpzLW1vZGFsLXRlbXBsYXRlJywgYCBcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpLWxhYmVsXCI+VGVtcGxhdGU8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlbGVjdCBcbiAgICAgICAgICAgICAgICAgY2xhc3M9XCJ2aS1zZWxlY3QganMtdGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAkeyF0aGlzLnByZXZpZXdEYXRhWyd0aXRsZSddLmxlbmd0aCA/ICdkaXNhYmxlZCcgOiAnJ31cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+dGVzdDwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+YCk7XG5cbiAgICAgICAgY29uc3QgJGVsID0galF1ZXJ5KFwiLmpzLXRlbXBsYXRlXCIpO1xuICAgICAgICAkZWwuZW1wdHkoKTtcbiAgICAgICAgalF1ZXJ5LmVhY2goT2JqZWN0LmtleXMoc2VsZi50ZW1wbGF0ZXMpLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgJGVsLmFwcGVuZChqUXVlcnkoXCI8b3B0aW9uPjwvb3B0aW9uPlwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwidmFsdWVcIiwgdmFsdWUpLnRleHQoc2VsZi50ZW1wbGF0ZXNbdmFsdWVdLmRlc2NyaXB0aW9uKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkZWwudmFsKHNlbGYucHJldmlld0RhdGFbJ3RlbXBsYXRlJ10pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlbmRlckZvb3RlciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5yZW5kZXJWaWV3KCcuanMtbW9kYWwtZm9vdGVyJywgYDxidXR0b24gXG4gICAgICAgICAgICAgICAgICAgICAgICAkeyF0aGlzLnByZXZpZXdEYXRhWyd0aXRsZSddLmxlbmd0aCA/ICdkaXNhYmxlZCcgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicmtscC1tb2RhbF9fYnV0dG9uIGJ1dHRvbiBidXR0b24tcHJpbWFyeSBidXR0b24tbGFyZ2UganMtaW5zZXJ0LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIEluc2VydCBsaW5rXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPmApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uQWRkSW1hZ2VDbGlja0hhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBqUXVlcnkoJ2JvZHknKS5kZWxlZ2F0ZSgnLmpzLWFkZC1pbWFnZScsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSB3cC5tZWRpYSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdVcGxvYWQgSW1hZ2UnLFxuICAgICAgICAgICAgICAgIG11bHRpcGxlOiBmYWxzZVxuICAgICAgICAgICAgfSkub3BlbigpXG4gICAgICAgICAgICAgICAgLm9uKCdzZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwbG9hZGVkX2ltYWdlID0gaW1hZ2Uuc3RhdGUoKS5nZXQoJ3NlbGVjdGlvbicpLmZpcnN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJldmlld0RhdGFbJ2ltYWdlJ10gPSB1cGxvYWRlZF9pbWFnZS50b0pTT04oKS51cmw7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW5kZXJQcmV2aWV3QmxvY2soKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbmRlckltYWdlQmxvY2soKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19
},{"base-64":2,"utf8":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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