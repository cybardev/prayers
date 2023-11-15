import successResponse from "../../src/prayertimes.mjs";

export function onRequestGet(context) {
    return successResponse(context.request.url);
}
