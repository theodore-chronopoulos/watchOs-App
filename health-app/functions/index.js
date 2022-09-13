"use strict";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);


exports.helloWorld = functions.https.onRequest((request, response) => {
  const uid = request.query.uid;
  const database = admin.database();
  const usersRef = database.ref("users/" + uid);
  usersRef.on("value", (snapshot) => {
    const type = snapshot.val().lastType;
    const stamp = snapshot.val().lastTimestamp;
    const usersRef2 = database.ref("users/"+uid+"/heartRate/"+type+"/"+stamp);
    usersRef2.on("value", (snapshot) =>{
      const plotdata = Object.values(snapshot.val());
      const plotlabels = Object.keys(snapshot.val());
      const usersRef3 = database.ref("users/"+uid+"/heartRate/"+type);
      usersRef3.on("value", (snapshot) =>{
        const measurements = Object.values(snapshot.val());
        const dataarray = [];
        for (let i = 0; i < (measurements.length - 1); i ++) {
          const data = Object.values(measurements[i]);
          for (let j=0; j<data.length; j++) {
            dataarray.push(data[j]);
          }
        }
        /**
         * Solves equations of the form a * x = b
         *@param {Array} t
        * @return {Number} Returns the value of x for the equation.
        */
        function getStandardDeviation(t) {
          const n = t.length;
          const m = t.reduce((a, b) => a + b) / n;
          return Math.sqrt(t.map((x)=>Math.pow(x-m, 2)).reduce((a, b)=>a+ b)/n);
        }
        const average = (array) => array.reduce((a, b) => a + b) / array.length;
        console.log(average(dataarray));
        console.log(getStandardDeviation(dataarray));
        const ave = average(dataarray);
        const std = getStandardDeviation(dataarray);
        const lower = ave - std;
        const upper = ave + std;
        const dictionary = {
          ave, lower, upper, plotdata, plotlabels,
        };
        response.set("Access-Control-Allow-Origin", "*");
        if (response.method === "OPTIONS") {
          // Send response to OPTIONS requests
          response.set("Access-Control-Allow-Methods", "GET");
          response.set("Access-Control-Allow-Headers", "Content-Type");
          response.set("Access-Control-Max-Age", "3600");
          response.status(204).send(" ");
        } else {
          response.send(dictionary);
        }
      });
    });
  }, (errorObject) => {
    console.log("The read failed: " + errorObject.name);
  });
});


exports.validatemeasurement = functions.https.onRequest((request, response) => {
  const uid = request.query.uid;
  console.log(uid);
  const database = admin.database();
  const usersRef = database.ref("users/" + uid);
  usersRef.on("value", (snapshot) => {
    const type = snapshot.val().lastType;
    const stamp = snapshot.val().lastTimestamp;
    const usersRef2 = database.ref("users/"+uid+"/heartRate/"+type+"/"+stamp);
    usersRef2.on("value", (snapshot) =>{
      const plotdata = Object.values(snapshot.val());
      const average = (array) => array.reduce((a, b) => a + b) / array.length;
      const avelastmeas = average(plotdata);
      const usersRef3 = database.ref("users/"+uid+"/heartRate/"+type);
      usersRef3.on("value", (snapshot) =>{
        const measurements = Object.values(snapshot.val());
        const dataarray = [];
        for (let i = 0; i < (measurements.length - 1); i ++) {
          const data = Object.values(measurements[i]);
          for (let j=0; j<data.length; j++) {
            dataarray.push(data[j]);
          }
        }
        /**
         * Solves equations of the form a * x = b
         *@param {Array} t
        * @return {Number} Returns the value of x for the equation.
        */
        function getStandardDeviation(t) {
          const n = t.length;
          const m = t.reduce((a, b) => a + b) / n;
          return Math.sqrt(t.map((x)=>Math.pow(x-m, 2)).reduce((a, b)=>a+ b)/n);
        }
        const average = (array) => array.reduce((a, b) => a + b) / array.length;
        console.log(average(dataarray));
        console.log(getStandardDeviation(dataarray));
        const ave = average(dataarray);
        const std = getStandardDeviation(dataarray);
        const lower = ave - std;
        const upper = ave + std;
        let valid = true;
        if (avelastmeas > upper || avelastmeas < lower) {
          valid = false;
        }
        response.set("Access-Control-Allow-Origin", "*");
        if (response.method === "OPTIONS") {
          // Send response to OPTIONS requests
          response.set("Access-Control-Allow-Methods", "GET");
          response.set("Access-Control-Allow-Headers", "Content-Type");
          response.set("Access-Control-Max-Age", "3600");
          response.status(204).send(" ");
        } else {
          response.send(valid);
        }
      });
    });
  }, (errorObject) => {
    console.log("The read failed: " + errorObject.name);
  });
});


