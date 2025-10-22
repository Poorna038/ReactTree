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
        Select a node to start editing...
      </div>
    );
  }

  const depth = selectedNode.depth || 1;

  if (depth !== 4) {
    return (
      <div className="editor-placeholder">
        Select a node to edit...
      </div>
    );
  }

  const nodePath = selectedNode.parentPath
    ? selectedNode.parentPath
        .split(".")
        .map((i, idx, arr) => {
          let nodes = tree;
          let title = "";
          arr.slice(0, idx + 1).forEach((n) => {
            const nodeIndex = parseInt(n, 10) - 1;
            title = nodes[nodeIndex]?.title || "";
            nodes = nodes[nodeIndex]?.children || [];
          });
          return title;
        })
        .join(" / ")
    : selectedNode.title;

  return (
    <div className="editor-panel">
      <h2 className="editor-title">{nodePath || selectedNode.title}</h2>
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
