// src/EditorPanel.js
import React, { useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { TreeContext } from "./TreeContext";
import "./EditorPanel.css";

const EditorPanel = () => {
  const { selectedNode, updateContent, tree } = useContext(TreeContext);

  if (!selectedNode) {
    return <div className="editor-placeholder">Select a collection to start editing...</div>;
  }

  // Build breadcrumb-like path (safe)
  const buildPath = () => {
    if (!selectedNode.parentPath) return selectedNode.title;
    const indices = selectedNode.parentPath.split(".");
    let nodes = tree;
    const titles = [];
    indices.forEach((index) => {
      const idx = parseInt(index, 10) - 1;
      if (nodes[idx]) {
        titles.push(nodes[idx].title);
        nodes = nodes[idx].children || [];
      }
    });
    if (!titles.includes(selectedNode.title)) titles.push(selectedNode.title);
    return titles.join(" / ");
  };

  const nodePath = buildPath();

  return (
    <div className="editor-wrapper">
      <div className="editor-card">
        <h2 className="editor-title">{nodePath}</h2>

        <div className="editor-quill">
          <ReactQuill
            theme="snow"
            value={selectedNode.content || ""}
            onChange={(content) => updateContent(selectedNode.id, content)}
            modules={{
              toolbar: [
                ["bold", "italic", "underline", "strike"],
                [{ header: [1, 2, 3, false] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
            placeholder="Start typing here..."
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
