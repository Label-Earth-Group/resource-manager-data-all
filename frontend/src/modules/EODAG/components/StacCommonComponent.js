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
  Table,
  TableRow,
  TableCell
} from '@mui/material';
import { Label } from 'design';
import Markdown from 'react-markdown';

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
                    <Label color="info">{keyword}</Label>{' '}
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

function StacProviderRow(provider) {
  return (
    <TableRow>
      <TableCell sx={{ minWidth: 80 }}>
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
      <TableCell>
        {provider.roles &&
          provider.roles.map((role) => <Label color="info">{role}</Label>)}
      </TableCell>
      <TableCell>
        <Typography>
          {provider.description || 'No description for this provider.'}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export function StacProviders(props) {
  const { providers } = props;
  return (
    <Card sx={{ mb: 3 }}>
      <Box>
        <CardHeader title="Providers"></CardHeader>
        <Divider />
      </Box>
      <CardContent sx={{ p: 0 }}>
        <Table>
          {Array.isArray(providers) ? (
            providers.map((provider) => <StacProviderRow {...provider} />)
          ) : (
            <StacProviderRow {...providers} />
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

export function StacItemMetaData(props) {
  const {
    datetime,
    start_datetime,
    end_datetime,
    created,
    updated,
    license,
    constellation,
    platform,
    instruments,
    gsd,
    published,
    version
  } = props;

  const metadata = [
    {
      label: 'datetime',
      value: datetime || 'N/A'
    },
    {
      label: 'start_datetime',
      value: start_datetime || 'N/A'
    },
    {
      label: 'end_datetime',
      value: end_datetime || 'N/A'
    },
    {
      label: 'created',
      value: created || 'N/A'
    },
    {
      label: 'updated',
      value: updated || 'N/A'
    },
    {
      label: 'license',
      value: license || 'N/A'
    },
    {
      label: 'constellation',
      value: constellation || 'N/A'
    },
    {
      label: 'platform',
      value: platform || 'N/A'
    },
    {
      label: 'instruments',
      value: instruments?.join(' ') || 'N/A'
    },
    {
      label: 'gsd',
      value: gsd || 'N/A'
    },
    {
      label: 'published',
      value: published || 'N/A'
    },
    {
      label: 'version',
      value: version || 'N/A'
    }
  ];

  let tables = {};
  for (let key in props) {
    let prefix, subKey;
    if (key.includes(':')) {
      [prefix, subKey] = key.split(':');
    } else {
      prefix = 'general';
      subKey = key;
    }
    tables[prefix] = tables[prefix] ? tables[prefix] : [];
    tables[prefix].push({
      label: subKey,
      value: props[key] || 'N/A'
    });
  }

  const { general, ...metadataExtension } = tables;

  console.log(metadataExtension);

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
          {Object.entries(metadataExtension).map(([extension, table]) => (
            <>
              <TableRow>
                <CardHeader title={extension}></CardHeader>
                <Divider></Divider>
                <TableCell></TableCell>
              </TableRow>
              {table.map((row) => (
                <TableRow>
                  <TableCell>
                    <Typography color="textSecondary" variant="subtitle2">
                      {row.label}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textPrimary" variant="body2">
                      {row.value}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ))}
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
