import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

interface Equipment {
  id?: number;
  name: string;
  serialNumber: string;
  status: string;
  category: string;
  location: string;
  description: string;
  manufacturer: string;
  model: string;
  purchaseDate: Date | null;
  warrantyExpiry: Date | null;
  lastMaintenance: Date | null;
  nextMaintenance: Date | null;
}

const statusOptions = [
  'Operational',
  'Maintenance Required',
  'Out of Service',
  'Under Maintenance',
];

const categoryOptions = [
  'Heavy Machinery',
  'Electrical Equipment',
  'Hand Tools',
  'Safety Equipment',
  'Vehicles',
  'Other',
];

const API_URL = 'http://localhost:8080/api';

export default function EquipmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [equipment, setEquipment] = useState<Equipment>({
    name: '',
    serialNumber: '',
    status: 'Operational',
    category: '',
    location: '',
    description: '',
    manufacturer: '',
    model: '',
    purchaseDate: null,
    warrantyExpiry: null,
    lastMaintenance: null,
    nextMaintenance: null,
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchEquipment();
    }
  }, [id]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/equipment/${id}`);
      const data = response.data;
      setEquipment({
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : null,
        lastMaintenance: data.lastMaintenance ? new Date(data.lastMaintenance) : null,
        nextMaintenance: data.nextMaintenance ? new Date(data.nextMaintenance) : null,
      });
    } catch (err) {
      setError('Failed to load equipment details');
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id && id !== 'new') {
        await axios.put(`${API_URL}/equipment/${id}`, equipment);
      } else {
        await axios.post(`${API_URL}/equipment`, equipment);
      }
      navigate('/equipment');
    } catch (err) {
      setError('Failed to save equipment');
      console.error('Error saving equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id && id !== 'new') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {id === 'new' ? 'Add Equipment' : 'Edit Equipment'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                value={equipment.name}
                onChange={(e) => setEquipment({ ...equipment, name: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Serial Number"
                value={equipment.serialNumber}
                onChange={(e) => setEquipment({ ...equipment, serialNumber: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Status"
                value={equipment.status}
                onChange={(e) => setEquipment({ ...equipment, status: e.target.value })}
                required
                fullWidth
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Category"
                value={equipment.category}
                onChange={(e) => setEquipment({ ...equipment, category: e.target.value })}
                required
                fullWidth
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Location"
                value={equipment.location}
                onChange={(e) => setEquipment({ ...equipment, location: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Manufacturer"
                value={equipment.manufacturer}
                onChange={(e) => setEquipment({ ...equipment, manufacturer: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Model"
                value={equipment.model}
                onChange={(e) => setEquipment({ ...equipment, model: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={equipment.description}
                onChange={(e) => setEquipment({ ...equipment, description: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Purchase Date"
                      value={equipment.purchaseDate}
                      onChange={(date) => setEquipment({ ...equipment, purchaseDate: date })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Warranty Expiry"
                      value={equipment.warrantyExpiry}
                      onChange={(date) => setEquipment({ ...equipment, warrantyExpiry: date })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Last Maintenance"
                      value={equipment.lastMaintenance}
                      onChange={(date) => setEquipment({ ...equipment, lastMaintenance: date })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Next Maintenance"
                      value={equipment.nextMaintenance}
                      onChange={(date) => setEquipment({ ...equipment, nextMaintenance: date })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/equipment')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
} 