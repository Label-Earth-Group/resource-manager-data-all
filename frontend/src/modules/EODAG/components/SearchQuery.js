import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Typography,
  TextField,
  LinearProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DateRangePicker } from './DateTimeRangePicker.js';
import { MultiSelectInput } from '../components/MultipleSelect';
import { QuaryableFilters } from './QueryableFilters.js';
import { aiSearchApi } from 'utils/constants.js';
import axios from 'axios';
import React, { useState } from 'react';
import L from 'leaflet';

export const SearchQuery = (props) => {
  const {
    mapRef,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setDrawnItems,
    selectedCollections,
    setSelectedCollections,
    triggerSearch,
    triggerReset
  } = props;

  const [LLMSearchPrompt, setLLMSearchPrompt] = useState('');
  const [pilotError, setPilotError] = useState('');
  const [pilotFetching, setPilotFetching] = useState(false);

  const triggerPilot = async (prompt) => {
    if (!prompt) return;

    setPilotError('');
    setPilotFetching(true);
    try {
      const response = await axios.get(aiSearchApi, {
        params: {
          prompt: prompt
        }
      });
      const data = response.data;

      if (data.bbox && data.datetime) {
        // sync temporal extent
        setStartDate(new Date(data.datetime[0]));
        setEndDate(new Date(data.datetime[1]));

        // sync spatial extent
        const southWest = L.latLng(data.bbox[1], data.bbox[0]);
        const northEast = L.latLng(data.bbox[3], data.bbox[2]);
        const bounds = L.latLngBounds(southWest, northEast);
        const rectangle = L.rectangle(bounds);
        setDrawnItems((prev) => [rectangle]);
        mapRef.current && mapRef.current.fitBoundsToItem(rectangle);
      } else if (typeof data === 'string') {
        setPilotError(data);
      } else {
        setPilotError('Error occured. Maybe you can try it later.');
      }
    } catch (err) {
      setPilotError('Error occured. Maybe you can try it later.');
    }
    setPilotFetching(false);
  };

  const promptSearch = (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">AI-powered spatial/temporal search</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          value={LLMSearchPrompt}
          label="Describe 'where' and 'when', press 'Enter' to input"
          onChange={(event) => {
            setLLMSearchPrompt(event.target.value);
          }}
          onKeyUp={(e) => {
            //e.preventDefault();
            if (e.key === 'Enter') {
              triggerPilot(LLMSearchPrompt);
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    triggerPilot(LLMSearchPrompt);
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        ></TextField>
      </Box>
      {pilotError && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{pilotError}</Typography>
        </Box>
      )}
      {pilotFetching && <LinearProgress />}
    </>
  );

  return (
    <FormControl sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={triggerSearch}
          sx={{ mr: 2 }}
        >
          Search
        </Button>
        <Button variant="contained" color="secondary" onClick={triggerReset}>
          Reset
        </Button>
      </Box>
      {promptSearch}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Date Range</Typography>
      </Box>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      ></DateRangePicker>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Select Collections</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <MultiSelectInput
          selectedCollections={selectedCollections}
          setSelectedCollections={setSelectedCollections}
        ></MultiSelectInput>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Property Filters</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <QuaryableFilters></QuaryableFilters>
      </Box>
    </FormControl>
  );
};
