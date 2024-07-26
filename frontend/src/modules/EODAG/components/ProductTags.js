import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5)
}));

export function ProductTags({ products, setProducts }) {
  const handleDelete = (productToDelete) => () => {
    setProducts((products) =>
      products.filter((product) => product !== productToDelete)
    );
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'flex-start',
        flexWrap: 'wrap',
        listStyle: 'none',
        my: 0.5,
        height: '12%',
        overflow: 'auto'
      }}
      component="ul"
    >
      {products.map((product) => {
        return (
          <ListItem key={product}>
            <Chip
              label={product}
              size="small"
              onDelete={handleDelete(product)}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}
