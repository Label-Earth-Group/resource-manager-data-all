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
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0
      }}
      component="ul"
    >
      {products.map((product) => {
        return (
          <ListItem key={product}>
            <Chip label={product} onDelete={handleDelete(product)} />
          </ListItem>
        );
      })}
    </Paper>
  );
}
