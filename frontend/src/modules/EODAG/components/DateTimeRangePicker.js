import React from 'react';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

export function DateRangePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) {
  const clearStartDate = () => setStartDate(null);
  const clearEndDate = () => setEndDate(null);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        sx={{ mr: 2, mb: 2 }}
        label="Start Date"
        openTo="year"
        views={['year', 'month', 'day']}
        value={startDate}
        maxDate={endDate}
        onAccept={(newValue) => setStartDate(newValue)}
        slotProps={{
          inputAdornment: {
            position: 'start'
          },
          textField: {
            InputProps: {
              endAdornment: (
                <IconButton onClick={clearStartDate}>
                  <CloseIcon />
                </IconButton>
              )
            }
          }
        }}
      />
      <DateTimePicker
        label="End Date"
        openTo="day"
        views={['year', 'month', 'day']}
        value={endDate}
        minDate={startDate}
        onChange={(newValue) => setEndDate(newValue)}
        sx={{ mr: 2, mb: 2 }}
        slotProps={{
          inputAdornment: {
            position: 'start'
          },
          textField: {
            InputProps: {
              endAdornment: (
                <IconButton onClick={clearEndDate}>
                  <CloseIcon />
                </IconButton>
              )
            }
          }
        }}
      />
    </LocalizationProvider>
  );
}
