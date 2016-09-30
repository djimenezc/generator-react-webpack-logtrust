'use strict';

var queries = {
  /****************************** MAIN 1 *************************************/
  w111: ['from siem.logtrust.collector.size where '+
    'isnotnull(domain), isnotnull(collector) '+
    'group every 30m by collector, domain every 0 '+
    'select sum(rawSize) as size'],
  w112: ['from siem.logtrust.web.activityAll where '+
    'isnotnull(username), isnotnull(domain) '+
    'group by username, domain every 0 select count() as count'],
  w113: ['from siem.logtrust.web.activityAll where '+
    'isnotnull(username), isnotnull(domain), isnotnull(serverPort) '+
    'group every 30m by username, domain every 1h '+
    'select count() as count select count * 100 as count100']
};

var queriesSearch = {
  /****************************** MAIN 1 *************************************/
  w111: 'from siem.logtrust.collector.size where '+
    'isnotnull(domain), isnotnull(collector) '+
    'group every 30m by collector, domain every 0 '+
    'select sum(rawSize) as size',
  
  w112: 'from siem.logtrust.web.activityAll where '+
    'isnotnull(username), isnotnull(domain) '+
    'group by username, domain every 0 select count() as count',
  
  w113: 'from siem.logtrust.web.activityAll where '+
    'isnotnull(username), isnotnull(domain), isnotnull(serverPort) '+
    'group every 30m by username, domain every 1h '+
    'select count() as count select count * 100 as count100',
  
  w121: 'from siem.logtrust.collector.size where isnotnull(domain), '+
    'isnotnull(collector) group every 30m every 1d select count() as count',
  
  w122: 'from siem.logtrust.web.activityAll where isnotnull(username), '+
    'isnotnull(domain), isnotnull(serverPort) group every 30m by '+
    'username, domain, serverPort every 1h select count() as count '+
    'select count * 100 as count100'
};

function getQuery(id) {
  return queries[id];
}

function getQuerySearch(id) {
  return queriesSearch[id];
}

module.exports = {
  getQuery: getQuery,
  getQuerySearch: getQuerySearch
};