import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';

import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { MyProductsPage } from '@/pages/MyProductsPage';
import { ShopOrdersPage } from '@/pages/ShopOrdersPage';
import { SupplierOrdersPage } from '@/pages/SupplierOrdersPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { OrganizationPage } from '@/pages/OrganizationPage';
import { CreateOrganizationPage } from '@/pages/CreateOrganizationPage';
import { AllOrganizationsPage } from '@/pages/AllOrganizationsPage';
import { AssignUserPage } from '@/pages/AssignUserPage';
import { CartPage } from '@/pages/CartPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout><ProductsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-products"
            element={
              <ProtectedRoute>
                <Layout><MyProductsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/shop"
            element={
              <ProtectedRoute>
                <Layout><ShopOrdersPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/supplier"
            element={
              <ProtectedRoute>
                <Layout><SupplierOrdersPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout><CategoriesPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organization"
            element={
              <ProtectedRoute>
                <Layout><OrganizationPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organization/create"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout><CreateOrganizationPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/organizations"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout><AllOrganizationsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assign-user"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout><AssignUserPage /></Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Layout><CartPage /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
