import React from 'react';
import {
  IconButton,
  TextField,
  Box,
  InputAdornment,
  Typography
} from '@mui/material';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';

export function DateRangePicker({ dateRange, setDateRange }) {
  const clearStartDate = () => setDateRange([null, dateRange[1]]);
  const clearEndDate = () => setDateRange([dateRange[0], null]);

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Typography component="span" sx={{ mx: 1, lineHeight: '40px' }}>
          时间范围：
        </Typography>
        <DateTimePicker
          openTo="year"
          views={['year', 'month', 'day']}
          format="yyyy-MM-dd"
          value={dateRange[0]}
          maxDate={dateRange[1]}
          onAccept={(newValue) => setDateRange([newValue, dateRange[1]])}
          slotProps={{
            inputAdornment: {
              position: 'start'
            },
            textField: {
              InputProps: {
                endAdornment: (
                  <IconButton onClick={clearStartDate} sx={{ px: 0, py: 1 }}>
                    <CloseIcon />
                  </IconButton>
                )
              },
              inputProps: {
                sx: { padding: 0 }
              }
            }
          }}
        />
        <Typography component="span" sx={{ mx: 1, lineHeight: '40px' }}>
          --
        </Typography>
        <DateTimePicker
          openTo="year"
          views={['year', 'month', 'day']}
          format="yyyy-MM-dd"
          value={dateRange[1]}
          minDate={dateRange[0]}
          onChange={(newValue) => setDateRange([dateRange[0], newValue])}
          slotProps={{
            inputAdornment: {
              position: 'start'
            },
            textField: {
              InputProps: {
                endAdornment: (
                  <IconButton onClick={clearEndDate} sx={{ px: 0, py: 1 }}>
                    <CloseIcon />
                  </IconButton>
                )
              },
              inputProps: {
                sx: { padding: 0 }
              }
            }
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}

export function CustomDateRangePicker({ dateRange, setDateRange }) {
  const clearStartDate = () => setDateRange([null, dateRange[1]]);
  const clearEndDate = () => setDateRange([dateRange[0], null]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <DatePicker
          label="Start"
          value={dateRange[0]}
          onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{ mx: 2 }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={clearStartDate}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          )}
        />
        <Box sx={{ mx: 2 }}> - </Box>
        <DatePicker
          label="End"
          value={dateRange[1]}
          onChange={(newValue) => setDateRange([dateRange[0], newValue])}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={clearEndDate}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
}
