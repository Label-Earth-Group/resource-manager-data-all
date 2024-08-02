import { useState, useEffect } from 'react';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();

export const useFetchS3Url = (s3Uri) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const match = s3Uri.match(/^s3:\/\/([^/]+)\/(.+)$/);
    if (!match) setImageSrc(null);
    else {
      const bucketName = match[1];
      const objectKey = match[2];
      const expires = 60; // URL expiry time in seconds

      const params = {
        Bucket: bucketName,
        Key: objectKey,
        Expires: expires,
        RequestPayer: 'requester' // Required for requester pays buckets
      };
      const fetchSignedUrl = async () => {
        try {
          const signedUrl = s3.getSignedUrl('getObject', params);
          setImageSrc(signedUrl);
        } catch (error) {
          console.error('Error fetching the signed URL:', error);
        }
      };

      fetchSignedUrl();
    }
  }, [s3Uri]);

  return imageSrc;
};
