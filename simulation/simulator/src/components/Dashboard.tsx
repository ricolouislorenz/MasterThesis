import React, { useState } from 'react';
import { Box, IconButton, Slider, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Umrechnung zwischen internem Slider-Wert (-1 bis 1) und realer Geschwindigkeit
const sliderValueToSpeed = (val: number) => Math.pow(10, val);
const speedToSliderValue = (speed: number) => Math.log10(speed);

interface DashboardProps {
  simulationRunning: boolean;
  setSimulationRunning: React.Dispatch<React.SetStateAction<boolean>>;
  simulationSpeed: number;
  setSimulationSpeed: React.Dispatch<React.SetStateAction<number>>;
  simulationDirection: number;
  setSimulationDirection: React.Dispatch<React.SetStateAction<number>>;
  totalNodes: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  simulationRunning,
  setSimulationRunning,
  simulationSpeed,
  setSimulationSpeed,
  simulationDirection,
  setSimulationDirection,
  totalNodes,
}) => {
  // Interner Slider-Wert: -1 entspricht 0.1x, 0 entspricht 1x, 1 entspricht 10x.
  const [sliderValue, setSliderValue] = useState<number>(speedToSliderValue(simulationSpeed));

  // Direktes Aktualisieren der SimulationSpeed, ohne pausieren zu müssen
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setSliderValue(newValue);
      setSimulationSpeed(sliderValueToSpeed(newValue));
    }
  };

  const handlePlayPause = () => {
    setSimulationRunning(prev => !prev);
  };

  const handleBackward = () => {
    setSimulationDirection(-1);
  };

  const handleForward = () => {
    setSimulationDirection(1);
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#444',
        color: '#fff',
        padding: '10px 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Zentriert horizontal
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <p style={{ margin: 0 }}>Total Nodes: {totalNodes}</p>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Tooltip title="Rückwärts">
          <IconButton
            onClick={handleBackward}
            sx={{ color: simulationDirection === -1 ? 'primary.main' : '#fff' }}
          >
            <ArrowBackIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title={simulationRunning ? 'Pause' : 'Play'}>
          <IconButton onClick={handlePlayPause} sx={{ color: '#fff' }}>
            {simulationRunning ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Vorwärts">
          <IconButton
            onClick={handleForward}
            sx={{ color: simulationDirection === 1 ? 'primary.main' : '#fff' }}
          >
            <ArrowForwardIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ width: 200, mt: 2 }}>
        <Tooltip title={`Speed: ${sliderValueToSpeed(sliderValue).toFixed(2)}x`}>
          <Slider
            value={sliderValue}
            onChange={handleSliderChange}
            min={-1}
            max={1}
            step={0.1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${sliderValueToSpeed(value).toFixed(2)}x`}
            sx={{ color: '#fff' }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Dashboard;
