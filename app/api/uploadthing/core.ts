// app/api/uploadthing/core.ts
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";  // ← import from here

const f = createUploadthing();

export const ourFileRouter = {
  topicImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ }) => {           // ← req param is required
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");  // ← UploadThingError
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Runs on your server after the upload is confirmed
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;