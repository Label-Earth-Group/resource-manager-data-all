import React, { useContext, useEffect, useState } from 'react';
import { SamContext } from '../context/context.tsx';
import { ToolProps } from '../helpers/Interfaces';
import * as _ from 'underscore';
import Box from '@mui/material/Box';

const Tool = ({ handleMouseMove }: ToolProps) => {
  const {
    image: [image],
    maskImg: [maskImg, setMaskImg]
  } = useContext(SamContext)!;

  const [shouldFitToWidth, setShouldFitToWidth] = useState(true);
  const bodyEl = document.body;

  const fitToPage = () => {
    if (!image) return;
    const imageAspectRatio = image.width / image.height;
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    setShouldFitToWidth(imageAspectRatio > screenAspectRatio);
  };

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === bodyEl) {
        fitToPage();
      }
    }
  });

  useEffect(() => {
    fitToPage();
    resizeObserver.observe(bodyEl);
    return () => {
      resizeObserver.unobserve(bodyEl);
    };
  }, [image]);

  return (
    <>
      {image && (
        <Box
          component="img"
          onMouseMove={handleMouseMove}
          onMouseOut={() => _.defer(() => setMaskImg(null))}
          onTouchStart={handleMouseMove}
          src={image.src}
          sx={{
            width: shouldFitToWidth ? '100%' : 'auto',
            height: shouldFitToWidth ? 'auto' : '100%'
          }}
        />
      )}
      {maskImg && (
        <Box
          component="img"
          src={maskImg.src}
          sx={{
            position: 'absolute',
            opacity: 0.4,
            pointerEvents: 'none',
            width: shouldFitToWidth ? '100%' : 'auto',
            height: shouldFitToWidth ? 'auto' : '100%'
          }}
        />
      )}
    </>
  );
};

export default Tool;
