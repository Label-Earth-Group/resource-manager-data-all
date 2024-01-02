import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  LinearProgress
} from '@mui/material';
import { FileDropzone } from 'design';
import { useState } from 'react';
import { getBucketClient } from '../services/s3storage';

function ImageUploadModal(props) {
  const { open, onClose } = props;
  const [files, setFiles] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const client = getBucketClient();
  const handleDrop = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_file) => _file.path !== file.path)
    );
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleClose = () => {
    onClose(isChanged);
  };

  const fileUpload = async (file) => {
    const params = {
      Bucket: 'labelearth-s3',
      Key: file.name,
      Body: file
    };
    setIsUploading(true);
    var response = client
      .putObject(params)
      .on('httpUploadProgress', (e) => {
        setProgress(Math.round((e.loaded * 100) / e.total));
      })
      .promise();
    await response
      .then((data) => {
        console.info(data);
      })
      .catch((err) => {
        console.error(err);
      });
    setIsUploading(false);
  };

  const batchUpload = async () => {
    for (const file of files) {
      await fileUpload(file);
    }
    setTimeout(() => {
      setFiles([]);
      setIsChanged(true);
    }, 1000);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Upload image</DialogTitle>
      <Box sx={{ px: 2, pb: 2 }}>
        <FileDropzone
          files={files}
          maxFiles={1}
          onDrop={handleDrop}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          onUpload={batchUpload}
        />
      </Box>
      {isUploading && (
        <Box
          sx={{
            mt: 2
          }}
        >
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
      <Grid container sx={{ px: 2, pb: 2 }} justifyContent="right">
        <Grid item>
          <Button variant="contained" onClick={handleClose} color="secondary">
            Close
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default ImageUploadModal;
