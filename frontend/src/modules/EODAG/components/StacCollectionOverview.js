import { Grid } from '@mui/material';
import {
  StacObjectDescription,
  StacProviders,
  StacCollectionTemporalExtent,
  StacCollectionMetaData
} from './StacCommonComponent';

export function StacCollectionOverview(props) {
  const { collection } = props;
  return (
    <Grid container spacing={2}>
      <Grid item md={8} xs={12}>
        <StacObjectDescription {...collection} />
        <StacProviders providers={collection.providers} />
      </Grid>
      <Grid item md={4} xs={12}>
        <StacCollectionTemporalExtent extent={collection.extent?.temporal} />
        <StacCollectionMetaData {...collection} />
      </Grid>
    </Grid>
  );
}
