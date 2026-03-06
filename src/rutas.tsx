import { Navigate, createBrowserRouter } from "react-router-dom";
import PaginaDashboard from "./App";
import PaginaAlertas from "./vistas/PaginaAlertas";
import PaginaDiagrama from "./vistas/PaginaDiagrama";
import PaginaNivel1 from "./vistas/PaginaNivel1";

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
    path: "/nivel-1",
    element: <PaginaNivel1 />,
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
