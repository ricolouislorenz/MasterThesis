import { PeerSelectionAlgorithm } from './index';
import { Node } from '../../modules/nodeManager';

const weightedSelection: PeerSelectionAlgorithm = {
  selectPeers: (nodes: Node[], currentNode: Node, config?: any): Node[] => {
    const candidates = nodes.filter(n => n.id !== currentNode.id);
    if (candidates.length === 0) return [];
    const epsilon = 0.001;
    const weights = candidates.map(candidate => {
      const dx = currentNode.longitude - candidate.longitude;
      const dy = currentNode.latitude - candidate.latitude;
      const distance = Math.sqrt(dx * dx + dy * dy);
      let roleFactor = 1;
      if (candidate.profile?.role === 'block-producing') {
        roleFactor = 1.5;
      } else if (candidate.profile?.role === 'light') {
        roleFactor = 0.8;
      } else if (candidate.profile?.role === 'archival') {
        roleFactor = 1.2;
      }
      return roleFactor / (distance + epsilon);
    });
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < candidates.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return [candidates[i]];
      }
    }
    return [candidates[candidates.length - 1]];
  }
};

export default weightedSelection;
