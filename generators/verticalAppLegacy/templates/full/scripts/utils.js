'use strict';
var C = require('./resources/constants');

function beforeLoadSTD(id) {
  return function (a) {
    $('#'+id).empty();
    $('#'+id).removeClass('hide');
    $('#'+id).append($('<img>', {
      'height': '55px',
      'width': '55px',
      'src': 'static/images/ajax-loader.gif'
    }));
  };
}

/****************************** EXPAND WIDGET ********************************/

function expandWidget($widget) {
  $widget.openModal({
    width: '90%',
    height: '80%',
    'beforeLoad': function() {
      $.fancybox.showLoading();
      $('.fancybox-inner').css('overflow-y', 'hidden');
    },
    'afterLoad': function() {
      $widget.hide();
      $('.fancybox-skin').addClass('gridster');
      $('.fancybox-inner').css('overflow-y', 'hidden');
    },
    'afterClose': function() {
      $widget.show();
      $(document).unbind('click.fb-start');
      $(document).unbind('click.fb');
      // var widget = getActiveWidget(wid);
      // DC.redisplayWidget(widget);
    },
    'afterShow': function() {
      $widget.show();
      $('.fancybox-inner').css('overflow-y', 'hidden');
      // var widget = getActiveWidget(wid);
      // DC.redisplayWidget(widget);
    }
  });
  $widget.click();
}

/***************************** HELP INFORMATION ******************************/

function info(content) {
  $('#info').remove();
  var not = new ltNotFX();
  $('body').append($('<div>', {id: 'info'}));
  not.message = content;
  not.onCloseCB = function() {
    $('#info').remove();
  };
  not.idToAppend = 'info';
  not.layout = 'default';
  not.display();
  $('#info .ns-box-inner').attr('style', 'height: 500px; overflow-y: auto;');
}

function getInfoVoronoi() {
  var interactions = lt.washemo.view.VoronoiWidget.prototype.interactions ?
                     lt.washemo.view.VoronoiWidget.prototype.interactions : [];
  var message = '<h2>Cuadro de mando</h2><ul>'+
    '<li><label class="stronger">Atajos de teclado del Voronoi</label></li>';
  for (var i=0; i < interactions.length; i++) {
    message += '<li><ul>';
    for (var j=0; j < interactions[i].length; j++) {
      message += '<li><label class="stronger">' +
        interactions[i][j].desktop +
        '</label> ' + interactions[i][j].action + '</li>';
    }
    message += '</ul></li>';
  }
  message += '</ul>';
  info(message);
}

function getInfoWidget(wid) {
  var infoWidget = C.getWidgetInfo(wid);
  var message = '<h2>'+infoWidget.title+'</h2>'+infoWidget.text;
  info(message);
}

/****************************** EXPORT ***************************************/

module.exports = {
  beforeLoadSTD: beforeLoadSTD,
  expandWidget: expandWidget,
  getInfoVoronoi: getInfoVoronoi,
  getInfoWidget: getInfoWidget
};