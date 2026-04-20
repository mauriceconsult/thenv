// app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const runtime = "nodejs"; // ← prevents edge/self-fetch error in dev

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
