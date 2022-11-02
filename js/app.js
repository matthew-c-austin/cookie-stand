'use strict';

//Define each cookie shop as an object literal (I hate all the copy/paste here...I know constructors are coming)
const seattle = {
  minHourlyCustomers: 23,
  maxHourlyCustomers: 65,
  avgCookiesPerSale: 6.3,
  //This function returns a random integer between min and max (inclusive)
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
  //This function converts a 24 hour format string to an iterable and operatable number
  hourAsNumber(hourAsString) {
    const timeArr = hourAsString.split(':');
    return Number(timeArr[0]) + timeArr[1] / 60;
  },
  //This function returns the current 12 hour format time
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
  }
};

console.log(seattle.getDailyCookieSales());
