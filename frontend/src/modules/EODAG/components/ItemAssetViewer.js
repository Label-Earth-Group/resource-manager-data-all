import {
  Box,
  Button,
  List,
  ListSubheader,
  //ListItem,
  ListItemButton,
  ListItemText,
  Popper,
  //Typography,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  //   Search as SearchIcon,
  AutoAwesomeMotion as AutoAwesomeMotionIcon,
  Square as SquareIcon
} from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, ZoomControl } from 'react-leaflet';
import { TianDiTuTileLayer } from './TianDiTuTileLayer';
import { StacGeometryLayer, ItemTitilerLayer } from './StacMapLayer.js';
import { useGetItemAssetsInfoQuery } from 'modules/PGSTAC/services/titilerApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils/utils.js';
import { LeafletControl } from './LeafletControl.tsx';
// import { LeafletControlWrapper } from './LeafletControlWrapper.js';
// import L from 'leaflet';

const COMPOSITION = 'composition'; //constant for composition display

function calculateDefaultViewOptions(assetsInfo) {
  if (!assetsInfo) return null;
  const assets = Object.keys(assetsInfo);
  if (assets.includes('visual')) return 'visual';
}

/**
 * Note:
 * 1. Use Popper instead of Popover, since Popover would not react nicely to mouseEnter event.
 *    Setting disablePortal would make its inner select components ineffective, so do not set disablePortal.
 * 2. To make the Popper open when mouse moves from Button to Popper,
 *    add a timeout delay to the Button's mouseLeave which can be canceled by Popper's mouseEnter.
 *    Take care of the timeoutId, which should be recorded for later clearing it.
 *    (The timeoutId cannot be kept as react state, as the state would not be updated before the timeout. Use plain variable instead.)
 * 3. The current leaflet control would make select ineffective, probably since select component requires adding <div> at the front,
 *    not supported by the control component.
 */
function AssetsSelection(props) {
  const { assetsInfo, assetSelected, setAssetSelected } = props;
  const assets = Object.keys(assetsInfo);
  assets.push(COMPOSITION);

  const [showAssets, setShowAssets] = useState(false);
  const assetSelectAnchorElRef = useRef(null);
  let timeoutId = null; //keep the timeoutId for clearing

  /** Delay the popper disappearance to allow moving from button to popper */
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setShowAssets(false);
    }, 200);
  };
  /** Cancel the timeout if the mouse enters the popper, ensuring that the popper remains open. */
  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    setShowAssets(true);
  };

  return (
    <div>
      <Button
        ref={assetSelectAnchorElRef}
        aria-owns={showAssets ? 'assets-select' : undefined}
        aria-haspopup="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {assetSelected}
      </Button>
      <Popper
        id="assets-select"
        placement="bottom"
        disablePortal={false} //Setting this would make its inner select components ineffective
        open={showAssets}
        anchorEl={assetSelectAnchorElRef.current}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClose={() => setShowAssets(false)}
        sx={{ zIndex: 1500 }} //set a high zIndex to show on top of map
      >
        <ToggleButtonGroup
          value={assetSelected}
          exclusive
          orientation="vertical"
          onChange={(event, newValue) => {
            if (newValue !== null) {
              setAssetSelected(newValue);
            }
          }}
          aria-label="select asset to view"
        >
          {assets.map((assetName) => (
            <ToggleButton
              key={assetName}
              value={assetName}
              aria-label={assetName}
            >
              {assetName}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Popper>
    </div>
  );
}

function DisplaySettings(props) {
  const { assetsInfo, assetSelected, displayMode, setDisplayMode } = props;

  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [bandsSetting, setBandsSetting] = useState({});
  console.log('bands setting', bandsSetting);
  const displaySettingsAnchorElRef = useRef(null);
  let timeoutId = null; //keep the timeoutId for clearing

  /** Delay the popper disappearance to allow moving from button to popper */
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setShowDisplaySettings(false);
    }, 200);
  };
  /** Cancel the timeout if the mouse enters the popper, ensuring that the popper remains open. */
  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    setShowDisplaySettings(true);
  };

  // set the default bands settings
  useEffect(() => {
    const assets = Object.keys(assetsInfo);

    if (displayMode === '1 band') {
      setBandsSetting({
        Grey: [assetSelected === COMPOSITION ? assets[0] : assetSelected, null]
      });
    } else {
      setBandsSetting({
        Red: [assetSelected === COMPOSITION ? assets[0] : assetSelected, null],
        Green: [
          assetSelected === COMPOSITION ? assets[0] : assetSelected,
          null
        ],
        Blue: [assetSelected === COMPOSITION ? assets[0] : assetSelected, null]
      });
    }
  }, [assetSelected, assetsInfo, displayMode]);

  // the getter and setter for indiviual chanels
  const setChanelBand = (chanel) => (band) => {
    setBandsSetting({ ...bandsSetting, [chanel]: band });
  };
  const getChanelBand = (chanel) => {
    const band = bandsSetting[chanel] || [assetSelected, null];
    //console.log(chanel, 'band', band);
    return band;
  };

  return (
    <>
      <Button
        ref={displaySettingsAnchorElRef}
        aria-owns={showDisplaySettings ? 'display-settings' : undefined}
        aria-haspopup="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          displayMode === '1 band'
            ? setDisplayMode('3 bands')
            : setDisplayMode('1 band');
        }}
      >
        {displayMode === '1 band' ? <SquareIcon /> : <AutoAwesomeMotionIcon />}
      </Button>
      {assetsInfo && assetSelected && (
        <Popper
          id="display-settings"
          placement="bottom-start"
          disablePortal={false} //Setting this would make its inner select components ineffective
          open={showDisplaySettings}
          anchorEl={displaySettingsAnchorElRef.current}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClose={() => setShowDisplaySettings(false)}
          sx={{ zIndex: 1500, display: 'block' }} //set a high zIndex to show on top of map
        >
          {displayMode === '1 band' ? (
            <BandSelect
              {...props}
              chanel={'Grey'}
              selectedBand={getChanelBand('Grey')}
              setSelectedBand={setChanelBand('Grey')}
            ></BandSelect>
          ) : (
            <Box display={'block'} flexDirection={'row'}>
              {['Red', 'Green', 'Blue'].map((chanel) => (
                <BandSelect
                  {...props}
                  chanel={chanel}
                  selectedBand={getChanelBand(chanel)}
                  setSelectedBand={setChanelBand(chanel)}
                ></BandSelect>
              ))}
            </Box>
          )}
        </Popper>
      )}
    </>
  );
}

function BandSelect(props) {
  const { assetsInfo, assetSelected, chanel, selectedBand, setSelectedBand } =
    props;
  const [showBandSelect, setShowBandSelect] = useState(false);
  const bandSelectAnchorElRef = useRef(null);

  const handleListItemClick = (event, assetName, band) => {
    setSelectedBand([assetName, band]);
    setShowBandSelect(false);
  };

  return (
    <>
      <Button
        ref={bandSelectAnchorElRef}
        aria-owns={showBandSelect ? 'band-select' : undefined}
        aria-haspopup="true"
        onClick={() => {
          setShowBandSelect(true);
        }}
        sx={{ color: chanel }}
      >
        {assetSelected === COMPOSITION
          ? `${selectedBand[0]}\n${selectedBand[1]}`
          : `${selectedBand[1]}`}
      </Button>
      <Popper
        id="band-select"
        placement="right-start"
        disablePortal={true} //Setting this would make its inner select components ineffective
        open={showBandSelect}
        anchorEl={showBandSelect ? bandSelectAnchorElRef.current : null}
        onClose={() => setShowBandSelect(false)}
        sx={{ zIndex: 1500 }} //set a high zIndex to show on top of map
      >
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 300,
            padding: 0,
            '& ul': { padding: 0 }
          }}
          component="nav"
          aria-label="bands to select"
          subheader={<li />}
        >
          {assetSelected === COMPOSITION
            ? Object.entries(assetsInfo).map(([assetName, info]) => (
                <li key={`asset-${assetName}`}>
                  <ul>
                    <ListSubheader>{assetName}</ListSubheader>
                    {info['band_descriptions'].map((band) => (
                      <ListItemButton
                        key={`band-${assetName}-${band[0]}`}
                        selected={
                          selectedBand[0] === assetName &&
                          selectedBand[1] === band[0]
                        }
                        onClick={(event) =>
                          handleListItemClick(event, assetName, band[0])
                        }
                      >
                        <ListItemText primary={band[0]} />
                      </ListItemButton>
                    ))}
                  </ul>
                </li>
              ))
            : assetsInfo[assetSelected]['band_descriptions'].map((band) => (
                <ListItemButton
                  key={`band-${assetSelected}-${band[0]}`}
                  selected={
                    selectedBand[0] === assetSelected &&
                    selectedBand[1] === band[0]
                  }
                  onClick={(event) =>
                    handleListItemClick(event, assetSelected, band[0])
                  }
                >
                  <ListItemText primary={band[0]} />
                </ListItemButton>
              ))}
        </List>
      </Popper>
    </>
  );
}

function ViewOptionControl(props) {
  const { collectionID, itemID, position } = props;
  const dispatch = useDispatch();

  const [displayMode, setDisplayMode] = useState('1 band');
  const [assetSelected, setAssetSelected] = useState(null);

  const {
    data: assetsInfo,
    error,
    isLoading
  } = useGetItemAssetsInfoQuery({
    collectionID,
    itemID
  });
  useHandleError(error, dispatch);

  // calculate and set the default setting
  useEffect(() => {
    setAssetSelected(calculateDefaultViewOptions(assetsInfo));
  }, [assetsInfo]);

  if (error || isLoading) {
    return <></>;
  }

  return (
    <>
      <LeafletControl prepend position={position}>
        <Box sx={{ display: 'flex' }}>
          <DisplaySettings
            assetsInfo={assetsInfo}
            assetSelected={assetSelected}
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
          ></DisplaySettings>
          <AssetsSelection
            assetsInfo={assetsInfo}
            assetSelected={assetSelected}
            setAssetSelected={setAssetSelected}
          ></AssetsSelection>
        </Box>
      </LeafletControl>
    </>
  );
}

export function PGStacItemAssetViewer(props) {
  const { collectionID, itemID, item } = props;
  const options = {
    boundsStyle: {
      color: 'red',
      fillOpacity: 0
    }
  };

  const assetName = 'visual';

  return (
    <MapContainer scrollWheelZoom={true} id="map" zoomControl={false}>
      <ZoomControl position="topright" />
      <ViewOptionControl {...props} position="topleft"></ViewOptionControl>
      <TianDiTuTileLayer />
      {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
      <StacGeometryLayer stacData={item} options={options}></StacGeometryLayer>
      {assetName && (
        <ItemTitilerLayer
          collectionID={collectionID}
          itemID={itemID}
          assets={assetName}
        />
      )}
    </MapContainer>
  );
}

export function EODAGItemAssetViewer(props) {
  const { item } = props;
  const options = {
    boundsStyle: {
      color: 'red',
      fillOpacity: 0.3
    }
  };
  return (
    <MapContainer scrollWheelZoom={true} id="map">
      <TianDiTuTileLayer />
      {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /> */}
      <StacGeometryLayer stacData={item} options={options}></StacGeometryLayer>
    </MapContainer>
  );
}
