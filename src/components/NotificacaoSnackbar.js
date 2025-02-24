import React, { useEffect }from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { clearNotification } from '../redux/reducers/FormSlice';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NotificationSnackbar = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.form.notification) || {};
  const open = Boolean(notification.message);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(clearNotification());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.severity || 'info'}
        sx={{
          fontSize: '1.25rem', 
          padding: '16px', 
          maxWidth: '500px',
        }}
      >
        {notification.message || 'Ocorreu um erro!'} 
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;