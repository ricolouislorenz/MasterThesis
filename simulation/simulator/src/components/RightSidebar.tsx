// src/components/RightSidebar.tsx
import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Node } from '../modules/nodeManager';

interface RightSidebarProps {
  selectedNode: Node | null;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ selectedNode }) => {
  // Falls kein Profil vorhanden ist, nutzen wir einen Fallback
  const profile = selectedNode?.profile ?? { role: 'Kein Profil verfügbar' };

  return (
    <Box sx={{ backgroundColor: '#222', color: '#fff', padding: '16px', width: '300px' }}>
      {selectedNode ? (
        <>
          <Typography variant="h6" gutterBottom>
            {selectedNode.name}
          </Typography>
          <Divider sx={{ bgcolor: 'grey.500', mb: 1 }} />
          <Typography variant="body1">
            <strong>ID:</strong> {selectedNode.id}
          </Typography>
          <Typography variant="body1">
            <strong>Latitude:</strong> {selectedNode.latitude.toFixed(4)}
          </Typography>
          <Typography variant="body1">
            <strong>Longitude:</strong> {selectedNode.longitude.toFixed(4)}
          </Typography>
          <Typography variant="body1">
            <strong>Type:</strong> {selectedNode.type}
          </Typography>
          <Typography variant="body1">
            <strong>Fixed:</strong> {selectedNode.fixed ? 'Yes' : 'No'}
          </Typography>
          <Divider sx={{ bgcolor: 'grey.500', my: 1 }} />
          <Typography variant="body1">
            <strong>Role:</strong> {profile.role}
          </Typography>
        </>
      ) : (
        <Typography variant="h6">Kein Knoten ausgewählt</Typography>
      )}
    </Box>
  );
};

export default RightSidebar;
