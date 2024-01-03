import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Autocomplete,
  Chip,
  TextField,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { useGetCollectionsResponseQuery } from '../services/eodagApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils/utils.js';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

export function MultipleSelect() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value }
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

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
          <li {...props}>{option.id}</li>
        </Tooltip>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Tooltip title={option.title}>
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
