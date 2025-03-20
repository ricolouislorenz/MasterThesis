import { PeerSelectionAlgorithm } from './index';
import { Node } from '../../modules/nodeManager';

const randomSelection: PeerSelectionAlgorithm = {
  selectPeers: (nodes: Node[], currentNode: Node, config?: any): Node[] => {
    const candidates = nodes.filter(n => n.id !== currentNode.id);
    if (candidates.length === 0) return [];
    // Hier wird komplett zufällig ein Peer ausgewählt
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return [candidates[randomIndex]];
  }
};

export default randomSelection;
