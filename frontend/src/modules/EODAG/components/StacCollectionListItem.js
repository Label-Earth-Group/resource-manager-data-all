import { Grid, Box, Card, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const StacCollectionListItem = (props) => {
  const { collection } = props;
  return (
    <Grid item key={collection.id} md={3} sm={4} xs={12}>
      <Card>
        <Box sx={{ p: 2 }}>
          <Typography>
            <Link
              underline="hover"
              color="textPrimary"
              component={RouterLink}
              to={`/console/eodag/collections/${collection.id}`} /*eslint-disable-line*/
              variant="h6"
            >
              {collection.id}
            </Link>
          </Typography>
        </Box>
      </Card>
    </Grid>
  );
};

export default StacCollectionListItem;
