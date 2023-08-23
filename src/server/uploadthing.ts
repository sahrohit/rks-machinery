/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { authOptions } from "./auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "128MB", maxFileCount: 10 } })
    .middleware(
      async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
        const user = await getServerSession(req, res, authOptions);
        if (!user) throw new Error("Unauthorized");
        return { user };
      }
    )
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete for email:", metadata.user.user.email);
      console.log("file url", file.url);
    }),
  categoryImageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(
      async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
        const user = await getServerSession(req, res, authOptions);
        if (!user) throw new Error("Unauthorized");
        return { user };
      }
    )
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete for email:", metadata.user.user.email);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
