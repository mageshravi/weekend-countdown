'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-env jquery */

var Tabs = function () {
  function Tabs($root, data) {
    _classCallCheck(this, Tabs);

    this.cssSelectors = {
      tabList: '.tab-list',
      tabItem: '.tab-list__item',
      tabLink: '.tab-list__link',

      barChartElapsed: '.bar-chart__elapsed',

      summaryCount: '.summary__count',
      summaryDate: '.summary__date',
      graph: '.graph'
    };

    var listClass = getClassName(this.cssSelectors.tabList);
    if (!$root.hasClass(listClass)) {
      throw new Error('Expected an element with class "' + listClass + '"');
    }

    this.$root = $root;
    this.data = data;

    // bind event-handlers before initialising
    this.bindUIActions();

    this.init();
  }

  _createClass(Tabs, [{
    key: 'init',
    value: function init() {
      var html = '';
      for (var i in this.data) {
        var item = this.data[i];
        var active = '';
        if (i === 0) {
          active = 'active';
        }
        html += '<li class="tab-list__item ' + active + '">\n        <a class="tab-list__link" href="#' + this.generateAnchor(item.name) + '" data-start="' + item.startDate + '" data-end="' + item.endDate + '">' + item.name + '</a>\n      </li>';
      }
      this.$root.html(html);

      $(this.cssSelectors.tabLink).eq(0).click();
    }
  }, {
    key: 'bindUIActions',
    value: function bindUIActions() {
      $(this.cssSelectors.tabList).on('click', this.cssSelectors.tabLink, this.reloadCountdown.bind(this));
    }

    /**
     * Generates the uri component from the tab name
     * @param {String} name The tab name
     */

  }, {
    key: 'generateAnchor',
    value: function generateAnchor(name) {
      return encodeURIComponent(name.toLowerCase().replace(' ', '-'));
    }

    /**
     * Reloads the countdown using data from the clicked tab
     * @param {Event} ev The click event
     */

  }, {
    key: 'reloadCountdown',
    value: function reloadCountdown(ev) {
      ev.preventDefault();
      var $link = $(ev.currentTarget);

      /* global Countdown */
      var countdown = new Countdown({
        startDate: $link.data('start'),
        endDate: $link.data('end')
      });

      var summary = countdown.getSummary();
      $(this.cssSelectors.summaryCount).text(summary.remainingWeekends);
      $(this.cssSelectors.summaryDate).text(summary.endDate);
      $(this.cssSelectors.barChartElapsed).width(Math.round(100 * (summary.totalWeekends - summary.remainingWeekends) / summary.totalWeekends) + '%');

      $(this.cssSelectors.graph).html(countdown.getGraphHtml());

      $link.parent(this.cssSelectors.tabItem).addClass('active').siblings().removeClass('active');
    }
  }]);

  return Tabs;
}();

/**
 * Strips the dot from the selector
 * @param {String} cssSelector The css class selector
 */


function getClassName(cssSelector) {
  return cssSelector.replace('.', '');
}

typeof Tabs === 'undefined' ? 'undefined' : _typeof(Tabs);