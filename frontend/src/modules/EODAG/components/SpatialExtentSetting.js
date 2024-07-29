/* eslint-disable no-unused-vars */
import { Button, Box, Typography, Tabs, Tab } from '@mui/material';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSettings } from 'design';
import shp from 'shpjs';

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
  const [currentTab, setCurrentTab] = useState('区域绘制');
  const tabs = ['区域绘制', '行政区选择', '文件导入'];
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
        variant="fullWidth"
        sx={{ width: '100%', p: 0 }}
      >
        {tabs.map((tab) => {
          return (
            <Tab
              key={tab}
              label={tab}
              value={tab}
              // icon={settings.tabIcons ? <Search /> : null}
              iconPosition="start"
            />
          );
        })}
      </Tabs>
      {currentTab === '文件导入' && (
        <FileUploader setGeoJsonData={setSpatialExtent} />
      )}
    </>
  );
};
