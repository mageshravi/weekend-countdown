'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-env jquery */
var Countdown = function () {
  function Countdown(options) {
    _classCallCheck(this, Countdown);

    this.today = new Date();

    var endDate = new Date(options.endDate);
    if (isNaN(endDate.getTime())) {
      throw Error('Invalid target date: ' + options.endDate);
    }

    if (endDate <= this.today) {
      throw Error('Must be a future date: ' + options.endDate);
    }

    this.endDate = endDate;

    if (options.startDate) {
      var startDate = new Date(options.startDate);
      if (isNaN(endDate.getTime())) {
        throw Error('Invalid start date: ' + options.startDate);
      }

      if (startDate >= this.today) {
        throw Error('Must be a past date: ' + options.startDate);
      }

      this.startDate = startDate;
    } else {
      this.startDate = new Date(endDate.getFullYear(), 0, 1);
    }
  }

  /**
   * Returns the number of weekends (saturdays) between the given dates
   * @param {Date} startDate The start date
   * @param {Date} endDate The end date
   */


  _createClass(Countdown, [{
    key: 'getNoOfWeekendsBetween',
    value: function getNoOfWeekendsBetween(startDate, endDate) {
      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);

      // no. of days to the closest Saturday
      var daysBeforeFirstSaturday = 6 - startDate.getDay();

      // no. of days after the last Saturday
      var daysAfterLastSaturday = endDate.getDay() + 1;
      if (daysAfterLastSaturday > 6) {
        daysAfterLastSaturday = 0;
      }

      var totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

      var totalWeekends = Math.round((totalDays - daysBeforeFirstSaturday - daysAfterLastSaturday) / 7);

      return totalWeekends;
    }
  }, {
    key: 'getGraphHtml',
    value: function getGraphHtml() {
      var html = '';
      for (var year = this.startDate.getFullYear(); year <= this.endDate.getFullYear(); year++) {
        for (var month = 0; month < 12; month++) {
          if (year === this.startDate.getFullYear() && month < this.startDate.getMonth()) {
            continue;
          }

          if (year === this.endDate.getFullYear() && month > this.endDate.getMonth()) {
            break;
          }

          var monthTitle = this.getMonthLabel(month);
          if (this.startDate.getFullYear() !== this.endDate.getFullYear()) {
            monthTitle += ' ' + year;
          }
          html += '<ul class="graph__month" title="' + monthTitle + '">';
          var firstDateOfMonth = new Date(year, month, 1);
          var lastDateOfMonth = new Date(year, month + 1, 0);

          var noOfWeekends = this.getNoOfWeekendsBetween(firstDateOfMonth, lastDateOfMonth);
          var elapsedWeekends = noOfWeekends;

          var elapsedYear = year < this.today.getFullYear();
          var elapsedMonth = year <= this.today.getFullYear() && month < this.today.getMonth();
          var curMonth = year === this.today.getFullYear() && month === this.today.getMonth();
          var curWeekendProcessed = false;

          var graphClasses = {
            weekElapsed: 'graph__week--elapsed',
            week: 'graph__week',
            weekCurrent: 'graph__week--current'
          };

          if (month === this.today.getMonth()) {
            elapsedWeekends = this.getNoOfWeekendsBetween(firstDateOfMonth, this.today);
          }

          for (var weekend = 0; weekend <= noOfWeekends; weekend++) {
            var weekClass = '';
            if (elapsedYear || elapsedMonth) {
              weekClass = graphClasses.weekElapsed;
            }

            if (curMonth) {
              if (weekend <= elapsedWeekends) {
                weekClass = graphClasses.weekElapsed;
              } else if (!curWeekendProcessed) {
                weekClass = graphClasses.weekCurrent;
                curWeekendProcessed = true;
              }
            }

            html += '<li class="' + graphClasses.week + ' ' + weekClass + '"></li>';
          }
          html += '</ul>';
        }
      }
      return html;
    }
  }, {
    key: 'getMonthLabel',
    value: function getMonthLabel(month) {
      var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return labels[month];
    }
  }, {
    key: 'getSummary',
    value: function getSummary() {
      return {
        totalWeekends: this.getNoOfWeekendsBetween(this.startDate, this.endDate),
        remainingWeekends: this.getNoOfWeekendsBetween(this.today, this.endDate),
        endDate: this.formatDate(this.endDate)
      };
    }

    /**
     * Returns the formatted date as d M Y
     * @param {Date} dt The date to be formatted
     */

  }, {
    key: 'formatDate',
    value: function formatDate(dt) {
      return dt.getDate() + ' ' + this.getMonthLabel(dt.getMonth()) + ' ' + dt.getFullYear();
    }
  }]);

  return Countdown;
}();

typeof Countdown === 'undefined' ? 'undefined' : _typeof(Countdown);