import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AWSS3Bucket } from 'src/constant/constant';

@Injectable()
export class FileServicesService {
  private readonly logger = new Logger(FileServicesService.name);

  constructor(@Inject(AWSS3Bucket) private s3: S3) {}

  public async createPresignedUrl(
    fileName: string,
    contentType: string
  ): Promise<string> {
    const params = {
      Bucket: `${process.env.APP_NAME}-${process.env.ENVIRONMENT}-demo-app`,
      Key: fileName,
      Expires: 60 * 5, // Expires in 5 minutes
      ContentType: contentType,
      ACL: 'private',
    };

    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('putObject', params, (error, url) => {
        if (error) {
          reject(error);
        } else {
          resolve(url);
        }
      });
    });
  }
  /**
   * Gets a dsigned URL for a user upload object in S3.
   *dddd
   * @param key - The object key to get a URL for.
   * @returns The signed URL for the object.
   */
  async getUserUploadsSignedUrl(key: string): Promise<any> {
    const bucket = `${process.env.APP_NAME}-${process.env.ENVIRONMENT}-demo-app`;
    const url = await this.getSignedUrl(key, bucket);
    return url;
  }

  /**
   * Generates a pre-signed URL for accessing an object in an S3 bucket.
   *
   * @param key - The key (file path) of the object in the S3 bucket.
   * @param bucket - The name of the S3 bucket.
   * @returns A pre-signed URL that can be used to access the object for a limited time (5 minutes).
   * @throws BadRequestException - If the specified key does not exist in the S3 bucket.
   */
  async getSignedUrl(key: string, bucket: string): Promise<string> {
    //Get a pre-signed URL for a given operation name.
    try {
      const checkKeyExists = await this.checkKeyExists(bucket, key);
      if (!checkKeyExists) {
        return null;
      }      
      const url = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: bucket,
        Key: key,
      });
      return url;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
