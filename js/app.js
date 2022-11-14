'use strict';

// Assume that all stores open and close at the same time. Maybe functionality can be added later to make this variable, so keep it as an object property for now. Functions in this script are only valid for this assumption
const OPENS = '06:00';
const CLOSES = '20:00';

// Define the control curve for projected sales traffic for each hour open
const PROJECTED_SALES_CURVE = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];

// Initialize the totals arrays
let totalHourlyCookies = [];
let totalHourlyTossers = [];

// Define all stores info for CookieStand construction. A stretch goal would be to have a separate text file or page with these as JSON to read in sort of like an API call.
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
// Define an array to iterate through that contains each location
const stores = [
  seattle,
  tokyo,
  dubai,
  paris,
  lima
];

// Define CookieStand constructor
function CookieStand(location, minHourlyCustomers, maxHourlyCustomers, avgCookiesPerSale, openingTime, closingTime) {
  this.location = location;
  this.minHourlyCustomers = minHourlyCustomers;
  this.maxHourlyCustomers = maxHourlyCustomers;
  this.avgCookiesPerSale = avgCookiesPerSale;
  this.openingTime = openingTime;
  this.closingTime = closingTime;
  this.dailySalesInfo = [];
}

// This method returns a random integer between min and max (inclusive)
CookieStand.prototype.generateHourlyCustomers = function() {
  const min = this.minHourlyCustomers;
  const max = this.maxHourlyCustomers;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// This method generates the number cookies sold per hour
CookieStand.prototype.generateHourlyCookies = function(numberOfCustomers) {
  const avg = this.avgCookiesPerSale;
  return Math.round(avg * numberOfCustomers);
};

// This method populates the dailySalesInfo array property with hourly cookie sales and projected staffing required based on the constant projected sales control curve
CookieStand.prototype.getDailyCookieSales = function() {
  const openingTimeAsNumber = getHourAsNumber(this.openingTime);
  const ClosingTimeAsNumber = getHourAsNumber(this.closingTime);
  const totalOperatingHours = ClosingTimeAsNumber - openingTimeAsNumber;
  // Iterate hourly to populate the daily sales information
  for (let i = 0; i < totalOperatingHours; i++) {
    // If the shop is open for less than an hour until close, factor the cookies sold. This functionality isn't entirely necessary for the limitations of the current code base, but I'm keeping it for future refactoring
    let timeRemainder = totalOperatingHours - i;
    let remainderFactor = timeRemainder < 1 ? timeRemainder : 1;
    let currentTime = getCurrentHour(openingTimeAsNumber + i);
    let hourlyCustomers = this.generateHourlyCustomers();
    let currentCookieSales = Math.round(this.generateHourlyCookies(hourlyCustomers) * remainderFactor * PROJECTED_SALES_CURVE[i]);
    // Calculate required tossers using the basic rubric that a single Salmon Cookie Tosser can serve 20 customers per hour, and that each location should have a minimum of two Salmon Cookie Tossers on shift at all times
    let tossersNeeded = Math.ceil(hourlyCustomers / 20);
    tossersNeeded = tossersNeeded < 2 ? 2 : tossersNeeded;
    this.dailySalesInfo.push([currentTime, currentCookieSales, tossersNeeded]);
  }
};

// This method calculates the total number of cookies sold that day or the total number of employees needed
CookieStand.prototype.getTotalDailyInfo = function(salesInfoIndex) {
  let total = 0;
  for (let i = 0; i < this.dailySalesInfo.length; i++) {
    total += this.dailySalesInfo[i][salesInfoIndex];
  }
  return total;
};

// This method renders a table row for the desired sales data (cookies or employees)
CookieStand.prototype.renderSalesDataRow = function(tableID, salesInfoIndex, hasDailyTotal) {
  // Create a new table row
  const tr = document.createElement('tr');
  // Define table row ID
  tr.id = this.generateTableRowID(tableID);
  // Create a table header element
  const th = document.createElement('th');
  th.innerText = this.location;
  tr.appendChild(th);
  const salesInfo = this.dailySalesInfo;
  for (let i = 0; i < salesInfo.length; i++) {
    let td = document.createElement('td');
    td.innerText = salesInfo[i][salesInfoIndex];
    tr.appendChild(td);
  }
  if (hasDailyTotal) {
    // Create a table data element for the total
    let td = document.createElement('td');
    td.innerText = this.getTotalDailyInfo(salesInfoIndex);
    tr.appendChild(td);
  }
  return tr;
};

// This method generates a unique HTML tag ID for each table row
CookieStand.prototype.generateTableRowID = function (tableID) {
  return `${tableID}-${this.location.toLowerCase()}`;
};

// This method finds the table row that matches the current cookie stand and decrements the totals array, then replaces the table data, then increments the totals array.
CookieStand.prototype.replaceSalesDataRow = function(tableID, totalHourlyArray, salesInfoIndex, hasDailyTotal) {
  let trID = this.generateTableRowID(tableID);
  let tr = document.getElementById(trID);
  let tdArray = tr.querySelectorAll('td');
  const salesInfo = this.dailySalesInfo;
  for (let i = 0; i < salesInfo.length; i++) {
    let tdBefore = Number(tdArray[i].innerText);
    totalHourlyArray[i] -= tdBefore;
    tdArray[i].innerText = salesInfo[i][salesInfoIndex];
    let tdAfter = Number(tdArray[i].innerText);
    totalHourlyArray[i] += tdAfter;
  }

  if (hasDailyTotal) {
    //Update the final index of the table row and totalHourlyArray
    let tdBefore = Number(tdArray[tdArray.length - 1].innerText);
    totalHourlyArray[totalHourlyArray.length - 1] -= tdBefore;
    tdArray[tdArray.length - 1].innerText = this.getTotalDailyInfo(salesInfoIndex);
    let tdAfter = Number(tdArray[tdArray.length - 1].innerText);
    totalHourlyArray[totalHourlyArray.length - 1] += tdAfter;
  }
};

// This function converts a 24 hour format string to an iterable and operatable number
function getHourAsNumber(hourAsString) {
  const timeArr = hourAsString.split(':');
  return Number(timeArr[0]) + Number(timeArr[1]) / 60;
}

// This function returns the current 12 hour format time
function getCurrentHour(currentHourAsNumber) {
  const hours = Math.floor(currentHourAsNumber) % 12 || 12;
  let minutes = Math.round((currentHourAsNumber % 1) * 60);
  // If minutes is in the single digits, format with a leading 0
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const period = currentHourAsNumber < 12 ? 'am' : 'pm';

  return `${hours}:${minutes}${period}`;
}

// Overall function to generate the daily sales data tables
function generateDailySalesTables() {
  // Define the time information to be used in the subsequent functions
  const openingTimeAsNumber = getHourAsNumber(OPENS);
  const ClosingTimeAsNumber = getHourAsNumber(CLOSES);
  const totalOperatingHours = ClosingTimeAsNumber - openingTimeAsNumber;
  //   // Set the size of the totalHourlyCookies array to calculate the overall total hourly cookies sold
  totalHourlyCookies = Array(totalOperatingHours).fill(0);
  //   // Set the size of the totalHourlyTossers array to calculate the overall total employees needed array to calculate the overall total employees needed
  totalHourlyTossers = Array(totalOperatingHours).fill(0);
  let totalDailyCookies = 0;
  // For the sales data table there is a daily total; for the tossers there is not
  const salesTableID = 'salesTable';
  let salesTable = createNewTable(salesTableID,openingTimeAsNumber, totalOperatingHours, true);
  const tossersTableID = 'tossersTable';
  let tossersTable = createNewTable(tossersTableID, openingTimeAsNumber, totalOperatingHours, false);
  // Iterate over every store and create a CookieStand. Track the hourly and daily sales info and create new table rows.
  for (let store of stores) {
    // Create new CookieStand and render table row
    const newStand = new CookieStand(store.location, store.minHourlyCustomers, store.maxHourlyCustomers, store.avgCookiesPerSale, OPENS, CLOSES);
    newStand.getDailyCookieSales();
    // Define index where cookie sales and tosser data is found
    const cookies_idx = 1;
    const tossers_idx = 2;
    salesTable.querySelector('tbody').appendChild(newStand.renderSalesDataRow(salesTableID, cookies_idx, true));
    tossersTable.querySelector('tbody').appendChild(newStand.renderSalesDataRow(tossersTableID, tossers_idx, false));
    // Increment totalHourlyCookies and totalHourlyTossers for each new store location. This functionality is only valid for the condition that all stores open and close at the same time.
    for (let i = 0; i < newStand.dailySalesInfo.length; i++) {
      totalHourlyCookies[i] += newStand.dailySalesInfo[i][cookies_idx];
      totalHourlyTossers[i] += newStand.dailySalesInfo[i][tossers_idx];
    }
    totalDailyCookies += newStand.getTotalDailyInfo(cookies_idx);
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
function createNewTable(tableID, openTime, totalHours, hasDailyTotalColumn) {
  // For speed, create new fragment instead of a new table so that you only have one reflow and a single render.
  const fragment = document.createDocumentFragment();
  let newTable = document.createElement('table');
  newTable.id = tableID;
  newTable.appendChild(createDailySalesTableHead(openTime, totalHours, hasDailyTotalColumn));
  // Create new CookieStands and rows for the sales table body
  let tbody = document.createElement('tbody');
  newTable.appendChild(tbody);
  fragment.appendChild(newTable);
  return fragment;
}

// Create Table Headers
function createDailySalesTableHead(openTime, totalHours, hasDailyTotalColumn) {
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  // According to the requirements, the first header in the table is empty
  let th = document.createElement('th');
  th.innerText = '';
  tr.appendChild(th);
  // Create table headers at one hour intervals
  for (let i = 0; i < totalHours; i++) {
    let currentTime = getCurrentHour(openTime + i);
    th = document.createElement('th');
    th.innerText = currentTime;
    tr.appendChild(th);
  }
  if (hasDailyTotalColumn) {
    // Create a final Daily Location Total header
    th = document.createElement('th');
    th.innerText = 'Daily Location Total';
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  return thead;
}

// Create Table Foot
function createDailySalesTableFoot(totalsArray) {
  const tfoot = document.createElement('tfoot');
  const tr = document.createElement('tr');
  let th = document.createElement('th');
  th.innerText = 'Totals';
  tr.appendChild(th);
  for (let total of totalsArray) {
    let td = document.createElement('td');
    td.innerText = total;
    tr.appendChild(td);
  }
  tfoot.appendChild(tr);
  return tfoot;
}


// Add event listener for sales form submittal
let salesForm = document.getElementById('salesForm');
salesForm.addEventListener('submit', addCookieStand);
function addCookieStand(event) {
  event.preventDefault();
  let form = event.target;
  let location = form.location.value;
  let minHourlyCustomers = form.minHourlyCustomers.value;
  let maxHourlyCustomers = form.maxHourlyCustomers.value;
  let avgCookiesPerSale = form.avgCookiesPerSale.value;
  const newStand = new CookieStand(location, minHourlyCustomers, maxHourlyCustomers, avgCookiesPerSale, OPENS, CLOSES);
  newStand.getDailyCookieSales();
  // Define index where cookie sales and tosser data is found
  const cookies_idx = 1;
  const tossers_idx = 2;
  // Define html elements to replace or append
  const salesTableID = 'salesTable';
  let salesTable = document.getElementById(salesTableID);
  let salesTableBody = salesTable.querySelector('tbody');
  const tossersTableID = 'tossersTable';
  let tossersTable = document.getElementById(tossersTableID);
  let tossersTableBody = tossersTable.querySelector('tbody');
  //Check if the location added is a new location and update the totals
  if (isNewCookieStand()) {
    updateTableBodies(true);
  } else {
    updateTableBodies(false);
  }
  updateTableFooter(salesTable, totalHourlyCookies);
  updateTableFooter(tossersTable, totalHourlyTossers);

  // This function checks if the HTML tag for the sales table row is used in the table header.
  function isNewCookieStand() {
    const trArray = salesTableBody.getElementsByTagName('tr');
    const tableRowID = newStand.generateTableRowID(salesTableID);
    for (let i in trArray) {
      // Check for table body row headers case insensitively
      if (trArray[i].id === tableRowID) {
        return false;
      }
    }
    return true;
  }

  // This function either adds the new location or updates an old location
  function updateTableBodies(isNewStand) {
    if (isNewStand) {
      salesTableBody.appendChild(newStand.renderSalesDataRow(salesTableID, cookies_idx, true));
      tossersTableBody.appendChild(newStand.renderSalesDataRow(tossersTableID, tossers_idx, false));
      for (let i = 0; i < newStand.dailySalesInfo.length; i++) {
        totalHourlyCookies[i] += newStand.dailySalesInfo[i][cookies_idx];
        totalHourlyTossers[i] += newStand.dailySalesInfo[i][tossers_idx];
      }
      //Update the final index of the totalHourlyCookies Array
      totalHourlyCookies[totalHourlyCookies.length - 1] += newStand.getTotalDailyInfo(cookies_idx);
    } else {
      newStand.replaceSalesDataRow(salesTableID, totalHourlyCookies, cookies_idx, true);
      newStand.replaceSalesDataRow(tossersTableID, totalHourlyTossers, tossers_idx, false);
    }
  }

  // This function updates the values in the table footer
  function updateTableFooter(table, totalsArray) {
    let tfoot = table.querySelector('tfoot');
    let tdArray = tfoot.querySelectorAll('td');
    for (let i = 0; i < totalsArray.length; i++) {
      tdArray[i].innerText = totalsArray[i];
    }
  }

  form.reset();
}

generateDailySalesTables();
