import axios from 'axios'
import {Site, Response, Incident} from './api/models'
import Utils from './api/utils';

import schedule from 'node-schedule'


//set startTime
axios.interceptors.request.use(function (config) {
  config.metadata = {startTime: new Date()};
  return config;
}, function (error) {
  return Promise.reject(error);
});

//set endTime and calculate duration
axios.interceptors.response.use(function (response) {

  response.config.metadata.endTime = new Date();
  response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
  return response;
}, function (error) {
  error.config.metadata.endTime = new Date();
  error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
  return Promise.reject(error);
});


function doCleanup() {
  const oneDayAgo = new Date(new Date().setDate(new Date().getDate() - 1));

  return Response.find({"date": {"$lte": oneDayAgo}})
    .remove().exec()
    .then(data => {
      console.log('deleted', data.deletedCount);
    })
}

function doPings() {
  return Site.find({})
    .then(sites => {

      const timeNow = Date.now();

      return Promise.all(sites.map(site => {

          return axios.get(site.url)
            .then(function (response) {
              // handle success
              console.log(site.name, response.duration, 'ms');


              return new Response({
                site: site._id,
                status: response.status,
                duration: response.duration,
                date: timeNow,
                error: false
              })
                .save()
                .then(() => {
                  if (response.status && response.status >= 400) {
                    return new Incident({
                      site: site._id,
                      down: true
                    }).save()
                  } else {
                    return Promise.resolve();
                  }
                })
            })
            .catch(function (error) {
              // handle error
              console.error(error);

              return new Response({
                site: site._id,
                status: error.status,
                duration: error.duration,
                date: timeNow,
                error: true
              })
                .save()
                .then(() => {
                  return new Incident({
                    site: site._id,
                    down: true
                  }).save()
                })
            })
        })
      )

    })
}

function doActions() {
  return doPings()
    .then(doCleanup)
    .catch(err => {
      console.error(err);
    })
}

export default {

  start() {

    Utils.connectToDb();

    const loop = schedule.scheduleJob('*/5 * * * *', function () {
      doActions();
    });


    // const loop = setInterval(function () {
    //   doActions();
    // }, 300000);
  }

};
