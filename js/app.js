'use strict';

//Assume that all stores open and close at the same time. Maybe functionality can be added later to make this variable, so keep it as an object property for now. Functions in this script are only valid for this assumption
const OPENS = '06:00';
const CLOSES = '20:00';

//Define all stores info for CookieStand construction
const seattle = {
  location: 'Seattle',
  minHourlyCustomers: 23,
  maxHourlyCustomers: 65,
  avgCookiesPerSale: 6.3,
};
const tokyo = {
  location: 'Tokyo',
  minHourlyCustomers: 3,
  maxHourlyCustomers: 24,
  avgCookiesPerSale: 1.2,
};
const dubai = {
  location: 'Dubai',
  minHourlyCustomers: 11,
  maxHourlyCustomers: 38,
  avgCookiesPerSale: 3.7,
};
const paris = {
  location: 'Paris',
  minHourlyCustomers: 20,
  maxHourlyCustomers: 38,
  avgCookiesPerSale: 2.3,
};
const lima = {
  location: 'Lima',
  minHourlyCustomers: 2,
  maxHourlyCustomers: 16,
  avgCookiesPerSale: 4.6,
};
//Define an array to iterate through that contains each location
const stores = [
  seattle,
  tokyo,
  dubai,
  paris,
  lima
];

//Define CookieStand constructor
function CookieStand(location, minHourlyCustomers, maxHourlyCustomers, avgCookiesPerSale, openingTime, closingTime) {
  this.location = location;
  this.minHourlyCustomers = minHourlyCustomers;
  this.maxHourlyCustomers = maxHourlyCustomers;
  this.avgCookiesPerSale = avgCookiesPerSale;
  this.openingTime = openingTime;
  this.closingTime = closingTime;
  this.dailySalesInfo = [];
}

//This method returns a random integer between min and max (inclusive)
CookieStand.prototype.generateHourlyCustomers = function() {
  const min = this.minHourlyCustomers;
  const max = this.maxHourlyCustomers;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//This method generates the number cookies sold per hour
CookieStand.prototype.generateHourlyCookies = function() {
  const avg = this.avgCookiesPerSale;
  return Math.round(avg * this.generateHourlyCustomers());
};

//This method creates an array with hourly cookie sales
CookieStand.prototype.getDailyCookieSales = function() {
  const openingTimeAsNumber = hourAsNumber(this.openingTime);
  const ClosingTimeAsNumber = hourAsNumber(this.closingTime);
  const totalOperatingHours = ClosingTimeAsNumber - openingTimeAsNumber;
  //Iterate hourly to populate the daily sales information
  for (let i = 0; i < totalOperatingHours; i++) {
    //If the shop is open for less than an hour until close, factor the cookies sold
    let timeRemainder = totalOperatingHours - i;
    let remainderFactor = timeRemainder < 1 ? timeRemainder : 1;
    let currentTime = getCurrentHour(openingTimeAsNumber + i);
    let currentCookieSales = Math.round(this.generateHourlyCookies() * remainderFactor);
    this.dailySalesInfo.push([currentTime, currentCookieSales]);
  }
};

//This method calculates the total number of cookies sold that day
CookieStand.prototype.totalDailyCookies = function() {
  const COOKIES = 1;
  let totalCookies = 0;
  for (let i = 0; i < this.dailySalesInfo.length; i++) {
    totalCookies += this.dailySalesInfo[i][COOKIES];
  }
  return totalCookies;
};

//This method calls the getDailyCookieSales method, as well as creating a table row with sales data
CookieStand.prototype.createDailySalesList = function() {
  //Define index where sales data is found
  const COOKIES = 1;
  const location = this.location;
  //Create a new table row
  const tr = document.createElement('tr');
  //Use canonical HTML styling (all lowercase for ids)
  tr.id = location[0].toLowerCase() + location.slice(1);
  //Create a table header element
  const th = document.createElement('th');
  th.innerText = location;
  tr.appendChild(th);
  this.getDailyCookieSales();
  const salesInfo = this.dailySalesInfo;
  for (let i = 0; i < salesInfo.length; i++) {
    let td = document.createElement('td');
    td.innerText = salesInfo[i][COOKIES];
    tr.appendChild(td);
  }
  //Create a table data element for the total number of cookies
  let td = document.createElement('td');
  td.innerText = this.totalDailyCookies();
  tr.appendChild(td);

  return tr;
};

//This function converts a 24 hour format string to an iterable and operatable number
function hourAsNumber(hourAsString) {
  const timeArr = hourAsString.split(':');
  return Number(timeArr[0]) + Number(timeArr[1]) / 60;
}

//This function returns the current 12 hour format time
function getCurrentHour(currentHourAsNumber) {
  const hours = Math.floor(currentHourAsNumber) % 12 || 12;
  let minutes = Math.round((currentHourAsNumber % 1) * 60);
  //If minutes is in the single digits, format with a leading 0
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const period = currentHourAsNumber < 12 ? 'am' : 'pm';

  return `${hours}:${minutes}${period}`;
}

//Overall function to generate the daily sales data
function generateDailySalesTable() {
  //Define the time information to be used in the subsequent functions
  const openingTimeAsNumber = hourAsNumber(OPENS);
  const ClosingTimeAsNumber = hourAsNumber(CLOSES);
  const totalOperatingHours = ClosingTimeAsNumber - openingTimeAsNumber;
  //Initialize an array to calculate the overall total hourly cookies sold
  let totalHourlyCookies = new Array(totalOperatingHours).fill(0);
  let totalDailyCookies = 0;
  //For speed, create a fragment instead of a new table so that you only have one reflow and a single render.
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createDailySalesTableHead(openingTimeAsNumber, totalOperatingHours));
  //Create new CookieStands and rows for the sales table body
  let tbody = document.createElement('tbody');
  for (let store of stores) {
    //Define index where sales data is found
    const COOKIES = 1;
    const newStand = new CookieStand(store.location, store.minHourlyCustomers, store.maxHourlyCustomers, store.avgCookiesPerSale, OPENS, CLOSES);
    tbody.appendChild(newStand.createDailySalesList());
    //Increment totalHourlyCookies for each new store location. This functionality is only valid for the condition that all stores open and close at the same time.
    for (let i = 0; i < newStand.dailySalesInfo.length; i++) {
      totalHourlyCookies[i] += newStand.dailySalesInfo[i][COOKIES];
    }
    totalDailyCookies += newStand.totalDailyCookies();
  }
  //Add the overall total cookies to the totalHourlyCookies array (i.e., the table foot row)
  totalHourlyCookies.push(totalDailyCookies);
  fragment.appendChild(tbody);
  fragment.appendChild(createDailySalesTableFoot(totalHourlyCookies));
  document.body.appendChild(fragment);
}

//Create Table Headers
function createDailySalesTableHead(openTime, totalHours) {
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  //According to the requirements, the first header in the table is empty
  let th = document.createElement('th');
  th.innerText = '';
  tr.appendChild(th);
  //Create table headers at one hour intervals
  for (let i = 0; i < totalHours; i++) {
    let currentTime = getCurrentHour(openTime + i);
    th = document.createElement('th');
    th.innerText = currentTime;
    tr.appendChild(th);
  }
  //Create a final Daily Location Total header
  th = document.createElement('th');
  th.innerText = 'Daily Location Total';
  tr.appendChild(th);
  thead.appendChild(tr);
  return thead;
}

//Create Table Foot
function createDailySalesTableFoot(totalCookiesArray) {
  const tfoot = document.createElement('tfoot');
  const tr = document.createElement('tr');
  let td = document.createElement('td');
  td.innerText = 'Totals';
  tr.appendChild(td);
  for (let cookies of totalCookiesArray) {
    td = document.createElement('td');
    td.innerText = cookies;
    tr.appendChild(td);
  }
  tfoot.appendChild(tr);
  return tfoot;
}

generateDailySalesTable();
