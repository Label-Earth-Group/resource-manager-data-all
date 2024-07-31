/* eslint-disable no-unused-vars */

import {
  Typography,
  Link,
  Box,
  Card,
  Divider,
  CardHeader,
  CardMedia,
  CardContent,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { Label } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { default as createStacObject } from 'stac-js';
import { useFetchS3Url } from '../services/useFetchS3Url';

export function SERPListDisplay(props) {
  const theme = useTheme();
  const {
    features,
    entryPoint,
    showCollection = false,
    highlightedItems = undefined,
    setHighlightedItems = undefined
  } = props;

  if (!features || features?.length === 0) {
    return <></>;
  }

  const setListItemHighlighted = (feature) => {
    setHighlightedItems && setHighlightedItems([createStacObject(feature)]);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {features.map((feature) => (
            <TableRow
              key={feature.id}
              onFocus={() => setListItemHighlighted(feature)}
              onClick={() => setListItemHighlighted(feature)}
              sx={
                highlightedItems?.some((i) => i.id === feature.id)
                  ? {
                      backgroundColor: theme.palette.action.selected,
                      borderTop: `2px solid ${theme.palette.primary.main}`,
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      ':hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }
                  : {
                      ':hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }
              }
            >
              <TableCell>
                <Link
                  component={RouterLink}
                  to={`/console/${entryPoint}/collections/${feature.collection}/items/${feature.id}`}
                >
                  {feature.id}
                </Link>
                {showCollection && (
                  <>
                    <br />
                    {' in '}
                    <Link
                      component={RouterLink}
                      to={`/console/${entryPoint}/collections/${feature.collection}`}
                    >
                      {feature.collection}
                    </Link>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function SERPCardDisplay(props) {
  const theme = useTheme();
  const {
    features,
    entryPoint,
    showCollection = false,
    highlightedItems = undefined,
    setHighlightedItems = undefined
  } = props;

  if (!features || features?.length === 0) {
    return <></>;
  }

  const setListItemHighlighted = (feature) => {
    setHighlightedItems && setHighlightedItems([createStacObject(feature)]);
  };

  const ImageCard = ({ feature }) => {
    const imageS3Path = feature.assets.thumbnail.alternate.s3.href;
    const imageSrc = useFetchS3Url(imageS3Path);

    return (
      <Card
        sx={
          highlightedItems?.some((i) => i.id === feature.id)
            ? {
                backgroundColor: theme.palette.action.selected,
                borderTop: `2px solid ${theme.palette.primary.main}`,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                ':hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }
            : {
                ':hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }
        }
      >
        <CardHeader
          title={
            <Link
              component={RouterLink}
              to={`/console/${entryPoint}/collections/${feature.collection}/items/${feature.id}`}
            >
              {feature.id}
            </Link>
          }
          subheader={showCollection && feature.collection}
        />
        {imageSrc && (
          <CardMedia
            component="img"
            height="140"
            image={imageSrc}
            alt={feature.id}
          />
        )}
        <CardContent></CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {features.map((feature) => (
          <Grid item xs={'auto'} md={'auto'} key={feature.id}>
            <ImageCard feature={feature} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
