import React, { useContext, useState } from "react";
import { TreeContext } from "./TreeContext";
import "./Sidebar.css";

const TreeNode = ({ node, parentPath = "" }) => {
  const { addNode, removeNode, updateNodeTitle, setSelectedNode } =
    useContext(TreeContext);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(node.title);

  const depth = parentPath ? parentPath.split(".").length : 1;
  let clickTimer = null;

  const handleSingleClick = () => {
    
    clickTimer = setTimeout(() => {
      setSelectedNode(node);
    }, 200);
  };

  const handleDoubleClick = () => {
    clearTimeout(clickTimer);
    setIsRenaming(true);
  };

  const handleRenameConfirm = (e) => {
    if (e.key === "Enter" && newTitle.trim()) {
      updateNodeTitle(node.id, newTitle.trim());
      setIsRenaming(false);
    }
  };

  const handleBlur = () => {
    if (newTitle.trim()) updateNodeTitle(node.id, newTitle.trim());
    setIsRenaming(false);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    addNode(node.id);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    removeNode(node.id);
  };

  return (
    <div className="tree-node" style={{ marginLeft: depth * 10 }}>
      <div
        className="node-header"
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {isRenaming ? (
          <input
            type="text"
            className="rename-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleRenameConfirm}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <span>{node.title}</span>
        )}

        <div className="node-actions">
          <button onClick={handleAddClick}>＋</button>
          <button onClick={handleRemoveClick}>🗑</button>
        </div>
      </div>

      {node.children?.length > 0 && (
        <div className="node-children">
          {node.children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              parentPath={`${parentPath ? parentPath + "." : ""}${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const { tree, addNode } = useContext(TreeContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-nav">
        <button className="nav-btn">All</button>
        <button className="nav-btn">Board</button>
        <button className="nav-btn">Graph</button>
        <button className="nav-btn">Recent</button>
      </div>

      <div className="sidebar-header">
        <h3>Collections</h3>
        <button className="add-btn" onClick={() => addNode(null)}>
          ＋
        </button>
      </div>

      <div className="tree">
        {tree.map((node, index) => (
          <TreeNode key={node.id} node={node} parentPath={`${index + 1}`} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
