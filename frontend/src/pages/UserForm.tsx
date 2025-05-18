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
import axios from 'axios';

interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role: string;
}

const roleOptions = ['ADMIN', 'USER', 'MANAGER'];

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User>({
    username: '',
    email: '',
    password: '',
    role: 'USER',
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${id}`);
      const { password, ...userData } = response.data;
      setUser(userData);
    } catch (err) {
      setError('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id && id !== 'new') {
        await axios.put(`/api/users/${id}`, user);
      } else {
        await axios.post('/api/users', user);
      }
      navigate('/users');
    } catch (err) {
      setError('Failed to save user');
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
        {id === 'new' ? 'Add User' : 'Edit User'}
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
              label="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              value={user.password || ''}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required={id === 'new'}
              fullWidth
              helperText={id !== 'new' ? 'Leave blank to keep current password' : ''}
            />

            <TextField
              select
              label="Role"
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              required
              fullWidth
            >
              {roleOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate('/users')}
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