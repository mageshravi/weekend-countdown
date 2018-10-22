/* eslint-env jquery */

class Tabs {
  constructor ($root, data) {
    this.cssSelectors = {
      tabList: '.tab-list',
      tabItem: '.tab-list__item',
      tabLink: '.tab-list__link',

      barChartElapsed: '.bar-chart__elapsed',

      summaryCount: '.summary__count',
      summaryDate: '.summary__date',
      graph: '.graph'
    }

    var listClass = getClassName(this.cssSelectors.tabList)
    if (!$root.hasClass(listClass)) {
      throw new Error(`Expected an element with class "${listClass}"`)
    }

    this.$root = $root
    this.data = data

    // bind event-handlers before initialising
    this.bindUIActions()

    this.init()
  }

  init () {
    var html = ''
    for (var i in this.data) {
      var item = this.data[i]
      var active = ''
      if (i === 0) {
        active = 'active'
      }
      html += `<li class="tab-list__item ${active}">
        <a class="tab-list__link" href="#${this.generateAnchor(item.name)}" data-start="${item.startDate}" data-end="${item.endDate}">${item.name}</a>
      </li>`
    }
    this.$root.html(html)

    $(this.cssSelectors.tabLink).eq(0).click()
  }

  bindUIActions () {
    $(this.cssSelectors.tabList).on('click', this.cssSelectors.tabLink, this.reloadCountdown.bind(this))
  }

  /**
   * Generates the uri component from the tab name
   * @param {String} name The tab name
   */
  generateAnchor (name) {
    return encodeURIComponent(name.toLowerCase().replace(' ', '-'))
  }

  /**
   * Reloads the countdown using data from the clicked tab
   * @param {Event} ev The click event
   */
  reloadCountdown (ev) {
    ev.preventDefault()
    var $link = $(ev.currentTarget)

    /* global Countdown */
    var countdown = new Countdown({
      startDate: $link.data('start'),
      endDate: $link.data('end')
    })

    var summary = countdown.getSummary()
    $(this.cssSelectors.summaryCount).text(summary.remainingWeekends)
    $(this.cssSelectors.summaryDate).text(summary.endDate)
    $(this.cssSelectors.barChartElapsed).width(Math.round(100 * (summary.totalWeekends - summary.remainingWeekends) / summary.totalWeekends) + '%')

    $(this.cssSelectors.graph).html(countdown.getGraphHtml())

    $link.parent(this.cssSelectors.tabItem).addClass('active').siblings().removeClass('active')
  }
}

/**
 * Strips the dot from the selector
 * @param {String} cssSelector The css class selector
 */
function getClassName (cssSelector) {
  return cssSelector.replace('.', '')
}

typeof Tabs
