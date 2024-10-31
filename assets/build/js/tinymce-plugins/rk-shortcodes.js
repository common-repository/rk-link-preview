(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _base = _interopRequireDefault(require("base-64"));

var _utf = _interopRequireDefault(require("utf8"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(function () {
  tinymce.PluginManager.add('rk-shortcodes', function (editor, url) {
    function encodeLink(link) {
      return _base["default"].encode(_utf["default"].encode(JSON.stringify(link)));
    }

    function decodeLink(encoded) {
      var decoded = '';

      try {
        decoded = JSON.parse(_utf["default"].decode(_base["default"].decode(encoded)));
      } catch (e) {
        decoded = JSON.parse(_base["default"].decode(encoded));
      }

      return decoded;
    }

    function replaceShortcodes(content) {
      var id = 0;
      return content.replace(/\[rklp_shortcode ([^\]]*)\]/g, function (match, attr) {
        id++;
        var data = attr.split('=')[1].replace("'", '').replace("'", '');
        return getHtml(decodeLink(data), id);
      });
    }

    function getHtml(data, id) {
      return "<div class=\"rklp-modal__preview\" contenteditable=\"false\" data-id=\"".concat(id, "\" data-url=\"").concat(data.url, "\">\n             <div class=\"rklp-preview js-preview ").concat(data.template, "\" data-template=\"").concat(data.template, "\">\n                <div class=\"rklp-preview__image\">\n                    <img src=\"").concat(data.image, "\" class=\"js-image\" alt=\"\">\n                </div>\n                <div class=\"rklp-preview__content\">\n                    <h3 class=\"rklp-preview__title js-preview-title\">\n                       ").concat(data.title, "\n                    </h3>\n                    <p class=\"rklp-preview__description js-preview-description\">\n                        ").concat(data.description, "\n                    </p>\n                    ").concat(window.rk_read_more ? renderReadMore(data) : '', "              \n                </div>\n             </div>\n        </div>\n        ");
    }

    function renderReadMore(data) {
      return "<a href=\"".concat(data.url, "\" target=\"_blank\" class=\"rklp-preview__more js-link\">Read More</a>");
    }

    function restoreShortcodes(content) {
      return content.replace(/<div class="rklp-.*?div><\/div><\/div>/g, function (match) {
        var data = collectData(match);

        if (data.title) {
          return "<p>[rklp_shortcode data='".concat(encodeLink(data), "']</p>");
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
      };
    }

    editor.on('mouseup', function (event) {
      var node = event.target;
      var data = collectData(jQuery(node).closest('.rklp-modal__preview'));

      if (data.title) {
        window.rk_modal.openModal(data);
      }
    });
    editor.on('BeforeSetContent', function (event) {
      event.content = replaceShortcodes(event.content);
    });
    editor.on('PostProcess', function (event) {
      if (event.get) {
        event.content = restoreShortcodes(event.content);
      }
    });
  });
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfNmRiZWI2NWUuanMiXSwibmFtZXMiOlsidGlueW1jZSIsIlBsdWdpbk1hbmFnZXIiLCJhZGQiLCJlZGl0b3IiLCJ1cmwiLCJlbmNvZGVMaW5rIiwibGluayIsImJhc2U2NCIsImVuY29kZSIsInV0ZjgiLCJKU09OIiwic3RyaW5naWZ5IiwiZGVjb2RlTGluayIsImVuY29kZWQiLCJkZWNvZGVkIiwicGFyc2UiLCJkZWNvZGUiLCJlIiwicmVwbGFjZVNob3J0Y29kZXMiLCJjb250ZW50IiwiaWQiLCJyZXBsYWNlIiwibWF0Y2giLCJhdHRyIiwiZGF0YSIsInNwbGl0IiwiZ2V0SHRtbCIsInRlbXBsYXRlIiwiaW1hZ2UiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwid2luZG93IiwicmtfcmVhZF9tb3JlIiwicmVuZGVyUmVhZE1vcmUiLCJyZXN0b3JlU2hvcnRjb2RlcyIsImNvbGxlY3REYXRhIiwiaHRtbCIsImpRdWVyeSIsImZpbmQiLCJvbiIsImV2ZW50Iiwibm9kZSIsInRhcmdldCIsImNsb3Nlc3QiLCJya19tb2RhbCIsIm9wZW5Nb2RhbCIsImdldCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7OztBQUVBLENBQUMsWUFBVztBQUNSQSxFQUFBQSxPQUFPLENBQUNDLGFBQVIsQ0FBc0JDLEdBQXRCLENBQTBCLGVBQTFCLEVBQTJDLFVBQVNDLE1BQVQsRUFBaUJDLEdBQWpCLEVBQXNCO0FBQzdELGFBQVNDLFVBQVQsQ0FBb0JDLElBQXBCLEVBQTBCO0FBQ3RCLGFBQU9DLGlCQUFPQyxNQUFQLENBQWNDLGdCQUFLRCxNQUFMLENBQVlFLElBQUksQ0FBQ0MsU0FBTCxDQUFlTCxJQUFmLENBQVosQ0FBZCxDQUFQO0FBQ0g7O0FBRUQsYUFBU00sVUFBVCxDQUFvQkMsT0FBcEIsRUFBNkI7QUFDekIsVUFBSUMsT0FBTyxHQUFHLEVBQWQ7O0FBQ0EsVUFBSTtBQUNBQSxRQUFBQSxPQUFPLEdBQUdKLElBQUksQ0FBQ0ssS0FBTCxDQUFXTixnQkFBS08sTUFBTCxDQUFZVCxpQkFBT1MsTUFBUCxDQUFjSCxPQUFkLENBQVosQ0FBWCxDQUFWO0FBQ0gsT0FGRCxDQUVFLE9BQU9JLENBQVAsRUFBVTtBQUNSSCxRQUFBQSxPQUFPLEdBQUdKLElBQUksQ0FBQ0ssS0FBTCxDQUFXUixpQkFBT1MsTUFBUCxDQUFjSCxPQUFkLENBQVgsQ0FBVjtBQUNIOztBQUNELGFBQU9DLE9BQVA7QUFDSDs7QUFFRCxhQUFTSSxpQkFBVCxDQUEyQkMsT0FBM0IsRUFBb0M7QUFDaEMsVUFBSUMsRUFBRSxHQUFHLENBQVQ7QUFDRCxhQUFPRCxPQUFPLENBQUNFLE9BQVIsQ0FBZ0IsOEJBQWhCLEVBQWdELFVBQVNDLEtBQVQsRUFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pFSCxRQUFBQSxFQUFFO0FBQ0YsWUFBTUksSUFBSSxHQUFHRCxJQUFJLENBQUNFLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLENBQWhCLEVBQW1CSixPQUFuQixDQUEyQixHQUEzQixFQUFnQyxFQUFoQyxFQUFvQ0EsT0FBcEMsQ0FBNEMsR0FBNUMsRUFBaUQsRUFBakQsQ0FBYjtBQUNBLGVBQU9LLE9BQU8sQ0FBQ2QsVUFBVSxDQUFDWSxJQUFELENBQVgsRUFBbUJKLEVBQW5CLENBQWQ7QUFDRixPQUpLLENBQVA7QUFLRjs7QUFFRCxhQUFTTSxPQUFULENBQWlCRixJQUFqQixFQUF1QkosRUFBdkIsRUFBMkI7QUFDdkIsOEZBQTRFQSxFQUE1RSwyQkFBNkZJLElBQUksQ0FBQ3BCLEdBQWxHLG9FQUN1Q29CLElBQUksQ0FBQ0csUUFENUMsZ0NBQ3dFSCxJQUFJLENBQUNHLFFBRDdFLHNHQUdvQkgsSUFBSSxDQUFDSSxLQUh6Qiw2TkFPYUosSUFBSSxDQUFDSyxLQVBsQixzSkFVY0wsSUFBSSxDQUFDTSxXQVZuQiw2REFZVUMsTUFBTSxDQUFDQyxZQUFQLEdBQXNCQyxjQUFjLENBQUNULElBQUQsQ0FBcEMsR0FBNkMsRUFadkQ7QUFpQkg7O0FBRUQsYUFBU1MsY0FBVCxDQUF3QlQsSUFBeEIsRUFBOEI7QUFDMUIsaUNBQW1CQSxJQUFJLENBQUNwQixHQUF4QjtBQUNIOztBQUVELGFBQVM4QixpQkFBVCxDQUEyQmYsT0FBM0IsRUFBb0M7QUFDaEMsYUFBT0EsT0FBTyxDQUFDRSxPQUFSLENBQWdCLHlDQUFoQixFQUEyRCxVQUFTQyxLQUFULEVBQWdCO0FBQzlFLFlBQU1FLElBQUksR0FBR1csV0FBVyxDQUFDYixLQUFELENBQXhCOztBQUNBLFlBQUlFLElBQUksQ0FBQ0ssS0FBVCxFQUFnQjtBQUNaLG9EQUFtQ3hCLFVBQVUsQ0FBQ21CLElBQUQsQ0FBN0M7QUFDSDs7QUFDRCxlQUFPRixLQUFQO0FBQ0gsT0FOTSxDQUFQO0FBT0g7O0FBRUQsYUFBU2EsV0FBVCxDQUFxQkMsSUFBckIsRUFBMkI7QUFDdkIsYUFBTztBQUNIUCxRQUFBQSxLQUFLLEVBQUVRLE1BQU0sQ0FBQ0QsSUFBRCxDQUFOLENBQWFFLElBQWIsQ0FBa0IsbUJBQWxCLEVBQXVDRixJQUF2QyxFQURKO0FBRUhoQyxRQUFBQSxHQUFHLEVBQUVpQyxNQUFNLENBQUNELElBQUQsQ0FBTixDQUFhWixJQUFiLENBQWtCLEtBQWxCLENBRkY7QUFHSEksUUFBQUEsS0FBSyxFQUFFUyxNQUFNLENBQUNELElBQUQsQ0FBTixDQUFhRSxJQUFiLENBQWtCLFdBQWxCLEVBQStCZixJQUEvQixDQUFvQyxLQUFwQyxDQUhKO0FBSUhPLFFBQUFBLFdBQVcsRUFBRU8sTUFBTSxDQUFDRCxJQUFELENBQU4sQ0FBYUUsSUFBYixDQUFrQix5QkFBbEIsRUFBNkNGLElBQTdDLEVBSlY7QUFLSFQsUUFBQUEsUUFBUSxFQUFFVSxNQUFNLENBQUNELElBQUQsQ0FBTixDQUFhRSxJQUFiLENBQWtCLGFBQWxCLEVBQWlDZCxJQUFqQyxDQUFzQyxVQUF0QyxDQUxQO0FBTUhKLFFBQUFBLEVBQUUsRUFBRWlCLE1BQU0sQ0FBQ0QsSUFBRCxDQUFOLENBQWFaLElBQWIsQ0FBa0IsSUFBbEI7QUFORCxPQUFQO0FBUUg7O0FBRURyQixJQUFBQSxNQUFNLENBQUNvQyxFQUFQLENBQVUsU0FBVixFQUFxQixVQUFTQyxLQUFULEVBQWdCO0FBQ2pDLFVBQU1DLElBQUksR0FBR0QsS0FBSyxDQUFDRSxNQUFuQjtBQUNBLFVBQU1sQixJQUFJLEdBQUdXLFdBQVcsQ0FBQ0UsTUFBTSxDQUFDSSxJQUFELENBQU4sQ0FBYUUsT0FBYixDQUFxQixzQkFBckIsQ0FBRCxDQUF4Qjs7QUFDQSxVQUFJbkIsSUFBSSxDQUFDSyxLQUFULEVBQWdCO0FBQ1pFLFFBQUFBLE1BQU0sQ0FBQ2EsUUFBUCxDQUFnQkMsU0FBaEIsQ0FBMEJyQixJQUExQjtBQUNIO0FBQ0osS0FORDtBQVFBckIsSUFBQUEsTUFBTSxDQUFDb0MsRUFBUCxDQUFVLGtCQUFWLEVBQThCLFVBQVNDLEtBQVQsRUFBZ0I7QUFDMUNBLE1BQUFBLEtBQUssQ0FBQ3JCLE9BQU4sR0FBZ0JELGlCQUFpQixDQUFDc0IsS0FBSyxDQUFDckIsT0FBUCxDQUFqQztBQUNILEtBRkQ7QUFJQWhCLElBQUFBLE1BQU0sQ0FBQ29DLEVBQVAsQ0FBVSxhQUFWLEVBQXlCLFVBQVNDLEtBQVQsRUFBZ0I7QUFDdEMsVUFBSUEsS0FBSyxDQUFDTSxHQUFWLEVBQWU7QUFDVk4sUUFBQUEsS0FBSyxDQUFDckIsT0FBTixHQUFnQmUsaUJBQWlCLENBQUNNLEtBQUssQ0FBQ3JCLE9BQVAsQ0FBakM7QUFDSDtBQUNKLEtBSkQ7QUFLSCxHQXRGRDtBQXVGSCxDQXhGRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiYXNlNjQgZnJvbSBcImJhc2UtNjRcIjtcbmltcG9ydCB1dGY4IGZyb20gXCJ1dGY4XCI7XG5cbihmdW5jdGlvbigpIHtcbiAgICB0aW55bWNlLlBsdWdpbk1hbmFnZXIuYWRkKCdyay1zaG9ydGNvZGVzJywgZnVuY3Rpb24oZWRpdG9yLCB1cmwpIHtcbiAgICAgICAgZnVuY3Rpb24gZW5jb2RlTGluayhsaW5rKSB7XG4gICAgICAgICAgICByZXR1cm4gYmFzZTY0LmVuY29kZSh1dGY4LmVuY29kZShKU09OLnN0cmluZ2lmeShsaW5rKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVjb2RlTGluayhlbmNvZGVkKSB7XG4gICAgICAgICAgICBsZXQgZGVjb2RlZCA9ICcnO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkZWNvZGVkID0gSlNPTi5wYXJzZSh1dGY4LmRlY29kZShiYXNlNjQuZGVjb2RlKGVuY29kZWQpKSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZGVjb2RlZCA9IEpTT04ucGFyc2UoYmFzZTY0LmRlY29kZShlbmNvZGVkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VTaG9ydGNvZGVzKGNvbnRlbnQpIHtcbiAgICAgICAgICAgIGxldCBpZCA9IDA7XG4gICAgICAgICAgIHJldHVybiBjb250ZW50LnJlcGxhY2UoL1xcW3JrbHBfc2hvcnRjb2RlIChbXlxcXV0qKVxcXS9nLCBmdW5jdGlvbihtYXRjaCwgYXR0cikge1xuICAgICAgICAgICAgICAgaWQrKztcbiAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhdHRyLnNwbGl0KCc9JylbMV0ucmVwbGFjZShcIidcIiwgJycpLnJlcGxhY2UoXCInXCIsICcnKVxuICAgICAgICAgICAgICAgcmV0dXJuIGdldEh0bWwoZGVjb2RlTGluayhkYXRhKSwgaWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRIdG1sKGRhdGEsIGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJya2xwLW1vZGFsX19wcmV2aWV3XCIgY29udGVudGVkaXRhYmxlPVwiZmFsc2VcIiBkYXRhLWlkPVwiJHtpZH1cIiBkYXRhLXVybD1cIiR7ZGF0YS51cmx9XCI+XG4gICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJrbHAtcHJldmlldyBqcy1wcmV2aWV3ICR7ZGF0YS50ZW1wbGF0ZX1cIiBkYXRhLXRlbXBsYXRlPVwiJHtkYXRhLnRlbXBsYXRlfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJya2xwLXByZXZpZXdfX2ltYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtkYXRhLmltYWdlfVwiIGNsYXNzPVwianMtaW1hZ2VcIiBhbHQ9XCJcIj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmtscC1wcmV2aWV3X19jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzcz1cInJrbHAtcHJldmlld19fdGl0bGUganMtcHJldmlldy10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAke2RhdGEudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwicmtscC1wcmV2aWV3X19kZXNjcmlwdGlvbiBqcy1wcmV2aWV3LWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAke2RhdGEuZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgJHt3aW5kb3cucmtfcmVhZF9tb3JlID8gcmVuZGVyUmVhZE1vcmUoZGF0YSkgOiAnJ30gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbmRlclJlYWRNb3JlKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBgPGEgaHJlZj1cIiR7ZGF0YS51cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCIgY2xhc3M9XCJya2xwLXByZXZpZXdfX21vcmUganMtbGlua1wiPlJlYWQgTW9yZTwvYT5gO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzdG9yZVNob3J0Y29kZXMoY29udGVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZSgvPGRpdiBjbGFzcz1cInJrbHAtLio/ZGl2PjxcXC9kaXY+PFxcL2Rpdj4vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gY29sbGVjdERhdGEobWF0Y2gpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgPHA+W3JrbHBfc2hvcnRjb2RlIGRhdGE9JyR7ZW5jb2RlTGluayhkYXRhKX0nXTwvcD5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbGxlY3REYXRhKGh0bWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpRdWVyeShodG1sKS5maW5kKCcuanMtcHJldmlldy10aXRsZScpLmh0bWwoKSxcbiAgICAgICAgICAgICAgICB1cmw6IGpRdWVyeShodG1sKS5kYXRhKCd1cmwnKSxcbiAgICAgICAgICAgICAgICBpbWFnZTogalF1ZXJ5KGh0bWwpLmZpbmQoJy5qcy1pbWFnZScpLmF0dHIoJ3NyYycpLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBqUXVlcnkoaHRtbCkuZmluZCgnLmpzLXByZXZpZXctZGVzY3JpcHRpb24nKS5odG1sKCksXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IGpRdWVyeShodG1sKS5maW5kKCcuanMtcHJldmlldycpLmRhdGEoJ3RlbXBsYXRlJyksXG4gICAgICAgICAgICAgICAgaWQ6IGpRdWVyeShodG1sKS5kYXRhKCdpZCcpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlZGl0b3Iub24oJ21vdXNldXAnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBjb2xsZWN0RGF0YShqUXVlcnkobm9kZSkuY2xvc2VzdCgnLnJrbHAtbW9kYWxfX3ByZXZpZXcnKSk7XG4gICAgICAgICAgICBpZiAoZGF0YS50aXRsZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5ya19tb2RhbC5vcGVuTW9kYWwoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVkaXRvci5vbignQmVmb3JlU2V0Q29udGVudCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5jb250ZW50ID0gcmVwbGFjZVNob3J0Y29kZXMoZXZlbnQuY29udGVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVkaXRvci5vbignUG9zdFByb2Nlc3MnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICBpZiAoZXZlbnQuZ2V0KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuY29udGVudCA9IHJlc3RvcmVTaG9ydGNvZGVzKGV2ZW50LmNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0pKCk7XG4iXX0=
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