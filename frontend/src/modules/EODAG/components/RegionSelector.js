/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import {
  Autocomplete,
  Box,
  Menu,
  MenuItem,
  Button,
  Typography,
  Breadcrumbs,
  Paper,
  TextField,
  Popper
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useGetSubRegionsQuery } from '../services/regionApi';

const regionOptions = {
  World: {
    'A-D': [
      '阿富汗',
      '阿尔巴尼亚',
      '阿尔及利亚',
      '美属萨摩亚',
      '安道尔',
      '安哥拉'
    ],
    'E-L': ['尼泊尔', '厄瓜多尔', '埃及', '苏里南', '尼立维亚', '爱沙尼亚'],
    'M-R': ['马其顿', '马达加斯加', '马拉维', '马来西亚', '马尔代夫', '马里'],
    'S-Z': [
      '圣文森特和格林纳丁斯',
      '萨摩亚',
      '圣卢西亚',
      '圣多美和普林西比',
      '沙特阿拉伯',
      '塞内加尔'
    ]
  },
  China: [
    '上海市',
    '云南省',
    '内蒙古自治区',
    '北京市',
    '台湾省',
    '吉林省',
    '四川省',
    '天津市',
    '宁夏回族自治区',
    '安徽省',
    '山东省',
    '山西省',
    '广东省',
    '广西壮族自治区',
    '新疆维吾尔自治区',
    '江苏省',
    '江西省',
    '河北省',
    '河南省',
    '浙江省',
    '海南省',
    '湖北省',
    '湖南省',
    '澳门特别行政区',
    '甘肃省',
    '福建省',
    '西藏自治区',
    '贵州省',
    '辽宁省',
    '重庆市',
    '陕西省',
    '青海省',
    '香港特别行政区',
    '黑龙江省'
  ]
};

export const RegionSelector = () => {
  const [selectedRegions, setSelectedRegions] = useState([null]);
  const inputZone = useRef(null);
  const autocompleteRefs = useRef([]);
  const [regionOptions, setRegionOptions] = useState(null);
  const [currentSelectingLevel, setCurrentSelectingLevel] = useState(0);

  const { data, isLoading } = useGetSubRegionsQuery(
    selectedRegions[currentSelectingLevel - 1]
      ? selectedRegions[currentSelectingLevel - 1]['id']
      : -1
  );

  useEffect(() => {
    if (data) {
      setRegionOptions(data);
    }
  }, [data]);
  const CustomPopper = (props) => {
    const { anchorEl, ...rest } = props;

    return (
      <Popper
        {...rest}
        anchorEl={inputZone.current} // Use the inputZone ref as the anchorEl
        style={{
          width: inputZone.current.offsetWidth
        }}
        placement="bottom-start"
      />
    );
  };

  const handleSelectRegion = (region, index) => {
    const newSelectedRegions = [...selectedRegions];
    newSelectedRegions[index] = region;

    if (region === null) {
      setSelectedRegions([...newSelectedRegions.slice(0, index + 1)]);
    } else {
      // Remove all levels after the current one and add a new empty level if not the last level
      setSelectedRegions([...newSelectedRegions.slice(0, index + 1), null]);

      // Focus the next Autocomplete component
      setTimeout(() => {
        if (autocompleteRefs.current[index + 1]) {
          autocompleteRefs.current[index + 1].querySelector('input').focus(); // Note: add querySelector('input') to make focus work
        }
      }, 100); // Delay to ensure the component is updated before focusing
    }
  };

  return (
    <Box>
      <Paper
        component="form"
        ref={inputZone}
        aria-controls="region-options"
        aria-haspopup="true"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextIcon fontSize="small" />}
        >
          {selectedRegions.map((region, index) => (
            <Box key={index} sx={{ minWidth: '90px' }}>
              <Autocomplete
                openOnFocus
                ref={(el) => (autocompleteRefs.current[index] = el)}
                options={regionOptions}
                getOptionLabel={(region) => region['name']}
                value={selectedRegions[index]}
                onChange={(event, newValue) =>
                  handleSelectRegion(newValue, index)
                }
                onFocus={() => {
                  setCurrentSelectingLevel(index);
                }}
                sx={{
                  '& .MuiAutocomplete-popupIndicator': {
                    display: 'none'
                  }
                }}
                PopperComponent={CustomPopper}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      sx: {
                        paddingRight: '0px !important' // Remove padding
                      }
                    }}
                  />
                )}
              />
            </Box>
          ))}
        </Breadcrumbs>
      </Paper>
    </Box>
  );
};
