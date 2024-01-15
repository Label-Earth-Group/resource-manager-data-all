import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Link } from '@mui/material';
import { ChevronRightIcon } from 'design';

export const Breadcrumbs = ({ owner, repo, folderPath }) => {
  const pathSegments = folderPath.split('/').filter(Boolean); // Split and remove empty segments

  const breadcrumbItems = pathSegments.map((segment, index, array) => {
    const isLast = index === array.length - 1;
    const tempPath = array.slice(0, index + 1).join('/');
    const to = `/console/geojournal/repos/${owner}/${repo}/${tempPath}`;

    return isLast ? (
      <Link
        key={segment}
        underline="none"
        color="textPrimary"
        variant="subtitle2"
      >
        {segment}
      </Link>
    ) : (
      <Link
        key={segment}
        component={RouterLink}
        to={to}
        underline="hover"
        color="textPrimary"
        variant="subtitle2"
      >
        {segment}
      </Link>
    );
  });

  // Adding the root repository link
  breadcrumbItems.unshift(
    <Link
      key="repository"
      component={RouterLink}
      to={`/console/geojournal/repos/${owner}/${repo}`}
      underline="hover"
      color="textPrimary"
      variant="subtitle2"
    >
      {repo}
    </Link>
  );

  return (
    <MuiBreadcrumbs
      aria-label="breadcrumb"
      separator={<ChevronRightIcon fontSize="small" />}
      sx={{ mt: 1 }}
    >
      {breadcrumbItems}
    </MuiBreadcrumbs>
  );
};
