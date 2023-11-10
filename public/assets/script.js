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
    return {
        year: isNaN(year) ? today.getFullYear() : year,
        month: isNaN(month) ? today.getMonth() + 1 : month,
        date: isNaN(date) ? today.getDate() : date,
    };
}

function processPos(latitude, longitude) {
    // default coordinates: Halifax, NS, Canada
    const defaultPos = { latitude: 44.65, longitude: -63.57 };
    return {
        latitude: isNaN(latitude) ? defaultPos.latitude : latitude,
        longitude: isNaN(longitude) ? defaultPos.longitude : longitude,
    };
}

function getPrayerTimes(params) {
    const date = processDate(params.year, params.month, params.date);
    const pos = processPos(params.latitude, params.longitude);
    prayTimes.setMethod("ISNA");
    const times = prayTimes.getTimes(
        [date.year, date.month, date.date],
        [pos.latitude, pos.longitude],
        "auto",
        "auto",
        "12h"
    );
    return {
        meta: {
            date: date,
            position: pos,
        },
        data: {
            fajr: times.fajr,
            zuhr: times.dhuhr,
            asr: times.asr,
            maghrib: times.maghrib,
            isha: times.isha,
        },
    };
}

function apiSite() {
    $$("body").innerText = JSON.stringify(
        getPrayerTimes(parseURL(window.location.search))
    );
}

function userSite() {
    const prayerTimes = getPrayerTimes(parseURL(window.location.search));
    for (const prayer in prayerTimes.data) {
        $$(`#prayer-${prayer}`).innerText =
            prayer[0].toUpperCase() + prayer.slice(1);
        $$(`#time-${prayer}`).innerText =
            prayerTimes.data[prayer].toUpperCase();
        $$("#latitude").innerText = prayerTimes.meta.position.latitude;
        $$("#longitude").innerText = prayerTimes.meta.position.longitude;
        $$("#date").innerText = Object.values(prayerTimes.meta.date).join("-");
    }
}
