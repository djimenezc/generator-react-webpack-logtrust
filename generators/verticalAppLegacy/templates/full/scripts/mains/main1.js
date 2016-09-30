'use strict';
var _ = require('lodash');
var C = require('../resources/constants');
var Q = require('../resources/queries');
var DC = require('../control/dataController');
var U = require('../utils');

/****************************** WIDGETS **************************************/

/**************** AUXILIAR ******************/
/********************************************/

var widgets = {};

function initWidgets(from, to) {
  var id = '';
  /*---------------------------- SECTION 11 ----------------------------*/
  /* w111 */
  id = 'w111';
  _.set(widgets, id+'.id', id);
  _.set(widgets, id+'.widgetType', DC.EXTRA_WIDGET_TYPES.DATATABLE);
  _.set(widgets, id+'.dates', {from: from, to: to});
  _.set(widgets, id+'.settings.beforeLoad', U.beforeLoadSTD(id));
  _.set(widgets, id+'.settings.ds.errorBgColor', 'transparent');
  _.set(widgets, id+'.settings.ds.limit', 100);
  _.set(widgets, id+'.settings.ds.labels', ['collector', 'domain', 'size']);
  _.set(widgets, id+'.settings.ds.value', 'size');
  _.set(widgets, id+'.settings.ds.sortAsc', false);
  _.set(widgets, id+'.query', Q.getQuery(id));
  _.set(widgets, id+'.querySearch', Q.getQuerySearch(id));
  _.set(widgets, id+'.replaceQuery', null);
  _.set(widgets, id+'.preProcessData', function(data) {
    var id = this.id;
    data = data[0];
    _.forEach(data.object, function(elem) {
      elem.collector = elem.collector.replace('datanode', 'DT');
    });
    return data;
  });
  
  /* w112 */
  id = 'w112';
  _.set(widgets, id+'.id', id);
  _.set(widgets, id+'.widgetType', DC.EXTRA_WIDGET_TYPES.HIGHCHART);
  _.set(widgets, id+'.dates', {from: from, to: to});
  _.set(widgets, id+'.settings.beforeLoad', U.beforeLoadSTD(id));
  _.set(widgets, id+'.settings.widgetTemplate', {
    chart: {renderTo: id, type: 'column'},
    credits: {enabled: false}
  });
  _.set(widgets, id+'.query', Q.getQuery(id));
  _.set(widgets, id+'.querySearch', Q.getQuerySearch(id));
  _.set(widgets, id+'.replaceQuery', null);
  _.set(widgets, id+'.preProcessData', function(data) {
    var id = this.id;
    data = data[0];
    var seriesObj = {};
    _.forEach(data.object, function(elem) {
      var serieName = elem.username+'@'+elem.domain;
      
      if(!seriesObj[serieName]){
        seriesObj[serieName] = {name: serieName, data: []};
      }
      seriesObj[serieName].data.push(parseInt(elem.count));
    });
    
    /* To highcharts series */
    var series = _.values(seriesObj);
    _.forEach(series, function(serie) {
      serie.data.sort(function(a, b) {
        return a[0] - b[0];
      });
    });
    _.set(this, 'settings.widgetTemplate.series', series);
  });
  
  /* w113 */
  id = 'w113';
  _.set(widgets, id+'.id', id);
  _.set(widgets, id+'.widgetType', DC.WIDGET_TYPES.BICHORD);
  _.set(widgets, id+'.dates', {from: from, to: to});
  _.set(widgets, id+'.settings.beforeLoad', U.beforeLoadSTD(id));
  _.set(widgets, id+'.settings.ds.errorBgColor', 'transparent');
  _.set(widgets, id+'.settings.ds.keys', {source: 'username', target: 'domain'});
  _.set(widgets, id+'.settings.ds.value', {value: 'count100'});
  _.set(widgets, id+'.query', Q.getQuery(id));
  _.set(widgets, id+'.querySearch', Q.getQuerySearch(id));
  
  /*---------------------------- SECTION 12 ----------------------------*/
  /* w121 */
  id = 'w121';
  _.set(widgets, id+'.id', id);
  _.set(widgets, id+'.widgetType', DC.WIDGET_TYPES.HEATCALENDAR);
  _.set(widgets, id+'.noDateChange', true);
  _.set(widgets, id+'.settings.beforeLoad', U.beforeLoadSTD(id));
  _.set(widgets, id+'.settings.ds.errorBgColor', 'transparent');
  _.set(widgets, id+'.settings.ds.multiKey', 'one');
  _.set(widgets, id+'.dataSource', DC.createDataSource('cc_self:snWEy964')
    .setGroupedBy(DC.DSUTILS.GB_1DAY)
    .setTimerange(DC.DSUTILS.TR_YEAR));
  _.set(widgets, id+'.querySearch', Q.getQuerySearch(id));
  
  /* w122 */
  id = 'w122';
  _.set(widgets, id+'.id', id);
  _.set(widgets, id+'.widgetType', DC.WIDGET_TYPES.LINE);
  _.set(widgets, id+'.dates', {from: from, to: to});
  _.set(widgets, id+'.settings.beforeLoad', U.beforeLoadSTD(id));
  _.set(widgets, id+'.settings.ds.errorBgColor', 'transparent');
  _.set(widgets, id+'.settings.ds.multiKey', 'one');
  _.set(widgets, id+'.dataSource', DC.createDataSource('cc_self:eBVbj130')
    .setGroupedBy(DC.DSUTILS.GB_1HOUR)
    .setWhere([{domain: 'paps160002336@pandasecurity', serverPort: '8080',
                username: '+lactal138@pandamanagedprotection.com'}]));
  _.set(widgets, id+'.querySearch', Q.getQuerySearch(id));
  
  /* Create widgets */
  createWidgets();
}

function createWidgets() {
  /* Widgets */
  _.forEach(widgets, function(widget, id) {
    _.set(widget, 'settings.dom', $('#' + id));
    var widgetType = widget.widgetType;
    if(widgetType && !DC.EXTRA_WIDGET_TYPES[widgetType]) {
      widget.widget = DC.createWidget(widget);
    }
  });
}

function refreshAll() {
  _.forEach(widgets, function(widget, id) {
    refreshWidget(id);
  });
}

function refreshWidget(id) {
  var widget = widgets[id];
  if(widget.dataSource) {
    DC.fromDataSource(widget.id, getMyDates(id));
  } else {
    if(widget.settings.beforeLoad) widget.settings.beforeLoad();
      DC.fromAPI(widget.query, getMyDates(id), widget.replaceQuery)
        (DC.processData(widget));
  }
}

/******************************* GETTERS *************************************/

function getWidget(wid) {
  return widgets[wid];
}

function getWidgets() {
  return widgets;
}

function getMyDates(id) {
  return function() {
    return widgets[id].dates ? [widgets[id].dates.from, widgets[id].dates.to] :
             [];
  };
}

/****************************** EXPORT ***************************************/

module.exports = {
  getWidget: getWidget,
  getWidgets: getWidgets,
  initWidgets: initWidgets,
  refreshAll: refreshAll,
  refreshWidget: refreshWidget
};