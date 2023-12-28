import { Box, Button, FormControl, Typography } from '@mui/material';
import { DateRangePicker } from './DateTimeRangePicker.js';
import { MultiSelectInput } from '../components/MultipleSelect.tsx';
import { QuaryableFilters } from './QueryableFilters.js';

export const SearchQuery = (props) => {
  const {
    setStartDate,
    setEndDate,
    selectedCollections,
    setSelectedCollections,
    triggerSearch
  } = props;

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
        <Button variant="contained" color="secondary">
          Reset
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Date Range</Typography>
      </Box>
      <DateRangePicker
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
