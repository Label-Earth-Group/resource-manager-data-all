import React from 'react';
import {
  IconButton,
  TextField,
  Box,
  Stack,
  InputAdornment,
  Typography
} from '@mui/material';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import zhCN from 'date-fns/locale/zh-CN';
import CloseIcon from '@mui/icons-material/Close';

export function DateRangePicker({ dateRange, setDateRange }) {
  const clearStartDate = () => setDateRange([null, dateRange[1]]);
  const clearEndDate = () => setDateRange([dateRange[0], null]);

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
        <Typography component="span" variant="body1" sx={{ mr: 1 }}>
          时间范围：
        </Typography>
        <DateTimePicker
          openTo="month"
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
                  <IconButton onClick={clearStartDate}>
                    <CloseIcon />
                  </IconButton>
                )
              },
              size: 'small'
            }
          }}
        />
        <Typography component="span" variant="body1" sx={{ mx: 1 }}>
          --
        </Typography>
        <DateTimePicker
          openTo="month"
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
                  <IconButton onClick={clearEndDate}>
                    <CloseIcon />
                  </IconButton>
                )
              },
              size: 'small'
            }
          }}
        />
      </LocalizationProvider>
    </Stack>
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
