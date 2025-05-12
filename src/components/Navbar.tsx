import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <FitnessCenterIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Fitness Tracker
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/workout">
            Workout
          </Button>
          <Button color="inherit" component={RouterLink} to="/nutrition">
            Nutrition
          </Button>
          <Button color="inherit" component={RouterLink} to="/progress">
            Progress
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 