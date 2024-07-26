/* eslint-disable no-unused-vars */
import { Button, Box, Typography } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import React, { useState, useEffect, useRef } from 'react';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

function getItemDescendantsIds(item) {
  const ids = [];
  item.children?.forEach((child) => {
    ids.push(child.id);
    ids.push(...getItemDescendantsIds(child));
  });

  return ids;
}

export const SelectableTree = ({
  items,
  selectedItemIDs,
  setSelectedItemIDs
}) => {
  const toggledItemRef = React.useRef({});
  const apiRef = useTreeViewApiRef();

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    toggledItemRef.current[itemId] = isSelected;
  };

  const handleSelectedItemsChange = (event, newSelectedItemIDs) => {
    setSelectedItemIDs(newSelectedItemIDs);

    // Select / unselect the children of the toggled item
    const itemIDsToSelect = [];
    const itemIDsToUnSelect = {};
    Object.entries(toggledItemRef.current).forEach(([itemId, isSelected]) => {
      const item = apiRef.current.getItem(itemId);
      if (isSelected) {
        itemIDsToSelect.push(...getItemDescendantsIds(item));
      } else {
        getItemDescendantsIds(item).forEach((descendantId) => {
          itemIDsToUnSelect[descendantId] = true;
        });
      }
    });

    const newSelectedItemIDsWithChildren = Array.from(
      new Set(
        [...newSelectedItemIDs, ...itemIDsToSelect].filter(
          (itemId) => !itemIDsToUnSelect[itemId]
        )
      )
    );

    setSelectedItemIDs(newSelectedItemIDsWithChildren);

    toggledItemRef.current = {};
  };

  const selectedLeafItems = items.filter((item) => {
    return (
      selectedItemIDs.includes(item.id) &&
      apiRef.current.getItemOrderedChildrenIds(item.id).length === 0
    );
  });

  return (
    <Box sx={{ height: '70%', width: '100%', overflowY: 'auto' }}>
      <RichTreeView
        multiSelect
        checkboxSelection
        apiRef={apiRef}
        items={items}
        selectedItems={selectedItemIDs}
        onSelectedItemsChange={handleSelectedItemsChange}
        onItemSelectionToggle={handleItemSelectionToggle}
        // slots={{ item: TreeItem2 }}
      />
    </Box>
  );
};
