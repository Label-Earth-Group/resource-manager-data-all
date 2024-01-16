import { fetchEventSource } from '@microsoft/fetch-event-source';

import {
  Box,
  Container,
  Card,
  Button,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { useSettings } from 'design';
import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

const solverApi = 'http://54.212.38.192:8086/stream_suite';

const testTaskData = {
  task_name: 'test',
  task: '1) Find out Census tracts that contain hazardous waste facilities, then comppute and print out the population living in those tracts. The study area is North Carolina (NC), US. 2) Generate a population choropleth map for all tract polygons in NC, rendering the color by population; and then highlight the borders of tracts that have hazardous waste facilities. Please draw all polygons, not only the highlighted ones. The map size is 15*10 inches.',
  data_locations: [
    'NC hazardous waste facility ESRI shape file: https://github.com/gladcolor/LLM-Geo/raw/master/overlay_analysis/HW_Sites_EPSG4326.zip.',
    "NC tract boundary shapefile: https://github.com/gladcolor/LLM-Geo/raw/master/overlay_analysis/tract_37_EPSG4326.zip. The tract ID column is 'GEOID', data types is integer.",
    "NC tract population CSV file: https://github.com/gladcolor/LLM-Geo/raw/master/overlay_analysis/NC_tract_population.csv. The population is stored in 'TotalPopulation' column. The tract ID column is 'GEOID', data types is integer."
  ]
};

const AutoSolver = () => {
  const settings = useSettings();
  const [taskData, setTaskData] = useState({
    task_name: 'test',
    task: '',
    data_locations: []
  });
  const [chunks, setChunks] = useState([]);

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

  const appendChunkFromMessage = (content) => {
    setChunks((c) => [...c, content]);
  };

  const ctrl = new AbortController();

  const fetchStreamApi = async (taskData) => {
    setChunks([]);
    await fetchEventSource(solverApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Connection: 'Keep-Alive'
      },
      body: JSON.stringify(taskData),
      signal: ctrl.signal,
      openWhenHidden: true,
      onmessage: (msg) => {
        appendChunkFromMessage(msg.data);
      },
      onerror: (err) => {
        throw err;
      },
      onclose: () => {
        console.info('Server closed');
      }
    });
  };

  const reset = useCallback(() => {
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
              </Grid>
            </Grid>
          </Box>
          {chunks.map((c, index) => (
            <Card key={`step-${index}`} sx={{ mb: 2, p: 2 }}>
              <Typography>{c}</Typography>
            </Card>
          ))}
        </Container>
      </Box>
    </>
  );
};

export default AutoSolver;
