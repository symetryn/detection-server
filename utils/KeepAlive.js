const fetch = require("node-fetch");

//keeps the heroku dyno from sleeping
const wakeUpDyno = (url, interval = 25, callback) => {
  const milliseconds = interval * 60000;
  console.log("Started Heroku Dyno keep alive");
  fetch(url).then(() => console.log(`Fetching ${url}.`));
  setTimeout(() => {
    try {
      // HTTP GET request to the dyno's url

      fetch(url).then(() => console.log(`Fetching ${url}.`));
    } catch (err) {
      // catch fetch errors
      console.log(`Error fetching ${url}: ${err.message} 
            Will try again in ${interval} minutes...`);
    } finally {
      try {
        s;
        callback(); // execute callback, if passed
      } catch (e) {
        // catch callback error
        callback ? console.log("Callback failed: ", e.message) : null;
      } finally {
        // do it all again
        return wakeUpDyno(url, interval, callback);
      }
    }
  }, milliseconds);
};

module.exports = wakeUpDyno;
