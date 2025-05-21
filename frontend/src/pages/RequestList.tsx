import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Request {
  id: number;
  equipmentId: number;
  equipmentName: string;
  requestedBy: string;
  requestDate: string;
  status: string;
  purpose: string;
  returnDate: string;
  approvedBy?: string;
  approvedAt?: string;
}

const API_URL = 'http://localhost:8080/api';

export default function RequestList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/requests`);
      setRequests(response.data);
    } catch (err) {
      setError('Failed to load requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await axios.delete(`${API_URL}/requests/${id}`);
        setRequests(requests.filter(item => item.id !== id));
      } catch (err) {
        setError('Failed to delete request');
        console.error('Error deleting request:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'equipmentName', headerName: 'Equipment', flex: 1 },
    { field: 'requestedBy', headerName: 'Requested By', flex: 1 },
    { field: 'purpose', headerName: 'Purpose', flex: 1 },
    {
      field: 'requestDate',
      headerName: 'Request Date',
      flex: 1,
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : 'N/A';
      },
    },
    {
      field: 'returnDate',
      headerName: 'Return Date',
      flex: 1,
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : 'N/A';
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'approvedBy',
      headerName: 'Approved By',
      flex: 1,
      valueGetter: (params) => params.row.approvedBy || 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              onClick={() => navigate(`/requests/${params.row.id}`)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          {user?.role === 'ADMIN' && params.row.status === 'PENDING' && (
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDelete(params.row.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Equipment Requests</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/requests/new')}
        >
          New Request
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={requests}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />
      </Paper>
    </Box>
  );
} 