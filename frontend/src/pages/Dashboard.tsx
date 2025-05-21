import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Divider,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Build as BuildIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#dc004e'];

const mockLineData = [
  { month: 'Jan', value: 20 },
  { month: 'Feb', value: 30 },
  { month: 'Mar', value: 25 },
  { month: 'Apr', value: 40 },
  { month: 'May', value: 35 },
  { month: 'Jun', value: 50 },
  { month: 'Jul', value: 45 },
  { month: 'Aug', value: 60 },
  { month: 'Sep', value: 55 },
  { month: 'Oct', value: 70 },
  { month: 'Nov', value: 65 },
  { month: 'Dec', value: 80 },
];

const mockPieData = [
  { name: 'Operational', value: 45 },
  { name: 'Maintenance Required', value: 30 },
  { name: 'Out of Service', value: 20 },
];

const mockRankings = [
  { name: 'Excavator', category: 'Heavy', usage: 312, status: 'Operational' },
  { name: 'Bulldozer', category: 'Heavy', usage: 207, status: 'Maintenance Required' },
  { name: 'Drill', category: 'Tool', usage: 162, status: 'Operational' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        setStats({ totalEquipment: 80, totalUsers: 25, maintenanceRequired: 7 }); // fallback mock
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar sx={{ width: 56, height: 56, mr: 2 }} src="https://randomuser.me/api/portraits/men/32.jpg" />
        <Box>
          <Typography variant="h5" fontWeight={700}>Welcome back!</Typography>
          <Typography variant="body1" color="text.secondary">Here is your equipment overview.</Typography>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 280 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ShowChartIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Equipment Usage (Monthly)</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={mockLineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 280, bgcolor: '#e3f2fd' }}>
            <Typography variant="subtitle2" color="text.secondary">Change (24h)</Typography>
            <Typography variant="h4" color="error.main">-4.31%</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary">Maintenance Required</Typography>
            <Typography variant="h4" color="warning.main">{stats.maintenanceRequired}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 280 }}>
            <Typography variant="h6" mb={2}>Equipment Status</Typography>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={mockPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                  {mockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 280 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Top Equipment Usage</Typography>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                size="small"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Heavy">Heavy</MenuItem>
                <MenuItem value="Tool">Tool</MenuItem>
              </Select>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Usage</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockRankings
                    .filter(r => selectedCategory === 'All' || r.category === selectedCategory)
                    .map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.usage}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 