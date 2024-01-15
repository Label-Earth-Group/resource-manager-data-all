import React from 'react';
import { Grid, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { bytesToSize } from 'utils';

export const FileItem = ({ name, type, size, onClick }) => {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>
        {type === 'dir' ? (
          <FolderIcon color="primary" />
        ) : (
          <InsertDriveFileIcon />
        )}
      </ListItemIcon>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <ListItemText primary={name} />
        </Grid>
        {type !== 'dir' && (
          <Grid item>
            <ListItemText primary={bytesToSize(size)} />
          </Grid>
        )}
      </Grid>
    </ListItem>
  );
};
