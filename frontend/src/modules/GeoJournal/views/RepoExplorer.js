import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Grid,
  List,
  CircularProgress,
  Typography
} from '@mui/material';
import { useGetRepoContentsQuery } from '../services/githubApi';
import { FileItem } from '../components/FileItem';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useDispatch } from 'globalErrors';
import { useHandleError } from 'utils/utils';
import { useSettings } from 'design';

function PageHeader({ owner, repo, folderPath }) {
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          GeoJournal Repository
        </Typography>
        <Breadcrumbs owner={owner} repo={repo} folderPath={folderPath} />
      </Grid>
    </Grid>
  );
}

function generateNBGitPullerLink(
  owner,
  repo,
  filepath = null,
  branchName = 'master'
) {
  const jupyterHubURL = 'http://54.184.95.98';
  const repoUrl = `https://github.com/${owner}/${repo}`;

  const params = new URLSearchParams({
    repo: repoUrl,
    brach: branchName
  });

  if (filepath) {
    const fullfilepath = `${repo}/${filepath}`;
    const urlpath = `lab/tree/${fullfilepath}?autodecode`;
    params.append('urlpath', urlpath.replace(/\/+/g, '/'));
  }

  return `${jupyterHubURL}/hub/user-redirect/git-pull?` + params.toString();
}

const RepositoryContent = ({ owner, repo, folderPath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: contents,
    error,
    isFetching
  } = useGetRepoContentsQuery({
    repoFullName: `${owner}/${repo}`,
    path: folderPath
  });
  useHandleError(error, dispatch);
  if (error) {
    return <>Error</>;
  }

  if (isFetching) {
    return <CircularProgress />;
  }

  const extensionsToOpenInJupyterHub = ['ipynb', 'py'];
  const handleItemClick = (item) => {
    if (item.type === 'dir') {
      const newPath = `${folderPath}/${item.name}`.replace(/^\//, ''); // Remove leading slash
      navigate(`/console/geojournal/repos/${owner}/${repo}/${newPath}`);
    } else {
      const fileExtension = item.name.split('.').pop();
      if (extensionsToOpenInJupyterHub.includes(fileExtension)) {
        const nbgitpullerLink = generateNBGitPullerLink(owner, repo, item.path);
        window.open(nbgitpullerLink, '_blank');
        console.log(nbgitpullerLink);
      }
      // handle file click, maybe display content
    }
  };

  // Sort data to show directories first
  let processedContents = contents?.slice().sort((a, b) => {
    if (a.type === 'dir' && b.type !== 'dir') return -1;
    if (a.type !== 'dir' && b.type === 'dir') return 1;
    return a.name.localeCompare(b.name); // Sort by name if both are same type
  });

  // add ".." to direct back to parent directory
  const getParentDirectoryItem = () => {
    if (!folderPath) return null; // Don't show ".." at the root level

    return {
      name: '..',
      type: 'dir',
      path: folderPath.split('/').slice(0, -1).join('/') // Remove the last segment to go up one level
    };
  };
  const parentDirectoryItem = getParentDirectoryItem();
  processedContents = parentDirectoryItem
    ? [parentDirectoryItem, ...processedContents]
    : processedContents; // Add the parent directory item to the start of the array if it exists

  return (
    <List>
      {processedContents?.map((item) => (
        <FileItem
          key={item.path}
          name={item.name}
          type={item.type}
          size={item.size}
          openExternal={extensionsToOpenInJupyterHub.includes(
            item.name.split('.').pop()
          )}
          onClick={() => handleItemClick(item)}
        />
      ))}
    </List>
  );
};

const RepositoryExplorer = () => {
  const { settings } = useSettings();
  const { owner, repo } = useParams();
  const location = useLocation();
  const folderPath = location.pathname
    .replace(`/console/geojournal/repos/${owner}/${repo}`, '')
    .replace(/^\/+/, '');
  // console.log('repo', owner, repo, location);
  // console.log('folderpath', folderPath);

  return (
    <>
      <Helmet>
        <title>GeoJournal | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <PageHeader owner={owner} repo={repo} folderPath={folderPath} />
          <Box
            sx={{
              flexGrow: 1,
              mt: 3
            }}
          >
            <RepositoryContent
              owner={owner}
              repo={repo}
              folderPath={folderPath}
            ></RepositoryContent>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default RepositoryExplorer;
