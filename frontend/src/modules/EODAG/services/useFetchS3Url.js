import { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';

export const useFetchS3Url = (s3Path, accessLevel = 'public') => {
  const [srcUrl, setSourceUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await Storage.get(s3Path, { level: accessLevel });
        setSourceUrl(url);
      } catch (error) {
        console.error('Error fetching the image from S3:', error);
      }
    };

    fetchImage();
  }, [s3Path, accessLevel]);

  return srcUrl;
};
