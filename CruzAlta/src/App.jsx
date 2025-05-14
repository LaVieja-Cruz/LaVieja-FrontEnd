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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <MainPage />
        </Layout>
      )
    },
    {
      path: '/login',
      element: <LoginPage />
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
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
