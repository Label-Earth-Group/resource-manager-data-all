import {
  ChevronLeft,
  ChevronRight,
  MenuBook,
  Share,
  Public,
  Search,
  CorporateFare,
  Cloud,
  Dataset,
  InsertComment,
  Insights,
  Image
} from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { AiOutlineExperiment } from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import { FiCodesandbox } from 'react-icons/fi';
import { MdShowChart } from 'react-icons/md';
import { SiJupyter } from 'react-icons/si';
import { useLocation } from 'react-router-dom';
import { ModuleNames, isModuleEnabled } from 'utils';
import { useSettings } from '../../hooks';
import { NavSection } from '../NavSection';
import { Scrollbar } from '../Scrollbar';

export const DefaultSidebar = ({ openDrawer, onOpenDrawerChange }) => {
  const getSections = (isAdvancedMode) => {
    const eodagSection = {
      title: 'EODAG',
      path: '/console/eodag',
      icon: <Public size={15} />,
      active: true
    };

    const eodagSearchSection = {
      title: 'Search',
      path: '/console/eodag/search',
      icon: <Search size={15} />,
      active: true
    };

    const catalogSection = {
      title: 'Catalog',
      path: '/console/catalog',
      icon: <MenuBook size={15} />,
      active: false
    };

    const datasetsSection = {
      title: 'Collections',
      path: '/console/repository',
      icon: <Dataset size={15} />,
      active: true
    };

    const assetSection = {
      title: 'Files',
      path: '/console/repository/assets',
      icon: <Image size={15} />,
      active: true
    };

    const sharesSection = {
      title: 'Shares',
      path: '#',
      icon: <Share size={15} />,
      active: isModuleEnabled(ModuleNames.SHARES)
    };

    const glossariesSection = {
      title: 'Glossaries',
      path: '/console/glossaries',
      icon: <BsIcons.BsTag size={15} />,
      active: false
    };

    const worksheetsSection = {
      title: 'Worksheets',
      path: '/console/worksheets',
      icon: <AiOutlineExperiment size={15} />,
      active: false
    };

    const mlStudioSection = {
      title: 'ML Studio',
      path: '/console/mlstudio',
      icon: <FiCodesandbox size={15} />,
      active: false
    };

    const dashboardsSection = {
      title: 'Dashboards',
      path: '/console/dashboards',
      icon: <MdShowChart size={15} />,
      active: false
    };

    const notebooksSection = {
      title: 'GeoJournal',
      path: '/console/notebooks',
      icon: <SiJupyter size={15} />,
      active: isModuleEnabled(ModuleNames.NOTEBOOKS)
    };

    const pipelinesSection = {
      title: 'Pipelines',
      path: '/console/pipelines',
      icon: <BsIcons.BsGear size={15} />,
      active: false
    };

    const toolboxSection = {
      title: 'Toolbox',
      path: '/console/geotoolbox',
      icon: <Insights size={15} />,
      active: true
    };

    const samSection = {
      title: 'Labelling',
      path: '/console/sam',
      icon: <InsertComment size={15} />,
      active: true
    };

    const organizationsSection = {
      title: 'Organizations',
      path: '#',
      icon: <CorporateFare size={15} />
    };

    const environmentsSection = {
      title: 'Environments',
      path: '#',
      icon: <Cloud size={15} />
    };

    let sections = [];

    if (isAdvancedMode) {
      sections = [
        {
          title: 'External',
          items: [
            eodagSection,
            eodagSearchSection,
            catalogSection,
            glossariesSection
          ]
        },
        {
          title: 'Repository',
          items: [datasetsSection, assetSection, sharesSection]
        },
        {
          title: 'Analysis',
          items: [
            worksheetsSection,
            notebooksSection,
            mlStudioSection,
            pipelinesSection,
            dashboardsSection,
            toolboxSection,
            samSection
          ]
        },
        {
          title: 'Admin',
          items: [organizationsSection, environmentsSection]
        }
      ];
    } else {
      sections = [
        {
          title: 'External',
          items: [eodagSection, eodagSearchSection, catalogSection]
        },
        {
          title: 'Repository',
          items: [datasetsSection, assetSection, sharesSection]
        },
        {
          title: 'Analysis',
          items: [
            worksheetsSection,
            notebooksSection,
            mlStudioSection,
            pipelinesSection,
            dashboardsSection,
            toolboxSection,
            samSection
          ]
        }
      ];
    }

    // Filter out deactivated modules from the sections
    // Note: for backwards compatibility, if the `active` field does not exist, the item is considered active
    sections = sections.map(({ items, ...rest }) => ({
      ...rest,
      items: items.filter((item) => item.active !== false)
    }));

    // If a section does not contain any modules, remove that section
    sections = sections.filter((section) => section.items.length !== 0);

    return sections;
  };

  const location = useLocation();
  const { settings } = useSettings();
  const [sections, setSections] = useState(
    getSections(settings.isAdvancedMode)
  );
  const [displayCollapser, setDisplayCollapser] = useState(false);
  const theme = useTheme();

  useEffect(
    () => setSections(getSections(settings.isAdvancedMode)),
    [settings.isAdvancedMode]
  );

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '200px',
        overflowY: 'auto'
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box sx={{ p: 1 }}>
          {sections &&
            sections.map((section) => (
              <NavSection
                key={section.title}
                pathname={location.pathname}
                {...section}
              />
            ))}
        </Box>
      </Scrollbar>
      <Divider />
      <Box sx={{ p: 2 }} style={{ position: 'relative' }}>
        <Box sx={{ pb: 1 }}>
          <Button
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => {
              window.open(process.env.REACT_APP_USERGUIDE_LINK, '_blank');
            }}
            variant="contained"
          >
            User Guide
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="left"
        open={openDrawer}
        style={{ zIndex: 1250 }}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper'
          }
        }}
        variant="temporary"
        sx={{
          display: { xs: 'block', sm: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100vw' }
        }}
      >
        <Box>
          <IconButton
            onClick={() => {
              onOpenDrawerChange(false);
            }}
          >
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
        {content}
      </Drawer>
      <Box display={{ xs: 'none', md: 'block' }}>
        <Drawer
          anchor="left"
          open={openDrawer}
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              pt: 8,
              overflow: 'visible'
            }
          }}
          variant="persistent"
          onMouseEnter={() => {
            setDisplayCollapser(true);
          }}
          onMouseLeave={() => {
            setDisplayCollapser(false);
          }}
        >
          {displayCollapser && (
            <Box
              sx={{
                position: 'absolute',
                right: -25,
                top: 100,
                zIndex: 2000,
                backgroundColor: 'background.paper',
                borderColor: `${theme.palette.divider} !important`,
                transform: 'scale(0.7)',
                borderRight: 1,
                borderBottom: 1,
                borderTop: 1,
                borderLeft: 1,
                borderRadius: 50
              }}
            >
              <IconButton
                onClick={() => {
                  onOpenDrawerChange(false);
                }}
              >
                {openDrawer ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </Box>
          )}
          {content}
        </Drawer>
      </Box>
    </>
  );
};

DefaultSidebar.propTypes = {
  openDrawer: PropTypes.bool,
  onOpenDrawerChange: PropTypes.func
};
