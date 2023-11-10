// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

function parseURL(url) {
    return new URL(url).search;
}

function getPrayerTimes(params) {
    const res = null;
    // TODO: fetch prayer times from API
    return res;
}

function apiSite() {
    $$("body").innerText = JSON.stringify(
        getPrayerTimes(parseURL(window.location.search)),
        undefined,
        2
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
