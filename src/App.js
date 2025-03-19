import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Dashboard from './components/pages/Dashboard';
import PatientList from './components/patients/PatientList';
import PatientForm from './components/patients/PatientForm';
import PatientDetails from './components/patients/PatientDetails';
import PatientEdit from './components/patients/PatientEdit';
import DeletedPatients from './components/patients/DeletedPatients';
import NotFound from './components/pages/NotFound';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4, minHeight: 'calc(100vh - 128px)' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/patients/:id/edit" element={<PatientEdit />} />
          <Route path="/patients/deleted" element={<DeletedPatients />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;