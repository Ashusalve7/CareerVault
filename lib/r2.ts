// Cloudflare R2 Storage Client (Supports both S3 Client & Direct Cloudflare R2 REST API)
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class CloudflareR2Client {
  private s3Client: S3Client | null = null;
  private accountId: string;
  private apiToken: string;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.accountId = process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN || '';
    const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
    this.bucketName = process.env.R2_BUCKET_NAME || 'careervault';
    this.publicUrl = process.env.R2_PUBLIC_URL || '';

    if (this.accountId && accessKeyId && secretAccessKey && !secretAccessKey.startsWith('http')) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  public isConfigured(): boolean {
    return Boolean((this.s3Client !== null) || (this.accountId && this.apiToken && this.bucketName));
  }

  public async uploadBuffer(key: string, buffer: Buffer, contentType: string): Promise<{ key: string; url: string }> {
    // 1. If S3 credentials available, use S3 Client
    if (this.s3Client) {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);

      const publicUrl = this.publicUrl
        ? `${this.publicUrl.replace(/\/$/, '')}/${key}`
        : `https://${this.bucketName}.${this.accountId}.r2.cloudflarestorage.com/${key}`;

      return { key, url: publicUrl };
    }

    // 2. Direct Cloudflare R2 REST API Upload (using API Token)
    if (this.accountId && this.apiToken && this.bucketName) {
      const r2ApiUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/r2/buckets/${this.bucketName}/objects/${key}`;
      
      const response = await fetch(r2ApiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': contentType || 'application/pdf',
        },
        body: new Uint8Array(buffer),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`R2 REST Upload failed (${response.status}): ${errText}`);
      }

      const publicUrl = this.publicUrl
        ? `${this.publicUrl.replace(/\/$/, '')}/${key}`
        : `https://${this.bucketName}.${this.accountId}.r2.cloudflarestorage.com/${key}`;

      return { key, url: publicUrl };
    }

    // 3. Fallback direct object url
    return {
      key,
      url: `https://${this.bucketName}.r2.cloudflarestorage.com/${key}`,
    };
  }

  public async deleteFile(key: string): Promise<boolean> {
    if (this.s3Client) {
      try {
        await this.s3Client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
        return true;
      } catch {
        return false;
      }
    }

    if (this.accountId && this.apiToken && this.bucketName) {
      try {
        const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/r2/buckets/${this.bucketName}/objects/${key}`;
        const res = await fetch(url, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${this.apiToken}` }
        });
        return res.ok;
      } catch {
        return false;
      }
    }

    return true;
  }
}

export const r2Client = new CloudflareR2Client();
