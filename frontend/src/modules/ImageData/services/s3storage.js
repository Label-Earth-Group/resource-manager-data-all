import AWS from 'aws-sdk';

export const getBucketClient = () => {
  AWS.config.update({
    accessKeyId: 'AKIASSNSOCEYNCSEEAGC',
    secretAccessKey: '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'
  });

  return new AWS.S3({
    region: 'us-west-2'
  });
};
