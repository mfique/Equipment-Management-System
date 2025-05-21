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
import { useAuth } from '../contexts/AuthContext';

interface Equipment {
  id: number;
  name: string;
  serialNumber: string;
  status: string;
}

interface Request {
  id?: number;
  equipmentId: number;
  purpose: string;
  requestDate: Date;
  returnDate: Date;
  status: string;
  notes?: string;
}

const API_URL = 'http://localhost:8080/api';

export default function RequestForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [request, setRequest] = useState<Request>({
    equipmentId: 0,
    purpose: '',
    requestDate: new Date(),
    returnDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 7 days from now
    status: 'PENDING',
    notes: '',
  });

  useEffect(() => {
    fetchEquipment();
    if (id && id !== 'new') {
      fetchRequest();
    }
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get(`${API_URL}/equipment`);
      setEquipment(response.data.filter((item: Equipment) => item.status === 'Operational'));
    } catch (err) {
      setError('Failed to load equipment list');
      console.error('Error fetching equipment:', err);
    }
  };

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/requests/${id}`);
      const data = response.data;
      setRequest({
        ...data,
        requestDate: new Date(data.requestDate),
        returnDate: new Date(data.returnDate),
      });
    } catch (err) {
      setError('Failed to load request details');
      console.error('Error fetching request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id && id !== 'new') {
        await axios.put(`${API_URL}/requests/${id}`, request);
      } else {
        await axios.post(`${API_URL}/requests`, {
          ...request,
          requestedBy: user?.email,
        });
      }
      navigate('/requests');
    } catch (err) {
      setError('Failed to save request');
      console.error('Error saving request:', err);
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
        {id === 'new' ? 'New Equipment Request' : 'Edit Request'}
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
                select
                label="Equipment"
                value={request.equipmentId}
                onChange={(e) => setRequest({ ...request, equipmentId: Number(e.target.value) })}
                required
                fullWidth
                disabled={id !== 'new'}
              >
                {equipment.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} ({item.serialNumber})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Purpose"
                value={request.purpose}
                onChange={(e) => setRequest({ ...request, purpose: e.target.value })}
                required
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Request Date"
                  value={request.requestDate}
                  onChange={(date) => date && setRequest({ ...request, requestDate: date })}
                  slotProps={{ textField: { fullWidth: true } }}
                  disabled={id !== 'new'}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Return Date"
                  value={request.returnDate}
                  onChange={(date) => date && setRequest({ ...request, returnDate: date })}
                  slotProps={{ textField: { fullWidth: true } }}
                  disabled={id !== 'new'}
                />
              </LocalizationProvider>
            </Grid>
            {user?.role === 'ADMIN' && (
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Status"
                  value={request.status}
                  onChange={(e) => setRequest({ ...request, status: e.target.value })}
                  required
                  fullWidth
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </TextField>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={request.notes}
                onChange={(e) => setRequest({ ...request, notes: e.target.value })}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/requests')}
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