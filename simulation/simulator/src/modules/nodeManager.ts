// src/modules/nodeManager.ts

export interface NodeProfile {
  role: 'relay' | 'block-producing' | 'light' | 'archival';
}

export interface Node {
  id: string;
  name: string; // Neu: Name des Knotens
  type: 'static' | 'dynamic';
  latitude: number;
  longitude: number;
  fixed: boolean;
  profile?: NodeProfile;
}

export interface SpawnConfig {
  getRandomLandCoordinate: () => [number, number] | null;
}

// Verwende eine Map für effizientes Node-Management
const nodesMap = new Map<string, Node>();

/**
 * Erzeugt ein zufälliges Profil für einen Knoten.
 * Es wird nur die Rolle zufällig ausgewählt.
 */
export function generateRandomProfile(): NodeProfile {
  const roles: NodeProfile['role'][] = ['relay', 'block-producing', 'light', 'archival'];
  const role = roles[Math.floor(Math.random() * roles.length)];
  return { role };
}

/**
 * Fügt einen Knoten in die interne Map ein.
 */
export function addNode(node: Node): void {
  nodesMap.set(node.id, node);
}

/**
 * Wrapper-Funktion zum Hinzufügen eines festen (static) Knotens.
 * Sie setzt den Typ auf 'static' und ruft addNode auf.
 */
export function addFixedNode(node: Node): void {
  node.type = 'static';
  addNode(node);
}

/**
 * Erzeugt einen dynamischen Knoten, indem die übergebene Funktion getRandomLandCoordinate genutzt wird.
 * Wird ein gültiger Punkt gefunden, wird ein neuer Knoten mit dem Standardnamen "Dynamic Node" erzeugt.
 */
export function spawnDynamicNode(config: SpawnConfig): Node {
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
    profile: generateRandomProfile(),
  };
  addNode(newNode);
  return newNode;
}

/**
 * Entfernt einen Knoten anhand seiner ID.
 */
export function removeNode(nodeId: string): void {
  nodesMap.delete(nodeId);
}

/**
 * Gibt alle Knoten als Array zurück.
 */
export function getNodes(): Node[] {
  return Array.from(nodesMap.values());
}

/**
 * Fügt in einem Batch 'count' Knoten hinzu.
 * Es werden nur Knoten erzeugt, wenn getRandomLandCoordinate einen gültigen Wert liefert.
 * Der Parameter type bestimmt, ob die Knoten als 'static' oder 'dynamic' markiert werden.
 */
export function bulkAddNodes(
  count: number,
  getRandomLandCoordinate: () => [number, number] | null,
  type: 'static' | 'dynamic'
): void {
  for (let i = 0; i < count; i++) {
    const coord = getRandomLandCoordinate();
    if (!coord) continue;
    const newNode: Node = {
      id: Math.random().toString(36).substring(2, 9),
      name: type === 'static' ? "Static Node" : "Dynamic Node",
      type,
      latitude: coord[1],
      longitude: coord[0],
      fixed: type === 'static',
      profile: generateRandomProfile(),
    };
    addNode(newNode);
  }
}
