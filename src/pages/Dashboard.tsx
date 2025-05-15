import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Grid';
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

const WORKOUT_EXERCISES_KEY = 'workoutExercises';
const NUTRITION_MEALS_KEY = 'nutritionMeals';
const PROGRESS_ENTRIES_KEY = 'progressEntries';

const Dashboard = () => {
  const [workoutData, setWorkoutData] = useState<any[]>([]);
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedWorkouts = localStorage.getItem(WORKOUT_EXERCISES_KEY);
    const storedMeals = localStorage.getItem(NUTRITION_MEALS_KEY);
    const storedProgress = localStorage.getItem(PROGRESS_ENTRIES_KEY);

    if (storedWorkouts) {
      setWorkoutData(JSON.parse(storedWorkouts));
    }
    if (storedMeals) {
      setNutritionData(JSON.parse(storedMeals));
    }
    if (storedProgress) {
      setProgressData(JSON.parse(storedProgress));
    }
  }, []);

  // Calculate today's workout duration (assuming 2 minutes per set)
  const calculateWorkoutDuration = () => {
    const todayWorkouts = workoutData.filter(workout => {
      const workoutDate = new Date(workout.date || Date.now());
      const today = new Date();
      return workoutDate.toDateString() === today.toDateString();
    });

    const totalSets = todayWorkouts.reduce((sum, workout) => sum + workout.sets, 0);
    return totalSets * 2; // 2 minutes per set
  };

  // Calculate today's nutrition totals
  const calculateNutritionTotals = () => {
    const todayMeals = nutritionData.filter(meal => {
      const mealDate = new Date(meal.date || Date.now());
      const today = new Date();
      return mealDate.toDateString() === today.toDateString();
    });

    const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalWater = todayMeals.reduce((sum, meal) => sum + (meal.water || 0), 0);

    return {
      calories: totalCalories,
      water: totalWater
    };
  };

  const nutritionTotals = calculateNutritionTotals();

  // Prepare weight data for the chart
  const weightData = {
    labels: progressData.map(entry => entry.date),
    datasets: [
      {
        label: 'Weight (kg)',
        data: progressData.map(entry => entry.weight),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Welcome to Your Fitness Dashboard
          </Typography>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Today's Workout
            </Typography>
            <Typography variant="h4">{calculateWorkoutDuration()} min</Typography>
            <Typography variant="body2" color="text.secondary">
              {workoutData.length > 0 ? `${workoutData.length} exercises completed` : 'No exercises today'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Daily Calories
            </Typography>
            <Typography variant="h4">{nutritionTotals.calories}</Typography>
            <Typography variant="body2" color="text.secondary">
              Goal: 2,000
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Water Intake
            </Typography>
            <Typography variant="h4">{nutritionTotals.water}L</Typography>
            <Typography variant="body2" color="text.secondary">
              Goal: 2.5L
            </Typography>
          </Paper>
        </Grid>

        {/* Progress Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Weight Progress
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={weightData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 