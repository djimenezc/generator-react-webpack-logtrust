var cm = {};

cm.QUERY = 'from siem.logtrust.web.activity where not domain = "none" group every 15m by username every 15m select count() as count';

_currentScreen.load = function () {
    cm.initListeners();
    vapp.timeRangeHandler(false);
    vapp.startTime(moment().subtract(1, 'day').toDate(), moment().subtract(1, 'day').toDate());
    vapp.changeDateTitles();
    cm.initWidgets();
};

cm.moreInfo = function(about){
    console.log('Handle more info button');
};

cm.csvDownload = function(csv){
    console.log('Handle download as csv');
};

cm.screenShotWidget = function (e) {
    if (e.detail) {
        vapp.widgetCapture($('#' + e.detail));
    } else {
        vapp.widgetCapture(tu.ltVappContainer);
    }
};

cm.expandWidget = function (e) {
    if (e.detail) {
        vapp.expandWidget($('#' + e.detail));
    }
};

vapp.removeListeners = function(){
    document.removeEventListener('refreshAll', vapp.refreshAll);
    document.removeEventListener('moreInfo', cm.moreInfo);
    document.removeEventListener('expandWidget', cm.expandWidget);
    document.removeEventListener('screenCapture', cm.screenShotWidget);
    document.removeEventListener('csvDownload', cm.csvDownload);
};

cm.initListeners = function () {
    document.addEventListener('refreshAll', vapp.refreshAll);
    document.addEventListener('moreInfo', cm.moreInfo);
    document.addEventListener('expandWidget', cm.expandWidget);
    document.addEventListener('screenCapture', cm.screenShotWidget);
    document.addEventListener('csvDownload', cm.csvDownload);
};

cm.initWidgets = function () {

    //Widget Settings
    cm.widget1Settings = {
        'settings': {
            'callback': cm.lines(
                vapp.fromMalote([cm.QUERY], function () {
                    return [vapp._calFrom * 1000, vapp._calTo * 1000];
                }),
                'username',
                'eventdate',
                'count'
            ),
            'ds': {},
            'afterLoad': function (a) {
            },
            'beforeLoad': function (a) {
                $('#' + this.id).empty();
                $('#' + this.id).removeClass('hide');
                $('#' + this.id).append($('<img>', {
                    'height': '55px',
                    'width': '55px',
                    'src': 'static/images/ajax-loader.gif'
                }));
            }
        }
    };

    vapp.controller.createWidget(
        'widget1',
        WIDGET_TYPES.LINE,
        cm.widget1Settings,
        {}).load();
};

cm.lines = function (callback, key, timeKey, valueKey) {
    return function (cb) {
        callback(function (error, data) {
            var correctData = data && data.all && Array.isArray(data.all) && data.all.length > 0,
                resData = [],
                numRequest = correctData ? data.all.length : 0,
                request,
                row,
                rows,
                uniques = {},
                user,
                val,
                eventDate,
                uniqueKeys,
                uniqueKey,
                totUniqueKeys;

            //Coger valores unicos por dominio y usuario
            while (numRequest--) {
                request = data.all[numRequest];
                rows = request.object.length;
                while (rows--) {
                    row = request.object[rows];
                    user = row[key];
                    eventDate = Date.parse(new moment(row[timeKey]));
                    val = parseInt(row[valueKey]);
                    if (user in uniques) {
                        uniques[user].unshift([eventDate, val]);
                    } else {
                        uniques[user] = [[eventDate, val]];
                    }
                }
            }

            uniqueKeys = Object.keys(uniques);
            totUniqueKeys = uniqueKeys.length;
            while (totUniqueKeys--) {
                uniqueKey = uniqueKeys[totUniqueKeys];
                resData.push({
                    'name': uniqueKey,
                    'data': uniques[uniqueKey]
                });
            }

            if (resData.length < 1) {
                resData = [{'name': 'NO HAY DATOS', 'data': [[0, 0]]}];
            }
            cb(null, resData, data);
        });
    };
};
