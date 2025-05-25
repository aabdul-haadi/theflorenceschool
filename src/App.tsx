import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Toaster } from 'sonner';
import LoadingScreen from './components/LoadingScreen';

// Components
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/student/StudentList';
import StudentForm from './pages/student/StudentForm';
import StudentDetail from './pages/student/StudentDetail';
import TeacherList from './pages/teacher/TeacherList';
import TeacherForm from './pages/teacher/TeacherForm';
import TeacherDetail from './pages/teacher/TeacherDetail';
import FeeList from './pages/fee/FeeList';
import StudentFees from './pages/fee/StudentFees';
import Calendar from './pages/Calendar';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> :  <Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Student Routes */}
        <Route path="/students" element={
          <ProtectedRoute>
            <Layout>
              <StudentList />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/students/add" element={
          <ProtectedRoute>
            <Layout>
              <StudentForm />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/students/:studentId" element={
          <ProtectedRoute>
            <Layout>
              <StudentDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/students/:studentId/edit" element={
          <ProtectedRoute>
            <Layout>
              <StudentForm />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Teacher Routes */}
        <Route path="/teachers" element={
          <ProtectedRoute>
            <Layout>
              <TeacherList />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/teachers/add" element={
          <ProtectedRoute>
            <Layout>
              <TeacherForm />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/teachers/:teacherId" element={
          <ProtectedRoute>
            <Layout>
              <TeacherDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/teachers/:teacherId/edit" element={
          <ProtectedRoute>
            <Layout>
              <TeacherForm />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Fee Routes */}
        <Route path="/fees" element={
          <ProtectedRoute>
            <Layout>
              <FeeList />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/fees/student/:studentId" element={
          <ProtectedRoute>
            <Layout>
              <StudentFees />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Calendar Route */}
        <Route path="/calendar" element={
          <ProtectedRoute>
            <Layout>
              <Calendar />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster position="top-right" expand={true} richColors />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;