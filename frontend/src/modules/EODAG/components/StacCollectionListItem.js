import { Grid, Box, Card, Link, Typography, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const StacCollectionListItem = (props) => {
  const { entrypoint, collection, showProviders } = props;
  return (
    <Grid item key={collection.id} lg={4} md={6} sm={12}>
      <Card>
        <Box sx={{ p: 2, minHeight: 120 }}>
          <Typography>
            <Link
              underline="hover"
              color="textPrimary"
              component={RouterLink}
              to={`/console/${entrypoint}/collections/${collection.id}`} /*eslint-disable-line*/
              variant="h6"
            >
              {collection.id}
            </Link>
          </Typography>
          <Typography color="textSecondary" variant="body2">
            <span>{collection.title}</span>
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 2, py: 1 }}>
          <Typography color="textSecondary" variant="body2">
            <span>
              Time: {collection.extent.temporal.interval[0][0] || 'N/A'} ~{' '}
              {collection.extent.temporal.interval[0][1] || 'Present'}
            </span>
          </Typography>
          {showProviders && (
            <Typography color="textSecondary" variant="body2">
              <span>
                Provider(s):{' '}
                {collection.providers?.map((p) => p.name).join(', ') || 'None'}
              </span>
            </Typography>
          )}
        </Box>
      </Card>
    </Grid>
  );
};
