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
  LinearProgress,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const NUTRITION_MEALS_KEY = 'nutritionMeals';

const NutritionTracker = () => {
  const [meals, setMeals] = useState<Meal[]>(() => {
    const storedMeals = localStorage.getItem(NUTRITION_MEALS_KEY);
    return storedMeals ? JSON.parse(storedMeals) : [
      { name: 'Breakfast', calories: 450, protein: 20, carbs: 45, fat: 15 },
      { name: 'Lunch', calories: 650, protein: 35, carbs: 60, fat: 25 },
    ];
  });

  // Load meals from localStorage on mount
  useEffect(() => {
    const storedMeals = localStorage.getItem(NUTRITION_MEALS_KEY);
    if (storedMeals) {
      setMeals(JSON.parse(storedMeals));
    }
  }, []);

  // Save meals to localStorage whenever meals change
  useEffect(() => {
    localStorage.setItem(NUTRITION_MEALS_KEY, JSON.stringify(meals));
  }, [meals]);

  const [newMeal, setNewMeal] = useState<Meal>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});

  const handleAddMeal = () => {
    if (!newMeal.name.trim() || newMeal.calories < 0 || newMeal.protein < 0 || newMeal.carbs < 0 || newMeal.fat < 0) {
      setSnackbar({open: true, message: 'Please enter a valid meal name and non-negative values for all fields.', severity: 'error'});
      return;
    }
    setMeals([...meals, newMeal]);
    setNewMeal({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
    setSnackbar({open: true, message: 'Meal added successfully!', severity: 'success'});
  };

  const handleDeleteMeal = (index: number) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals);
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  // Simulate calories over the last 7 days (replace with real data if available)
  const caloriesHistory = [1800, 2000, 1750, 2100, 1900, 1850, totalCalories];
  const caloriesLabels = ['6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'Yesterday', 'Today'];
  const caloriesData = {
    labels: caloriesLabels,
    datasets: [
      {
        label: 'Calories',
        data: caloriesHistory,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.2,
      },
    ],
  };

  const proteinHistory = [90, 110, 100, 120, 105, 95, totalProtein];
  const carbsHistory = [200, 220, 210, 230, 215, 205, totalCarbs];
  const fatHistory = [50, 60, 55, 65, 58, 52, totalFat];
  const macrosData = {
    labels: caloriesLabels,
    datasets: [
      {
        label: 'Protein (g)',
        data: proteinHistory,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.2,
      },
      {
        label: 'Carbs (g)',
        data: carbsHistory,
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        tension: 0.2,
      },
      {
        label: 'Fat (g)',
        data: fatHistory,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.2,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Typography variant="h4" gutterBottom>
            Nutrition Tracker
          </Typography>
        </Grid>

        {/* Macro Progress */}
        <Grid xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Daily Progress
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} md={3}>
                <Typography variant="subtitle1">Calories</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(totalCalories / 2000) * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {totalCalories} / 2000 kcal
                </Typography>
              </Grid>
              <Grid xs={12} md={3}>
                <Typography variant="subtitle1">Protein</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(totalProtein / 150) * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {totalProtein}g / 150g
                </Typography>
              </Grid>
              <Grid xs={12} md={3}>
                <Typography variant="subtitle1">Carbs</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(totalCarbs / 250) * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {totalCarbs}g / 250g
                </Typography>
              </Grid>
              <Grid xs={12} md={3}>
                <Typography variant="subtitle1">Fat</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(totalFat / 65) * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {totalFat}g / 65g
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Calories Over Time */}
        <Grid xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Calories Over Time
            </Typography>
            <Box sx={{ height: 250 }}>
              <Line data={caloriesData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        {/* Protein / Carbs / Fat Trends */}
        <Grid xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Protein / Carbs / Fat Trends
            </Typography>
            <Box sx={{ height: 250 }}>
              <Line data={macrosData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        {/* Meal List */}
        <Grid xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Meals
            </Typography>
            <List>
              {meals.map((meal, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteMeal(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={meal.name}
                    secondary={`${meal.calories} kcal | P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fat}g`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Add Meal Form */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Meal
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Meal Name"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Calories"
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Protein (g)"
                type="number"
                value={newMeal.protein}
                onChange={(e) => setNewMeal({ ...newMeal, protein: parseInt(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Carbs (g)"
                type="number"
                value={newMeal.carbs}
                onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Fat (g)"
                type="number"
                value={newMeal.fat}
                onChange={(e) => setNewMeal({ ...newMeal, fat: parseInt(e.target.value) })}
                fullWidth
              />
              <Button variant="contained" onClick={handleAddMeal} fullWidth>
                Add Meal
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

export default NutritionTracker; 