/* eslint-disable no-unused-vars */
import { Button, Box, Typography, Tabs, Tab } from '@mui/material';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSettings } from 'design';
import shp from 'shpjs';
import PublicIcon from '@mui/icons-material/Public';
import PolylineIcon from '@mui/icons-material/Polyline';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import * as toGeoJSON from 'togeojson';
// import { GeoPackageAPI } from '@ngageoint/geopackage';

// async function parseGPKG(arrayBuffer) {
//   const geoPackage = await GeoPackageAPI.open(arrayBuffer);
//   const tables = await geoPackage.getFeatureTables();
//   let geojson = { type: 'FeatureCollection', features: [] };

//   for (let table of tables) {
//     const featureDao = geoPackage.getFeatureDao(table);
//     const iterator = featureDao.queryForAll();
//     for (let row of iterator) {
//       const feature = featureDao.getFeatureRow(row);
//       geojson.features.push(feature.geometry.toGeoJSON());
//     }
//   }
//   return geojson;
// }

const FileUploader = ({ setGeoJsonData }) => {
  const handleShapefileUpload = async (files) => {
    const fileMap = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        fileMap[file.name] = arrayBuffer;

        if (Object.keys(fileMap).length === files.length) {
          const shpFiles = {};
          Object.keys(fileMap).forEach((fileName) => {
            const extension = fileName.split('.').pop();
            shpFiles[extension] = fileMap[fileName];
          });

          if (shpFiles.shp) {
            shp(shpFiles).then((result) => setGeoJsonData(result));
          }
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSingleFileUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      let geojson;

      if (file.name.endsWith('.kml')) {
        geojson = toGeoJSON.kml(
          new DOMParser().parseFromString(e.target.result, 'text/xml')
        );
      }
      //   else if (file.name.endsWith('.gpkg')) {
      //     geojson = await parseGPKG(arrayBuffer);
      //   }
      else if (file.name.endsWith('.zip')) {
        geojson = await shp(arrayBuffer);
      }

      setGeoJsonData(geojson);
    };

    if (file.name.endsWith('.kml')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const shpFileExtensions = ['.shp', '.dbf', '.prj', '.cpg'];

    if (
      files.length > 1 ||
      shpFileExtensions.some((ext) => files[0].name.endsWith(ext))
    ) {
      handleShapefileUpload(files);
    } else {
      handleSingleFileUpload(files[0]);
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
  const [storedSpatialData, setStoredSpatialData] = useState({
    drawn: null,
    selected: null,
    uploaded: null
  });
  console.info('storedSpatialData', storedSpatialData);
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
        <FileUploader
          setGeoJsonData={(geojson) => {
            setStoredSpatialData({
              ...storedSpatialData,
              uploaded: geojson
            });
          }}
        />
      )}
    </>
  );
};
