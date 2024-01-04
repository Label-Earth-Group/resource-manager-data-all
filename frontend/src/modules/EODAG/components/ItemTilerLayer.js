import { useDispatch } from 'globalErrors';
import { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';
import { useGetItemAssetTileJsonQuery } from 'modules/PGSTAC/services/titilerApi.ts';
import { useHandleError } from '../utils/utils.js';

const ItemTilerLayer = (props) => {
  const [tileApi, setTileApi] = useState(null);
  const dispatch = useDispatch();

  const { collectionID, itemID, assets } = props;

  const { data: tileJson, error } = useGetItemAssetTileJsonQuery({
    collectionID,
    itemID,
    assets
  });

  useHandleError(error, dispatch);
  console.log('tile json', tileJson);

  const titilerEntrypoint = 'http://118.31.15.5:8082';

  const tileJsonApi = `${titilerEntrypoint}/collections/${collectionID}/items/${itemID}/WebMercatorQuad/tilejson.json?assets=${assets}`;

  useEffect(() => {
    fetch(tileJsonApi)
      .then((res) => {
        if (res.ok) return res.json();
        else {
          throw new Error('Cannot access TiTiler service.');
        }
      })
      .then((data) => {
        setTileApi(data.tiles[0]);
      })
      .catch((err) => {
        dispatch({ type: 'SET_ERROR', error: err.message });
      });
  }, [dispatch, tileJsonApi]);

  return tileApi && <TileLayer url={tileApi} />;
};

export default ItemTilerLayer;
