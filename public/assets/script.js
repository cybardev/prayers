// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

function parseURL(url) {
    const args = new URLSearchParams(url);
    return {
        year: parseInt(args.get("year")),
        month: parseInt(args.get("month")),
        date: parseInt(args.get("date")),
        latitude: parseFloat(args.get("latitude")),
        longitude: parseFloat(args.get("longitude")),
    };
}

function processDate(year, month, date) {
    const today = new Date();
    return [
        isNaN(year) ? today.getFullYear() : year,
        isNaN(month) ? today.getMonth() + 1 : month,
        isNaN(date) ? today.getDate() : date,
    ];
}

function processPos(latitude, longitude) {
    // default coordinates: Halifax, NS, Canada
    const defaultPos = {
        latitude: 44.65,
        longitude: -63.57,
    };
    return [
        isNaN(latitude) ? defaultPos.latitude : latitude,
        isNaN(longitude) ? defaultPos.longitude : longitude,
    ];
}

function getPrayerTimes(params) {
    prayTimes.setMethod("ISNA");
    const times = prayTimes.getTimes(
        processDate(params.year, params.month, params.date),
        processPos(params.latitude, params.longitude),
        "auto",
        "auto",
        "12h"
    );
    return {
        fajr: times.fajr,
        zuhr: times.dhuhr,
        asr: times.asr,
        maghrib: times.maghrib,
        isha: times.isha,
    };
}

function apiSite() {
    $$("body").innerText = JSON.stringify(
        getPrayerTimes(parseURL(window.location.search))
    );
}

function userSite() {
    const prayerTimes = getPrayerTimes(parseURL(window.location.search));
    for (const prayer in prayerTimes) {
        $$(`#prayer-${prayer}`).innerText =
            prayer[0].toUpperCase() + prayer.slice(1);
        $$(`#time-${prayer}`).innerText = prayerTimes[prayer].toUpperCase();
    }
}
