'use strict';

/***************************** DOWNLOAD CSV DATA *****************************/

var csvMap = {
  line: csv4Line,
  pie: csv4Pie,
  pielayered: csv4Pielayered,
  table: csv4Table,
  colorworldmap: csv4Colorworldmap,
  tree: csv4Tree,
  voronoi: csv4Voronoi,
  bubble: csv4Bubble,
  heatcalendar: csv4HeatCalendar
  //graph: csv4Graph
};

function toCsvWashemo(widget) {
  var s = widget.widgetType ? csvMap[widget.widgetType](widget.widget) : '';
  downloadBlob(widget, s, 'data');
}

function toCsvHighcharts(widget) {
  var s = widget.widget.chart.getCSV();
  downloadBlob(widget, s, 'data');
}

function toCsvDataTable(widget) {
  var s = '';
  /* Titles */
  _.forEach(widget.widget.table.fnSettings().aoColumns, function(column) {
    var text = $.trim(column.sTitle).length > 0 ? column.sTitle : 'NA';
    s += text+',';
  });
  s = s.slice(0, -1) + '\n';
  /* Content */
  _.forEach(widget.widget.table.fnGetData(), function(row) {
    _.forEach(row, function(cell) {
      var text = $.trim(cell).length > 0 ? cell : 'NA';
      s += text+',';
    });
    s = s.slice(0, -1) + '\n';
  });
  downloadBlob(widget, s, 'data');
}

function downloadBlob(widget, content, fname) {
  var downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", content]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = fname+'.csv';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

/*************************** DOWNLOAD CSV WIDGET *****************************/

function csv4Bubble(widget) {
  var isCorrectData = widget && widget._data && widget._data.data &&
                      widget._data.data.allPeriods &&
                      Array.isArray(widget._data.data.allPeriods),
    data = isCorrectData ? widget._data.data.allPeriods : null,
    header = '',
    content = '';
  for(var i=0; i < widget._data.metadata.fields; i++) {
    header += widget._data.metadata.fields[i].name + ',';
  }
  header = header.slice(0,-1) + '\n';
  
  var xIsDate = (new Date(data[0][0])).getTime() > 0;
  for(var i=0; i < data[0].length; i++) {
    content += xIsDate ? new Date(data[0][i]).toString() : data[0][i];
    content += ',' + data[1][i] + ',';
    content += data[2][i];
    content += data[3] ? ',' + data[3][i] + '\r\n' : '\r\n';
  }
  return header + content;
}

function csv4Tree(widget) {
  var isCorrectData = widget && widget._data && widget._data.data &&
                      Array.isArray(widget._data.data),
    data = isCorrectData ? widget._data.data : null,
    totVals = isCorrectData ? widget._data.data.length : 0,
    header = widget._data.kKeys.keys.join(',')+','+widget._data.kval.value+'\n',
    content = '';
  for(var i=0; i < data.length; i++) {
    for(var j=0; j < data[i].length-1; j++) {
      content += data[i][j] + ',';
    }
    content += data[i][data[i].length-1] + '\r\n';
  }
  return header + content;
}

function csv4Colorworldmap(widget) {
  var isCorrectData = widget && widget._data,
    data = isCorrectData ? widget._data : null,
    header = widget._data.kKeys.country + ',' + widget._data.kval.value + '\n',
    content = '';
  for(var k in data.country) {
    content += data.country[k].value ? data.country[k].name.replace(',', '')+
                                       ','+data.country[k].value+'\r\n' : '';
  }
  return header + content;
}

var keysInserted = null;
function csv4Pielayered(widget) {
  keysInserted = {};
  var isCorrectData = widget && widget._data && widget._data.data &&
                      Array.isArray(widget._data.data),
    data = isCorrectData ? widget._data.data : null,
    keys = widget._data.kKeys.keys,
    header = keys.join(',') + ',' + widget._data.kval.value + ',%\n',
    content = recPielayered(data[3]);
  return header + content;
}

function recPielayered(dataArr) {
  for(var k in dataArr) {
    if(!jQuery.isEmptyObject(dataArr[k][3])) {
      recPielayered(dataArr[k][3]);
    } else {
      if(!keysInserted[k]) {
        keysInserted[k] = k.split('.').join(',') + ',' + dataArr[k][1] + ',' +
                                                         dataArr[k][2]+'\r\n';
      }
    }
  }
  
  var s = '';
  for(var l in keysInserted) {
    s += keysInserted[l];
  }
  return s;
}

function csv4Line(widget) {
  var isCorrectData = widget && widget._data && Array.isArray(widget._data),
    dats = isCorrectData ? widget._data : null,
    totSeries = isCorrectData ? widget._data.length : 0,
    dat,
    header = '"name","timestamp","value"\r\n',
    content = '',
    serieTot,
    serieName,
    serieData,
    tupla;
  for(var i=0; i < totSeries; i += 1) {
    dat = dats[i];
    j = 0;
    isCorrectData = dat && dat.name && dat.data && Array.isArray(dat.data);
    serieName = isCorrectData ? dat.name : '';
    serieData = isCorrectData ? dat.data : [];
    serieTot = serieData.length;
    for (var j=0; j < serieTot; j += 1) {
      isCorrectData = serieData[j] && Array.isArray(serieData[j]) &&
                      serieData[j].length == 2;
      tupla = serieData[j];
      if (isCorrectData) {
        content += serieName+','+serieData[j][0]+','+serieData[j][1]+',\r\n';
      }
    }
  }
  return header + content;
};

function csv4Table(widget) {
  var isCorrectData = widget && widget._data && widget._data.count &&
      Array.isArray(widget._data.count),
    count = isCorrectData ? widget._data.count : null,
    labels = isCorrectData ? widget._data.labels : null,
    name = isCorrectData ? widget._data.name : null,
    pct = isCorrectData ? widget._data.pct : null,
    totSeries = isCorrectData ? widget._data.count.length : 0,
    header = '',
    content = '',
    totNames = labels.length;
  for(var j=0; j < totNames; j += 1) {
    header += labels[j] + ',';
  }
  header += 'pct\r\n';
  for(var i=0; i < totSeries; i += 1) {
    for(var j=0; j < totNames - 1; j += 1) {
      content += name[i][j] + ',';
    }
    content += count[i] + ',' + pct[i] + ',\r\n';
  }
  return header + content;
};

function csv4Pie(widget) {
  var isCorrectData = widget && widget._data && Array.isArray(widget._data),
    dats = isCorrectData ? widget._data : null,
    totSeries = isCorrectData ? widget._data.length : 0,
    dat,
    header = '"name","value"\n',
    content = '',
    serieName,
    y;
  for (var i=0; i < totSeries; i += 1) {
    dat = dats[i];
    isCorrectData = dat && dat.name && dat.y;
    serieName = isCorrectData ? dat.name : '';
    y = isCorrectData ? dat.y : null;
    isCorrectData = y && !isNaN(y);
    if (isCorrectData) {
      content += serieName + ',' + y + '\n';
    }
  }
  return header + content;
};

function csv4Voronoi(widget) {
  var isCorrectData = widget && widget._data && widget._data.data &&
                      Array.isArray(widget._data.data),
    data = isCorrectData ? widget._data.data : null,
    totVals = isCorrectData ? widget._data.data.length : 0,
    totSeries = isCorrectData && totVals > 0 ? widget._data.data[0].length : 0,
    header = widget._data.kKeys.keys.join(',') + ',value\n',
    content = '';
  for (var i=0; i < totSeries; i += 1) {
    for (var j=0; j < totVals; j += 1) {
      content += data[j][i] + ',';
    }
    content = content.slice(0, -1) + '\n';
  }
  return header + content;
};

function csv4HeatCalendar(widget) {
  var isCorrectData = widget && widget._data && widget._data.days &&
                      Array.isArray(widget._data.days),
    dayss = isCorrectData ? widget._data.days : null,
    valss = isCorrectData ? widget._data.values : null,
    //namss = isCorrectData ? widget._data.tags : null,
    days,
    vals,
    nams = widget._originalData.object.names[0],
    totSeries = isCorrectData ? widget._data.days.length : 0,
    header = '"name","timestamp","value"\r\n',
    content = '';
  for(var i=0; i < totSeries; i += 1) {
    days = dayss[i];
    vals = valss[i];
    //nams = namss[i];
    var serieTot = days.length;
    for (var j=0; j < serieTot; j += 1) {
      content += nams + ',' + days[j] + ',' + vals[j] + ',\r\n';
    }
  }
  return header + content;
}

/****************************** EXPORT ***************************************/

module.exports = {
  toCsvWashemo: toCsvWashemo,
  toCsvHighcharts: toCsvHighcharts,
  toCsvDataTable: toCsvDataTable
};