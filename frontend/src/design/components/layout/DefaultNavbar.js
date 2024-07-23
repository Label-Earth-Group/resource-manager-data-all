import React from 'react';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Menu } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { AccountPopover } from '../popovers';
import { Logo } from '../Logo';
import { SettingsDrawer } from '../SettingsDrawer';
import { headerHeight } from 'design/constants';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.main
  }
}));

export const DefaultNavbar = ({ openDrawer, onOpenDrawerChange }) => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar sx={{ minHeight: headerHeight, maxHeight: headerHeight }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => {
            onOpenDrawerChange(!openDrawer);
          }}
        >
          <Menu />
        </IconButton>
        <Box width="350px" display={{ xs: 'block', lg: 'block', xl: 'block' }}>
          <Logo />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            ml: 2
          }}
        />
        <Box sx={{ ml: 1 }}>
          <SettingsDrawer />
        </Box>
        <Box sx={{ ml: 2 }}>
          <AccountPopover />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

DefaultNavbar.propTypes = {
  openDrawer: PropTypes.bool,
  onOpenDrawerChange: PropTypes.func
};
