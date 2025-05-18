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
  lastMaintenance: Date | null;
  nextMaintenance: Date | null;
}

const statusOptions = [
  'Operational',
  'Maintenance Required',
  'Out of Service',
  'Under Maintenance',
];

export default function EquipmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [equipment, setEquipment] = useState<Equipment>({
    name: '',
    serialNumber: '',
    status: 'Operational',
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
      const response = await axios.get(`/api/equipment/${id}`);
      const data = response.data;
      setEquipment({
        ...data,
        lastMaintenance: data.lastMaintenance ? new Date(data.lastMaintenance) : null,
        nextMaintenance: data.nextMaintenance ? new Date(data.nextMaintenance) : null,
      });
    } catch (err) {
      setError('Failed to load equipment details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id && id !== 'new') {
        await axios.put(`/api/equipment/${id}`, equipment);
      } else {
        await axios.post('/api/equipment', equipment);
      }
      navigate('/equipment');
    } catch (err) {
      setError('Failed to save equipment');
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
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Name"
              value={equipment.name}
              onChange={(e) => setEquipment({ ...equipment, name: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="Serial Number"
              value={equipment.serialNumber}
              onChange={(e) => setEquipment({ ...equipment, serialNumber: e.target.value })}
              required
              fullWidth
            />

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

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Last Maintenance"
                value={equipment.lastMaintenance}
                onChange={(date) => setEquipment({ ...equipment, lastMaintenance: date })}
              />

              <DatePicker
                label="Next Maintenance"
                value={equipment.nextMaintenance}
                onChange={(date) => setEquipment({ ...equipment, nextMaintenance: date })}
              />
            </LocalizationProvider>

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
          </Box>
        </form>
      </Paper>
    </Box>
  );
} 