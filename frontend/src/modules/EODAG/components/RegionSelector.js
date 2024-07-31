import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  Button,
  Typography,
  Breadcrumbs,
  Link
} from '@mui/material';

const regions = {
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('China');
  const [currentSubRegion, setCurrentSubRegion] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    setCurrentSubRegion(null);
    setAnchorEl(null);
  };

  const handleSelectSubRegion = (subRegion) => {
    setCurrentSubRegion(subRegion);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Select Region
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(regions).map((region) => (
          <MenuItem
            key={region}
            onClick={() => handleSelectRegion(region)}
            selected={selectedRegion === region}
          >
            {region}
          </MenuItem>
        ))}
      </Menu>

      <div>
        <Typography variant="h6">
          Select Sub-Region in {selectedRegion}
        </Typography>
        {regions[selectedRegion].map((subRegion) => (
          <MenuItem
            key={subRegion.id}
            onClick={() => handleSelectSubRegion(subRegion)}
            selected={currentSubRegion && currentSubRegion.id === subRegion.id}
          >
            {subRegion.name}
          </MenuItem>
        ))}
      </div>

      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" onClick={() => setCurrentSubRegion(null)}>
          {selectedRegion}
        </Link>
        {currentSubRegion && (
          <Typography color="textPrimary">{currentSubRegion.name}</Typography>
        )}
      </Breadcrumbs>
    </div>
  );
};
