// src/App.jsx
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from 'components/layout';

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
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
