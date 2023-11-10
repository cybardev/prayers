const $$ = (el) => document.querySelector(el);

function parseURL(url) {
    const args = new URLSearchParams(url);
    return {
        year: parseInt(args.get("year")),
        month: parseInt(args.get("month")),
        date: parseInt(args.get("date")),
        lat: parseFloat(args.get("lat")),
        lon: parseFloat(args.get("lon")),
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

function processPos(lat, lon) {
    const pos = { lat: 0, lon: 0 };
    if (isNaN(lat) || isNaN(lon)) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                pos.lat = pos.coords.latitude;
                pos.lon = pos.coords.longitude;
            });
        }
    }
    return [pos.lat, pos.lon];
}

function getPrayerTimes(params) {
    prayTimes.setMethod("ISNA");
    const times = prayTimes.getTimes(
        processDate(params.year, params.month, params.date),
        [params.lat, params.lon],
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
