import {
  Typography,
  Link,
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
