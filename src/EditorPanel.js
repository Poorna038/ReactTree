import React, { useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { TreeContext } from "./TreeContext";
import "./EditorPanel.css";

const EditorPanel = () => {
  const { selectedNode, updateContent, tree } = useContext(TreeContext);

  if (!selectedNode) {
    return (
      <div className="editor-placeholder">
        Select a collection to start editing...
      </div>
    );
  }

  // Build breadcrumb path for selected node from parentPath like "1.2"
  const getNodePath = (pathStr) => {
    if (!pathStr) return selectedNode.title;

    const indices = pathStr.split(".");
    let nodes = tree;
    const titles = [];

    for (let i = 0; i < indices.length; i++) {
      const idx = parseInt(indices[i], 10) - 1;
      if (!nodes || !nodes[idx]) break;
      titles.push(nodes[idx].title);
      nodes = nodes[idx].children || [];
    }

    // Ensure selected node title is included at end
    if (!titles.includes(selectedNode.title)) {
      titles.push(selectedNode.title);
    }

    return titles.join(" / ");
  };

  const nodePath = getNodePath(selectedNode.parentPath);

  return (
    <div className="editor-panel">
      <h2 className="editor-title">{nodePath}</h2>
      <ReactQuill
        theme="snow"
        value={selectedNode.content || ""}
        onChange={(content) => updateContent(selectedNode.id, content)}
        className="editor-quill"
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        }}
        placeholder="Start typing your notes or content here..."
      />
    </div>
  );
};

export default EditorPanel;
