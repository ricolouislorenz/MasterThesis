// src/components/RightSidebar.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Node } from '../modules/nodeManager';

interface RightSidebarProps {
  selectedNode: Node | null;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ selectedNode }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#333',
        color: '#fff',
        padding: '16px',
        minWidth: '250px',
        height: '100%',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>Peer Details</Typography>
      {!selectedNode ? (
        <Typography variant="body1">No Peer selected</Typography>
      ) : (
        <>
          <Typography variant="body1"><strong>Name:</strong> {selectedNode.name}</Typography>
          <Typography variant="body1"><strong>Type:</strong> {selectedNode.type}</Typography>
          <Typography variant="body1"><strong>Roll:</strong> {selectedNode.profile.role}</Typography>
          <Typography variant="body1">
            <strong>Latency:</strong> {selectedNode.profile.networkLatency} ms
          </Typography>
          <Typography variant="body1">
            <strong>Availability:</strong> {selectedNode.profile.availability.toFixed(1)}%
          </Typography>
          <Typography variant="body1">
            <strong>CPU:</strong> {selectedNode.profile.cpu.toFixed(1)} GHz
          </Typography>
          <Typography variant="body1">
            <strong>Memory:</strong> {selectedNode.profile.memory.toFixed(1)} GB
          </Typography>
          <Typography variant="body1">
            <strong>Storage:</strong> {selectedNode.profile.storage.toFixed(0)} GB
          </Typography>
          <Typography variant="body1">
            <strong>Bandwidth:</strong> {selectedNode.profile.bandwidth.toFixed(0)} Mbps
          </Typography>
          {selectedNode.profile.stake !== undefined && (
            <Typography variant="body1">
              <strong>Stake:</strong> {selectedNode.profile.stake} ADA
            </Typography>
          )}
          <Button variant="contained" sx={{ mt: 2 }}>Parameter bearbeiten</Button>
        </>
      )}
    </Box>
  );
};

export default RightSidebar;
