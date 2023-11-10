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

function getPrayerTimes(params) {
    prayTimes.setMethod("ISNA");
    const times = prayTimes.getTimes(
        [params.year, params.month, params.date],
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

window.addEventListener("load", () => {
    $$("body").innerHTML = JSON.stringify(
        getPrayerTimes(parseURL(window.location.search))
    );
});
