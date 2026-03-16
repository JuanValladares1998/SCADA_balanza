import { Navigate, createBrowserRouter } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout";
import PaginaDashboard from "./App";
import PaginaAlertas from "./vistas/PaginaAlertas";
import PaginaBalanza from "./vistas/PaginaBalanza";
import PaginaCamaraLPR from "./vistas/PaginaCamaraLPR";
import PaginaDiagrama from "./vistas/PaginaDiagrama";
import PaginaNivel1 from "./vistas/PaginaNivel1";
import PaginaSensoresIR from "./vistas/PaginaSensoresIR";
import PaginaUps from "./vistas/PaginaUps";
import PaginaSwitch from "./vistas/PaginaSwitch";
import PaginaAlmacenes from "./vistas/PaginaAlmacenes";

export const enrutador = createBrowserRouter([
  {
    path: "/",
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <PaginaDashboard />,
      },
      {
        path: "nivel-1",
        element: <PaginaNivel1 />,
      },
      {
        path: "balanza",
        element: <PaginaBalanza />,
      },
      {
        path: "ups",
        element: <PaginaUps />,
      },
      {
        path: "switch",
        element: <PaginaSwitch />,
      },
      {
        path: "sensores-ir",
        element: <PaginaSensoresIR />,
      },
      {
        path: "camara-lpr",
        element: <PaginaCamaraLPR />,
      },
      {
        path: "alertas",
        element: <PaginaAlertas />,
      },
      {
        path: "diagrama-editar",
        element: <PaginaDiagrama />,
      },
      {
        path: "almacenes",
        element: <PaginaAlmacenes />,
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
