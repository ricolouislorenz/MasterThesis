// src/App.tsx
import React, { useState } from 'react';
import HeaderBar from './components/HeaderBar';
import Dashboard from './components/Dashboard';
import LeftSidebar from './components/LeftSidebar';
import WorldMap from './components/WorldMap';
import RightSidebar from './components/RightSidebar';
import Footer from './components/Footer';
import './styles/global.css';
import { Node } from './modules/nodeManager';

const App: React.FC = () => {
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [simulationDirection, setSimulationDirection] = useState(1);
  const [totalNodes, setTotalNodes] = useState(0);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <div className="app-container">
      <HeaderBar />
      <Dashboard 
        simulationRunning={simulationRunning}
        setSimulationRunning={setSimulationRunning}
        simulationSpeed={simulationSpeed}
        setSimulationSpeed={setSimulationSpeed}
        simulationDirection={simulationDirection}
        setSimulationDirection={setSimulationDirection}
        totalNodes={totalNodes}
      />
      <div className="main-content">
        <LeftSidebar />
        <div className="world-map-container" style={{ flex: 1 }}>
          <WorldMap 
            simulationRunning={simulationRunning}
            simulationSpeed={simulationSpeed}
            simulationDirection={simulationDirection}
            setTotalNodes={setTotalNodes}
            onNodeSelect={setSelectedNode}
          />
        </div>
        <RightSidebar selectedNode={selectedNode} />
      </div>
      <Footer />
    </div>
  );
};

export default App;
