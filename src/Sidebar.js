import React, { useContext, useState } from "react";
import { TreeContext } from "./TreeContext";
import "./Sidebar.css";

const TreeNode = ({ node, parentPath = "" }) => {
  const { setSelectedNode, addNode, removeNode } = useContext(TreeContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");

  // ✅ Determine depth based on parentPath
  const depth = parentPath.split(".").length;

  const handleAddClick = () => {
    if (depth === 3) {
      if (!node.title || node.title.startsWith("Collection")) {
        setIsEditing(true);
      }
    } else {
      addNode(node.id);
    }
  };

  const handleAddConfirm = (e) => {
    if (e.key === "Enter" && newNodeName.trim()) {
      addNode(node.id, newNodeName.trim());
      setNewNodeName("");
      setIsEditing(false);
    }
  };

  const handleSelectNode = () => {
  const nodeDepth = parentPath.split(".").length;
  setSelectedNode({ ...node, depth: nodeDepth, parentPath });
};

  return (
    <div className="tree-node">
      <div className="node-header">
        {/* ✅ Updated click behavior */}
        <span onClick={handleSelectNode}>{node.title}</span>
        <div className="node-actions">
          {/* Hide + button for 4th-level nodes */}
          {!(depth === 4) && <button onClick={handleAddClick}>＋</button>}
          <button onClick={() => removeNode(node.id)}>🗑</button>
        </div>
      </div>

      {isEditing && (
        <input
          type="text"
          className="new-node-input"
          placeholder="Enter collection name"
          value={newNodeName}
          onChange={(e) => setNewNodeName(e.target.value)}
          onKeyDown={handleAddConfirm}
          autoFocus
        />
      )}

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
