// src/modules/simulationEngine.ts
import { spawnDynamicNode, removeNode, getNodes, Node } from './nodeManager';
import { getCurrentPeerSelectionAlgorithm } from './peerSelection';

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

export const startSimulation = (
  updateNodes: (nodes: Node[]) => void,
  updateLinks: (links: Link[]) => void,
  getRandomLandCoordinate: () => [number, number] | null
) => {
  let links: Link[] = [];
  
  simulationInterval = window.setInterval(() => {
    if (currentPreset.simulationDirection === 1) {
      const coord = getRandomLandCoordinate();
      if (coord) {
        const newNode = spawnDynamicNode({ getRandomLandCoordinate });
        const algorithm = getCurrentPeerSelectionAlgorithm();
        const peers = algorithm.selectPeers(getNodes(), newNode, { maxPeers: 1 });
        if (peers && peers.length > 0) {
          const newLink: Link = {
            source: newNode,
            target: peers[0],
            created: Date.now(),
          };
          links.push(newLink);
        }
      }
    } else {
      const nodes = getNodes();
      const dynamicNodes = nodes.filter(n => n.type === 'dynamic');
      if (dynamicNodes.length > 0) {
        const nodeToRemove = dynamicNodes[dynamicNodes.length - 1];
        removeNode(nodeToRemove.id);
        links = links.filter(link => link.source.id !== nodeToRemove.id && link.target.id !== nodeToRemove.id);
      }
    }
    const now = Date.now();
    links = links.filter(link => now - link.created < 30000);

    updateNodes(getNodes());
    updateLinks(links);
  }, 5000 / currentPreset.simulationSpeed);
};

export const stopSimulation = (): void => {
  if (simulationInterval !== null) {
    window.clearInterval(simulationInterval);
    simulationInterval = null;
  }
};

export const setPreset = (preset: SimulationPreset): void => {
  currentPreset = preset;
};
