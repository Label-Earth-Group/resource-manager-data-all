import { Card, Grid } from '@mui/material';
import {
  StacObjectDescription,
  StacProviders,
  StacItemMetaData
} from './StacCommonComponent';
// import { getThumbnailHrefFromItem } from '../services/eodagApi.ts';
import {
  PGStacItemAssetViewer,
  EODAGItemAssetViewer
} from './ItemAssetViewer.js';

export function StacItemOverview(props) {
  const { item, entryPoint } = props;
  return (
    <Grid container spacing={2}>
      <Grid item md={8} sm={12}>
        <Card sx={{ mb: 3 }}>
          {entryPoint === 'eodag' ? (
            <EODAGItemAssetViewer {...props} />
          ) : (
            <PGStacItemAssetViewer {...props} />
          )}
        </Card>
        {item?.properties?.description && (
          <StacObjectDescription description={item.properties.description} />
        )}
        <StacProviders {...item.properties} />
      </Grid>
      <Grid item md={4} sm={12}>
        {/* {getThumbnailHrefFromItem(item) && (
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              sx={{ height: 384 }}
              image={getThumbnailHrefFromItem(item)}
            />
          </Card>
        )} */}
        <StacItemMetaData item={item} />
      </Grid>
    </Grid>
  );
}
