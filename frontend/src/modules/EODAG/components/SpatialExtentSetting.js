/* eslint-disable no-unused-vars */
import { Button, Box, Typography, Tabs, Tab } from '@mui/material';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSettings } from 'design';
import shp from 'shpjs';
import PublicIcon from '@mui/icons-material/Public';
import PolylineIcon from '@mui/icons-material/Polyline';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const FileUploader = (setGeoJsonData) => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        let geojson;

        if (file.name.endsWith('.shp')) {
          geojson = await shp(arrayBuffer);
          console.log('geojson', geojson);
        }
        // else if (file.name.endsWith('.kml')) {
        //   geojson = parseKML(
        //     new DOMParser().parseFromString(e.target.result, 'text/xml')
        //   );
        // } else if (file.name.endsWith('.gpkg')) {
        //   geojson = await parseGPKG(arrayBuffer);
        // }

        setGeoJsonData(geojson);
      };
      reader.readAsArrayBuffer(file);
      //   if (file.name.endsWith('.kml')) {
      //     reader.readAsText(file);
      //   } else {
      //     reader.readAsArrayBuffer(file);
      //   }
    }
  };
  return (
    <Box>
      <input type="file" onChange={handleFileUpload} />
    </Box>
  );
};

export const SpatialExtentSetting = ({ setSpatialExtent }) => {
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('draw');
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
  return (
    <>
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
              sx={{ px: 1, py: 0, minHeight: 48 }}
            />
          );
        })}
      </Tabs>
      {currentTab === 'upload' && (
        <FileUploader setGeoJsonData={setSpatialExtent} />
      )}
    </>
  );
};
