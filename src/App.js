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

function App() {
  return (
    <Router>
      <MainLayout>
        <Switch>
          <Route exact path="/login" component={Login} />
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

          <Redirect to="/" />
        </Switch>
      </MainLayout>
    </Router>
  );
}

export default App;
