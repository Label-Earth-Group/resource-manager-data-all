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
