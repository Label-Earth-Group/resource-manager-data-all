import React from 'react';
import {
  Slider,
  Typography,
  Box,
  TextField,
  InputAdornment
} from '@mui/material';

export const CloudCoverSlider = ({ value, onChange }) => {
  const handleSliderChange = (event, newValue) => {
    if (newValue[0] < newValue[1]) {
      onChange(newValue);
    }
  };

  const handleInputChange = (index, event) => {
    const newValue = [...value];
    newValue[index] = Number(event.target.value);
    if (newValue[0] < newValue[1]) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    let newValue = [...value];
    if (newValue[0] < 0) {
      newValue[0] = 0;
    }
    if (newValue[1] > 100) {
      newValue[1] = 100;
    }
    if (newValue[0] >= newValue[1]) {
      newValue = [Math.min(newValue[0], newValue[1] - 1), newValue[1]];
    }
    onChange(newValue);
  };

  return (
    <>
      <Typography variant="body1">云量</Typography>
      <Box
        width={'100%'}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <TextField
          value={value[0]}
          onChange={(event) => handleInputChange(0, event)}
          onBlur={handleBlur}
          inputProps={{
            step: 1,
            min: 0,
            max: 100,
            type: 'number',
            'aria-labelledby': 'input-slider'
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>
          }}
          size="small"
          margin="dense"
          style={{ width: 100 }}
        />
        <Slider
          value={value}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          step={1}
          style={{ width: 150 }}
        />
        <TextField
          value={value[1]}
          onChange={(event) => handleInputChange(1, event)}
          onBlur={handleBlur}
          inputProps={{
            step: 1,
            min: 0,
            max: 100,
            type: 'number',
            'aria-labelledby': 'input-slider'
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>
          }}
          size="small"
          margin="dense"
          style={{ width: 100 }}
        />
      </Box>
    </>
  );
};
