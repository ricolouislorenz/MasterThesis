// src/modules/simulationEngine.ts
import { getNodes, Node } from './nodeManager';
import { getCurrentPeerSelectionAlgorithm } from './peerSelection';
import { SpawnConfig } from './nodeManager';

export interface Link {
  source: Node;
  target: Node;
  created: number;
}

export type SimulationPreset = {
  simulationSpeed: number;
  simulationDirection: number; // 1: vorwärts, -1: rückwärts
};

let simulationInterval: number | null = null;
let currentPreset: SimulationPreset = { simulationSpeed: 1, simulationDirection: 1 };

/**
 * Startet die Simulation: Mehrere Sender werden ausgewählt, und für jeden Sender
 * werden Peers (bis zu 3) über den aktuellen Peer-Selection-Algorithmus ausgewählt.
 */
export const startSimulation = (
  updateNodes: (nodes: Node[]) => void,
  updateLinks: (links: Link[]) => void,
  getRandomLandCoordinate: () => [number, number] | null
) => {
  let links: Link[] = [];
  
  simulationInterval = window.setInterval(() => {
    const allNodes = getNodes();
    if (allNodes.length === 0) return;
    
    if (currentPreset.simulationDirection === 1) {
      // Wähle mehrere Sender (z. B. 5, falls genügend Knoten vorhanden)
      const numberOfSenders = Math.min(5, allNodes.length);
      for (let i = 0; i < numberOfSenders; i++) {
        const sender = allNodes[Math.floor(Math.random() * allNodes.length)];
        const algorithm = getCurrentPeerSelectionAlgorithm();
        // Konfiguriere maxPeers, z. B. auf 3
        const peers = algorithm.selectPeers(allNodes, sender, { maxPeers: 3 });
        if (peers && peers.length > 0) {
          peers.forEach(peer => {
            const newLink: Link = {
              source: sender,
              target: peer,
              created: Date.now(),
            };
            links.push(newLink);
          });
        }
      }
    } else {
      // Rückwärts: Entferne z. B. 5 der zuletzt erzeugten Links
      if (links.length > 0) {
        links = links.slice(0, Math.max(links.length - 5, 0));
      }
    }
    
    // Entferne Links, die älter als 30 Sekunden sind
    const now = Date.now();
    links = links.filter(link => now - link.created < 30000);

    updateNodes(allNodes);
    updateLinks(links);
  }, 5000 / currentPreset.simulationSpeed);
};

export const stopSimulation = (): void => {
  if (simulationInterval !== null) {
    window.clearInterval(simulationInterval);
    simulationInterval = null;
  }
};

/**
 * Setzt die Simulation komplett zurück.
 * Dies sollte aufgerufen werden, wenn ein neuer Peer-Selection-Algorithmus ausgewählt wird.
 */
export const resetSimulation = (
  updateNodes: (nodes: Node[]) => void,
  updateLinks: (links: Link[]) => void
) => {
  stopSimulation();
  updateLinks([]);
  startSimulation(updateNodes, updateLinks, getRandomLandCoordinateWrapper);
};

// Wir definieren eine Wrapper-Funktion, um getRandomLandCoordinate als Parameter
// im richtigen Format an startSimulation zu übergeben.
function getRandomLandCoordinateWrapper(): [number, number] | null {
  // Diese Funktion sollte in der WorldMap.tsx definiert und übergeben werden.
  // Hier wird nur ein Platzhalter geliefert.
  return null;
}

export const setPreset = (preset: SimulationPreset): void => {
  currentPreset = preset;
};
