// import * as moment from 'moment-timezone';
const moment = require('moment');

/**
 * "Input:"YYYY-MM-DD HH:mm:ss",
 *  Output:"1582857000000",
 *  return typ
 */
const getTime = (date = new Date()) => {
  const response = moment(date).utc().format('x');
  return response;
}

/**
 *"Input-date: 2020-02-28", Input-time: "18:00",
 * Output:"1582857000000",
 * return typ
 */
const concatDateTime = (date, time = "00:00") => {
  const response = moment(date + ' ' + time, 'YYYY-MM-DD HH:mm').utc().format('x');
  return response;
}

const getUnixTime = (time = "00:00") => {
  const response = moment("1980-01-01" + ' ' + time, 'YYYY-MM-DD HH:mm').utc().format('x');
  return response;
}

/**
 * Input:"1582857000000",
 * Output: "2020-02-20",
 * return typ
 */
const extractDate = (date) => {
  const response = moment.unix(date / 1000).utc().format('YYYY-MM-DD');
  return response;
}

/**
 *Input:"1582857000000",
 * Output: "18:00",
 * return typ
 * fmt: HH:mm or hh:mm A
 */
const extractTime = (date, fmt) => {
  const response = moment.unix(date / 1000).format(fmt);
  return response;
}

/**
 *Input-date:"1582857000000",Input-day integer number"
 *Output: integer number"
 *return typ
 */
const getDays = (startDate, day) => {
  // const response = moment(moment(extractDate(startDate)).add(day, 'day').utc().format('LL')).utc().format("YYYY-MM-DD");
  const response = moment(extractDate(startDate)).add(day, 'day').utc().format('LL');

  return response;
}

/**
 * Input:"1582857000000",
 * Output: "March 1, 2020",
 * return typ
 */
const getDateDifference = (startDate, endDate) => {
  startDate = moment(extractDate(startDate));
  endDate = moment(extractDate(endDate));
  const response = moment.duration(endDate.diff(startDate)).asDays();
  return response;
}

const concatUnixTime = (startDate, date) => {
  const response = moment(moment(date).utc().format("YYYY-MM-DD") + ' ' + extractTime(startDate), 'YYYY-MM-DD HH:mm').utc().format('x');
  return response;
}

const convertDateFormat = (date, fmt, utc = true) => {
  //const response = (utc) ? moment(date).utc().format(fmt) : moment(date).format(fmt);
  let response = moment(date).format();
  if (fmt) {
    response = moment(date).format(fmt);
  } else {
    response = response.replace(/-00:00/g, "Z");
  }
  return response;
}
//Thu, Jul 18, 2019 at 10:49 AM
const convertDateFormatWIthWeekName = async (date) => {
  if (date) {
    var replacedate = date.split('at', 1).pop().replace(",", "");
    replacedate = replacedate.replace(",", "");
    var replacetime = date.split('at').pop().trim();
    create_date = new Date(replacedate);
    var year = create_date.getFullYear();
    // month as (MM) format
    let month = ("0" + (create_date.getMonth() + 1)).slice(-2);

    // date as (DD) format
    let day = ("0" + create_date.getDate()).slice(-2);

    var formatteddate = year + "-" + month + "-" + day;
    var formattedtime = await convertTimeFrom12To24(replacetime);
    datetimeformatted = formatteddate + " " + formattedtime + ":00";
    if (datetimeformatted.includes("NaN")) {
      return null;
    } else {
      return datetimeformatted;
    }

  }//
  return null;

}

const agoTime = (date) => {
  const response = moment.unix(date / 1000).fromNow();
  return response;
}

const extractPostTime = (date, fmt) => {
  const response = moment.unix(date / 1000).format(fmt);
  return response;
}

const fileDateTimeFormat = () => {
  const date = convertDateFormat(new Date(), "L").split("/").join("_");
  let time = convertDateFormat(new Date(), "LTS").split(" ")[0];
  time = time.split(":").join("_");
  return `${date} ${time}`;
}

const getCustomDate = (date, day = 1, fmt = "YYYY-MM-DD", type = "day") => {
  let minusTime = day * 24 * 60 * 60 * 1000;
  let customDate = "";
  if (fmt === "c") {
    const date = new Date();
    customDate = moment(new Date(date.getTime() - minusTime)).utc().format();
  } else {
    if (type == "hour") {
      minusTime = day * 60 * 60 * 1000;
    }
    customDate = `${convertDateFormat(new Date(date.getTime() - minusTime), fmt)}`;
  }
  return customDate;
}

function convertTimeFrom12To24(timeStr) {
  var colon = timeStr.indexOf(':');
  var hours = timeStr.substr(0, colon),
    minutes = timeStr.substr(colon + 1, 2),
    meridian = timeStr.substr(colon + 4, 2).toUpperCase();


  var hoursInt = parseInt(hours, 10),
    offset = meridian == 'PM' ? 12 : 0;

  if (hoursInt === 12) {
    hoursInt = offset;
  } else {
    hoursInt += offset;
  }
  return hoursInt + ":" + minutes;
}

async function getCurrentTime() {
  let nz_date_string = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

  // Date object initialized from the above datetime string
  let date_nz = new Date(nz_date_string);

  // year as (YYYY) format
  let year = date_nz.getFullYear();

  // month as (MM) format
  let month = ("0" + (date_nz.getMonth() + 1)).slice(-2);

  // date as (DD) format
  let date = ("0" + date_nz.getDate()).slice(-2);

  // hours as (HH) format
  let hours = ("0" + date_nz.getHours()).slice(-2);

  // minutes as (mm) format
  let minutes = ("0" + date_nz.getMinutes()).slice(-2);

  // seconds as (ss) format
  let seconds = ("0" + date_nz.getSeconds()).slice(-2);

  // date and time as YYYY-MM-DD hh:mm:ss format
  let date_time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  return date_time;
}

const newDate = (fmt = null) => {
  //const response = (utc) ? moment(date).utc().format(fmt) : moment(date).format(fmt);
  let date = new Date;
  let response = moment(date).format();
  if (fmt) {
    response = moment(date).format(fmt);
  } else {
    response = response.replace(/-00:00/g, "Z");
  }
  return response;
}

module.exports = {
  newDate,
  getTime,
  concatDateTime,
  getUnixTime,
  extractDate,
  extractTime,
  getDays,
  getDateDifference,
  concatUnixTime,
  convertDateFormat,
  agoTime,
  extractPostTime,
  fileDateTimeFormat,
  getCustomDate,
  convertDateFormatWIthWeekName,
  getCurrentTime
}
