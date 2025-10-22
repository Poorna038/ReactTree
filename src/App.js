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
          <EditorPanel />
        </div>
      </div>
    </TreeProvider>
  );
}

export default App;
