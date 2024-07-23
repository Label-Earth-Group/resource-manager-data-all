import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export const SelectableTree = (data, selectedItems, setSelectedItems) => {
  const handleToggle = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedItems.includes(nodes.id)}
              onChange={() => handleToggle(nodes.id)}
              onClick={(event) => event.stopPropagation()}
            />
          }
          label={nodes.label}
          key={nodes.id}
        />
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <div style={{ padding: '20px' }}>
      <TreeView>{data.map((tree) => renderTree(tree))}</TreeView>
    </div>
  );
};
