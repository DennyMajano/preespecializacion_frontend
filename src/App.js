import React from "react";
//Layout
import MainLayout from "./components/layouts/MainLayout";

//Router config
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import PrivateRoute from "./config/routers/PrivateRoute";
import Authorization from "./services/Authorization";

//componentes
import Test from "./components/Test";
import Login from "./pages/Acceso/Login";

import Roles from "./pages/Acceso/Roles/Roles";
import RolesForm from "./pages/Acceso/Roles/RolesForm";
import Modulos from "./pages/Acceso/Modulos/Modulos";
import ModulosForm from "./pages/Acceso/Modulos/ModulosForm";
import RolesModulos from "./pages/Acceso/Roles/RolesModulos";
import Usuarios from "./pages/Acceso/Usuarios/Usuarios";

import UsuariosForm from "./pages/Acceso/Usuarios/UsuariosForm";
import ValidarAcceso from "./pages/Acceso/ValidarAcceso";
import SolicitarCorreoEnlace from "./pages/Acceso/SolicitarCorreoEnlace";
import Zonas from "./pages/Zonas/Zonas";
import ZonasForm from "./pages/Zonas/ZonasForm";
import ZonasDepartamento from "./pages/Zonas/ZonasDepartamento";
import Distritos from "./pages/Distritos/Distritos";
import DistritosForm from "./pages/Distritos/DistritosForm";

function App() {
  return (
    <Router>
      <MainLayout>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route
            exact
            path="/validar_acceso/:codigo"
            component={ValidarAcceso}
          />
          <Route
            exact
            path="/restaurar_acceso"
            component={SolicitarCorreoEnlace}
          ></Route>
          <PrivateRoute exact path="/" component={Test} />

          {/**INICIO RUTAS ROLES */}
          <PrivateRoute
            exact
            path="/administracion/roles"
            component={Authorization(
              Roles,
              "289fd42f-b5d7-430f-a753-13ec027e4134"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/roles/new"
            component={Authorization(
              RolesForm,
              "289fd42f-b5d7-430f-a753-13ec027e4134"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/roles/update/:id"
            component={Authorization(
              RolesForm,
              "289fd42f-b5d7-430f-a753-13ec027e4134"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/roles/asignacion/:id"
            component={Authorization(
              RolesModulos,
              "289fd42f-b5d7-430f-a753-13ec027e4134"
            )}
          />
          {/**FIN RUTAS ROLES */}

          {/**INICIO RUTAS MODULOS */}
          <PrivateRoute
            exact
            path="/administracion/modulos"
            component={Authorization(
              Modulos,
              "f91cdcdd-6623-47d7-ae19-87b75e966ff6"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/modulos/new"
            component={Authorization(
              ModulosForm,
              "f91cdcdd-6623-47d7-ae19-87b75e966ff6"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/modulos/update/:id"
            component={Authorization(
              ModulosForm,
              "f91cdcdd-6623-47d7-ae19-87b75e966ff6"
            )}
          />
          {/**FIN RUTAS MODULOS */}
          {/**INICIO RUTAS USUARIOS */}
          <PrivateRoute
            exact
            path="/administracion/usuarios"
            component={Authorization(
              Usuarios,
              "0e265555-6b54-4f97-b520-c836c4f7b215"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/usuarios/new"
            component={Authorization(
              UsuariosForm,
              "0e265555-6b54-4f97-b520-c836c4f7b215"
            )}
          />

          <PrivateRoute
            exact
            path="/administracion/usuarios/update/:id"
            component={Authorization(
              UsuariosForm,
              "0e265555-6b54-4f97-b520-c836c4f7b215"
            )}
          />
          {/**FIN RUTAS USUARIOS */}

          {/**INICIO RUTAS ZONAS */}
          <PrivateRoute
            exact
            path="/organizacion/zonas"
            component={Authorization(
              Zonas,
              "c13a1b4d-612a-4f46-ba98-6b0bc5e10e47"
            )}
          />
          <PrivateRoute
            exact
            path="/organizacion/zonas/new"
            component={Authorization(
              ZonasForm,
              "c13a1b4d-612a-4f46-ba98-6b0bc5e10e47"
            )}
          />
          <PrivateRoute
            exact
            path="/organizacion/zonas/update/:id"
            component={Authorization(
              ZonasForm,
              "c13a1b4d-612a-4f46-ba98-6b0bc5e10e47"
            )}
          />
          <PrivateRoute
            exact
            path="/organizacion/zonas/asignacion/:id"
            component={Authorization(
              ZonasDepartamento,
              "c13a1b4d-612a-4f46-ba98-6b0bc5e10e47"
            )}
          />
          {/**FIN RUTAS ZONAS */}

          {/**INICIO RUTAS Distritos */}
          <PrivateRoute
            exact
            path="/organizacion/distritos"
            component={Authorization(
              Distritos,
              "dcc3ec83-1367-4166-94e2-ba46c9c029a1"
            )}
          />
          <PrivateRoute
            exact
            path="/organizacion/distritos/new"
            component={Authorization(
              DistritosForm,
              "dcc3ec83-1367-4166-94e2-ba46c9c029a1"
            )}
          />
          <PrivateRoute
            exact
            path="/organizacion/distritos/update/:id"
            component={Authorization(
              DistritosForm,
              "dcc3ec83-1367-4166-94e2-ba46c9c029a1"
            )}
          />
          {/**FIN RUTAS Distritos */}
          <Redirect to="/" />
        </Switch>
      </MainLayout>
    </Router>
  );
}

export default App;
