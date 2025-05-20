// src/App.jsx
import './App.css';
import LoginPage from './components/loginPage/LoginPage'; // Ajusta la ruta si es distinta
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminMapPage from './components/AdminMap/AdminMapPage';     
import DeliveryPedidosPage from './components/deliveryPedidos/DeliveryPedidosPage';
import Layout from './components/layout/Layout';
import MainPage from './components/mainPage/MainPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import ForgotPassword from './components/password/Password';
import EmailVerification from './components/emailVerification/EmailVerification';
import ChangePassword from './components/changePassword/ChangePassword';
import PresentationPage from './components/presentationPage/PresentationPage';
import Pedidos from './components/pedidos/Pedidos';
import ResumenCaja from './components/resumenCaja/ResumenCaja';
import ProveedoresPage from './components/proveedores/ProveedoresPage';
import CrearProveedor from './components/proveedores/CrearProveedor';
import EditarProveedor from './components/proveedores/EditarProveedor';



function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <PresentationPage />
        </Layout>
      )
    },
    {
      path: '/login',
      element: 
      (
        <Layout>
          <LoginPage/>
        </Layout>
      )
    },
    {
      path: '/main',
      element: 
      (
        <Layout>
          <MainPage/>
        </Layout>
      )
    },
    {path: "/forgot-password",
    element: <ForgotPassword/>
      },
       {path: "/email-verification",
    element: <EmailVerification/>
      },
       {path: "/change-password",
    element: <ChangePassword/>
      },
    {path: "admin/pedidos",
   element: 
      (
        <Layout>
          <Pedidos/>
        </Layout>
      )
      },
            {
        path: "/delivery/pedidos",
        element: (
          <Layout>
            <DeliveryPedidosPage />
          </Layout>
        )
      },
      {
      path: "/admin/mapa",
      element: (
        <Layout>
          <AdminMapPage />
        </Layout>
      )
    },
    {
      path: "/admin/caja",
      element: (
        <Layout>
          <ResumenCaja />
        </Layout>
      )
    },
    {
      path: "/proveedores",
      element: (
        <Layout>
          <ProveedoresPage />
        </Layout>
      )
    },
    
    {
      path: "/proveedores/crear",
      element: (
        <Layout>
          <CrearProveedor />
        </Layout>
      )
    },
    {
      path: "/proveedores/editar/:id",
      element: (
        <Layout>
          <EditarProveedor />
        </Layout>
      )
    }

  ]);

  return <RouterProvider router={router} />;
}

export default App;
