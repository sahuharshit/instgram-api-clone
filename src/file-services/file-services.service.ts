import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { CreateFileServiceDto } from './dto/create-file-service.dto';
import { AWSS3Bucket } from 'src/constant/constant';

@Injectable()
export class FileServicesService {
  private readonly logger = new Logger(FileServicesService.name);

  constructor(@Inject(AWSS3Bucket) private s3: S3) {}

  async generatePresignedUrls(
    createFileServiceDto: CreateFileServiceDto,
  ): Promise<any[]> {
    return Promise.all(
      createFileServiceDto.files.map(async (file) => {
        const subfolderPrefix = file.subfolder ? `${file.subfolder}` : '';
        const fileName = `${subfolderPrefix}${file.fileName}`;
        const tags = file.tags ? file.tags : {};
        const tagsQueryString = this.constructTagsQueryString(tags);

        try {
          const url = await this.createPresignedUrl(
            fileName,
            file.contentType,
            tagsQueryString,
          );
          return { fileName: file.fileName, url };
        } catch (error) {
          this.logger.error(
            `Error generating URL for ${file.fileName}: ${error.message}`,
          );
          throw new BadRequestException(error.message);
        }
      }),
    );
  }

  private constructTagsQueryString(tags?: Record<string, string>): string {
    return tags
      ? Object.entries(tags)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
          )
          .join('&')
      : '';
  }

  private async createPresignedUrl(
    fileName: string,
    contentType: string,
    tagsQueryString: string,
  ): Promise<string> {
    const params = {
      Bucket: `user-uploads`,
      Key: fileName,
      Expires: 60 * 5, // Expires in 5 minutes
      ContentType: contentType,
      ACL: 'private',
      Tagging: tagsQueryString,
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

  async getFileList(prefix = '') {
    try {
      const bucket = `${process.env.APP_NAME}-${process.env.ENVIRONMENT}-user-uploads`;
      const response = await this.s3
        .listObjectsV2({
          Bucket: bucket,
          Prefix: prefix,
          Delimiter: '/',
        })
        .promise();

      const root = { folders: [], files: [] };

      // Folders
      response.CommonPrefixes.forEach(({ Prefix }) => {
        const folderName = Prefix.split('/').slice(-2, -1)[0]; // Get the last folder name before the trailing slash
        root.folders.push({
          id: Buffer.from(Prefix).toString('base64'),
          name: folderName,
          path: Prefix,
        });
      });

      // Prepare to fetch additional details for files
      const fileDetailsPromises = response.Contents.filter(
        ({ Key }) => !Key.endsWith('/'),
      ) // Ignore directories
        .map(async ({ Key, LastModified }) => {
          // Fetch tags for the file
          const tagsResponse = await this.s3
            .getObjectTagging({ Bucket: bucket, Key })
            .promise();
          const tags = tagsResponse.TagSet.reduce(
            (acc, tag) => ({ ...acc, [tag.Key]: tag.Value }),
            {},
          );

          return {
            id: Key,
            name: Key.split('/').pop(),
            path: Key,
            lastModified: LastModified,
            tags,
          };
        });

      // Resolve promises and add file details to the root object
      const filesWithDetails = await Promise.all(fileDetailsPromises);
      root.files = filesWithDetails;

      return root;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Checks if the specified S3 object key exists in the given bucket.
   *
   * @param bucket - The name of the S3 bucket to check.
   * @param key - The key of the S3 object to check.
   * @returns A Promise that resolves to `true` if the object exists, or `false` otherwise.
   */
  async checkKeyExists(bucket: string, key: string): Promise<boolean> {
    try {
      await this.s3.getObject({ Bucket: bucket, Key: key }).promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets a dsigned URL for a user upload object in S3.
   *dddd
   * @param key - The object key to get a URL for.
   * @returns The signed URL for the object.
   */
  async getUserUploadsSignedUrl(key: string): Promise<any> {
    const bucket = `${process.env.APP_NAME}-${process.env.ENVIRONMENT}-user-uploads`;
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

  async deleteUploadedFile(filePath: string): Promise<any> {
    try {
      const response = await this.s3
        .deleteObject({
          Bucket: `${process.env.APP_NAME}-${process.env.ENVIRONMENT}-user-uploads`,
          Key: filePath,
        })
        .promise();
      this.logger.log(`Bucket deleted successfully: ${filePath}`);

      return response;
    } catch (error) {
      this.logger.error(`Error deleting bucket: ${filePath}`, error);
      throw new BadRequestException(`Error deleting bucket: ${error.message}`);
    }
  }
}
