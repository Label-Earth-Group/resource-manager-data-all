import * as React from 'react';
import {
  Autocomplete,
  Chip,
  TextField,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { useGetCollectionsResponseQuery } from '../services/eodagApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils/utils.js';

export const MultiSelectInput = (props) => {
  const { selectedCollections, setSelectedCollections } = props;
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

  const handleSelect = (event, newValue) => {
    setSelectedCollections(newValue);
  };

  const isOptionEqualToValue = (option, value) => option.id === value.id;

  const options = collections
    ? collections.map((collection) => {
        return { title: collection.title, id: collection.id };
      })
    : [];

  return (
    <Autocomplete
      multiple
      id="collectionID-filter"
      options={options}
      getOptionLabel={(option) => option.id}
      value={selectedCollections}
      onChange={handleSelect}
      isOptionEqualToValue={isOptionEqualToValue}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      loading={isLoading}
      renderOption={(props, option) => (
        <Tooltip key={option.id} title={option.title}>
          <li key={option.id} {...props}>
            {option.id}
          </li>
        </Tooltip>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Tooltip key={index} title={option.title}>
            <Chip
              variant="outlined"
              label={option.id}
              {...getTagProps({ index })}
            />
          </Tooltip>
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label="Select Collections"
          placeholder="Add more"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  );
};
