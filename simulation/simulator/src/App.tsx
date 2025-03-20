// src/App.tsx
import React, { useState } from 'react';
import HeaderBar from './components/HeaderBar';
import Dashboard from './components/Dashboard';
import LeftSidebar from './components/LeftSidebar';
import WorldMap from './components/WorldMap';
import RightSidebar from './components/RightSidebar';
import Footer from './components/Footer';
import { resetSimulation } from './modules/simulationEngine';
import { Node } from './modules/nodeManager';
import './styles/global.css';

const App: React.FC = () => {
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [simulationDirection, setSimulationDirection] = useState<number>(1);
  const [totalNodes, setTotalNodes] = useState<number>(0);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handlePeerSelectionChange = () => {
    resetSimulation(() => {}, () => {}); // Beispiel: Simulation zurücksetzen
  };

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
        <LeftSidebar onPeerSelectionChange={handlePeerSelectionChange} />
        <div className="world-map-container">
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
