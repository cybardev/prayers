// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

function getPrayerTimes() {
    fetch(`https://prayertimes.cybar.dev/${window.location.search}`)
        .then((response) => response.json())
        .then((body) => {
            // metadata
            $$("#date").innerText = Object.values(body.meta.date).join("-");
            $$("#latitude").innerText = body.meta.position.latitude;
            $$("#longitude").innerText = body.meta.position.longitude;
            // prayer times
            for (const prayer in body.data) {
                $$(`#prayer-${prayer}`).innerText =
                    prayer[0].toUpperCase() + prayer.slice(1);
                $$(`#time-${prayer}`).innerText =
                    body.data[prayer].toUpperCase();
            }
        })
        .catch((err) => console.error(err));
}
