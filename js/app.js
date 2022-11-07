'use strict';

//Assume that all stores open and close at the same time. Maybe functionality can be added later to make this variable, so keep it as an object property for now. Functions in this script are only valid for this assumption
const OPENS = '06:00';
const CLOSES = '20:00';

//Define the control curve for projected sales traffic for each hour open
const projectedSalesFactor = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];

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
CookieStand.prototype.generateHourlyCookies = function(numberOfCustomers) {
  const avg = this.avgCookiesPerSale;
  return Math.round(avg * numberOfCustomers);
};

//This method creates an array with hourly cookie sales and prejected staffing required based on the constant projected sales control curve
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
    let hourlyCustomers = this.generateHourlyCustomers();
    let currentCookieSales = Math.round(this.generateHourlyCookies(hourlyCustomers) * remainderFactor * projectedSalesFactor[i]);
    //Calculate required tossers using the basic rubric that a single Salmon Cookie Tosser can serve 20 customers per hour, and that each location should have a minimum of two Salmon Cookie Tossers on shift at all times
    let tossersNeeded = Math.round(hourlyCustomers / 20);
    tossersNeeded = tossersNeeded < 2 ? 2 : tossersNeeded;
    this.dailySalesInfo.push([currentTime, currentCookieSales, tossersNeeded]);
  }
};

//This method calculates the total number of cookies sold that day or the total number of employees needed
CookieStand.prototype.totalDailyInfo = function(salesInfoIndex) {
  let total = 0;
  for (let i = 0; i < this.dailySalesInfo.length; i++) {
    total += this.dailySalesInfo[i][salesInfoIndex];
  }
  return total;
};

//This method renders a table row for the desired sales data (cookies or employees)
CookieStand.prototype.renderSalesDataRow = function(salesInfoIndex, hasDailyTotal) {
  //Define index where sales data is found
  const location = this.location;
  //Create a new table row
  const tr = document.createElement('tr');
  //Use canonical HTML styling (all lowercase for ids)
  tr.id = location[0].toLowerCase() + location.slice(1);
  //Create a table header element
  const th = document.createElement('th');
  th.innerText = location;
  tr.appendChild(th);
  const salesInfo = this.dailySalesInfo;
  for (let i = 0; i < salesInfo.length; i++) {
    let td = document.createElement('td');
    td.innerText = salesInfo[i][salesInfoIndex];
    tr.appendChild(td);
  }
  if (hasDailyTotal === true) {
    //Create a table data element for the total
    let td = document.createElement('td');
    td.innerText = this.totalDailyInfo(salesInfoIndex);
    tr.appendChild(td);
  }
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

//Overall function to generate the daily sales data tables
function generateDailySalesTables() {
  //Define the time information to be used in the subsequent functions
  const openingTimeAsNumber = hourAsNumber(OPENS);
  const ClosingTimeAsNumber = hourAsNumber(CLOSES);
  const totalOperatingHours = ClosingTimeAsNumber - openingTimeAsNumber;
  //Initialize an array to calculate the overall total hourly cookies sold
  let totalHourlyCookies = new Array(totalOperatingHours).fill(0);
  let totalDailyCookies = 0;
  //Initialize an array to calculate the overall total employees needed
  let totalHourlyTossers = new Array(totalOperatingHours).fill(0);
  //For the sales data table there is a daily total, for the tossers there is not
  let salesTable = createNewTable(openingTimeAsNumber, totalOperatingHours, true);
  let tossersTable = createNewTable(openingTimeAsNumber, totalOperatingHours, false);
  //Iterate over every store and create a CookieStand. Track the hourly and daily sales info and create new table rows.
  for (let store of stores) {
    //Define index where cookie sales and tosser data is found
    const COOKIES = 1;
    const TOSSERS = 2;
    //Create new CookieStand and render table row
    const newStand = new CookieStand(store.location, store.minHourlyCustomers, store.maxHourlyCustomers, store.avgCookiesPerSale, OPENS, CLOSES);
    newStand.getDailyCookieSales();
    salesTable.querySelector('tbody').appendChild(newStand.renderSalesDataRow(COOKIES, true));
    tossersTable.querySelector('tbody').appendChild(newStand.renderSalesDataRow(TOSSERS, false));
    //Increment totalHourlyCookies and totalHourlyTossers for each new store location. This functionality is only valid for the condition that all stores open and close at the same time.
    for (let i = 0; i < newStand.dailySalesInfo.length; i++) {
      totalHourlyCookies[i] += newStand.dailySalesInfo[i][COOKIES];
      totalHourlyTossers[i] += newStand.dailySalesInfo[i][TOSSERS];
    }
    totalDailyCookies += newStand.totalDailyInfo(COOKIES);
  }
  //Add the overall total cookies to the totalHourlyCookies array (i.e., the table foot row)
  totalHourlyCookies.push(totalDailyCookies);

  //Create and append the footer and append the table after the correct header
  salesTable.querySelector('table').appendChild(createDailySalesTableFoot(totalHourlyCookies));
  tossersTable.querySelector('table').appendChild(createDailySalesTableFoot(totalHourlyTossers));
  let salesInfo = document.getElementById('salesInfo');
  let tossersInfo = document.getElementById('tossersInfo');
  salesInfo.parentElement.insertBefore(salesTable, salesInfo.nextElementSibling);
  tossersInfo.parentElement.insertBefore(tossersTable, tossersInfo.nextElementSibling);
}

// This function creates a new table with a table head and empty table body to be appended
function createNewTable(openTime, totalHours, hasDailyTotalColumn) {
  //For speed, create new fragment instead of a new table so that you only have one reflow and a single render.
  const fragment = document.createDocumentFragment();
  let newTable = document.createElement('table');
  newTable.appendChild(createDailySalesTableHead(openTime, totalHours, hasDailyTotalColumn));
  //Create new CookieStands and rows for the sales table body
  let tbody = document.createElement('tbody');
  newTable.appendChild(tbody);
  fragment.appendChild(newTable);
  return fragment;
}

//Create Table Headers
function createDailySalesTableHead(openTime, totalHours, hasDailyTotalColumn) {
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
  if (hasDailyTotalColumn === true) {
    //Create a final Daily Location Total header
    th = document.createElement('th');
    th.innerText = 'Daily Location Total';
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  return thead;
}

//Create Table Foot
function createDailySalesTableFoot(totalCookiesArray) {
  const tfoot = document.createElement('tfoot');
  const tr = document.createElement('tr');
  let th = document.createElement('th');
  th.innerText = 'Totals';
  tr.appendChild(th);
  for (let cookies of totalCookiesArray) {
    let td = document.createElement('td');
    td.innerText = cookies;
    tr.appendChild(td);
  }
  tfoot.appendChild(tr);
  return tfoot;
}

generateDailySalesTables();
