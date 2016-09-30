/* 
Documentación:
https://logtrust.atlassian.net/wiki/display/LI/App+vertical+Template+FULL
*/

'use strict';
var _ = require('lodash');
var C = require('./scripts/resources/constants');
var DC = require('./scripts/control/dataController');
var EX = require('./scripts/exportData');
var U = require('./scripts/utils');

var main1 = require('./scripts/mains/main1');

function initVapp(e) {
  if(e.detail.page === 'apps/custom/appV') {
    wu.initLTDropdowns(null, {});
    tu.startTemplate();

    initEventsListeners();
    /* INITIAL DATES */
    var from = new moment().hours(0).minutes(0).seconds(0).milliseconds(0)
                           .subtract(1, 'day');
    var to = new moment();
    initDom(from, to);
    initWidgets(from, to);
    refreshAll();
  } else {
    removeListeners();
  }
}

/****************************** EVENTS ***************************************/

function removeListeners() {
  document.removeEventListener('changeContainer', initVapp);
  document.removeEventListener('refreshAll', refreshAll);
  document.removeEventListener('expandWidget', expandWidget);
  document.removeEventListener('csvDownload', csvDownload);
  document.removeEventListener('moreInfo', moreInfo);
  
  $(window).off('resize', resizeEvent);
};

function initEventsListeners() {
  document.addEventListener('refreshAll', refreshAll);
  document.addEventListener('expandWidget', expandWidget);
  document.addEventListener('csvDownload', csvDownload);
  document.addEventListener('moreInfo', moreInfo);
  
  $(window).off('resize', resizeEvent);
  $(window).on('resize', resizeEvent);
};

function resizeEvent() {
  if ($('.lt-vapp-config[closed="true"]')) {
    tu.optionsToggler(true, true);
  }
  
  window.clearTimeout(700);
  tu.resizing = setTimeout(function() {
    DC.redisplayWidgets(getActiveWidgets());
  }, 700);
}

/****************************** DOM ******************************************/

function onCloseFrom(id) {
  return function(currentDateTime) {
    currentDateTime.setHours(0);
    currentDateTime.setMinutes(0);
    currentDateTime.setSeconds(0);
    currentDateTime.setMilliseconds(0);
    currentDateTime = currentDateTime.getTime();
    
    var widgets = main1.getWidgets();
    //widgets = _.concat(widgets, main2.getWidgets());
    // ....
    _.forEach(widgets, function(widget) {
      if(!widget.noDateChange) widget.dates.from = currentDateTime;
    });
    
    var text = new moment(currentDateTime).format(C.dateFormat);
    $('#custom_from_date input').val(currentDateTime);
    $('#custom_from_date .custom_from_date_container').text(text);
  };
}

function onCloseTo() {
  return function(currentDateTime) {
    currentDateTime.setHours(23);
    currentDateTime.setMinutes(59);
    currentDateTime.setSeconds(59);
    currentDateTime.setMilliseconds(999);
    currentDateTime = currentDateTime.getTime();

    var now = new Date().getTime();
    currentDateTime = currentDateTime > now ? now : currentDateTime;
    
    var widgets = main1.getWidgets();
    //widgets = _.concat(widgets, main2.getWidgets());
    // ....
    _.forEach(widgets, function(widget) {
      if(!widget.noDateChange) widget.dates.to = currentDateTime > now ? now :
                                                   currentDateTime;
    });
    
    var text = new moment(currentDateTime).format(C.dateFormat);
    $('#custom_to_date input').val(currentDateTime);
    $('#custom_to_date .custom_to_date_container').text(text);
  };
}

function initDom(from, to) {
  /* Create from timePicker */
  $('#custom_from_date').find('input').val(from.toDate().getTime());
  var text = from.format(C.dateFormat);
  $('#custom_from_date').find('.custom_from_date_container').text(text);
  $('#custom_from_date').datetimepicker({
    startDate: from.format("YYYY/MM/DD"),
    onClose: onCloseFrom(),
    format: 'Y/m/d',
    closeOnDateSelect: false,
    closeOnTimeSelect: false,
    timepicker: false,
    id: 'customFromDateCalendar',
    onShow: function(ct) {
      this.setOptions({
        maxDate: $('#custom_to_date').val() ?
          $('#custom_to_date').val().split(" ")[0] : 0
      });
    }
  });
  
  /* Create to timePicker */
  $('#custom_to_date').find('input').val(to.toDate().getTime());
  text = to.format(C.dateFormat);
  $('#custom_to_date').find('.custom_to_date_container').text(text);
  $('#custom_to_date').datetimepicker({
    startDate: to.format("YYYY/MM/DD"),
    onClose: onCloseTo(),
    format: 'Y/m/d',
    closeOnDateSelect: false,
    closeOnTimeSelect: false,
    timepicker: false,
    id: 'customToDateCalendar',
    onShow : function(ct) {
      this.setOptions({
        minDate: $('#custom_from_date').val() ?
          $('#custom_from_date').val().split(" ")[0] : 0,
        maxDate: 0
      });
    }
  });
  
  /* Go to search */
  $('.gotoSearch').off('click');
  $('.gotoSearch').on('click', function(e) {
    e.preventDefault();
    var widget = getActiveWidget($(this).attr('wid'));
    if(widget && widget.querySearch) {
      wu.goToSearch(widget.querySearch, widget.dates.from, widget.dates.to,
                    null, null);
    }
  });
  
  /* Refresh buttons */
  $('.refreshh').off('click');
  $('.refreshh').on('click', function() {
    var id = $(this).parent().attr('wid');
    var ids = id.split('-');
    if(ids.length > 0) {
      _.forEach(ids, function(wid) {
        refreshWidget(wid);
      });
    }
  });
}

/*************************** EXPORT/DOWNLOAD DATA ****************************/

function csvDownload(e) {
  var widget = getActiveWidget(e.detail);
  if(widget) {
    if(widget.widgetType == DC.WIDGET_TYPES.HIGHCHART) {
      EX.toCsvHighcharts(widget);
    } else if(widget.widgetType == DC.WIDGET_TYPES.DATATABLE) {
      EX.toCsvDataTable(widget);
    } else {// Washemo
      EX.toCsvWashemo(widget);
    }
  }
}

/***************************** HELP INFORMATION ******************************/

function moreInfo(e) {
  var content = '';
  if(e.detail === 'voronoi') {
    U.getInfoVoronoi();
  } else {
    U.getInfoWidget(e.detail);
  }
}

/***************************** WIDGETS ***************************************/

function expandWidget(e) {
  var wid = e.detail;
  if(wid) U.expandWidget($('#'+wid));
}

function initWidgets(from, to) {
  /* Build widgets */
  main1.initWidgets(from.toDate().getTime(), to.toDate().getTime());
}

function refreshAll() {
  var activeMain = getActiveMain();
  activeMain.refreshAll();
  
  /* Update span dates */
  $('#calfrom').text($('#custom_from_date .custom_from_date_container').text());
  $('#calto').text($('#custom_to_date .custom_to_date_container').text());
}

function refreshWidget(wid) {
  var activeMain = getActiveMain();
  activeMain.refreshWidget(wid);
}

/******************************* GETTERS *************************************/

function getActiveWidget(wid) {
  return getActiveMain().getWidget(wid);
}

function getActiveWidgets() {
  return getActiveMain().getWidgets();
}

function getActiveMain() {
  var activeMain = $('li[main].active').attr('main');
  if(activeMain == 'Main1') {
    activeMain = main1;
  }
  return activeMain;
}

/*****************************************************************************/
document.addEventListener('changeContainer', initVapp);
document.dispatchEvent(new CustomEvent('changeContainer', {detail: {page: 'apps/custom/appV'}}));
