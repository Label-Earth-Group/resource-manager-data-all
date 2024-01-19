import { useState, useEffect, useCallback } from 'react';

export const useEventSource = ({
  url,
  setContent,
  onGoingEventSource,
  setOnGoingEventSource
}) => {
  const [status, setStatus] = useState('NotStarted');

  const startEventSource = useCallback(() => {
    const solverURL = 'http://10.168.34.61:8081';

    if (onGoingEventSource) return; // Avoid starting a new EventSource if one is already ongoing

    const eventSource = new EventSource(`${solverURL}/${url}`);

    eventSource.onopen = () => {
      setStatus('Fetching');
      setContent('');
      setOnGoingEventSource(eventSource);
    };

    eventSource.onmessage = function (event) {
      setContent((prev) => prev + event.data);
      console.log('New message:', event.data);
    };

    eventSource.onerror = function (error) {
      console.error('EventSource failed:', error);
      setStatus('Error');
      eventSource.close();
      setOnGoingEventSource(null);
    };

    eventSource.addEventListener('contentclose', (event) => {
      console.log('Server closed the stream');
      setStatus('Finished');
      eventSource.close();
      setOnGoingEventSource(null);
    });
  }, [url, setContent, onGoingEventSource, setOnGoingEventSource]);

  // when closed the ongoing evert source from outside
  useEffect(() => {
    if (!onGoingEventSource) {
      status === 'Fetching' && setStatus('Error');
    }
  }, [onGoingEventSource, status]);

  return { startEventSource, status };
};
