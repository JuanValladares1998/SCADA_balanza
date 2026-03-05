import { Navigate, createBrowserRouter } from "react-router-dom";
import PaginaDashboard from "./App";
import PaginaAlertas from "./vistas/PaginaAlertas";
import PaginaDiagrama from "./vistas/PaginaDiagrama";

export const enrutador = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: <PaginaDashboard />,
  },
  {
    path: "/alertas",
    element: <PaginaAlertas />,
  },
  {
    path: "/diagrama-editar",
    element: <PaginaDiagrama />,
  },
]);
