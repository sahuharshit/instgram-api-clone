import * as AWS from 'aws-sdk';
import { AWSS3Bucket, AWS_REGION } from '../constant/constant';

/**
 *
 * @description This module exports a default object that provides a S3Client instance to consuming components.
 * The S3Client is instantiated using the AWS_S3_REGION environment variable as the region and forcePathStyle set to true.
 * The object is provided using the S3ClientProviderToken key for injection in a dependency injection container.
 */
export default {
  provide: AWSS3Bucket,
  useFactory() {
    return new AWS.S3({
      region: process.env.AWS_REGION || AWS_REGION,
      signatureVersion: 'v4',
    });
  },
};
