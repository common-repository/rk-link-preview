(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function () {
  tinymce.PluginManager.add('rk-mce-button', function (editor, url) {
    window.e = editor;
    editor.addButton('rklp_mce_button', {
      image: url.slice(0, -18) + '/img/link-preview.svg',
      tooltip: 'RK Link Preview',
      onclick: function onclick() {
        window.rk_modal.openModal();
      }
    });
  });
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfODY3ZDBlZTQuanMiXSwibmFtZXMiOlsidGlueW1jZSIsIlBsdWdpbk1hbmFnZXIiLCJhZGQiLCJlZGl0b3IiLCJ1cmwiLCJ3aW5kb3ciLCJlIiwiYWRkQnV0dG9uIiwiaW1hZ2UiLCJzbGljZSIsInRvb2x0aXAiLCJvbmNsaWNrIiwicmtfbW9kYWwiLCJvcGVuTW9kYWwiXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxZQUFXO0FBQ1JBLEVBQUFBLE9BQU8sQ0FBQ0MsYUFBUixDQUFzQkMsR0FBdEIsQ0FBMEIsZUFBMUIsRUFBMkMsVUFBVUMsTUFBVixFQUFrQkMsR0FBbEIsRUFBd0I7QUFDL0RDLElBQUFBLE1BQU0sQ0FBQ0MsQ0FBUCxHQUFXSCxNQUFYO0FBQ0FBLElBQUFBLE1BQU0sQ0FBQ0ksU0FBUCxDQUFpQixpQkFBakIsRUFBb0M7QUFDaENDLE1BQUFBLEtBQUssRUFBR0osR0FBRyxDQUFDSyxLQUFKLENBQVUsQ0FBVixFQUFhLENBQUMsRUFBZCxJQUFvQix1QkFESTtBQUVoQ0MsTUFBQUEsT0FBTyxFQUFFLGlCQUZ1QjtBQUdoQ0MsTUFBQUEsT0FBTyxFQUFFLG1CQUFXO0FBQ2hCTixRQUFBQSxNQUFNLENBQUNPLFFBQVAsQ0FBZ0JDLFNBQWhCO0FBQ0g7QUFMK0IsS0FBcEM7QUFPSCxHQVREO0FBVUgsQ0FYRCIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICB0aW55bWNlLlBsdWdpbk1hbmFnZXIuYWRkKCdyay1tY2UtYnV0dG9uJywgZnVuY3Rpb24oIGVkaXRvciwgdXJsICkge1xuICAgICAgICB3aW5kb3cuZSA9IGVkaXRvcjtcbiAgICAgICAgZWRpdG9yLmFkZEJ1dHRvbigncmtscF9tY2VfYnV0dG9uJywge1xuICAgICAgICAgICAgaW1hZ2UgOiB1cmwuc2xpY2UoMCwgLTE4KSArICcvaW1nL2xpbmstcHJldmlldy5zdmcnLFxuICAgICAgICAgICAgdG9vbHRpcDogJ1JLIExpbmsgUHJldmlldycsXG4gICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmtfbW9kYWwub3Blbk1vZGFsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSkoKTtcbiJdfQ==
},{}]},{},[1])