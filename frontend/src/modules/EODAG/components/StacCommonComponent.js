import {
  Typography,
  Link,
  // List,
  // ListItem,
  Box,
  Card,
  Divider,
  CardHeader,
  CardContent,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@mui/material';
import { Label } from 'design';
import Markdown from 'react-markdown';
import { Link as RouterLink } from 'react-router-dom';
import StacFields from '@radiantearth/stac-fields';
import {
  formatTemporalExtent,
  formatTemporalExtents,
  formatTimestamp
} from '@radiantearth/stac-fields/formatters';

export function StacObjectDescription(props) {
  const { description, keywords } = props;

  const markdownComponent = {
    a: (props) => {
      const { children, node, href, title, ...rest } = props;
      return (
        <Link
          href={href}
          target="_blank"
          rel="noreferrer"
          title={title}
          {...rest}
        >
          {children}
        </Link>
      );
    }
  };
  return (
    <Card sx={{ mb: 3 }}>
      <Box>
        <CardHeader title="Description" />
        <Divider />
      </Box>
      <CardContent>
        <Typography>
          <Markdown components={markdownComponent}>
            {description || 'No description for this collection.'}
          </Markdown>
        </Typography>
        <Typography color="textPrimary" variant="body2">
          {keywords && (
            <Box sx={{ mt: 2 }}>
              {keywords.map((keyword) => {
                return keyword ? (
                  <>
                    <Label color="secondary">{keyword}</Label>{' '}
                  </>
                ) : null;
              })}
            </Box>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}

function StacProviderRow({ provider, index }) {
  return (
    <TableRow key={index}>
      <TableCell key={`${index}-name`} sx={{ minWidth: 80 }}>
        <Typography color="text" variant="subtitle">
          {provider.url ? (
            <Link href={provider.url} target="_blank" rel="noopener noreferrer">
              {provider.name}
            </Link>
          ) : (
            provider.name
          )}
        </Typography>
      </TableCell>
      <TableCell key={`${index}-role`}>
        {provider.roles &&
          provider.roles.map((role) => (
            <Label key={`${index}-role-label`} color="secondary">
              {role}
            </Label>
          ))}
      </TableCell>
      <TableCell key={`${index}-description`}>
        <Typography>
          {provider.description || 'No description for this provider.'}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export function StacProviders(props) {
  const { providers } = props;
  if (!providers) {
    return <></>;
  }
  return (
    <Card sx={{ mb: 3 }}>
      <Box>
        <CardHeader title="Providers"></CardHeader>
        <Divider />
      </Box>
      <CardContent sx={{ p: 0 }}>
        <Table>
          <TableBody>
            {Array.isArray(providers) ? (
              providers.map((provider, index) => (
                <StacProviderRow
                  provider={provider}
                  key={index}
                  index={index}
                />
              ))
            ) : (
              <StacProviderRow provider={providers} key={0} index={0} />
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function StacCollectionTemporalExtent(props) {
  const temporalExtent = props?.extent?.interval;
  const formatted = Array.isArray(temporalExtent)
    ? formatTemporalExtents(temporalExtent)
    : formatTemporalExtent(temporalExtent);
  console.log('formatted temporal', formatted);
  return (
    <Card sx={{ mb: 3 }}>
      <Box>
        <CardHeader title="Temporal extent"></CardHeader>
        <Divider />
      </Box>
      <Grid container sx={{ p: 2 }}>
        <Grid item md={12} lg={6}>
          <Typography>
            From:{' '}
            {temporalExtent[0][0]
              ? formatTimestamp(temporalExtent[0][0])
              : 'N/A'}
          </Typography>
        </Grid>
        <Grid item md={12} lg={6}>
          <Typography>
            To:{' '}
            {temporalExtent[0][1]
              ? formatTimestamp(temporalExtent[0][1])
              : 'Present'}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

export function StacCollectionMetaData({ collection, entryPoint = 'eodag' }) {
  // deal with EODAT keywords, merge it into summaries
  if (entryPoint === 'eodag' && collection['keywords']) {
    let keywords = collection['keywords'];
    const EODAGMapping = {
      constellation: keywords[1],
      platform: keywords[0],
      intruments: keywords[2],
      'processing:level': keywords[3],
      sensorType: keywords[4]
    };
    let summaries = { ...collection['summaries'], ...EODAGMapping };
    collection = { ...collection, summaries };
  }

  let { crs, license } = collection;
  const summaryFormatted = StacFields.formatSummaries(collection);
  //console.log('formatted summary', summaryFormatted);

  const extraInfo = {
    extension: '',
    label: '',
    properties: {}
  };

  // deal with license
  if (license) {
    extraInfo.properties['License'] = {
      label: 'License',
      value: license,
      formatted: license
    };
  }

  // deal with crs
  if (crs && typeof crs === 'string') {
    const title = crs
      .replace(/^https?:\/\/www\.opengis\.net\/def\/crs\//i, '') // HTTP(s) URI
      .replace(/^urn:ogc:def:crs:/i, ''); // OGC URN
    const crsFormatted = (
      <Link href={crs} target="_blank" rel="noopener noreferrer">
        {title}
      </Link>
    );
    extraInfo.properties['CRS'] = {
      label: 'CRS',
      value: crs,
      formatted: crsFormatted
    };
  }

  const formatted = [extraInfo, ...summaryFormatted];

  return (
    <Card sx={{ mb: 3 }}>
      <Box>
        <CardHeader title="Metadata"></CardHeader>
        <Divider />
      </Box>
      <CardContent sx={{ p: 0 }}>
        <Table>
          <TableBody>
            {formatted.map((subSummary) => (
              <MetaDataSubTable {...subSummary}></MetaDataSubTable>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MetaDataSubTable({ extension, label, properties }) {
  return (
    <>
      {extension !== '' && (
        <TableRow key={extension}>
          <TableCell key={`${extension}-header`} colSpan={2}>
            <div style={{ display: 'flex' }}>
              <Typography variant="h6">{'Extension: '}</Typography>
              <Typography variant="h6">
                <div
                  dangerouslySetInnerHTML={{
                    __html: label
                  }}
                />
              </Typography>
            </div>
          </TableCell>
        </TableRow>
      )}
      {Object.entries(properties).map(([key, row]) => (
        <TableRow key={`${extension}-${key}`}>
          <TableCell
            key={`${extension}-${key}-label`}
            sx={{ maxWidth: 120, minWidth: 90 }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: row.label
              }}
            />
          </TableCell>
          <TableCell key={`${extension}-${key}-value`}>
            <Typography color="textPrimary" variant="body2">
              {typeof row.formatted === 'string' ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: row.formatted.replace(
                      '<i class="null">n/a</i>',
                      'N/A'
                    )
                  }}
                />
              ) : (
                row.formatted
              )}
            </Typography>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function StacItemMetaData({ item }) {
  const excludes = ['description', 'providers'];
  const formatted = StacFields.formatItemProperties(
    item,
    (key, path) => !excludes.includes(key)
  );
  //console.log('item property formatted', formatted);

  return (
    <Card sx={{ mb: 3 }}>
      <Box>
        <CardHeader title="Metadata"></CardHeader>
        <Divider />
      </Box>
      <CardContent sx={{ p: 0 }}>
        <Table>
          <TableBody>
            {formatted.map((subProps) => (
              <MetaDataSubTable {...subProps}></MetaDataSubTable>
            ))}
          </TableBody>
        </Table>

        {/* {Object.entries(metadataExtension).map(([extension, table]) => (
          <>
            <CardHeader title={extension}></CardHeader>
            <Divider />
            <List>
              {table.map((row) => (
                <ListItem
                  disableGutters
                  divider
                  sx={{
                    justifyContent: 'space-between',
                    padding: 2
                  }}
                >
                  <Typography color="textSecondary" variant="subtitle2">
                    {row.label}
                  </Typography>

                  <Typography color="textPrimary" variant="body2">
                    {row.value}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </>
        ))} */}
      </CardContent>
    </Card>
  );
}

export function StacItemDisplayList(props) {
  const { features, entryPoint } = props;

  if (!features || features?.length === 0) {
    return <></>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {features.map((feature) => {
            return (
              <TableRow key={feature.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/console/${entryPoint}/collections/${feature.collection}/items/${feature.id}`}
                  >
                    {feature.id}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
