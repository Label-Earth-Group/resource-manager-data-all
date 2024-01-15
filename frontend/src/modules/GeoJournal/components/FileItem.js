import React from 'react';
import { Grid, ListItem, ListItemIcon, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LaunchIcon from '@mui/icons-material/Launch';
import { bytesToSize } from 'utils';

export const FileItem = ({ name, type, size, openExternal, onClick }) => {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>
        {type === 'dir' ? (
          <FolderIcon color="primary" />
        ) : openExternal ? (
          <LaunchIcon color="info" />
        ) : (
          <InsertDriveFileIcon />
        )}
      </ListItemIcon>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography color="textPrimary">{name}</Typography>
        </Grid>
        {type !== 'dir' && (
          <Grid item>
            <Typography color="textPrimary">{bytesToSize(size)}</Typography>
          </Grid>
        )}
      </Grid>
    </ListItem>
  );
};
