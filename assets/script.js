function parseURL() {
    const args = new URLSearchParams(window.location.search);
    return {
        year: args.get("year"),
        month: args.get("month"),
        date: args.get("date"),
        lat: args.get("lat"),
        lon: args.get("lon"),
    };
}
