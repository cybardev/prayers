// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

function prayerEntry(name, time) {
    return `<tr><td>${name}</td><td>${time}</td></tr>`;
}

function getPrayerTimes() {
    fetch(`https://prayertimes.cybar.dev/${window.location.search}`)
        .then((response) => response.json())
        .then((body) => {
            // metadata
            $$("#date").innerText = Object.values(body.meta.date).join("-");
            $$("#latitude").innerText = body.meta.position.latitude;
            $$("#longitude").innerText = body.meta.position.longitude;
            // prayer times
            const prayers = $$("#prayers");
            for (const prayer in body.data) {
                prayers.insertAdjacentHTML(
                    "beforeend",
                    prayerEntry(prayer, body.data[prayer])
                );
            }
        })
        .catch((err) => console.error(err));
}
