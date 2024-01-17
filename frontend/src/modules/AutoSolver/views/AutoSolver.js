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
import { useEventSource } from '../services/useEventSource';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';

//const solverApi = 'http://54.212.38.192:8086/stream_suite';
const solverURL = 'http://10.168.34.61:8081'; //the address of the server started from code synced from LabelEarth/LLM-Geo

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
    <Card sx={{ p: 2, mt: 2, overflowX: 'scroll' }}>
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
  const [session, setSession] = useState(null);
  console.log('current session', session);
  const [onGoingEventSource, setOnGoingEventSource] = useState(null);
  console.log('active', Boolean(onGoingEventSource));

  const [graphCode, setGraphCode] = useState('');
  const [graphHTML, setGraphHTML] = useState('');
  const [operationCode, setOperationCode] = useState('');
  const [assemblyCode, setAssemblyCode] = useState('');
  const [finalOutputFiles, setFinalOutputFiles] = useState('');
  console.log(finalOutputFiles);

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

  useEffect(() => {
    setTaskData(testTaskData);
  }, []);

  // a cleanup mechanism for EventSource when the component unmounts
  useEffect(() => {
    return () => {
      if (onGoingEventSource) {
        onGoingEventSource.close();
        setOnGoingEventSource(null);
      }
    };
  }, []);

  const registerSession = async (taskData) => {
    const response = await axios.post(
      `${solverURL}/generate_session`,
      taskData
    );
    setSession(response.data?.session_id);
  };

  const { startEventSource: getGraphCode, isFinished: graphCodeFinished } =
    useEventSource({
      url: `${session}/get_graph_code`,
      onMessage: (data) => {
        setGraphCode((prev) => prev + data);
      },
      onGoingEventSource,
      setOnGoingEventSource
    });

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

  const {
    startEventSource: getOperationCode,
    isFinished: operationCodeFinished
  } = useEventSource({
    url: `${session}/get_operation_code`,
    onMessage: (data) => {
      setOperationCode((prev) => prev + data);
    },
    onGoingEventSource,
    setOnGoingEventSource
  });

  const {
    startEventSource: getAssemblyCode,
    isFinished: assemblyCodeFinished
  } = useEventSource({
    url: `${session}/get_assembly_code`,
    onMessage: (data) => {
      setAssemblyCode((prev) => prev + data);
    },
    onGoingEventSource,
    setOnGoingEventSource
  });

  const getFinalOutput = async () => {
    try {
      const response = await axios.get(
        `${solverURL}/${session}/execute_complete_code`
      );
      console.log('final output', response);
      setFinalOutputFiles(response.data);
    } catch (error) {
      console.error('Error fetching HTML:', error);
    }
  };

  const reset = useCallback(() => {
    onGoingEventSource?.close();
    setOnGoingEventSource(null);
    setSession(null);
    setGraphCode('');
    setGraphHTML('');
    setOperationCode('');
    setAssemblyCode('');
  }, [onGoingEventSource]);

  const stopStream = useCallback(() => {
    onGoingEventSource?.close();
    setOnGoingEventSource(null);
  }, [onGoingEventSource]);

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
                    registerSession(taskData);
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
                  disabled={!Boolean(session)}
                  color="secondary"
                  onClick={getGraphCode}
                >
                  getGraphCode
                  {Boolean(onGoingEventSource) && (
                    <StopCircleOutlinedIcon onClick={stopStream} />
                  )}
                </Button>
                {graphCodeFinished && (
                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    color="secondary"
                    disabled={!Boolean(session)}
                    onClick={() => {
                      getGraphHTML();
                    }}
                  >
                    getGraphHTML
                    {Boolean(onGoingEventSource) && (
                      <StopCircleOutlinedIcon onClick={stopStream} />
                    )}
                  </Button>
                )}
                {graphCodeFinished && (
                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    color="secondary"
                    disabled={!Boolean(session)}
                    onClick={() => {
                      getOperationCode();
                    }}
                  >
                    getOperationCode
                    {Boolean(onGoingEventSource) && (
                      <StopCircleOutlinedIcon onClick={stopStream} />
                    )}
                  </Button>
                )}
                {operationCodeFinished && (
                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    color="secondary"
                    disabled={!Boolean(session)}
                    onClick={() => {
                      getAssemblyCode();
                    }}
                  >
                    getAssemblyCode
                    {Boolean(onGoingEventSource) && (
                      <StopCircleOutlinedIcon onClick={stopStream} />
                    )}
                  </Button>
                )}
                {assemblyCodeFinished && (
                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    color="secondary"
                    disabled={!Boolean(session)}
                    onClick={() => {
                      getFinalOutput();
                    }}
                  >
                    getFinalOutput
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
          {graphCode && <CustomMarkDown content={graphCode} />}
          {graphHTML && (
            <iframe
              width={'100%'}
              height={800}
              title="Solution code"
              srcDoc={graphHTML}
            ></iframe>
          )}
          {operationCode && <CustomMarkDown content={operationCode} />}
          {assemblyCode && <CustomMarkDown content={assemblyCode} />}
          {finalOutputFiles &&
            finalOutputFiles
              .filter((filename) => /\.(png|jpg)$/i.test(filename))
              .map((filename) => (
                <img
                  width={'100%'}
                  alt="result"
                  src={`${solverURL}/${session}/return_file?file_name=${filename}`}
                ></img>
              ))}
        </Container>
      </Box>
    </>
  );
};

export default AutoSolver;
