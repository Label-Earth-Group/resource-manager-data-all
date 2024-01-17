import { useState, useCallback } from 'react';

export const useEventSource = ({
  url,
  onMessage,
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
      setOnGoingEventSource(eventSource);
      setIsFetching(true);
    };

    eventSource.onmessage = function (event) {
      if (onMessage) {
        onMessage(event.data);
      }
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
  }, [url, onMessage, onGoingEventSource, setOnGoingEventSource]);

  return { startEventSource, isFetching, isError, isFinished };
};
