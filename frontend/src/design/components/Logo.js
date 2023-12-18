import { Box, CardMedia, Grid, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const Logo = () => (
  <>
    <Grid container>
      <Grid item>
        <Box sx={{ mt: 0.5, mr: 0.5 }}>
          <CardMedia
            src="/static/logo-dataall.svg"
            component="img"
            sx={{
              height: '25px',
              width: '35px'
            }}
          />
        </Box>
      </Grid>
      <Grid item>
        <Link
          to="/"
          color="textPrimary"
          underline="none"
          variant="h5"
          component={RouterLink}
        >
          data.all
        </Link>
      </Grid>
    </Grid>
  </>
);
