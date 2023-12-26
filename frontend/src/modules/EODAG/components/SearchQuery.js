import { Box, Button, FormControl } from '@mui/material';
import { DateRangePicker } from './DateTimeRangePicker.js';
import {
  //   MultipleSelect,
  MultiSelectInput
} from '../components/MultipleSelect.tsx';
import { QuaryableFilters } from './QueryableFilters.js';
import { useGetCollectionsResponseQuery } from '../services/eodagApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils.js';

export const SearchQuery = (props) => {
  const dispatch = useDispatch();
  const { collections, error, isLoading } = useGetCollectionsResponseQuery(
    undefined,
    {
      selectFromResult: ({ data, error, isLoading }) => ({
        collections: data && data.collections,
        error,
        isLoading
      })
    }
  ); // NOTE: should also select error and isLoading
  useHandleError(error, dispatch);

  return (
    <FormControl>
      <Box>
        <Button variant="contained" color="primary">
          Search
        </Button>
        <Button variant="contained" color="secondary">
          Reset
        </Button>
      </Box>
      <DateRangePicker></DateRangePicker>
      <MultiSelectInput
        collections={collections || []}
        isLoading={isLoading}
      ></MultiSelectInput>
      <QuaryableFilters></QuaryableFilters>
    </FormControl>
  );
};
