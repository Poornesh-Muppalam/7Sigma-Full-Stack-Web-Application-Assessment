import { FastifyInstance } from "fastify";
import { Storage } from "@google-cloud/storage";

export default async function protectedRoutes(fastify: FastifyInstance) {
  fastify.post("/protectedUpload", async (request: any, reply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({ message: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");

    let user;
    try {
      user = (fastify as any).jwt.verify(token); // 👈 FIX for TS error
    } catch (err) {
      return reply.status(403).send({ message: "Invalid token" });
    }

    const data = await request.file(); // 👈 works at runtime, no need to change logic

    if (!data) {
      return reply.status(400).send({ message: "No file uploaded" });
    }

    const filename = `${Date.now()}_${data.filename}`;

    const storage = new Storage({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);
    const blob = bucket.file(filename);

    const stream = blob.createWriteStream({
      resumable: false,
      contentType: data.mimetype,
    });

    await new Promise<void>((resolve, reject) => {
      data.file.pipe(stream).on("finish", resolve).on("error", reject);
    });

    fastify.log.info(`📤 Uploaded file: ${filename}`);

    (fastify as any).io.emit("image_status", {
      status: "Upload complete",
      filename,
    });
    

    return reply.send({ message: "Upload successful", filename });
  });
}
