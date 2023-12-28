import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Box,
  Button
} from '@mui/material';
import { Delete } from '@mui/icons-material';

export const QuaryableFilters = () => {
  const [filters, setFilters] = useState([]);
  console.log('additional filters', filters);

  const addFilter = () => {
    const newFilter = {
      id: Date.now(),
      field: '',
      operator: '',
      value: '',
      valueType: ''
    };
    setFilters([...filters, newFilter]);
  };

  const deleteFilter = (filterId) => {
    setFilters(filters.filter((filter) => filter.id !== filterId));
  };

  const handleFilterChange = (filterId, key, newValue) => {
    setFilters(
      filters.map((filter) => {
        if (filter.id === filterId) {
          return { ...filter, [key]: newValue };
        }
        return filter;
      })
    );
  };

  const operators = ['eq', 'ne', 'lt', 'le', 'gt', 'ge'];
  //const valueTypes = ['str', 'int', 'float'];

  return (
    <FormControl variant="outlined" size="small" sx={{ width: '100%' }}>
      {filters.map((filter) => (
        <Box key={filter.id} display="flex" alignItems="center" mb={2}>
          <TextField
            label="Field"
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
            value={filter.field}
            onChange={(e) =>
              handleFilterChange(filter.id, 'field', e.target.value)
            }
          />
          <Select
            key="operators"
            value={filter.operator}
            sx={{ mr: 1 }}
            onChange={(e) =>
              handleFilterChange(filter.id, 'operator', e.target.value)
            }
          >
            {operators.map((op) => (
              <MenuItem key={op} value={op}>
                {op}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Value"
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
            value={filter.value}
            onChange={(e) =>
              handleFilterChange(filter.id, 'value', e.target.value)
            }
          />
          {/* <Select
              key="valueTypes"
              value={filter.valueType}
              onChange={(e) =>
                handleFilterChange(filter.id, 'valueType', e.target.value)
              }
            >
              {valueTypes.map((valueType) => (
                <MenuItem key={valueType} value={valueType}>
                  {valueType}
                </MenuItem>
              ))}
            </Select> */}
          <IconButton onClick={() => deleteFilter(filter.id)} size="small">
            <Delete />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" onClick={addFilter}>
        Add Filter
      </Button>
    </FormControl>
  );
};
