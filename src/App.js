// src/App.js
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import EditorPanel from "./EditorPanel";
import { TreeProvider } from "./TreeContext";
import "./App.css";

function App() {
  return (
    <TreeProvider>
      <div className="app">
        <Header />
        <div className="main-content">
          <Sidebar />
          <div className="editor-area">
            
              <EditorPanel />
            
          </div>
        </div>
      </div>
    </TreeProvider>
  );
}

export default App;
