import { DeleteOutlined } from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Tooltip,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  countUnreadNotifications,
  listNotifications,
  markNotificationAsRead,
  useClient
} from 'services';
import { BellIcon } from '../../icons';
import { Defaults } from '../defaults';

export const NotificationsPopover = () => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const client = useClient();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [countInbox, setCountInbox] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCountInbox = useCallback(async () => {
    setLoading(true);
    const response = await client.query(countUnreadNotifications());
    if (!response.errors) {
      setCountInbox(response.data.countUnreadNotifications);
      fetchItems({ unread: true });
    }
    setLoading(false);
  }, [client]);

  const fetchItems = useCallback(
    async (notificationFilter) => {
      setLoading(true);
      let filter = Object.assign(
        {},
        Defaults.selectListFilter,
        notificationFilter
      );
      const response = await client.query(listNotifications(filter));
      if (!response.errors) {
        setNotifications(response.data.listNotifications.nodes);
      }
      setLoading(false);
    },
    [client]
  );

  const markAsRead = useCallback(
    async (notificationUri) => {
      await client.mutate(markNotificationAsRead(notificationUri));
    },
    [client]
  );

  const handleRemoveNotification = (idx) => {
    let notificiationUri = notifications[idx].notificationUri;
    setNotifications((prevstate) => {
      const rows = [...prevstate];
      rows.splice(idx, 1);
      return rows;
    });
    setCountInbox(countInbox - 1);
    markAsRead(notificiationUri);
  };

  const clearNotifications = (idx) => {
    let readNotifications = notifications;
    setNotifications([]);
    setCountInbox(0);
    readNotifications.forEach((note) => {
      markAsRead(note.notificationUri);
    });
  };

  useEffect(() => {
    if (client) {
      getCountInbox();
    }
  }, [client]);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton ref={anchorRef} color="inherit" onClick={handleOpen}>
          <Badge color="error" badgeContent={countInbox}>
            <BellIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 320 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography color="textPrimary" variant="h6">
            Notifications
          </Typography>
          <Button
            fullWidth
            type="submit"
            variant="outlined"
            onClick={() => {
              clearNotifications();
            }}
          >
            Clear All
          </Button>
        </Box>
        {loading || notifications.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="textPrimary" variant="subtitle2">
              There are no notifications
            </Typography>
          </Box>
        ) : (
          <>
            <List disablePadding>
              {notifications.length > 0 &&
                notifications.map((notification, idx) => (
                  <ListItem divider key={notification.id}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText'
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Link
                          underline="hover"
                          color="textPrimary"
                          sx={{ cursor: 'pointer' }}
                          variant="subtitle2"
                        >
                          {notification.message}
                        </Link>
                      }
                    />
                    <IconButton
                      onClick={() => {
                        handleRemoveNotification(idx);
                      }}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
            </List>
          </>
        )}
      </Popover>
    </>
  );
};
