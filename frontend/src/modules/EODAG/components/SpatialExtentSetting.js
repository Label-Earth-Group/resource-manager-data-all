/* eslint-disable no-unused-vars */
import { Box, Tabs, Tab } from '@mui/material';

import React, { useState, useEffect } from 'react';
import { useSettings } from 'design';
import PublicIcon from '@mui/icons-material/Public';
import PolylineIcon from '@mui/icons-material/Polyline';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { GeoFileLoader } from '../components/GeoFileLoader.js';
import { RegionSelector } from '../components/RegionSelector.js';

export const SpatialExtentSetting = ({ setSpatialExtent }) => {
  const tabs = [
    {
      key: 'draw',
      label: '区域绘制',
      icon: <PolylineIcon />
    },
    {
      key: 'select',
      label: '区域选择',
      icon: <PublicIcon />
    },
    {
      key: 'upload',
      label: '文件导入',
      icon: <FileUploadIcon />
    }
  ];

  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('draw');
  const [storedUIData, setStoredUIData] = useState({
    draw: null,
    select: null,
    upload: { fileNames: [], loading: false }
  });
  console.log('storedUIData', storedUIData['upload']);
  const [storedSpatialData, setStoredSpatialData] = useState({
    draw: null,
    select: null,
    upload: null
  });
  console.info('storedSpatialData', storedSpatialData);
  useEffect(() => {
    setSpatialExtent(storedSpatialData[currentTab]);
  }, [currentTab, storedSpatialData, setSpatialExtent]);

  return (
    <Box>
      <Tabs
        indicatorColor="primary"
        onChange={(event, value) => {
          setCurrentTab(value);
        }}
        scrollButtons="auto"
        textColor="primary"
        value={currentTab}
        variant="standard"
      >
        {tabs.map((tab) => {
          return (
            <Tab
              key={tab.key}
              label={tab.label}
              value={tab.key}
              icon={tab.icon}
              iconPosition="start"
            />
          );
        })}
      </Tabs>
      {currentTab === 'upload' && (
        <GeoFileLoader
          uploadUIState={storedUIData['upload']}
          setUploadUIState={(newState) => {
            setStoredUIData((prevState) => ({
              ...prevState,
              upload:
                typeof newState === 'function'
                  ? newState(prevState['upload'])
                  : newState
            }));
          }}
          setGeoJsonData={(geojson) => {
            setStoredSpatialData({
              ...storedSpatialData,
              upload: geojson
            });
          }}
        />
      )}
      {currentTab === 'select' && <RegionSelector></RegionSelector>}
    </Box>
  );
};
