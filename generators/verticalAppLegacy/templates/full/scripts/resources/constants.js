'use strict';

var dateFormat = 'DD/MM/YYYY';

/************************** WIDGET NAMES *************************************/

var widgetsInfo = {
  w111: {title: 'w111', text: '<ul><li>WIDGET</li><li>DATATABLE</li></ul>'},
  w112: {title: 'w112', text: '<ul><li>WIDGET</li><li>HIGHCHARTS</li></ul>'},
  w113: {title: 'w112', text: '<ul><li>WIDGET</li><li>BICHORD</li></ul>'},
  w121: {title: 'w121', text: '<ul><li>WIDGET</li><li>HEATCALENDAR</li></ul>'},
  w122: {title: 'w122', text: '<ul><li>WIDGET</li><li>TABLE</li></ul>'}
};

function getWidgetInfo(id) {
  return widgetsInfo[id] ? widgetsInfo[id] : '';
}

/*****************************************************************************/

module.exports = {
  dateFormat: dateFormat,
  getWidgetInfo: getWidgetInfo
};