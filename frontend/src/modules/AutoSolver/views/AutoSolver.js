import {
  Box,
  Button,
  Container,
  Card,
  CircularProgress,
  Grid,
  IconButton,
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
import { solverURL } from 'utils/constants.js';

const testTaskData = {
  task_name: 'test',
  task: '1) Find out Census tracts that contain hazardous waste facilities, then compute and print out the population living in those tracts. The study area is North Carolina (NC), US. 2) Generate a population choropleth map for all tract polygons in NC, rendering the color by population; and then highlight the borders of tracts that have hazardous waste facilities. Please draw all polygons, not only the highlighted ones. The map size is 15*10 inches.',
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
    <Card sx={{ p: 2, mt: 2, mb: 2, width: '100%', overflowX: 'auto' }}>
      <Typography component="div" color="textPrimary">
        <Markdown components={markdownComponent}>{content}</Markdown>
      </Typography>
    </Card>
  );
};

const CustomTriggerButton = ({
  session,
  startAction,
  actionName,
  isFetching = null,
  stopAction = null
}) => {
  return (
    <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
      <Button
        variant="contained"
        disabled={!Boolean(session)}
        color="secondary"
        onClick={startAction}
        startIcon={isFetching && <CircularProgress size={24} />}
      >
        {actionName}
      </Button>
      {isFetching && (
        <IconButton aria-label="stop_stream" onClick={stopAction}>
          <StopCircleOutlinedIcon />
        </IconButton>
      )}
    </Box>
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

  const [graphCode, setGraphCode] = useState('');
  const [graphHTML, setGraphHTML] = useState('');
  const [operationCode, setOperationCode] = useState('');
  const [assemblyCode, setAssemblyCode] = useState('');
  const [executeCodePrint, setExecuteCodePrint] = useState('');
  const [finalOutputFiles, setFinalOutputFiles] = useState([]);
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
    // setSession('276ce93b-c3b5-4560-91c3-86c4f2a2c7b6');
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

  const { startEventSource: getGraphCode, status: graphCodeStatus } =
    useEventSource({
      url: `${session}/get_graph_code`,
      setContent: setGraphCode,
      onGoingEventSource,
      setOnGoingEventSource
    });

  // once the getGraphCode is finished, get the graph html
  useEffect(() => {
    const getGraphHTML = async () => {
      console.log('get graph html');
      try {
        const response = await axios.get(
          `${solverURL}/${session}/get_graph_html`
        );
        setGraphHTML(response.data);
      } catch (error) {
        console.error('Error fetching HTML:', error);
      }
    };
    graphCodeStatus === 'Finished' && getGraphHTML();
  }, [graphCodeStatus, session]);
  console.log('graphCodeStatus', graphCodeStatus);

  const { startEventSource: getOperationCode, status: operationCodeStatus } =
    useEventSource({
      url: `${session}/get_operation_code`,
      setContent: setOperationCode,
      onGoingEventSource,
      setOnGoingEventSource
    });

  const { startEventSource: getAssemblyCode, status: assemblyCodeStatus } =
    useEventSource({
      url: `${session}/get_assembly_code`,
      setContent: setAssemblyCode,
      onGoingEventSource,
      setOnGoingEventSource
    });

  const {
    startEventSource: getExecuteCodePrint,
    status: getExecuteCodePrintStatus
  } = useEventSource({
    url: `${session}/execute_complete_code`,
    setContent: setExecuteCodePrint,
    onGoingEventSource,
    setOnGoingEventSource
  });

  // once the ExecuteCodePrint is finished, get the final output
  useEffect(() => {
    const getFinalOutput = async () => {
      try {
        const response = await axios.get(
          `${solverURL}/${session}/list_output_files`
        );
        console.log('final output', response);
        setFinalOutputFiles(response.data);
      } catch (error) {
        console.error('Error fetching HTML:', error);
      }
    };
    getExecuteCodePrintStatus === 'Finished' && getFinalOutput();
  }, [getExecuteCodePrintStatus, session]);

  const reset = useCallback(() => {
    onGoingEventSource?.close();
    setOnGoingEventSource(null);
    setSession(null);
    setGraphCode('');
    setGraphHTML('');
    setOperationCode('');
    setAssemblyCode('');
    setExecuteCodePrint('');
    setFinalOutputFiles([]);
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
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              flex: 1,
              width: '100%',
              overflowY: 'auto',
              display: 'flex', // Use flexbox
              flexDirection: 'column',
              justifyContent: 'center', // Center content vertically
              alignItems: 'center'
            }}
          >
            {session && (
              <CustomTriggerButton
                session={session}
                startAction={getGraphCode}
                actionName={'Generate Graph Code'}
                isFetching={graphCodeStatus === 'Fetching'}
                stopAction={stopStream}
              ></CustomTriggerButton>
            )}
            {graphCode && <CustomMarkDown content={graphCode} />}
            {graphHTML && (
              <Card sx={{ p: 2, mb: 2, width: '100%', overflow: 'hidden' }}>
                <iframe
                  style={{
                    width: '100%',
                    height: '800px',
                    overflow: 'hidden',
                    border: 'none'
                  }}
                  title="Solution Operation Graph"
                  scrolling="no"
                  srcDoc={graphHTML}
                ></iframe>
              </Card>
            )}
            {graphHTML && (
              <CustomTriggerButton
                session={session}
                startAction={getOperationCode}
                actionName={'Generate Code for Each Operation'}
                isFetching={operationCodeStatus === 'Fetching'}
                stopAction={stopStream}
              ></CustomTriggerButton>
            )}
            {operationCode && <CustomMarkDown content={operationCode} />}
            {operationCodeStatus === 'Finished' && (
              <CustomTriggerButton
                session={session}
                startAction={getAssemblyCode}
                actionName={'Generate Assemly Code'}
                isFetching={assemblyCodeStatus === 'Fetching'}
                stopAction={stopStream}
              ></CustomTriggerButton>
            )}
            {assemblyCode && <CustomMarkDown content={assemblyCode} />}
            {assemblyCodeStatus === 'Finished' && (
              <CustomTriggerButton
                session={session}
                startAction={getExecuteCodePrint}
                actionName={'Generate Final Output'}
                isFetching={getExecuteCodePrintStatus === 'Fetching'}
                stopAction={stopStream}
              ></CustomTriggerButton>
            )}
            {executeCodePrint && <CustomMarkDown content={executeCodePrint} />}
            {finalOutputFiles.length > 0 && (
              <Card sx={{ p: 2, mb: 2, width: '100%' }}>
                {finalOutputFiles
                  .filter((filename) => /\.(png|jpg)$/i.test(filename))
                  .map((filename) => (
                    <img
                      key={filename}
                      width={'100%'}
                      alt="result"
                      src={`${solverURL}/${session}/get_file/${filename}`}
                    ></img>
                  ))}
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AutoSolver;
