// TODO: fetch these constants via EODAG api

export const providers = [
  {
    label: 'usgs',
    description: 'U.S geological survey catalog for Landsat products'
  },

  {
    label: 'theia',
    description:
      'French National Space Agency (CNES) value-adding products for Land surfaces'
  },

  {
    label: 'peps',
    description:
      'French National Space Agency (CNES) catalog for Sentinel products'
  },

  { label: 'aws_eos', description: 'EOS search for Amazon public datasets' },

  { label: 'creodias', description: 'CloudFerro DIAS' },

  { label: 'onda', description: 'Serco DIAS' },

  { label: 'astraea_eod', description: 'Astraea Earth OnDemand STAC API' },

  { label: 'usgs_satapi_aws', description: 'USGS Landsatlook SAT API' },

  { label: 'earth_search', description: 'Element84 Earth Search' },

  {
    label: 'earth_search_cog',
    description: 'Element84 Earth Search of Cloud-Optimized GeoTIFF (COG)'
  },

  {
    label: 'earth_search_gcs',
    description: 'Element84 Earth Search and Google Cloud Storage download'
  },

  {
    label: 'ecmwf',
    description: 'European Centre for Medium-Range Weather Forecasts'
  },

  { label: 'cop_ads', description: 'Copernicus Atmosphere Data Store' },

  { label: 'cop_cds', description: 'Copernicus Climate Data Store' },

  { label: 'sara', description: 'Sentinel Australasia Regional Access' },

  { label: 'meteoblue', description: 'Meteoblue forecast' },

  { label: 'cop_dataspace', description: 'Copernicus Data Space' },

  { label: 'planetary_computer', description: 'Microsoft Planetary Computer' },

  {
    label: 'hydroweb_next',
    description: 'hydroweb.next thematic hub for hydrology data access'
  },

  { label: 'wekeo', description: 'WEkEO Copernicus and Sentinel data' }
];

export const platform = [
  { label: 'CBERS' },
  { label: 'CEMS' },
  { label: 'LANDSAT8' },
  { label: 'Sentinal-1' },
  { label: 'Sentinal-2' }
];

export const processingLevel = [
  { label: 'L1' },
  { label: 'L2' },
  { label: 'L3' },
  { label: 'L4' }
];

export const sensorType = [
  { label: 'ATMOSPHERIC' },
  { label: 'OPTICAL' },
  { label: 'RADAR' }
];

export const productTree = [
  {
    id: 'sensor_type:OPTICAL',
    label: 'Optical',
    children: [
      {
        id: 'platform:LANDSAT_4_5:instruments:TM',
        label: 'LandSat-4/5 | TM',
        children: [
          {
            id: 'product:LANDSAT_4_5_C2L1',
            label: 'Level-1 product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [{ property: 'platform' }, ['LANDSAT_4', 'LANDSAT_5']]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['TM']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2l1']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_4_5_C2L2_SR',
            label: 'Level-2 Surface Reflectance product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [{ property: 'platform' }, ['LANDSAT_4', 'LANDSAT_5']]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['TM']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2l2-sr']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_4_5_C2L2_ST',
            label: 'Level-2 Surface Temperature product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [{ property: 'platform' }, ['LANDSAT_4', 'LANDSAT_5']]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['TM']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2l2-st']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_4_5_C2ARD_SR',
            label: 'U.S. ARD Surface Reflectance product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [{ property: 'platform' }, ['LANDSAT_4', 'LANDSAT_5']]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['TM']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2ard-sr']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_4_5_C2ARD_ST',
            label: 'U.S. ARD Surface Temperature product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [{ property: 'platform' }, ['LANDSAT_4', 'LANDSAT_5']]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['TM']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2ard-st']
                }
              ]
            }
          }
        ]
      },
      {
        id: 'platform:LANDSAT_7:instruments:ETM',
        label: 'LandSat-7 | ETM+',
        children: [
          {
            id: 'product:LANDSAT_7_C2L1',
            label: 'Level-1 product',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'LANDSAT_7']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ETM']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2l1']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_7_C2L2_SR',
            label: 'Level-2 Surface Reflectance product',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'LANDSAT_7']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ETM']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2l2-sr']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_7_C2L2_ST',
            label: 'Level-2 Surface Temperature product',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'LANDSAT_7']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ETM']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2l2-st']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_7_C2ARD_SR',
            label: 'U.S. ARD Surface Reflectance product',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'LANDSAT_7']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ETM']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2ard-sr']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_7_C2ARD_ST',
            label: 'U.S. ARD Surface Temperature product',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'LANDSAT_7']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ETM']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2ard-st']
                }
              ]
            }
          }
        ]
      },
      {
        id: 'platform:LANDSAT_8_9:instruments:OLI_TIRS',
        label: 'LandSat-8/9 | OLI, TIRS',
        children: [
          {
            id: 'product:LANDSAT_8_9_C2L1',
            label: 'Level-1 product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [{ property: 'platform' }, ['LANDSAT_8', 'LANDSAT_9']]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['OLI', 'TIRS']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2l1']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_8_9_C2L2_SR',
            label: 'Level-2 Surface Reflectance product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [{ property: 'platform' }, ['LANDSAT_8', 'LANDSAT_9']]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['OLI', 'TIRS']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2l2-sr']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_8_9_C2L2_ST',
            label: 'Level-2 Surface Temperature product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [{ property: 'platform' }, ['LANDSAT_8', 'LANDSAT_9']]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['OLI', 'TIRS']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2l2-st']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_8_9_C2ARD_SR',
            label: 'U.S. ARD Surface Reflectance product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [{ property: 'platform' }, ['LANDSAT_8', 'LANDSAT_9']]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['OLI', 'TIRS']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2ard-sr']
                }
              ]
            }
          },
          {
            id: 'product:LANDSAT_8_9_C2ARD_ST',
            label: 'U.S. ARD Surface Temperature product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [{ property: 'platform' }, ['LANDSAT_8', 'LANDSAT_9']]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['OLI', 'TIRS']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'landsat-c2ard-sr']
                }
              ]
            }
          }
        ]
      },
      {
        id: 'platform:SENTINEL_2:instruments:MSI',
        label: 'Sentinel-2 | MSI',
        children: [
          {
            id: 'product:S2MSI1C',
            label: 'Level-1C Product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [
                    { property: 'platform' },
                    ['sentinel-2a', 'sentinel-2b']
                  ]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['MSI']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'S2MSI1C']
                }
              ]
            }
          },
          {
            id: 'product:S2MSI2A',
            label: 'Level-2A Product',
            filter: {
              op: 'and',
              args: [
                {
                  op: 'in',
                  args: [
                    { property: 'platform' },
                    ['sentinel-2a', 'sentinel-2b']
                  ]
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['MSI']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'S2MSI2A']
                }
              ]
            }
          }
        ]
      },
      {
        id: 'platform:TERRA:instruments:ASTER',
        label: 'Terra | ASTER',
        children: [
          {
            id: 'product:AST_L1A',
            label: 'Level-1A Reconstructed Unprocessed Instrument Data',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'TERRA']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ASTER']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'AST_L1A']
                }
              ]
            }
          },
          {
            id: 'product:AST_L1B',
            label: 'Level-1B Registered Radiance an the Sensor',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'TERRA']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ASTER']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'AST_L1B']
                }
              ]
            }
          },
          {
            id: 'product:AST_L1T',
            label:
              'Level-1T Registered Radiance at the Sensor (Precision Terrain Corrected)',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'TERRA']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ASTER']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'AST_L1T']
                }
              ]
            }
          },
          {
            id: 'product:AST_05',
            label: 'Level-2 Surface Emissivity',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'TERRA']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ASTER']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'AST_05']
                }
              ]
            }
          },
          {
            id: 'product:AST_07',
            label: 'Level-2 Surface Reflectance (VNIR & SWIR)',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'TERRA']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ASTER']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'AST_07']
                }
              ]
            }
          },
          {
            id: 'product:AST_08',
            label: 'Level-2 Surface Kinetic Temperature',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'TERRA']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ASTER']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'AST_08']
                }
              ]
            }
          },
          {
            id: 'product:AST_09',
            label: 'Level-2 Surface Radiance (VNIR & SWIR)',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'TERRA']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ASTER']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'AST_09']
                }
              ]
            }
          },
          {
            id: 'product:AST_09T',
            label: 'Level-2 Surface Radiance (TIR)',
            filter: {
              op: 'and',
              args: [
                {
                  op: '=',
                  args: [{ property: 'platform' }, 'TERRA']
                },
                {
                  op: 'a_overlaps',
                  args: [{ property: 'instruments' }, ['ASTER']]
                },
                {
                  op: '=',
                  args: [{ property: 'product:type' }, 'AST_09T']
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'sensor_type:SAR',
    label: 'SAR',
    children: [
      {
        id: 'platform:SENTINEL-1:instruments:SAR',
        label: 'Sentinel-1 | C-SAR',
        children: [
          {
            id: 'productCategory:RAW__0S',
            label: 'Level-0 RAW product',
            children: [
              {
                id: 'product:SM_RAW__0S',
                label: 'SM',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'RAW']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'SM']
                    }
                  ]
                }
              },
              {
                id: 'product:IW_RAW__0S',
                label: 'IW',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'RAW']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'IW']
                    }
                  ]
                }
              },
              {
                id: 'product:EW_RAW__0S',
                label: 'EW',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'RAW']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'EW']
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'productCategory:GRD__1S',
            label: 'Level-1 GRD product',
            children: [
              {
                id: 'product:SM_GRD__1S',
                label: 'SM',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'GRD']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'SM']
                    }
                  ]
                }
              },
              {
                id: 'product:IW_GRD__1S',
                label: 'IW',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'GRD']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'IW']
                    }
                  ]
                }
              },
              {
                id: 'product:EW_GRD__1S',
                label: 'EW',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'GRD']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'EW']
                    }
                  ]
                }
              },
              {
                id: 'product:WV_GRD__1S',
                label: 'WV',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'GRD']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'WV']
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'productCategory:SLC__1S',
            label: 'Level-1 SLC product',
            children: [
              {
                id: 'product:SM_SLC__1S',
                label: 'SM',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'SLC']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'IW']
                    }
                  ]
                }
              },
              {
                id: 'product:IW_SLC__1S',
                label: 'IW',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'SLC']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'IW']
                    }
                  ]
                }
              },
              {
                id: 'product:EW_SLC__1S',
                label: 'EW',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'GRD']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'EW']
                    }
                  ]
                }
              },
              {
                id: 'product:WV_SLC__1S',
                label: 'WV',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'GRD']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'WV']
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'productCategory:OCN__2S',
            label: 'Level-2 OCN product',
            children: [
              {
                id: 'product:SM_OCN__2S',
                label: 'SM',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'OCN']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'SM']
                    }
                  ]
                }
              },
              {
                id: 'product:IW_OCN__2S',
                label: 'IW',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'OCN']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'IW']
                    }
                  ]
                }
              },
              {
                id: 'product:EW_OCN__2S',
                label: 'EW',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'OCN']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'EW']
                    }
                  ]
                }
              },
              {
                id: 'product:WV_OCN__2S',
                label: 'WV',
                filter: {
                  op: 'and',
                  args: [
                    {
                      op: 'in',
                      args: [
                        { property: 'platform' },
                        ['sentinel-1a', 'sentinel-1b']
                      ]
                    },
                    {
                      op: 'a_overlaps',
                      args: [{ property: 'instruments' }, ['SAR']]
                    },
                    {
                      op: '=',
                      args: [{ property: 'product:type' }, 'OCN']
                    },
                    {
                      op: '=',
                      args: [{ property: 'sar:instrument_mode' }, 'WV']
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
