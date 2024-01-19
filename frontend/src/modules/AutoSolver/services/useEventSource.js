import { useState, useEffect, useCallback } from 'react';

export const useEventSource = ({
  url,
  setContent,
  onGoingEventSource,
  setOnGoingEventSource
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const startEventSource = useCallback(() => {
    const solverURL = 'http://10.168.34.61:8081';

    if (onGoingEventSource) return; // Avoid starting a new EventSource if one is already ongoing

    const eventSource = new EventSource(`${solverURL}/${url}`);

    eventSource.onopen = () => {
      setContent('');
      setOnGoingEventSource(eventSource);
      setIsFetching(true);
    };

    eventSource.onmessage = function (event) {
      setContent((prev) => prev + event.data);
      console.log('New message:', event.data);
    };

    eventSource.onerror = function (error) {
      console.error('EventSource failed:', error);
      eventSource.close();
      setOnGoingEventSource(null);
      setIsError(true);
      setIsFetching(false);
    };

    eventSource.addEventListener('contentclose', (event) => {
      console.log('Server closed the stream');
      eventSource.close();
      setOnGoingEventSource(null);
      setIsFinished(true);
      setIsFetching(false);
    });
  }, [url, setContent, onGoingEventSource, setOnGoingEventSource]);

  useEffect(() => {
    if (!onGoingEventSource) {
      setIsFetching(false);
    }
  }, [onGoingEventSource]);

  return { startEventSource, isFetching, isError, isFinished };
};
