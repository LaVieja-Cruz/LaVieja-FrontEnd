// src/App.jsx
import './App.css';
import LoginPage from './components/loginPage/LoginPage'; // Ajusta la ruta si es distinta
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminMapPage from './components/AdminMap/AdminMapPage';     
import DeliveryPedidosPage from './components/deliveryPedidos/DeliveryPedidosPage';
import Layout from './components/layout/Layout';
import MainPage from './components/mainPage/MainPage';
//aca pegue recien SHARAWI
import AdminCrearPedido from './components/administrador/AdminCrearPedido';
import PedidosAdminPage from './components/administrador/PedidosAdminPage';


import 'bootstrap/dist/css/bootstrap.min.css';
import ForgotPassword from './components/password/Password';
import EmailVerification from './components/emailVerification/EmailVerification';
import ChangePassword from './components/changePassword/ChangePassword';
import PresentationPage from './components/presentationPage/PresentationPage';
import Pedidos from './components/pedidos/Pedidos';

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
      path: "/admin/cargar-pedido",
      element: (
        <Layout>
          <AdminCrearPedido />
        </Layout>
      )
    },
    {
      path: "/admin/ver-pedidos",
      element: (
        <Layout>
          <PedidosAdminPage />
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
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
