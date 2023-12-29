import {
  Box,
  Grid,
  Typography,
  Breadcrumbs,
  Button,
  Link,
  Container,
  CircularProgress,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody
} from '@mui/material';
import { ChevronRightIcon, useSettings } from 'design';
import { Helmet } from 'react-helmet-async';
import { getBucketClient } from '../services/s3storage';
import { useCallback, useEffect, useState } from 'react';
import { Upload } from '@mui/icons-material';
import ImageUploadModal from '../components/ImageUploadModal';
import { bytesToSize } from 'utils';

function ImageAssetsPageHeader(props) {
  const { handleUpload } = props;
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          LabelEarth geospatial data repository
        </Typography>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mt: 1 }}
        >
          <Link underline="hover" color="textPrimary" variant="subtitle2">
            Images
          </Link>
          <Link underline="hover" color="textPrimary" variant="subtitle2">
            Repository
          </Link>
        </Breadcrumbs>
      </Grid>
      <Grid item>
        <Box sx={{ m: -1 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleUpload}
            startIcon={<Upload />}
          >
            Upload
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

function ImageAssets() {
  const [isLoading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { settings } = useSettings();
  const [objList, setObjList] = useState([]);
  const client = getBucketClient();
  const fetchObjList = useCallback(async () => {
    setLoading(true);
    // TODO: deal with truncated object list
    var response = client
      .listObjectsV2({
        Bucket: 'labelearth-s3'
      })
      .promise();
    await response.then((data, err) => {
      if (err) {
        console.info(err);
      } else {
        var res = [];
        data.Contents?.forEach((c) => {
          // TODO: get object metadata(MIME, etc) using headObject
          res.push(c);
        });
        setObjList(res);
      }
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchObjList();
  }, []);

  const handleDialogClose = (changed) => {
    setDialogOpen(false);
    if (changed) fetchObjList();
  };

  const handleOpenUpload = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Image assets - data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <ImageAssetsPageHeader handleUpload={handleOpenUpload} />
          <ImageUploadModal open={isDialogOpen} onClose={handleDialogClose} />
          <Box
            sx={{
              flexGrow: 1,
              mt: 3
            }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Last modified</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {objList.map((c) => (
                    <TableRow key={c.Key}>
                      <TableCell>
                        <Typography color="textPrimary">{c.Key}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textPrimary">
                          {bytesToSize(c.Size)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textPrimary">
                          {c.LastModified.toISOString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default ImageAssets;
