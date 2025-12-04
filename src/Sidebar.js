// Sidebar.jsx
import React, { useContext, useState, useRef } from "react";
import { TreeContext } from "./TreeContext";
import "./Sidebar.css";

const TreeNode = ({ node, parentPath = "" }) => {
  const { addNode, removeNode, updateNodeTitle, setSelectedNode, expandedIds, toggleExpand } =
    useContext(TreeContext);

  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(node.title);
  const nodeRef = useRef(null);

  const depth = parentPath ? parentPath.split(".").length : 1;

  const handleSelect = (e) => {
    e.stopPropagation();
    // pass parentPath into selected node so EditorPanel can build breadcrumb
    setSelectedNode({ ...node, parentPath });
  };

  const handleRenameStart = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    setTimeout(() => nodeRef.current?.focus(), 0);
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

  const isExpanded = expandedIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="tree-node" style={{ paddingLeft: (depth - 1) * 14 }}>
      <div
        className={`node-row ${/* selected styling is controlled by EditorPanel's selectedNode */ ""}`}
        onClick={handleSelect}
        onDoubleClick={handleRenameStart}
        role="button"
      >
        <div className="chev" onClick={(e) => { e.stopPropagation(); if (hasChildren) toggleExpand(node.id); }}>
          {hasChildren ? (isExpanded ? "▾" : "▸") : <span style={{ width: 12, display: "inline-block" }} />}
        </div>

        <div className="node-title" title={node.title}>
          {isRenaming ? (
            <input
              ref={nodeRef}
              className="rename-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleRenameConfirm}
              onBlur={handleBlur}
            />
          ) : (
            <span>{node.title}</span>
          )}
        </div>

        <div className="node-actions">
          <button className="icon-btn" onClick={handleAddClick} title="Add child">＋</button>
          <button className="icon-btn" onClick={handleRenameStart} title="Rename">✎</button>
          <button className="icon-btn danger" onClick={handleRemoveClick} title="Delete">🗑</button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="node-children">
          {node.children.map((child, idx) => (
            <TreeNode
              key={child.id}
              node={child}
              parentPath={`${parentPath ? parentPath + "." : ""}${idx + 1}`}
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
        <button className="add-btn" onClick={() => addNode(null)}>＋</button>
      </div>

      <div className="tree" role="tree">
        {tree.length === 0 ? (
          <div className="empty">No collections yet — click ＋ to add</div>
        ) : (
          tree.map((node, index) => (
            <TreeNode key={node.id} node={node} parentPath={`${index + 1}`} />
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
