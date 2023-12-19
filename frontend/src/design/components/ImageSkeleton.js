import { Skeleton } from '@mui/material';
import { useState } from 'react';

export function ImageSkeleton(props) {
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
}
