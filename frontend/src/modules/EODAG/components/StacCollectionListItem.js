import {
  Grid,
  Box,
  Card,
  Link,
  Typography,
  Divider,
  Checkbox
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const StacCollectionListItem = (props) => {
  const {
    entryPoint,
    collection,
    showProviders,
    checked,
    toggleCollectionChecked
  } = props;
  return (
    <Grid item key={collection.id} lg={4} md={6} sm={12}>
      <Card>
        <Box sx={{ p: 2, minHeight: 120 }}>
          <Typography>
            {toggleCollectionChecked && (
              <Checkbox
                checked={checked}
                onChange={(e) => {
                  toggleCollectionChecked(
                    collection.id,
                    collection.title,
                    e.target.checked
                  );
                }}
              ></Checkbox>
            )}
            <Link
              underline="hover"
              color="textPrimary"
              component={RouterLink}
              to={`/console/${entryPoint}/collections/${collection.id}`} /*eslint-disable-line*/
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
                {collection.providers
                  ?.filter((p) => p.roles?.includes('host'))
                  .map((p) => p.name)
                  .join(', ') || 'None'}
              </span>
            </Typography>
          )}
        </Box>
      </Card>
    </Grid>
  );
};
