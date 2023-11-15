import successResponse from "../../src/prayertimes.mjs";

export function onRequestGet(ctx) {
    return successResponse(ctx.request.url);
}
