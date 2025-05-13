// src/App.jsx
import './App.css';
import LoginPage from './components/loginPage/LoginPage'; // Ajusta la ruta si es distinta
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './components/layout/Layout';
import MainPage from './components/mainPage/MainPage';

import 'bootstrap/dist/css/bootstrap.min.css';


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
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
