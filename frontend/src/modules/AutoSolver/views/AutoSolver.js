// import { fetchEventSource } from '@microsoft/fetch-event-source';

import {
  Box,
  Container,
  Card,
  Button,
  Grid,
  Link,
  TextField,
  Typography
} from '@mui/material';
import { useSettings } from 'design';
import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Markdown from 'react-markdown';

//const solverApi = 'http://54.212.38.192:8086/stream_suite';
const solverURL = 'http://54.213.71.82:8000'; //the address of the server started from code synced from LabelEarth/LLM-Geo

const testTaskData = {
  task_name: 'test',
  task: '1) Find out Census tracts that contain hazardous waste facilities, then comppute and print out the population living in those tracts. The study area is North Carolina (NC), US. 2) Generate a population choropleth map for all tract polygons in NC, rendering the color by population; and then highlight the borders of tracts that have hazardous waste facilities. Please draw all polygons, not only the highlighted ones. The map size is 15*10 inches.',
  data_locations: [
    'NC hazardous waste facility ESRI shape file: https://github.com/gladcolor/LLM-Geo/raw/master/overlay_analysis/HW_Sites_EPSG4326.zip.',
    "NC tract boundary shapefile: https://github.com/gladcolor/LLM-Geo/raw/master/overlay_analysis/tract_37_EPSG4326.zip. The tract ID column is 'GEOID', data types is integer.",
    "NC tract population CSV file: https://github.com/gladcolor/LLM-Geo/raw/master/overlay_analysis/NC_tract_population.csv. The population is stored in 'TotalPopulation' column. The tract ID column is 'GEOID', data types is integer."
  ]
};

const CustomMarkDown = ({ content }) => {
  const markdownComponent = {
    a: (props) => {
      const { children, node, href, title, ...rest } = props;
      return (
        <Link
          href={href}
          target="_blank"
          rel="noreferrer"
          title={title}
          {...rest}
        >
          {children}
        </Link>
      );
    }
  };
  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Typography component="div" color="textPrimary">
        <Markdown components={markdownComponent}>{content}</Markdown>
      </Typography>
    </Card>
  );
};

const AutoSolver = () => {
  const settings = useSettings();
  const [taskData, setTaskData] = useState({
    task_name: 'test',
    task: '',
    data_locations: []
  });
  const [chunks, setChunks] = useState([]);
  const [session, setSession] = useState(null);
  console.log('current session', session);
  const [eventSourceInstance, setEventSourceInstance] = useState(null);
  console.log(eventSourceInstance);
  const [graphHTML, setGraphHTML] = useState('');

  const [graphCode, setGraphCode] = useState('');
  const [operationCode, setOperationCode] = useState('');

  const updateTaskDetail = (taskDetail) => {
    setTaskData((taskData) => {
      return { ...taskData, task: taskDetail };
    });
  };

  const updateTaskDataLocations = (locations) => {
    setTaskData((taskData) => {
      return { ...taskData, data_locations: locations.split('\n') };
    });
  };

  // const appendChunkFromMessage = (content) => {
  //   setChunks((c) => [...c, content]);
  // };

  const ctrl = new AbortController();

  // const fetchStreamApi = async (taskData) => {
  //   setChunks([]);
  //   await fetchEventSource(solverApi, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Cache-Control': 'no-cache',
  //       Connection: 'Keep-Alive'
  //     },
  //     body: JSON.stringify(taskData),
  //     signal: ctrl.signal,
  //     openWhenHidden: true,
  //     onmessage: (msg) => {
  //       appendChunkFromMessage(msg.data);
  //     },
  //     onerror: (err) => {
  //       throw err;
  //     },
  //     onclose: () => {
  //       console.info('Server closed');
  //     }
  //   });
  // };
  const fetchStreamApi = async (taskData) => {
    const response = await axios.post(
      `${solverURL}/generate_session`,
      taskData
    );
    setSession(response.data?.session_id);
  };

  const getGraphCode = async () => {
    const eventSource = new EventSource(
      `${solverURL}/${session}/get_graph_code`
    );
    eventSource.onmessage = function (event) {
      setGraphCode((prev) => prev + event.data);
      console.log('New message:', event.data);
    };

    eventSource.onerror = function (error) {
      console.error('EventSource failed:', error);
      eventSource.close();
    };
    eventSource.addEventListener('close', (event) => {
      console.log('Server closed the stream');
      eventSource.close();
    });
    setEventSourceInstance(eventSource);
  };

  const getGraphHTML = async () => {
    try {
      const response = await axios.get(
        `${solverURL}/${session}/get_graph_html`
      );
      setGraphHTML(response.data);
    } catch (error) {
      console.error('Error fetching HTML:', error);
    }
  };

  const getOperationCode = async () => {
    const eventSource = new EventSource(
      `${solverURL}/${session}/get_operation_code`
    );
    eventSource.onmessage = function (event) {
      setOperationCode((prev) => prev + event.data);
      console.log('New message:', event.data);
    };

    eventSource.onerror = function (error) {
      console.error('EventSource failed:', error);
      eventSource.close();
    };
    eventSource.addEventListener('close', (event) => {
      console.log('Server closed the stream');
      eventSource.close();
    });
    setEventSourceInstance(eventSource);
  };

  const reset = useCallback(() => {
    eventSourceInstance.close();
    ctrl.abort();
    setChunks([]);
  }, []);

  // const renderMessage = (content) => {
  //   switch (content.type) {
  //     case 'html':
  //       return (
  //         <iframe
  //           srcDoc={content.data}
  //           width="100%"
  //           height={800}
  //           title="Web frame"
  //         />
  //       );
  //     case 'image':
  //       return <img src={content.data} alt="Rendered content" />;
  //     default:
  //       return <pre>{content.data}</pre>;
  //   }
  // };

  useEffect(() => {
    setTaskData(testTaskData);
  }, []);

  return (
    <>
      <Helmet>
        <title>GeoPilot auto solver | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Box sx={{ mb: 2 }}>
            <Grid container rowSpacing={2}>
              <Grid item lg={2}>
                <Typography color="textSecondary">Task detail</Typography>
              </Grid>
              <Grid item lg={10}>
                <TextField
                  multiline
                  sx={{ width: '100%' }}
                  minRows={2}
                  value={taskData.task}
                  onChange={(e) => {
                    updateTaskDetail(e.target.value);
                  }}
                ></TextField>
              </Grid>
              <Grid item lg={2}>
                <Typography color="textSecondary">
                  Data location and description <br />
                  (one line per data)
                </Typography>
              </Grid>
              <Grid item lg={10}>
                <TextField
                  multiline
                  minRows={2}
                  sx={{ width: '100%' }}
                  value={taskData.data_locations.join('\n')}
                  onChange={(e) => {
                    updateTaskDataLocations(e.target.value);
                  }}
                ></TextField>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => {
                    fetchStreamApi(taskData);
                  }}
                >
                  Query
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    reset();
                  }}
                >
                  Reset
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    getGraphCode();
                  }}
                >
                  getGraphCode
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    getGraphHTML();
                  }}
                >
                  getGraphHTML
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    getOperationCode();
                  }}
                >
                  getOperationCode
                </Button>
              </Grid>
            </Grid>
          </Box>
          {chunks.map((c, index) => (
            <Card key={`step-${index}`} sx={{ mb: 2, p: 2 }}>
              <Typography>{c}</Typography>
            </Card>
          ))}
          <CustomMarkDown content={graphCode} />
          {graphHTML && (
            <iframe
              width={'100%'}
              height={800}
              title="Solution code"
              srcDoc={graphHTML}
            ></iframe>
          )}
          <CustomMarkDown content={operationCode} />
        </Container>
      </Box>
    </>
  );
};

export default AutoSolver;
