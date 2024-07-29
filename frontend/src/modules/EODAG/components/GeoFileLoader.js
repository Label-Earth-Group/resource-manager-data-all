import React, { useCallback } from 'react';
import {
  IconButton,
  Box,
  Typography,
  Tooltip,
  Paper,
  LinearProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDropzone } from 'react-dropzone';
import shp from 'shpjs';
import * as toGeoJSON from 'togeojson';

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

export const GeoFileLoader = ({
  uploadUIState,
  setUploadUIState,
  setGeoJsonData
}) => {
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
            shp(shpFiles).then((result) => {
              setGeoJsonData(result);
              setUploadUIState((prevState) => ({
                ...prevState,
                loading: false
              }));
            });
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
      } else if (file.name.endsWith('.zip')) {
        geojson = await shp(arrayBuffer);
      }
      //   else if (file.name.endsWith('.gpkg')) {
      //     geojson = await parseGPKG(arrayBuffer);
      //   }

      setGeoJsonData(geojson);
      setUploadUIState((prevState) => ({
        ...prevState,
        loading: false
      }));
    };

    if (file.name.endsWith('.kml')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); //阻止事件继续传播到父级元素
    setUploadUIState({ fileNames: [], loading: false });
    setGeoJsonData(null);
  };

  /**
   * user react drop zone to trigger file upload event
   * 使用useDropzone钩子来处理文件拖放操作，传入的onDrop函数将在文件被成功拖放时被调用。
   *
   * 此钩子提供了getRootProps和getInputProps两个函数：
   * getRootProps绑定在需要文件拖放到的元素上
   * getInputProps总是绑定在原生input组件上（否则会出错）
   */
  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploadUIState({
        fileNames: acceptedFiles.map((file) => file.name),
        loading: true
      });

      const shpFileExtensions = ['.shp', '.dbf', '.prj', '.cpg'];

      if (
        acceptedFiles.length > 1 ||
        shpFileExtensions.some((ext) => acceptedFiles[0].name.endsWith(ext))
      ) {
        handleShapefileUpload(acceptedFiles);
      } else {
        handleSingleFileUpload(acceptedFiles[0]);
      }
    },
    [handleShapefileUpload, handleSingleFileUpload, setUploadUIState]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { fileNames, loading } = uploadUIState;
  return (
    <Box
      alignItems="center"
      mb={2}
      sx={{
        width: '100%'
      }}
    >
      <div {...getRootProps()} style={{ width: '100%', position: 'relative' }}>
        <input {...getInputProps()} />
        <Paper
          sx={{
            padding: 2,
            backgroundColor: 'primary',
            border: '2px dashed',
            textAlign: 'center',
            cursor: 'pointer',
            width: '100%',
            margin: '0 auto',
            position: 'relative'
          }}
        >
          {loading && <LinearProgress />}
          {!loading && fileNames.length === 0 && (
            <Typography>
              Drag & drop files here, or click to select files
            </Typography>
          )}
          {!loading && fileNames.length > 0 && (
            <>
              <Tooltip
                title={
                  <div>
                    {fileNames.map((name) => (
                      <Typography key={name}>{name}</Typography>
                    ))}
                  </div>
                }
              >
                <Typography variant="body2">
                  {fileNames.length > 1
                    ? `${fileNames.length} files`
                    : fileNames[0]}
                </Typography>
              </Tooltip>
              <IconButton
                aria-label="delete"
                onClick={handleDelete}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8
                }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Paper>
      </div>
    </Box>
  );
};
