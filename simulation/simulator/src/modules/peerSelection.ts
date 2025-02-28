// src/modules/peerSelection.ts
import { Node } from './nodeManager';

export interface PeerSelectionAlgorithm {
  selectPeers: (nodes: Node[], currentNode: Node, config?: any) => Node[];
}

export const defaultAlgorithm: PeerSelectionAlgorithm = {
  selectPeers: (nodes, currentNode, config: any = { maxPeers: 3 }) => {
    return nodes
      .filter(node => node.id !== currentNode.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, config.maxPeers);
  }
};

export const geoProximityAlgorithm: PeerSelectionAlgorithm = {
  selectPeers: (nodes, currentNode, config: any = { maxPeers: 3 }) => {
    return nodes
      .filter(node => node.id !== currentNode.id)
      .sort((a, b) => getDistance(currentNode, a) - getDistance(currentNode, b))
      .slice(0, config.maxPeers);
  }
};

function getDistance(node1: Node, node2: Node): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const lat1 = node1.latitude;
  const lon1 = node1.longitude;
  const lat2 = node2.latitude;
  const lon2 = node2.longitude;
  const R = 6371; // Erdradius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Registry mit den Algorithmen
export const peerSelectionAlgorithms: { [key: string]: PeerSelectionAlgorithm } = {
  default: defaultAlgorithm,
  geo: geoProximityAlgorithm,
};

let currentPeerSelectionAlgorithm: PeerSelectionAlgorithm = defaultAlgorithm;

export const setPeerSelectionAlgorithm = (algorithmName: string): void => {
  if (peerSelectionAlgorithms[algorithmName]) {
    currentPeerSelectionAlgorithm = peerSelectionAlgorithms[algorithmName];
  }
};

export const getCurrentPeerSelectionAlgorithm = (): PeerSelectionAlgorithm =>
  currentPeerSelectionAlgorithm;
