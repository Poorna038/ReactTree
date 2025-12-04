import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const TreeContext = createContext();

export const TreeProvider = ({ children }) => {
  // Load tree from localStorage or start with empty array
  const [tree, setTree] = useState(() => {
    try {
      const saved = localStorage.getItem("treeData");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedNode, setSelectedNode] = useState(null);

  // Store which nodes are expanded (open)
  const [expandedIds, setExpandedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("treeExpanded");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Persist tree to localStorage
  useEffect(() => {
    localStorage.setItem("treeData", JSON.stringify(tree));
  }, [tree]);

  // Persist expandedIds to localStorage
  useEffect(() => {
    localStorage.setItem(
      "treeExpanded",
      JSON.stringify(Array.from(expandedIds))
    );
  }, [expandedIds]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addNode = (parentId = null, name = null) => {
    const newNode = {
      id: uuidv4(),
      title: "",
      children: [],
      content: "",
    };

    const addRecursively = (nodes) => {
      if (!parentId) {
        // Add at root level
        const maxNumber = nodes.reduce((max, node) => {
          const match = node.title.match(/Collection (\d+)/);
          return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, 0);
        newNode.title = name || `Collection ${maxNumber + 1}`;
        return [...nodes, newNode];
      }

      // Add as child of parentId
      return nodes.map((node) => {
        if (node.id === parentId) {
          const maxNumber = node.children.reduce((max, child) => {
            const parts = child.title.split(".");
            const lastPart = parseInt(parts[parts.length - 1], 10);
            return !isNaN(lastPart) ? Math.max(max, lastPart) : max;
          }, 0);

          newNode.title =
            name ||
            `${node.title}.${maxNumber + 1}`.replace(
              "Collection ",
              "Collection "
            );
          return { ...node, children: [...node.children, newNode] };
        }

        if (node.children?.length > 0) {
          return { ...node, children: addRecursively(node.children) };
        }

        return node;
      });
    };

    setTree((prev) => addRecursively(prev));

    // auto-expand parent so child is visible
    if (parentId) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(parentId);
        return next;
      });
    }
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
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
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
    setSelectedNode((prev) =>
      prev && prev.id === id ? { ...prev, content } : prev
    );
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
    setSelectedNode((prev) =>
      prev && prev.id === id ? { ...prev, title: newTitle } : prev
    );
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
        expandedIds,
        toggleExpand,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};
