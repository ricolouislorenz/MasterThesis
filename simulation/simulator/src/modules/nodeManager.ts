// src/modules/nodeManager.ts
export interface NodeProfile {
  role: 'relay' | 'block-producing' | 'light' | 'archival';
  networkLatency: number; // in ms
  availability: number;   // in Prozent
  cpu: number;            // in GHz
  memory: number;         // in GB
  storage: number;        // in GB
  bandwidth: number;      // in Mbps
  stake?: number;         // nur für block-producing Nodes
}

export interface Node {
  id: string;
  name: string;
  type: 'static' | 'dynamic';
  latitude: number;
  longitude: number;
  fixed: boolean;
  profile: NodeProfile;
}

let nodes: Node[] = [];

export function generateRandomProfile(nodeType: 'static' | 'dynamic'): NodeProfile {
  let role: 'relay' | 'block-producing' | 'light' | 'archival';
  if (nodeType === 'static') {
    const rand = Math.random();
    if (rand < 0.7) role = 'relay';
    else if (rand < 0.9) role = 'block-producing';
    else if (rand < 0.95) role = 'archival';
    else role = 'light';
  } else {
    const rand = Math.random();
    if (rand < 0.5) role = 'relay';
    else role = 'light';
  }
  switch (role) {
    case 'relay':
      return {
        role,
        networkLatency: Math.floor(50 + Math.random() * 100),
        availability: 98 + Math.random() * 2,
        cpu: 2 + Math.random() * 2,
        memory: 8 + Math.random() * 8,
        storage: 256 + Math.random() * 256,
        bandwidth: 50 + Math.random() * 50,
      };
    case 'block-producing':
      return {
        role,
        networkLatency: Math.floor(30 + Math.random() * 70),
        availability: 99 + Math.random(),
        cpu: 3 + Math.random() * 2,
        memory: 16 + Math.random() * 16,
        storage: 512 + Math.random() * 512,
        bandwidth: 100 + Math.random() * 50,
        stake: Math.floor(1000 + Math.random() * 9000),
      };
    case 'light':
      return {
        role,
        networkLatency: Math.floor(70 + Math.random() * 100),
        availability: 95 + Math.random() * 5,
        cpu: 1 + Math.random(),
        memory: 4 + Math.random() * 4,
        storage: 128 + Math.random() * 128,
        bandwidth: 20 + Math.random() * 30,
      };
    case 'archival':
      return {
        role,
        networkLatency: Math.floor(80 + Math.random() * 100),
        availability: 97 + Math.random() * 3,
        cpu: 2 + Math.random() * 2,
        memory: 16 + Math.random() * 16,
        storage: 1024 + Math.random() * 1024,
        bandwidth: 50 + Math.random() * 50,
      };
    default:
      return {
        role: 'relay',
        networkLatency: 100,
        availability: 98,
        cpu: 2,
        memory: 8,
        storage: 256,
        bandwidth: 50,
      };
  }
}

export function addFixedNode(node: Node): void {
  nodes.push(node);
}

export function spawnDynamicNode(config: { getRandomLandCoordinate: () => [number, number] | null }): Node {
  const coord = config.getRandomLandCoordinate();
  if (!coord) {
    throw new Error("No valid land coordinate");
  }
  const newNode: Node = {
    id: Math.random().toString(36).substring(2, 9),
    name: "Dynamic Node",
    type: 'dynamic',
    latitude: coord[1],
    longitude: coord[0],
    fixed: false,
    profile: generateRandomProfile('dynamic'),
  };
  nodes.push(newNode);
  return newNode;
}

export function removeNode(nodeId: string): void {
  nodes = nodes.filter(node => node.id !== nodeId);
}

export function getNodes(): Node[] {
  return [...nodes];
}
