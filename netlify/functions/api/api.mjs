import res from "../../../src/prayerTimes.mjs";

// re-route endpoint to /api
export const config = { path: "/api" };

export default async (req, ctx) => {
    return req.method === "GET"
        ? res.validResponse(req.url)
        : res.invalidResponse();
};
