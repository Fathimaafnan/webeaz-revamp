import "server-only";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export type MediaStorageStatus = {
  configured: boolean;
  missing: string[];
};

type StorageConfig = {
  bucket: string;
  publicBaseUrl: string;
  region: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
};

export class MediaStorageConfigurationError extends Error {
  readonly missing: string[];

  constructor(missing: string[]) {
    super(`S3-compatible media storage is not configured. Missing: ${missing.join(", ")}.`);
    this.name = "MediaStorageConfigurationError";
    this.missing = missing;
  }
}

function getStorageConfig(): StorageConfig {
  const bucket = process.env.S3_BUCKET?.trim();
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");
  const endpoint = process.env.S3_ENDPOINT?.trim() || undefined;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID?.trim() || undefined;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY?.trim() || undefined;
  const missing: string[] = [];

  if (!bucket) missing.push("S3_BUCKET");
  if (!publicBaseUrl) missing.push("S3_PUBLIC_BASE_URL");
  if (Boolean(accessKeyId) !== Boolean(secretAccessKey)) {
    missing.push("both S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY (or neither for IAM credentials)");
  }

  if (publicBaseUrl) {
    try {
      const url = new URL(publicBaseUrl);
      if (
        url.protocol !== "https:" &&
        !(process.env.NODE_ENV !== "production" && url.protocol === "http:")
      ) {
        missing.push("S3_PUBLIC_BASE_URL must use HTTPS in production");
      }
    } catch {
      missing.push("S3_PUBLIC_BASE_URL must be a valid URL");
    }
  }

  if (missing.length > 0) throw new MediaStorageConfigurationError(missing);
  if (!bucket || !publicBaseUrl) {
    throw new MediaStorageConfigurationError(["S3_BUCKET", "S3_PUBLIC_BASE_URL"]);
  }

  return {
    bucket,
    publicBaseUrl,
    region: process.env.S3_REGION?.trim() || "us-east-1",
    endpoint,
    accessKeyId,
    secretAccessKey,
  };
}

export function getMediaStorageStatus(): MediaStorageStatus {
  try {
    getStorageConfig();
    return { configured: true, missing: [] };
  } catch (error) {
    if (error instanceof MediaStorageConfigurationError) {
      return { configured: false, missing: error.missing };
    }
    throw error;
  }
}

function createS3Client(config: StorageConfig): S3Client {
  return new S3Client({
    region: config.region,
    ...(config.endpoint
      ? { endpoint: config.endpoint, forcePathStyle: true }
      : {}),
    ...(config.accessKeyId && config.secretAccessKey
      ? {
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        }
      : {}),
  });
}

function publicUrl(baseUrl: string, key: string): string {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl}/${encodedKey}`;
}

export async function uploadMediaObject(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<{ url: string; storageKey: string }> {
  const config = getStorageConfig();
  const client = createS3Client(config);

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentLength: body.byteLength,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return { url: publicUrl(config.publicBaseUrl, key), storageKey: key };
}

export async function deleteMediaObject(storageKey: string): Promise<void> {
  const config = getStorageConfig();
  const client = createS3Client(config);

  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: storageKey,
    }),
  );
}
