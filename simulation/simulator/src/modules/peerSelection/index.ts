import randomSelection from './randomSelection';
import weightedSelection from './weightedSelection';
import { Node } from '../../modules/nodeManager';

export interface PeerSelectionAlgorithm {
  selectPeers: (nodes: Node[], currentNode: Node, config?: any) => Node[];
}

const peerSelectionAlgorithms: { [key: string]: PeerSelectionAlgorithm } = {
  random: randomSelection,
  weighted: weightedSelection,
};

let currentAlgorithmKey = 'random';

export function setPeerSelectionAlgorithm(key: string): void {
  if (peerSelectionAlgorithms[key]) {
    currentAlgorithmKey = key;
  } else {
    throw new Error(`Algorithm ${key} not found`);
  }
}

export function getCurrentPeerSelectionAlgorithm(): PeerSelectionAlgorithm {
  return peerSelectionAlgorithms[currentAlgorithmKey];
}

export { peerSelectionAlgorithms };
