// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

function getPrayerTimes(params) {
    let result = null;
    fetch(`https://prayertimes.cybar.dev/${params}`)
        .then((res) => res.json())
        .then((data) => (result = data))
        .catch((err) => console.log(err));
    return result;
}

function userSite() {
    const prayerTimes = getPrayerTimes(window.location.search);
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
