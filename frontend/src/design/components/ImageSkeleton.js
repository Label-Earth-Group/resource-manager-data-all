import { Skeleton } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';

export const ImageSkeleton = (props) => {
  const [isDone, setDone] = useState(false);
  return (
    <>
      {!isDone && <Skeleton width={props.width} />}
      <img
        onLoad={() => setDone(true)}
        alt={props.alt || 'Image'}
        width={isDone ? props.width : 0}
        {...props}
      />
    </>
  );
};

ImageSkeleton.propTypes = {
  width: PropTypes.number.isRequired,
  alt: PropTypes.string,
  src: PropTypes.string
};
