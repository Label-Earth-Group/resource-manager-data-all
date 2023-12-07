// import * as STAC from 'stac-js';
import axios from 'axios';
const eodagApi = process.env.REACT_APP_EODAG_API;

export const getCollections = async () => {
  const collections = axios
    .get(eodagApi + '/collections')
    .then((res) => res.data.collections);
  return collections;
};

export const EODAG_INSTRUMENT_INDEX = 0;
export const EODAG_CONSTELLATION_INDEX = 1;
export const EODAG_PLATFORM_INDEX = 2;
export const EODAG_PROCESSING_LEVEL_INDEX = 3;
export const EODAG_SENSOR_TYPE_INDEX = 4;

/**
 * Get summary as filters from EODAG collections,
 * directly from 'keyword' field, as each key has unique meaning.
 */
export const getSummary = (collections, summaryIndex) => {
  var summaryArray = [];
  collections.forEach((c) => {
    let s = c.keywords[summaryIndex];
    if (s) {
      if (s.includes(',')) {
        s.split(',').forEach((subS) => {
          if (!summaryArray.includes(subS)) {
            summaryArray.push(subS);
          }
        });
      } else {
        if (!summaryArray.includes(s)) {
          summaryArray.push(s);
        }
      }
    }
  });
  return summaryArray.sort();
};
