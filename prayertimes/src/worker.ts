/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import prayTimes from "./PrayTimes.js";

export default {
  async fetch(request, env, ctx) {
    return new Response(JSON.stringify(prayTimes.getTimes(new Date(), [44.65, -63.69])));
  },
};