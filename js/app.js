'use strict';

//Define each cookie shop as an object literal (I hate all the copy/paste here...I know constructors are coming)
const seattle = {
  location : 'Seattle',
  minHourlyCustomers: 23,
  maxHourlyCustomers: 65,
  avgCookiesPerSale: 6.3,
  //This method returns a random integer between min and max (inclusive)
  generateHourlyCustomers() {
    const min = this.minHourlyCustomers;
    const max = this.maxHourlyCustomers;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  generateHourlyCookies() {
    const avg = this.avgCookiesPerSale;
    return Math.round(avg * this.generateHourlyCustomers());
  },
  //Adding functionality to change the opening and closing time, which feeds into the getDailyCookieSales method
  openingTime: '06:00',
  closingTime: '20:00',
  //This method converts a 24 hour format string to an iterable and operatable number
  hourAsNumber(hourAsString) {
    const timeArr = hourAsString.split(':');
    return Number(timeArr[0]) + Number(timeArr[1]) / 60;
  },
  //This method returns the current 12 hour format time
  getCurrentHour(currentHourAsNumber) {
    const hours = Math.floor(currentHourAsNumber) % 12 || 12;
    let minutes = Math.round((currentHourAsNumber % 1) * 60);
    //If minutes is in the single digits, format with a leading 0
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const period = currentHourAsNumber < 12 ? 'AM' : 'PM';

    return `${hours}:${minutes} ${period}`;
  },
  getDailyCookieSales() {
    const openingTimeAsNumber = this.hourAsNumber(this.openingTime);
    const ClosingTimeAsNumber = this.hourAsNumber(this.closingTime);
    const totalOperatingHours = ClosingTimeAsNumber - openingTimeAsNumber;
    const dailySalesInfo = [];
    //Iterate hourly to populate the daily sales information
    for (let i = 0; i < totalOperatingHours; i++) {
      //If the shop is open for less than an hour until close, factor the cookies sold
      let timeRemainder = totalOperatingHours - i;
      let remainderFactor = timeRemainder < 1 ? timeRemainder : 1;

      let currentTime = this.getCurrentHour(openingTimeAsNumber + i);
      let currentCookieSales = Math.round(this.generateHourlyCookies() * remainderFactor);
      dailySalesInfo.push([currentTime, currentCookieSales]);
    }
    return dailySalesInfo;
  },
  createDailySalesList() {
    //Define indices where sales data is found
    const HOUR = 0;
    const COOKIES = 1;
    const location = this.location;
    //Create an h2 heading
    const newH2 = document.createElement('h2');
    newH2.innerText = location;
    //Create an unordered list and iterate through the salesInfo array to create list items
    const newUl = document.createElement('ul');
    //Use canonical HTML styling (all lowercase for ids)
    newUl.id = location[0].toLowerCase() + location.slice(1);
    const salesInfo = this.getDailyCookieSales();
    for (let i = 0; i < salesInfo.length; i++) {
      let hour = salesInfo[i][HOUR];
      let cookies = salesInfo[i][COOKIES];
      let newLi = document.createElement('li');
      newLi.innerText = `${hour}: ${cookies} cookies`;
      newUl.appendChild(newLi);
    }
    newH2.appendChild(newUl);
    document.body.appendChild(newH2);
  },
};

const tokyo = {
  location : 'Tokyo',
  minHourlyCustomers: 3,
  maxHourlyCustomers: 24,
  avgCookiesPerSale: 1.2,
  //This method returns a random integer between min and max (inclusive)
  generateHourlyCustomers() {
    const min = this.minHourlyCustomers;
    const max = this.maxHourlyCustomers;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  generateHourlyCookies() {
    const avg = this.avgCookiesPerSale;
    return Math.round(avg * this.generateHourlyCustomers());
  },
  //Adding functionality to change the opening and closing time, which feeds into the getDailyCookieSales method
  openingTime: '06:00',
  closingTime: '20:00',
  //This method converts a 24 hour format string to an iterable and operatable number
  hourAsNumber(hourAsString) {
    const timeArr = hourAsString.split(':');
    return Number(timeArr[0]) + Number(timeArr[1]) / 60;
  },
  //This method returns the current 12 hour format time
  getCurrentHour(currentHourAsNumber) {
    const hours = Math.floor(currentHourAsNumber) % 12 || 12;
    let minutes = Math.round((currentHourAsNumber % 1) * 60);
    //If minutes is in the single digits, format with a leading 0
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const period = currentHourAsNumber < 12 ? 'AM' : 'PM';

    return `${hours}:${minutes} ${period}`;
  },
  getDailyCookieSales() {
    const openingTimeAsNumber = this.hourAsNumber(this.openingTime);
    const ClosingTimeAsNumber = this.hourAsNumber(this.closingTime);
    const totalOperatingHours = ClosingTimeAsNumber - openingTimeAsNumber;
    const dailySalesInfo = [];
    //Iterate hourly to populate the daily sales information
    for (let i = 0; i < totalOperatingHours; i++) {
      //If the shop is open for less than an hour until close, factor the cookies sold
      let timeRemainder = totalOperatingHours - i;
      let remainderFactor = timeRemainder < 1 ? timeRemainder : 1;

      let currentTime = this.getCurrentHour(openingTimeAsNumber + i);
      let currentCookieSales = Math.round(this.generateHourlyCookies() * remainderFactor);
      dailySalesInfo.push([currentTime, currentCookieSales]);
    }
    return dailySalesInfo;
  },
  createDailySalesList() {
    //Define indices where sales data is found
    const HOUR = 0;
    const COOKIES = 1;
    const location = this.location;
    //Create an h2 heading
    const newH2 = document.createElement('h2');
    newH2.innerText = location;
    //Create an unordered list and iterate through the salesInfo array to create list items
    const newUl = document.createElement('ul');
    //Use canonical HTML styling (all lowercase for ids)
    newUl.id = location[0].toLowerCase() + location.slice(1);
    const salesInfo = this.getDailyCookieSales();
    for (let i = 0; i < salesInfo.length; i++) {
      let hour = salesInfo[i][HOUR];
      let cookies = salesInfo[i][COOKIES];
      let newLi = document.createElement('li');
      newLi.innerText = `${hour}: ${cookies} cookies`;
      newUl.appendChild(newLi);
    }
    newH2.appendChild(newUl);
    document.body.appendChild(newH2);
  },
};

const dubai = {
  location : 'Dubai',
  minHourlyCustomers: 11,
  maxHourlyCustomers: 38,
  avgCookiesPerSale: 3.7,
  //This method returns a random integer between min and max (inclusive)
  generateHourlyCustomers() {
    const min = this.minHourlyCustomers;
    const max = this.maxHourlyCustomers;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  generateHourlyCookies() {
    const avg = this.avgCookiesPerSale;
    return Math.round(avg * this.generateHourlyCustomers());
  },
  //Adding functionality to change the opening and closing time, which feeds into the getDailyCookieSales method
  openingTime: '06:00',
  closingTime: '20:00',
  //This method converts a 24 hour format string to an iterable and operatable number
  hourAsNumber(hourAsString) {
    const timeArr = hourAsString.split(':');
    return Number(timeArr[0]) + Number(timeArr[1]) / 60;
  },
  //This method returns the current 12 hour format time
  getCurrentHour(currentHourAsNumber) {
    const hours = Math.floor(currentHourAsNumber) % 12 || 12;
    let minutes = Math.round((currentHourAsNumber % 1) * 60);
    //If minutes is in the single digits, format with a leading 0
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const period = currentHourAsNumber < 12 ? 'AM' : 'PM';

    return `${hours}:${minutes} ${period}`;
  },
  getDailyCookieSales() {
    const openingTimeAsNumber = this.hourAsNumber(this.openingTime);
    const ClosingTimeAsNumber = this.hourAsNumber(this.closingTime);
    const totalOperatingHours = ClosingTimeAsNumber - openingTimeAsNumber;
    const dailySalesInfo = [];
    //Iterate hourly to populate the daily sales information
    for (let i = 0; i < totalOperatingHours; i++) {
      //If the shop is open for less than an hour until close, factor the cookies sold
      let timeRemainder = totalOperatingHours - i;
      let remainderFactor = timeRemainder < 1 ? timeRemainder : 1;

      let currentTime = this.getCurrentHour(openingTimeAsNumber + i);
      let currentCookieSales = Math.round(this.generateHourlyCookies() * remainderFactor);
      dailySalesInfo.push([currentTime, currentCookieSales]);
    }
    return dailySalesInfo;
  },
  createDailySalesList() {
    //Define indices where sales data is found
    const HOUR = 0;
    const COOKIES = 1;
    const location = this.location;
    //Create an h2 heading
    const newH2 = document.createElement('h2');
    newH2.innerText = location;
    //Create an unordered list and iterate through the salesInfo array to create list items
    const newUl = document.createElement('ul');
    //Use canonical HTML styling (all lowercase for ids)
    newUl.id = location[0].toLowerCase() + location.slice(1);
    const salesInfo = this.getDailyCookieSales();
    for (let i = 0; i < salesInfo.length; i++) {
      let hour = salesInfo[i][HOUR];
      let cookies = salesInfo[i][COOKIES];
      let newLi = document.createElement('li');
      newLi.innerText = `${hour}: ${cookies} cookies`;
      newUl.appendChild(newLi);
    }
    newH2.appendChild(newUl);
    document.body.appendChild(newH2);
  },
};

const paris = {
  location : 'Paris',
  minHourlyCustomers: 20,
  maxHourlyCustomers: 38,
  avgCookiesPerSale: 2.3,
  //This method returns a random integer between min and max (inclusive)
  generateHourlyCustomers() {
    const min = this.minHourlyCustomers;
    const max = this.maxHourlyCustomers;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  generateHourlyCookies() {
    const avg = this.avgCookiesPerSale;
    return Math.round(avg * this.generateHourlyCustomers());
  },
  //Adding functionality to change the opening and closing time, which feeds into the getDailyCookieSales method
  openingTime: '06:00',
  closingTime: '20:00',
  //This method converts a 24 hour format string to an iterable and operatable number
  hourAsNumber(hourAsString) {
    const timeArr = hourAsString.split(':');
    return Number(timeArr[0]) + Number(timeArr[1]) / 60;
  },
  //This method returns the current 12 hour format time
  getCurrentHour(currentHourAsNumber) {
    const hours = Math.floor(currentHourAsNumber) % 12 || 12;
    let minutes = Math.round((currentHourAsNumber % 1) * 60);
    //If minutes is in the single digits, format with a leading 0
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const period = currentHourAsNumber < 12 ? 'AM' : 'PM';

    return `${hours}:${minutes} ${period}`;
  },
  getDailyCookieSales() {
    const openingTimeAsNumber = this.hourAsNumber(this.openingTime);
    const ClosingTimeAsNumber = this.hourAsNumber(this.closingTime);
    const totalOperatingHours = ClosingTimeAsNumber - openingTimeAsNumber;
    const dailySalesInfo = [];
    //Iterate hourly to populate the daily sales information
    for (let i = 0; i < totalOperatingHours; i++) {
      //If the shop is open for less than an hour until close, factor the cookies sold
      let timeRemainder = totalOperatingHours - i;
      let remainderFactor = timeRemainder < 1 ? timeRemainder : 1;

      let currentTime = this.getCurrentHour(openingTimeAsNumber + i);
      let currentCookieSales = Math.round(this.generateHourlyCookies() * remainderFactor);
      dailySalesInfo.push([currentTime, currentCookieSales]);
    }
    return dailySalesInfo;
  },
  createDailySalesList() {
    //Define indices where sales data is found
    const HOUR = 0;
    const COOKIES = 1;
    const location = this.location;
    //Create an h2 heading
    const newH2 = document.createElement('h2');
    newH2.innerText = location;
    //Create an unordered list and iterate through the salesInfo array to create list items
    const newUl = document.createElement('ul');
    //Use canonical HTML styling (all lowercase for ids)
    newUl.id = location[0].toLowerCase() + location.slice(1);
    const salesInfo = this.getDailyCookieSales();
    for (let i = 0; i < salesInfo.length; i++) {
      let hour = salesInfo[i][HOUR];
      let cookies = salesInfo[i][COOKIES];
      let newLi = document.createElement('li');
      newLi.innerText = `${hour}: ${cookies} cookies`;
      newUl.appendChild(newLi);
    }
    newH2.appendChild(newUl);
    document.body.appendChild(newH2);
  },
};

const lima = {
  location : 'Lima',
  minHourlyCustomers: 2,
  maxHourlyCustomers: 16,
  avgCookiesPerSale: 4.6,
  //This method returns a random integer between min and max (inclusive)
  generateHourlyCustomers() {
    const min = this.minHourlyCustomers;
    const max = this.maxHourlyCustomers;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  generateHourlyCookies() {
    const avg = this.avgCookiesPerSale;
    return Math.round(avg * this.generateHourlyCustomers());
  },
  //Adding functionality to change the opening and closing time, which feeds into the getDailyCookieSales method
  openingTime: '06:00',
  closingTime: '20:00',
  //This method converts a 24 hour format string to an iterable and operatable number
  hourAsNumber(hourAsString) {
    const timeArr = hourAsString.split(':');
    return Number(timeArr[0]) + Number(timeArr[1]) / 60;
  },
  //This method returns the current 12 hour format time
  getCurrentHour(currentHourAsNumber) {
    const hours = Math.floor(currentHourAsNumber) % 12 || 12;
    let minutes = Math.round((currentHourAsNumber % 1) * 60);
    //If minutes is in the single digits, format with a leading 0
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const period = currentHourAsNumber < 12 ? 'AM' : 'PM';

    return `${hours}:${minutes} ${period}`;
  },
  getDailyCookieSales() {
    const openingTimeAsNumber = this.hourAsNumber(this.openingTime);
    const ClosingTimeAsNumber = this.hourAsNumber(this.closingTime);
    const totalOperatingHours = ClosingTimeAsNumber - openingTimeAsNumber;
    const dailySalesInfo = [];
    //Iterate hourly to populate the daily sales information
    for (let i = 0; i < totalOperatingHours; i++) {
      //If the shop is open for less than an hour until close, factor the cookies sold
      let timeRemainder = totalOperatingHours - i;
      let remainderFactor = timeRemainder < 1 ? timeRemainder : 1;

      let currentTime = this.getCurrentHour(openingTimeAsNumber + i);
      let currentCookieSales = Math.round(this.generateHourlyCookies() * remainderFactor);
      dailySalesInfo.push([currentTime, currentCookieSales]);
    }
    return dailySalesInfo;
  },
  createDailySalesList() {
    //Define indices where sales data is found
    const HOUR = 0;
    const COOKIES = 1;
    const location = this.location;
    //Create an h2 heading
    const newH2 = document.createElement('h2');
    newH2.innerText = location;
    //Create an unordered list and iterate through the salesInfo array to create list items
    const newUl = document.createElement('ul');
    //Use canonical HTML styling (all lowercase for ids)
    newUl.id = location[0].toLowerCase() + location.slice(1);
    const salesInfo = this.getDailyCookieSales();
    for (let i = 0; i < salesInfo.length; i++) {
      let hour = salesInfo[i][HOUR];
      let cookies = salesInfo[i][COOKIES];
      let newLi = document.createElement('li');
      newLi.innerText = `${hour}: ${cookies} cookies`;
      newUl.appendChild(newLi);
    }
    newH2.appendChild(newUl);
    document.body.appendChild(newH2);
  },
};

//Create sales lists for all locations
seattle.createDailySalesList();
tokyo.createDailySalesList();
dubai.createDailySalesList();
paris.createDailySalesList();
lima.createDailySalesList();
