import { useEffect } from 'react';

// Custom hook for handling errors
export const useHandleError = (error, dispatch) => {
  useEffect(() => {
    if (error) {
      console.error(error);
      dispatch({ type: 'SET_ERROR', error: error.error });
    }
  }, [error, dispatch]);
};
