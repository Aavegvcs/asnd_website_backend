const moment = require('moment-timezone');

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// it will return indian time stamp
function tds() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    hours = checkTime(hours);
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);
    return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
    );
}


function get_month(time) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date(time * 1000);
    let month = months[date.getMonth()];
    return month;
}

function get_year(time) {
    const date = new Date(time * 1000);
    let year = date.getFullYear();
    return year;
}

function calculateDaysBetweenDates(startDate, endDate) {

    // date should be in format dd-mm-yyyy
    const [sday, smonth, syear] = startDate.split('-').map(Number);
    const [eday, emonth, eyear] = endDate.split('-').map(Number);
    const start = new Date(syear, smonth - 1, sday); // Month is 0-indexed in JavaScript Date
    const end = new Date(eyear, emonth - 1, eday);
    const timeDifference = end - start;
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    return timeDifference / millisecondsInADay;
}

function convertTimestampToDDMMMYYYYHHMM(timestamp) {
  const dateObj = new Date(timestamp);

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  const formattedDateTime = `${day} ${month} ${year} ${hours}:${minutes}`;

  return formattedDateTime; // Output: "12 Nov 2024 12:30"
}

function convertTimestampToDDMMMYYYYHHMM_IST(timestamp) {

  const utcDate = new Date(timestamp); // Example UTC date
  const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

  const day = String(istDate.getDate()).padStart(2, "0");
  const month = istDate.toLocaleString("en-US", { month: "short" });
  const year = istDate.getFullYear();
  const hours = String(istDate.getHours()).padStart(2, "0");
  const minutes = String(istDate.getMinutes()).padStart(2, "0");

  const formattedDateTime = `${day} ${month} ${year} ${hours}:${minutes}`;

  return formattedDateTime; // Output: "12 Nov 2024 12:30"
}

function convertUtcToTimezone(utcTimestamp, targetTimezone) {
    let dateTime =  moment.utc(utcTimestamp).tz(targetTimezone).format("YYYY-MM-DD HH:mm:ss");
    dateTime = dateTime.split(" ")
    return `${dateTime[0]}, ${dateTime[1]}`
}

module.exports = {
    tds,
    get_month,
    get_year,
    calculateDaysBetweenDates,
    convertTimestampToDDMMMYYYYHHMM,
    convertTimestampToDDMMMYYYYHHMM_IST,
    convertUtcToTimezone
}
