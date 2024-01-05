import { useEffect } from 'react';

// Custom hook for handling errors
export const useHandleError = (error, dispatch) => {
  useEffect(() => {
    if (error) {
      dispatch({ type: 'SET_ERROR', error: error.error });
    }
  }, [error, dispatch]);
};
