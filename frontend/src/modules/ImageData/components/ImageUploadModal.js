import { Box, Button, Dialog, DialogTitle, Grid } from '@mui/material';
import { FileDropzone } from 'design';
import { useState } from 'react';

function ImageUploadModal(props) {
  const { open, onClose } = props;
  const [files, setFiles] = useState([]);
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
    onClose(false);
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
        />
      </Box>
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
