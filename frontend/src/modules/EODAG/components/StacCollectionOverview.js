import {
  Typography,
  Link,
  Box,
  Card,
  Grid,
  Table,
  TableRow,
  TableCell,
  Divider,
  CardHeader,
  CardContent
} from '@mui/material';
import { StacObjectDescription, StacProviders } from './StacCommonComponent';

function StacCollectionTemporalExtent(props) {
  const { extent } = props;
  return (
    <Card sx={{ mb: 3 }}>
      <Box>
        <CardHeader title="Temporal extent"></CardHeader>
        <Divider />
      </Box>
      <Grid container sx={{ p: 2 }}>
        <Grid item md={12} lg={6}>
          <Typography>From: {extent?.interval[0][0] || 'N/A'}</Typography>
        </Grid>
        <Grid item md={12} lg={6}>
          <Typography>To: {extent?.interval[0][1] || 'Present'}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

function StacCollectionMetaData(props) {
  const { keywords, summaries, crs, license } = props;
  let metadata = [
    {
      label: 'Constellation',
      value: summaries.constellation?.join(' ') || keywords[1] || 'N/A'
    },
    {
      label: 'Platform',
      value: summaries.platform?.join(' ') || keywords[0] || 'N/A'
    },
    {
      label: 'Instruments',
      value: summaries.intruments?.join(' ') || keywords[2] || 'N/A'
    },
    {
      label: 'Processing level',
      value: summaries['processing:level'] || keywords[3] || 'N/A'
    },
    {
      label: 'Sensor type',
      value: keywords[4] || 'N/A'
    },
    {
      label: 'License',
      value: license
    }
  ];
  if (crs) {
    metadata.push({
      label: 'CRS',
      value: <Link href={crs}>{crs}</Link>
    });
  }

  return (
    <Card sx={{ mb: 3 }}>
      <Box>
        <CardHeader title="Metadata"></CardHeader>
        <Divider />
      </Box>
      <CardContent sx={{ p: 0 }}>
        <Table>
          {metadata.map((row) => (
            <TableRow>
              <TableCell>{row.label}</TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </Table>
      </CardContent>
    </Card>
  );
}

function StacCollectionOverview(props) {
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

export default StacCollectionOverview;
