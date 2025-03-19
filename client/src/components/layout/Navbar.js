import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <LocalHospitalIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            PaReS
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
            {!isMobile && (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/"
                  startIcon={<HomeIcon />}
                  sx={{ mr: 1 }}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/patients"
                  startIcon={<PeopleIcon />}
                  sx={{ mr: 1 }}
                >
                  Patients
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/patients/deleted"
                  startIcon={<DeleteIcon />}
                  sx={{ mr: 1 }}
                >
                  Deleted
                </Button>
              </>
            )}
          </Box>

          <Button
            color="inherit"
            variant="outlined"
            component={RouterLink}
            to="/patients/new"
            startIcon={<PersonAddIcon />}
            sx={{
              borderRadius: '8px',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {isMobile ? <PersonAddIcon /> : 'New Patient'}
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;