import { Card, Grid } from '@mui/material';
import {
  StacObjectDescription,
  StacProviders,
  StacItemMetaData
} from './StacCommonComponent';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

export function StacItemOverview(props) {
  const { item } = props;
  const { assets, links, bbox, ...geojson } = item;
  const center = [(bbox[1] + bbox[3]) / 2, (bbox[0] + bbox[2]) / 2];
  const redOptions = { color: 'red' };
  return (
    <Grid container spacing={2}>
      <Grid item md={8} sm={12}>
        <Grid container spacing={2}>
          <Grid item md={6} sm={12}>
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
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={geojson} style={redOptions}></GeoJSON>
              </MapContainer>
            </Card>
          </Grid>
          <Grid item md={6} sm={12}>
            <Card sx={{ mb: 3 }}></Card>
          </Grid>
        </Grid>
        {item.properties?.description && (
          <StacObjectDescription description={item.properties.description} />
        )}
        <StacProviders {...item.properties} />
      </Grid>
      <Grid item md={4} sm={12}>
        <StacItemMetaData {...item.properties} />
      </Grid>
    </Grid>
  );
}
