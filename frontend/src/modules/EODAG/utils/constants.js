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
    id: '1',
    label: 'LandSat-4 / 5 / TM',
    children: [
      { id: '1-1', label: 'Level-1 product' },
      { id: '1-2', label: 'Level-2 Surface Reflectance product' },
      { id: '1-3', label: 'Level-2 Surface Temperature product' },
      { id: '1-4', label: 'U.S. ARD Surface Reflectance product' },
      { id: '1-5', label: 'U.S. ARD Surface Temperature product' },
      { id: '1-6', label: 'Level-3 ...' }
    ]
  },
  {
    id: '2',
    label: 'LandSat-7 / ETM+',
    children: [
      { id: '2-1', label: 'Level-1 product' },
      { id: '2-2', label: 'Level-2 Surface Reflectance product' },
      { id: '2-3', label: 'Level-2 Surface Temperature product' },
      { id: '2-4', label: 'U.S. ARD Surface Reflectance product' },
      { id: '2-5', label: 'U.S. ARD Surface Temperature product' },
      { id: '2-6', label: 'Level-3 ...' }
    ]
  },
  {
    id: '3',
    label: 'LandSat-8/9 / OLI, TIRS',
    children: [
      { id: '3-1', label: 'Level-1 product' },
      { id: '3-2', label: 'Level-2 Surface Reflectance product' },
      { id: '3-3', label: 'Level-2 Surface Temperature product' },
      { id: '3-4', label: 'U.S. ARD Surface Reflectance product' },
      { id: '3-5', label: 'U.S. ARD Surface Temperature product' },
      { id: '3-6', label: 'Level-3 ...' }
    ]
  },
  {
    id: '4',
    label: 'Sentinel-1 / C-SAR',
    children: [
      { id: '4-1', label: 'Level-0 RAW product' },
      { id: '4-2', label: 'Level-1 GRD product' },
      { id: '4-3', label: 'Level-1 SLC product' },
      { id: '4-4', label: 'Level-2 OCN product' }
    ]
  },
  {
    id: '5',
    label: 'Sentinel-2 / MSI',
    children: [
      { id: '5-1', label: 'Level-1C product' },
      { id: '5-2', label: 'Level-2A product' }
    ]
  }
];
