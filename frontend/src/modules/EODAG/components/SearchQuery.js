import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Typography,
  Table,
  TableRow
} from '@mui/material';
import { DateRangePicker } from './DateTimeRangePicker.js';
import {
  //   MultipleSelect,
  MultiSelectInput
} from '../components/MultipleSelect.tsx';
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
    <FormControl>
      <Table>
        <TableRow>
          <Box>
            <Button variant="contained" color="primary" onClick={triggerSearch}>
              Search
            </Button>
            <Button variant="contained" color="secondary">
              Reset
            </Button>
          </Box>
        </TableRow>
        <TableRow>
          <Typography>Date Range</Typography>
        </TableRow>
        <TableRow>
          <DateRangePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          ></DateRangePicker>
          <FormHelperText>Disabled</FormHelperText>
        </TableRow>
        <TableRow>
          <Typography>Select Collections</Typography>
        </TableRow>
        <TableRow>
          <MultiSelectInput
            selectedCollections={selectedCollections}
            setSelectedCollections={setSelectedCollections}
          ></MultiSelectInput>
        </TableRow>
        <TableRow>
          <Typography>Property Filters</Typography>
        </TableRow>
        <TableRow>
          <QuaryableFilters></QuaryableFilters>
        </TableRow>
      </Table>
    </FormControl>
  );
};
