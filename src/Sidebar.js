// src/Sidebar.js

import React, { useContext, useState, useRef } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { TreeContext } from "./TreeContext";
import "./Sidebar.css";

const TreeNode = ({ node, parentPath = "" }) => {
  const {
    addNode,
    removeNode,
    updateNodeTitle,
    setSelectedNode,
    selectedNode,
    expandedIds,
    toggleExpand,
  } = useContext(TreeContext);

  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(node.title || "");
  const nodeRef = useRef(null);

  const depth = parentPath ? parentPath.split(".").length : 1;
  const isSelected = selectedNode?.id === node.id;

  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);

  const handleSelect = (e) => {
    e.stopPropagation();
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

  return (
    <div className="tree-node-wrapper" style={{ paddingLeft: (depth - 1) * 14 }}>
      <div
        className={`node-row ${isSelected ? "selected" : ""}`}
        onClick={handleSelect}
        onDoubleClick={handleRenameStart}
      >
        <div
          className="node-chevron"
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) toggleExpand(node.id);
          }}
        >
          {hasChildren ? (
            isExpanded ? <FiChevronDown /> : <FiChevronRight />
          ) : (
            <span className="chev-placeholder" />
          )}
        </div>

        <div className="node-meta">
          <span className={`status-dot ${node.children?.length ? "green" : "gray"}`} />
          <div className="node-title">
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
              <span className="node-text">{node.title}</span>
            )}
          </div>
        </div>

        <div className="node-actions">
          <button className="icon-btn" onClick={() => addNode(node.id)}>＋</button>
          <button className="icon-btn" onClick={handleRenameStart}>✎</button>
          <button className="icon-btn danger" onClick={() => removeNode(node.id)}>🗑</button>
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
  const [activeNav, setActiveNav] = useState("All");

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-nav">
          {["All", "Board", "Graph", "Recent"].map((item) => (
            <button
              key={item}
              className={`nav-btn ${activeNav === item ? "active" : ""}`}
              onClick={() => setActiveNav(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-header">
        <h3>Collections</h3>
        <button className="add-btn" onClick={() => addNode(null)}>＋</button>
      </div>

      <div className="tree">
        {tree.length ? (
          tree.map((node, i) => (
            <TreeNode key={node.id} node={node} parentPath={`${i + 1}`} />
          ))
        ) : (
          <div className="empty">No collections yet — click ＋ to add</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
