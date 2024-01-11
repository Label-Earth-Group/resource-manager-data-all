import AWS from 'aws-sdk';

export const getBucketClient = () => {
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_STORAGE_SECRET_ACCESS_KEY
  });

  return new AWS.S3({
    region: 'us-west-2'
  });
};
