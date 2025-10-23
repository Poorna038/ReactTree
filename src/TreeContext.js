import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const TreeContext = createContext();

export const TreeProvider = ({ children }) => {
  const [tree, setTree] = useState(() => {
    const savedTree = localStorage.getItem("treeData");
    return savedTree ? JSON.parse(savedTree) : [];
  });

  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    localStorage.setItem("treeData", JSON.stringify(tree));
  }, [tree]);

  const addNode = (parentId = null, name = null) => {
    const newNode = {
      id: uuidv4(),
      title: "",
      children: [],
      content: "",
    };

    const addRecursively = (nodes) => {
      if (!parentId) {
        const maxNumber = nodes.reduce((max, node) => {
          const match = node.title.match(/Collection (\d+)/);
          return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, 0);
        newNode.title = name || `Collection ${maxNumber + 1}`;
        return [...nodes, newNode];
      }

      return nodes.map((node) => {
        if (node.id === parentId) {
          const maxNumber = node.children.reduce((max, child) => {
            const parts = child.title.split(".");
            const lastPart = parseInt(parts[parts.length - 1], 10);
            return !isNaN(lastPart) ? Math.max(max, lastPart) : max;
          }, 0);

          newNode.title =
            name ||
            `${node.title}.${maxNumber + 1}`.replace("Collection ", "Collection ");
          return { ...node, children: [...node.children, newNode] };
        }

        if (node.children?.length > 0) {
          return { ...node, children: addRecursively(node.children) };
        }

        return node;
      });
    };

    setTree((prev) => addRecursively(prev));
  };

  const removeNode = (id) => {
    const removeRecursively = (nodes) =>
      nodes
        .filter((node) => node.id !== id)
        .map((node) => ({
          ...node,
          children: node.children ? removeRecursively(node.children) : [],
        }));

    setTree((prev) => removeRecursively(prev));
    setSelectedNode((prev) => (prev?.id === id ? null : prev));
  };

  const updateContent = (id, content) => {
    const updateRecursively = (nodes) =>
      nodes.map((node) => {
        if (node.id === id) return { ...node, content };
        if (node.children?.length > 0)
          return { ...node, children: updateRecursively(node.children) };
        return node;
      });

    setTree((prev) => updateRecursively(prev));
    setSelectedNode((prev) => (prev && prev.id === id ? { ...prev, content } : prev));
  };

  const updateNodeTitle = (id, newTitle) => {
    const updateRecursively = (nodes) =>
      nodes.map((node) => {
        if (node.id === id) return { ...node, title: newTitle };
        if (node.children?.length > 0)
          return { ...node, children: updateRecursively(node.children) };
        return node;
      });

    setTree((prev) => updateRecursively(prev));
    setSelectedNode((prev) => (prev && prev.id === id ? { ...prev, title: newTitle } : prev));
  };

  return (
    <TreeContext.Provider
      value={{
        tree,
        selectedNode,
        setSelectedNode,
        addNode,
        removeNode,
        updateContent,
        updateNodeTitle,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};
