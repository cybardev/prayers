function parseURL() {
    const args = new URLSearchParams(window.location.search);
    const year = parseInt(args.get("year")),
        month = parseInt(args.get("month")),
        date = parseInt(args.get("date")),
        lat = parseFloat(args.get("lat")),
        lon = parseFloat(args.get("lon")),
        timezone = lon / 0.004167;
    return {
        year: year,
        month: month,
        date: date,
        lat: lat,
        lon: lon,
        timezone: timezone,
    };
}

window.addEventListener("load", () => {})