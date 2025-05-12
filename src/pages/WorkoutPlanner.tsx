import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

const WORKOUT_EXERCISES_KEY = 'workoutExercises';

const WorkoutPlanner = () => {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const storedExercises = localStorage.getItem(WORKOUT_EXERCISES_KEY);
    return storedExercises ? JSON.parse(storedExercises) : [
      { name: 'Bench Press', sets: 3, reps: 10, weight: 60 },
      { name: 'Squats', sets: 4, reps: 8, weight: 80 },
    ];
  });

  // Load exercises from localStorage on mount
  useEffect(() => {
    const storedExercises = localStorage.getItem(WORKOUT_EXERCISES_KEY);
    if (storedExercises) {
      setExercises(JSON.parse(storedExercises));
    }
  }, []);

  // Save exercises to localStorage whenever exercises change
  useEffect(() => {
    localStorage.setItem(WORKOUT_EXERCISES_KEY, JSON.stringify(exercises));
  }, [exercises]);

  const [newExercise, setNewExercise] = useState<Exercise>({
    name: '',
    sets: 0,
    reps: 0,
    weight: 0,
  });

  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});

  const handleAddExercise = () => {
    if (!newExercise.name.trim() || newExercise.sets <= 0 || newExercise.reps <= 0 || newExercise.weight < 0) {
      setSnackbar({open: true, message: 'Please enter a valid exercise name, positive sets/reps, and non-negative weight.', severity: 'error'});
      return;
    }
    setExercises([...exercises, newExercise]);
    setNewExercise({ name: '', sets: 0, reps: 0, weight: 0 });
    setSnackbar({open: true, message: 'Exercise added successfully!', severity: 'success'});
  };

  const handleDeleteExercise = (index: number) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Typography variant="h4" gutterBottom>
            Workout Planner
          </Typography>
        </Grid>

        {/* Current Workout */}
        <Grid xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Workout
            </Typography>
            <List>
              {exercises.map((exercise, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteExercise(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={exercise.name}
                    secondary={`${exercise.sets} sets × ${exercise.reps} reps @ ${exercise.weight}kg`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Add Exercise Form */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Exercise
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Exercise Name"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Sets"
                type="number"
                value={newExercise.sets}
                onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Reps"
                type="number"
                value={newExercise.reps}
                onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Weight (kg)"
                type="number"
                value={newExercise.weight}
                onChange={(e) => setNewExercise({ ...newExercise, weight: parseInt(e.target.value) })}
                fullWidth
              />
              <Button variant="contained" onClick={handleAddExercise} fullWidth>
                Add Exercise
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WorkoutPlanner; 