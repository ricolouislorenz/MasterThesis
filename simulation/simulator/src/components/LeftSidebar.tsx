import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Button } from '@mui/material';
import { peerSelectionAlgorithms, setPeerSelectionAlgorithm } from '../modules/peerSelection';

interface LeftSidebarProps {
  onPeerSelectionChange: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onPeerSelectionChange }) => {
  const [view, setView] = useState<'overview' | 'peer'>('overview');

  const overviewView = (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Actions</Typography>
      <List>
        <ListItemButton onClick={() => setView('peer')}>
          <ListItemText primary="Choose Peer-Selection Algorithm" />
        </ListItemButton>
        {/* Weitere Optionen */}
      </List>
    </Box>
  );

  const peerView = (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Peer-Selection Algorithm</Typography>
      {Object.keys(peerSelectionAlgorithms).map(key => (
        <ListItemButton
          key={key}
          onClick={() => {
            setPeerSelectionAlgorithm(key);
            // Reset der Simulation beim Wechsel des Algorithmus
            onPeerSelectionChange();
            setView('overview');
          }}
        >
          <ListItemText primary={key} />
        </ListItemButton>
      ))}
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setView('overview')}>
          Done
        </Button>
      </Box>
    </Box>
  );

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
      {view === 'overview' ? overviewView : peerView}
    </Box>
  );
};

export default LeftSidebar;
