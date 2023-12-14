import { Grid } from '@mui/material';
import {
  StacObjectDescription,
  StacProviders,
  StacItemMetaData
} from './StacCommonComponent';

export function StacItemOverview(props) {
  const { item } = props;

  return (
    item.properties && (
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          {item.properties.description && (
            <StacObjectDescription description={item.properties.description} />
          )}
          <StacProviders {...item.properties} />
          <StacItemMetaData {...item.properties} />
        </Grid>
        <Grid item md={4} xs={12}></Grid>
      </Grid>
    )
  );
}
