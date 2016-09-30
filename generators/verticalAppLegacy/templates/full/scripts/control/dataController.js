'use strict';
var _ = require('lodash');

var WIDGET_TYPES = lt.washemo.controller.WidgetController.widgetType;

var DSUTILS = lt.washemo.data.Datasource;

/**************************** FACTORY WIDGETS ********************************/

var EXTRA_WIDGET_TYPES = {
  HIGHCHART: 'highchart',
  DATATABLE: 'datatable'
};

/***************************** FACTORY DATA **********************************/

var factoryData = {
  highchart: forHighchart,
  datatable: forDataTable,
  voronoi: forVoronoi,
  googleheatmap: forGoogleheatmap,
  table: forTable,
  pie: forPie,
  pielayered: forPieLayered,
  line: forLine,
  bubble: forBubble,
  tree: forTree,
  colorworldmap: forColorworldmap,
  graph: forGraph,
  bichord: forBichord,
  sankey: forSankey,
  circleworldmap: forCircleworldmap
};

/********************************* DATA **************************************/

/********* DATA DISPATCHER *********/
function setDataFromMalote(data, widget) {
  if(widget.widgetType) {
    if(widget.widgetType != WIDGET_TYPES.GRAPH) widget.settings.dom.empty();
    factoryData[widget.widgetType](data, widget);
  }
}
/********** MAIN CALLBACK **********/
function mainCB(widget) {
  return function(err, returnData) {
    widget.widget.setData(returnData);
    widget.widget.display({force: true, data: true});
  };
}
/***********************************/

/* HIGHCHARTS */
function forHighchart(data, widget) {
  /* data must be null */
  widget.chart = new Highcharts.Chart(widget.settings.widgetTemplate);
}

/* DATATABLE */
function forDataTable(data, widget) {
  var limit = widget.settings.ds.limit;
  var value = widget.settings.ds.value;
  var sortAsc = widget.settings.ds.sortAsc;
  var id = widget.id;

  if(data && data.object && Array.isArray(data.object)) {
    /* Get labels and keys */
    var keys = [];
    var labels = [];
    if(data.object[0] != undefined ){
      labels = Object.keys(data.object[0]);
      keys = Object.keys(data.object[0]);
    }

    var arr = data.object;
    var sumTot = 0;
    arr.forEach(function(el) {
      sumTot += Number(el[value]);
    });
    arr.sort(function(a, b) {
      if (typeof(a[value]) == "number") {
      var va = parseFloat(a[value]);
      var vb = parseFloat(b[value]);
      } else {
        var va = a[value], vb = b[value];
      }
      return sortAsc ? va - vb : vb - va;
    });

    var names = [];
    var count = [];
    var pcts = [];
    arr.slice(0, limit || 10).forEach(function(el) {
      var namesArray = [];
      keys.forEach(function(key) {
        namesArray.push(el[key]);
      });
      names.push(namesArray);
      count.push(Number(el[value]));
      pcts.push(Number(el[value]) / sumTot);
    });

    var $div = $('#' + id);
    var listHeader = [];
    if(widget.settings.ds.labels) {
       widget.settings.ds.labels.forEach(function(h) {
        listHeader.push({sTitle:h});
      });
    } else {
      labels.forEach(function(h) {
        listHeader.push({sTitle:h});
      });
    }

    var $table = $('<table></table>').attr({'class': 'display',
                                            'cellspacing':'0',
                                            'width':'100%'});
    if($div.length !== 0 ){
      $div.append($table);
      widget.widget = $table.DataTable({
        aaData: names,
        aoColumns: listHeader,
        aaSorting:  [],
        bDestroy: true,
        iDisplayLength: widget.settings.ds.iDisplayLength ?
                          widget.settings.ds.iDisplayLength : 10
      });
    }else{
      console.error('No existe el widgetId ' + id);
    }
  }
}

/* CIRCLEWORLDMAP */
function forCircleworldmap(data, widget) {
  var keys = widget.settings.ds.keys;
  var value = widget.settings.ds.value;
  
  lt.washemo.dashboard.CircleWorldMapDBWidget.processFromTable
    (data,mainCB(widget),keys,value,widget.widget);
}

/* SANKEY */
function forSankey(data, widget) {
  var valKey = widget.settings.ds.valKey;
  var sourceKey = widget.settings.ds.sourceKey;
  var targetKey = widget.settings.ds.targetKey;
  
  lt.washemo.dashboard.SankeyDBWidget.processFromTable
    (data,mainCB(widget),valKey,sourceKey,targetKey,widget.widget);
}

/* BICHORD */
function forBichord(data, widget) {
  var keys = widget.settings.ds.keys;
  var value = widget.settings.ds.value;
  var minPct = widget.settings.ds.minPct;

  lt.washemo.dashboard.BiChordDBWidget.processFromTable
    (data,mainCB(widget),minPct,keys,value,widget.widget);
}

/* VORONOI */
function forVoronoi(data, widget) {
  var keys = widget.settings.ds.keys;
  var value = widget.settings.ds.value;

  lt.washemo.dashboard.VoronoiDBWidget.processFromTable
    (data,mainCB(widget),keys,value,widget.widget,keys);
}

/* GOOGLEHEATMAP */
function forGoogleheatmap(data, widget) {
  var keys = widget.settings.ds.keys;
  var value = widget.settings.ds.value;
  var partKey = widget.settings.ds.partKey;

  lt.washemo.dashboard.GoogleHeatMapDBWidget.processFromTable
    (data,mainCB(widget),keys,value,widget.widget,partKey);
}

/* COLORWORLDMAP */
function forColorworldmap(data, widget) {
  var keys = widget.settings.ds.keys;
  var value = widget.settings.ds.value;

  lt.washemo.dashboard.ColorWorldMapDBWidget.processFromTable
    (data,mainCB(widget),keys,value,widget.widget);
}

/* TABLE */
function forTable(data, widget) {
  var limit = widget.settings.ds.limit;
  var labels = widget.settings.ds.labels;
  var keys = widget.settings.ds.keys;
  var valueKey = widget.settings.ds.valueKey;
  var sortAsc = widget.settings.ds.sortAsc;

  lt.washemo.dashboard.TableDBWidget.processFromTable
    (data,mainCB(widget),limit,labels,keys,valueKey,sortAsc);
}

/* PIE */
function forPie(data, widget) {
  var keys = widget.settings.ds.keys;
  var value = widget.settings.ds.value;

  processFromTablePie(data,mainCB(widget),keys,value);
}

function processFromTablePie(data, cb, keys, value) {
  var serie = null;
  if(data && data.object && Array.isArray(data.object) &&
     data.object.length > 0 && keys && Array.isArray(keys) && value) {
    var grouppedData = {};
    _.forEach(data.object, function(row) {
      var name = '';
      _.forEach(keys, function(key) {
        name += row[key]+'/';
      });
      var newVal = parseInt(row[value]);
      _.update(grouppedData, name,
        function(val) {
          return !val ? newVal : val + newVal;
      });
    });
    serie = _.map(grouppedData, function(value, name) {
      return {name: name, y: value};
    });
    serie = _.sortBy(serie, function(elem) {return elem.y;}).reverse();
  }
  cb(null, serie, data);
}

/* PIE LAYERED */
function forPieLayered(data, widget) {
  var keys = widget.settings.ds.keys;
  var value = widget.settings.ds.value;
  var hierarchyChar = widget.settings.ds.hierarchyChar;

  lt.washemo.dashboard.PieLayeredDBWidget.processFromTable
    (data,mainCB(widget),hierarchyChar,keys,value,widget.widget);
}

/* LINE */
function forLine(data, widget) {
  var keys = widget.settings.ds.keys;
  var value = widget.settings.ds.value;
  var seriesNames = widget.settings.ds.seriesNames;
  var timestampKey = widget.settings.ds.timestampKey;

  lt.washemo.dashboard.LineDBWidget.processFromTable
    (data,mainCB(widget),keys,value,seriesNames,timestampKey);
}

/* BUBBLE */
function forBubble(data, widget) {
  var xAxis = widget.settings.ds.xAxis;
  var yAxis = widget.settings.ds.yAxis;
  var value = widget.settings.ds.value;
  var seriesby = widget.settings.ds.seriesby;

  lt.washemo.dashboard.BubbleDBWidget.processFromTable
    (data,mainCB(widget),xAxis,yAxis,value,seriesby);
}

/* TREE */
function forTree(data, widget) {
  var keys = widget.settings.ds.keys;
  var value = widget.settings.ds.value;

  processFromTableTree
    (data,mainCB(widget),keys,value,widget.widget);
};

function processFromTableTree(data, cb, keys, value, widget) {
  var ret = {
    data: [],
    kKeys: {keys: keys},
    kval: {value: value}
  };
  if(data && data.object && Array.isArray(data.object) &&
     data.object.length > 0) {
    data.object.forEach(function(elem) {
      var value = [];
      keys.forEach(function(key) {
        value.push(elem[key]);
      });
      value.push(parseFloat(elem[value]));
      ret.data.push(value);
    });
  }
  cb(null, ret, data, widget.widget);
}

/* GRAPH */
function forGraph(data, widget) {
  var nodes = widget.settings.ds.nodes;
  var links = widget.settings.ds.links;
  var latitude = widget.settings.ds.latitude;
  var longitude = widget.settings.ds.longitude;

  processFromTableGraph
    (data,mainCB(widget),nodes,links,latitude,longitude);
}

//var lttype = require('lt-web/loxcope/type');
function processFromTableGraph(data, cb, nodes, links, latitude, longitude) {
  var ret = {metadata: {realtime: false, fields: []}, matrix: []};
  if(data && data.object && Array.isArray(data.object) &&
     data.object.length > 0) {
    var keys = [];
    /* Build types */
    var field = {name: 'eventdate', role: 'date',
                 type: lt.type.all.Timestamp};
    ret.metadata.fields.push(field);
    keys.push('eventdate');

    nodes.forEach(function(node) {
      var field = {name: node.name, role: 'node',
                   type: lt.type.all[node.type]};
      ret.metadata.fields.push(field);
      keys.push(node.name);
    });
    links.forEach(function(link) {
      var field = {name: link.name, role: 'linkWidthDelta',
                   type: lt.type.all[link.type]};
      ret.metadata.fields.push(field);
      keys.push(link.name);
    });
    latitude.forEach(function(lat) {
      var field = {name: lat.name, role: 'latitude',
                   type: lt.type.all[lat.type]};
      ret.metadata.fields.push(field);
      keys.push(lat.name);
    });
    longitude.forEach(function(lon) {
      var field = {name: lon.name, role: 'longitude',
                   type: lt.type.all[lon.type]};
      ret.metadata.fields.push(field);
      keys.push(lon.name);
    });

    /* Build data */
    keys.forEach(function(field) {ret.matrix.push([]);});
    var now = new Date().getTime();
    data.object.forEach(function(elem) {
      elem.eventdate = elem.eventdate ? elem.eventdate : now;

      keys.forEach(function(field, index) {
        ret.matrix[index].push(ret.metadata.fields[index].type.parse(elem[field]));
      });
    });
  }
  cb(null, ret, data);
}

/********************************** API **************************************/

function sign(dateFrom, dateTo, query, ts) {
  return CryptoJS.HmacSHA256(lt.user._metadata.credential.apiKey + dateFrom +
    dateTo + query + ts, lt.user._metadata.credential.apiSecret).toString();
};

function buildAPIQueryParams(query, datesCB, replaceQueryValsCB) {
  var ts,
    params = [],
    i = 0,
    q,
    tot = query && Array.isArray(query) && query.length > 0 ? query.length : 0,
    dates = datesCB ? datesCB() : null,
    f = dates ? dates[0] : moment().utc().unix() * 1000,
    t = dates ? dates[1] : moment().utc().unix() * 1000;

  for (i; i < tot; i += 1) {
    if (replaceQueryValsCB) {
      q = replaceQueryValsCB(query[i]);
    } else {
      q = query[i];
    }
    ts = new Date().getTime();
    params[i] = {
      'apiKey': lt.user._metadata.credential.apiKey,
      'dateFrom': f,
      'dateTo': t,
      'timestamp': ts,
      'query': q,
      'idSearch': null,
      'sign': sign(f, t, q, ts)
    };
  }
  return params;
}

var urlAPI = 'https://api.logtrust.com/lt-api/storedSearchAction.streamjson';
function fromAPI(query, datesCB, replaceQueryValsCB) {
  return function(dcb) {
    var i = 0;
    var tot = query.length;
    var dataCollected = [];
    var completedRequests = [];
    var q = buildAPIQueryParams(query, datesCB, replaceQueryValsCB);
    for(i; i < tot; i += 1) {
      $.post(urlAPI, q[i]).done(function(data) {
        var index = 0;
        var auxData = this.data;
        q.filter(function(el, pos) {
          if(decodeURIComponent((auxData + '').replace(/\+/g, '%20'))
                                              .indexOf(el.query) > -1) {
            index = pos;
          }
          return auxData.indexOf(el) > -1;
        });
        dataCollected[index] = data;
        completedRequests.push(index);
        if(completedRequests.length == tot) {
          dcb(null, dataCollected);
        }
      });
    }
  };
};

function processData(widget) {
  return function(error, data) {
    if(data && Array.isArray(data) && data.length > 0) {
      var isValid = true;
      var i = 0;
      while(isValid && i < data.length) {
        isValid = data[i].success && data[i].object &&
                  Array.isArray(data[i].object) && data[i].object.length > 0;
        i++;
      }
      if(isValid) {
        widget.dataOrig = _.cloneDeep(data);
        var dataProcessed = widget.preProcessData ?
                              widget.preProcessData(data) : data[0];
        setDataFromMalote(dataProcessed, widget);
      } else {
        new lt.NotiPop({text: 'Wrong data for '+widget.id,
                        type: lt.NotiPop.ERR});
      }
    } else {
      new lt.NotiPop({text: 'No data for '+widget.id,
                      type: lt.NotiPop.ERR});
    }
  };
}

/***************************** CONTROLLER ************************************/

var controller = new lt.washemo.controller.WidgetController();

function createDataSource(casperable) {
  return controller.createDataSource(casperable);
}

function createWidget(widget) {
  var widgetDB = null;
  if(widget.dataSource) {
    widgetDB = createDSWidget(widget);
  } else {
    _.set(widget, 'settings.callback', function(a) {});
    widgetDB = createAPIWidget(widget);
  }
  return widgetDB ? widgetDB.widget : null;
}

function createDSWidget(widget) {
  var widgetDB = controller.createWidget(widget.id, widget.widgetType,
                                         widget.dataSource, widget.settings);
  return widgetDB;
}

function createAPIWidget(widget) {
  var widgetDB = controller.createWidget(widget.id, widget.widgetType,
                                         {settings: widget.settings}, {});
  return widgetDB;
}

function fromDataSource(id, dates) {
  var widgetDB = controller._widgetMap[id];
  widgetDB.realtime(false);
  
  var newDates = dates();
  if(newDates.length == 2) {
    widgetDB.from(newDates[0] / 1000);
    widgetDB.to(newDates[1] / 1000);
  }
  widgetDB.reload();
}

/***************************** WIDGETS ***************************************/

function redisplayWidgets(widgets) {
  _.forEach(widgets, function(widget) {
    redisplayWidget(widget);
  });
}

function redisplayWidget(widget) {
  if(widget.dataSource) {
    controller._widgetMap[widget.id].reload();
  } else {
    var dataProcessed = widget.preProcessData ?
                          widget.preProcessData(widget.dataOrig) :
                            widget.dataOrig[0];
    setDataFromMalote(dataProcessed, widget); 
  }
}

/*****************************************************************************/

module.exports = {
  WIDGET_TYPES: WIDGET_TYPES,
  EXTRA_WIDGET_TYPES: EXTRA_WIDGET_TYPES,
  DSUTILS: DSUTILS,
  fromAPI: fromAPI,
  processData: processData,
  createDataSource: createDataSource,
  createWidget: createWidget,
  fromDataSource: fromDataSource,
  redisplayWidgets: redisplayWidgets
};