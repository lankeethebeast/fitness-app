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
import type { ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressEntry {
  date: string;
  weight: number;
  bodyFat: number;
  notes: string;
}

const PROGRESS_ENTRIES_KEY = 'progressEntries';

const ProgressTracker = () => {
  const [entries, setEntries] = useState<ProgressEntry[]>(() => {
    const storedEntries = localStorage.getItem(PROGRESS_ENTRIES_KEY);
    return storedEntries ? (JSON.parse(storedEntries) as ProgressEntry[]) : [
      {
        date: '2024-01-01',
        weight: 75,
        bodyFat: 20,
        notes: 'Starting point',
      },
      {
        date: '2024-01-15',
        weight: 74,
        bodyFat: 19,
        notes: 'Good progress',
      },
    ];
  });

  // Load entries from localStorage on mount
  useEffect(() => {
    const storedEntries = localStorage.getItem(PROGRESS_ENTRIES_KEY);
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem(PROGRESS_ENTRIES_KEY, JSON.stringify(entries));
  }, [entries]);

  const [newEntry, setNewEntry] = useState<ProgressEntry>({
    date: '',
    weight: 0,
    bodyFat: 0,
    notes: '',
  });

  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});

  const handleAddEntry = () => {
    if (!newEntry.date || newEntry.weight <= 0 || newEntry.bodyFat < 0) {
      setSnackbar({open: true, message: 'Please enter a date, positive weight, and non-negative body fat %.', severity: 'error'});
      return;
    }
    setEntries([...entries, newEntry]);
    setNewEntry({ date: '', weight: 0, bodyFat: 0, notes: '' });
    setSnackbar({open: true, message: 'Progress entry added successfully!', severity: 'success'});
  };

  const handleDeleteEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const combinedData = {
    labels: entries.map((entry) => entry.date),
    datasets: [
      {
        label: 'Weight (kg)',
        data: entries.map((entry) => entry.weight),
        borderColor: 'rgb(75, 192, 192)',
        yAxisID: 'y',
        tension: 0.1,
      },
      {
        label: 'Body Fat %',
        data: entries.map((entry) => entry.bodyFat),
        borderColor: 'rgb(255, 99, 132)',
        yAxisID: 'y1',
        tension: 0.1,
      },
    ],
  };

  const combinedOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weight & Body Fat Over Time' },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Weight (kg)' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Body Fat %' },
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Typography variant="h4" gutterBottom>
            Progress Tracker
          </Typography>
        </Grid>

        {/* Combined Weight & Body Fat Chart */}
        <Grid xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ height: 300 }}>
              <Line data={combinedData} options={combinedOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Progress Charts */}
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Weight Progress
            </Typography>
            <Line data={combinedData} />
          </Paper>
        </Grid>

        <Grid xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Body Fat Progress
            </Typography>
            <Line data={combinedData} />
          </Paper>
        </Grid>

        {/* Add Entry Form */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Progress Entry
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Date"
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Weight (kg)"
                type="number"
                value={newEntry.weight}
                onChange={(e) => setNewEntry({ ...newEntry, weight: parseFloat(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Body Fat %"
                type="number"
                value={newEntry.bodyFat}
                onChange={(e) => setNewEntry({ ...newEntry, bodyFat: parseFloat(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Notes"
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                fullWidth
                multiline
                rows={2}
              />
              <Button variant="contained" onClick={handleAddEntry} fullWidth>
                Add Entry
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Entry History */}
        <Grid xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Entry History
            </Typography>
            <List>
              {entries.map((entry, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteEntry(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${entry.date} - Weight: ${entry.weight}kg, Body Fat: ${entry.bodyFat}%`}
                    secondary={entry.notes}
                  />
                </ListItem>
              ))}
            </List>
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

export default ProgressTracker; 