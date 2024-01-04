import { Card, Grid } from '@mui/material';
import {
  StacObjectDescription,
  StacProviders,
  StacItemMetaData
} from './StacCommonComponent';
import { MapContainer, GeoJSON } from 'react-leaflet';
// import { getThumbnailHrefFromItem } from '../services/eodagApi.ts';
import TianDiTuTileLayer from './TianDiTuTileLayer.js';
import ItemTilerLayer from './ItemTilerLayer.js';

export function StacItemOverview(props) {
  const { collectionID, itemID, item, entryPoint } = props;
  const { assets, links, bbox, ...geojson } = item;
  const center = [(bbox[1] + bbox[3]) / 2, (bbox[0] + bbox[2]) / 2];
  const redOptions = { color: 'red' };
  return (
    <Grid container spacing={2}>
      <Grid item md={8} sm={12}>
        <Card sx={{ mb: 3 }}>
          <MapContainer
            center={center}
            bounds={[
              [bbox[1], bbox[0]],
              [bbox[3], bbox[2]]
            ]}
            scrollWheelZoom={true}
            id="map"
          >
            <TianDiTuTileLayer />
            {/* <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
            {entryPoint === 'pgstac' && assets.visual && (
              <ItemTilerLayer
                collectionID={collectionID}
                itemID={itemID}
                assets="visual"
              />
            )}
            <GeoJSON data={geojson} style={redOptions}></GeoJSON>
          </MapContainer>
        </Card>
        {item.properties?.description && (
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
