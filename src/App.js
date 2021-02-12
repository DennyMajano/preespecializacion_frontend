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
import RoutesPath from "./config/RoutesPath"; //Rutas

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
import Configuracion from "./pages/Acceso/Configuracion/Configuracion";
import TasasIva from "./pages/TasasIva/TasasIva";
import TasasIvaForm from "./pages/TasasIva/TasasIvaForm";
import ImpuestosEspeciales from "./pages/ImpuestosEspeciales/ImpuestosEspeciales";
import ImpuestosEspecialesForm from "./pages/ImpuestosEspeciales/ImpuestosEspecialesForm";
import Categorias from "./pages/Categorias/Categorias";
import CategoriasForm from "./pages/Categorias/CategoriasForm";
import TiposDocumento from "./pages/TiposDocumento/TiposDocumento";
import TiposDocumentoForm from "./pages/TiposDocumento/TiposDocumentoForm";
import UnidadesMedida from "./pages/UnidadesMedida/UnidadesMedida";
import UnidadesMedidaForm from "./pages/UnidadesMedida/UnidadesMedidaForm";
import Productos from "./pages/Productos/Productos";
import ProductosForm from "./pages/Productos/ProductosForm";
import Clientes from "./pages/Clientes/Clientes";
import ClientesForm from "./pages/Clientes/ClientesForm";
import Gestiones from "./pages/Gestiones/Gestiones";
import GestionesForm from "./pages/Gestiones/GestionesForm";
import GestionesHistory from "./pages/Gestiones/GestionesHistory";
import Paquetes from "./pages/Gestiones/Paquetes/Paquetes";
import PaquetesContent from "./pages/Gestiones/Paquetes/PaqueteContent";
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
              "3f689ee9-b3e1-439b-84ca-fee6d5c1781c"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/roles/new"
            component={Authorization(
              RolesForm,
              "3f689ee9-b3e1-439b-84ca-fee6d5c1781c"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/roles/update/:id"
            component={Authorization(
              RolesForm,
              "3f689ee9-b3e1-439b-84ca-fee6d5c1781c"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/roles/asignacion/:id"
            component={Authorization(
              RolesModulos,
              "3f689ee9-b3e1-439b-84ca-fee6d5c1781c"
            )}
          />
          {/**FIN RUTAS ROLES */}

          {/**INICIO RUTAS MODULOS */}
          <PrivateRoute
            exact
            path="/administracion/modulos"
            component={Authorization(
              Modulos,
              "5f4b7113-ff26-4a2d-8506-b6445e5eb4be"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/modulos/new"
            component={Authorization(
              ModulosForm,
              "5f4b7113-ff26-4a2d-8506-b6445e5eb4be"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/modulos/update/:id"
            component={Authorization(
              ModulosForm,
              "5f4b7113-ff26-4a2d-8506-b6445e5eb4be"
            )}
          />
          {/**FIN RUTAS MODULOS */}
          {/**INICIO RUTAS USUARIOS */}
          <PrivateRoute
            exact
            path="/administracion/usuarios"
            component={Authorization(
              Usuarios,
              "b2368e0e-cf14-4168-bfb6-68b851781fbe"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/usuarios/new"
            component={Authorization(
              UsuariosForm,
              "b2368e0e-cf14-4168-bfb6-68b851781fbe"
            )}
          />

          <PrivateRoute
            exact
            path="/administracion/usuarios/update/:id"
            component={Authorization(
              UsuariosForm,
              "b2368e0e-cf14-4168-bfb6-68b851781fbe"
            )}
          />
          {/**FIN RUTAS USUARIOS */}

          {/**INICIO RUTAS TASA IVA */}
          <PrivateRoute
            exact
            path="/administracion/tasas_iva"
            component={Authorization(
              TasasIva,
              "c85623b9-d6a6-44ea-a72c-011c5f4a13d7"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/tasas_iva/new"
            component={Authorization(
              TasasIvaForm,
              "c85623b9-d6a6-44ea-a72c-011c5f4a13d7"
            )}
          />

          <PrivateRoute
            exact
            path="/administracion/tasas_iva/update/:id"
            component={Authorization(
              TasasIvaForm,
              "c85623b9-d6a6-44ea-a72c-011c5f4a13d7"
            )}
          />
          {/**FIN RUTAS TASA IVA */}

          {/**INICIO RUTAS configuracion */}
          <PrivateRoute
            exact
            path="/administracion/configuracion"
            component={Authorization(
              Configuracion,
              "b5dcf605-897d-4521-9464-7176e234fd98"
            )}
          />
          {/**FIN RUTAS configuracion */}

          {/**INICIO RUTAS IMPUESTOS ESPECIALES*/}
          <PrivateRoute
            exact
            path="/administracion/impuestos_especiales"
            component={Authorization(
              ImpuestosEspeciales,
              "81ea746c-7539-4ff6-b33b-d8bf62f8af9e"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/impuestos_especiales/new"
            component={Authorization(
              ImpuestosEspecialesForm,
              "81ea746c-7539-4ff6-b33b-d8bf62f8af9e"
            )}
          />

          <PrivateRoute
            exact
            path="/administracion/impuestos_especiales/update/:id"
            component={Authorization(
              ImpuestosEspecialesForm,
              "81ea746c-7539-4ff6-b33b-d8bf62f8af9e"
            )}
          />
          {/**FIN RUTAS IMPUESTOS ESPECIALES */}

          {/**INICIO RUTAS ICATEGORIAS*/}
          <PrivateRoute
            exact
            path="/categorias"
            component={Authorization(
              Categorias,
              "dbe5c0ee-253f-40b0-a244-34e6b1d0316e"
            )}
          />
          <PrivateRoute
            exact
            path="/categorias/new"
            component={Authorization(
              CategoriasForm,
              "dbe5c0ee-253f-40b0-a244-34e6b1d0316e"
            )}
          />

          <PrivateRoute
            exact
            path="/categorias/update/:id"
            component={Authorization(
              CategoriasForm,
              "dbe5c0ee-253f-40b0-a244-34e6b1d0316e"
            )}
          />
          {/**FIN RUTAS CATEGORIAS*/}

          {/**INICIO RUTAS Tipo de documento*/}
          <PrivateRoute
            exact
            path="/administracion/tipos_documento"
            component={Authorization(
              TiposDocumento,
              "d5cd3659-e9d6-4c6f-afae-3d9d1d9c0032"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/tipos_documento/new"
            component={Authorization(
              TiposDocumentoForm,
              "d5cd3659-e9d6-4c6f-afae-3d9d1d9c0032"
            )}
          />

          <PrivateRoute
            exact
            path="/administracion/tipos_documento/update/:id"
            component={Authorization(
              TiposDocumentoForm,
              "d5cd3659-e9d6-4c6f-afae-3d9d1d9c0032"
            )}
          />
          {/**FIN RUTAS Tipos documento*/}

          {/**INICIO RUTAS Unidades medida*/}
          <PrivateRoute
            exact
            path="/administracion/unidades_medida"
            component={Authorization(
              UnidadesMedida,
              "f4dcf8a2-8824-42f8-b8fe-8a0956f2d300"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/unidades_medida/new"
            component={Authorization(
              UnidadesMedidaForm,
              "f4dcf8a2-8824-42f8-b8fe-8a0956f2d300"
            )}
          />

          <PrivateRoute
            exact
            path="/administracion/unidades_medida/update/:id"
            component={Authorization(
              UnidadesMedidaForm,
              "f4dcf8a2-8824-42f8-b8fe-8a0956f2d300"
            )}
          />
          {/**FIN RUTAS Unidades medida*/}

          {/**INICIO RUTAS PRODUCTOS*/}
          <PrivateRoute
            exact
            path="/productos"
            component={Authorization(
              Productos,
              "6506804a-90e0-40a5-8522-5fd094005f71"
            )}
          />
          <PrivateRoute
            exact
            path="/productos/new"
            component={Authorization(
              ProductosForm,
              "6506804a-90e0-40a5-8522-5fd094005f71"
            )}
          />

          <PrivateRoute
            exact
            path="/productos/update/:id"
            component={Authorization(
              ProductosForm,
              "6506804a-90e0-40a5-8522-5fd094005f71"
            )}
          />
          {/**FIN RUTAS PRODUCTOS*/}

          {/**INICIO RUTAS CLientes*/}
          <PrivateRoute
            exact
            path="/clientes"
            component={Authorization(
              Clientes,
              "6e7719cb-ec27-41db-8330-bc36a612bd85"
            )}
          />
          <PrivateRoute
            exact
            path="/clientes/new"
            component={Authorization(
              ClientesForm,
              "6e7719cb-ec27-41db-8330-bc36a612bd85"
            )}
          />

          <PrivateRoute
            exact
            path="/clientes/update/:id"
            component={Authorization(
              ClientesForm,
              "6e7719cb-ec27-41db-8330-bc36a612bd85"
            )}
          />
          {/**FIN RUTAS Clientes*/}

          {/**INICIO RUTAS Gestiones*/}
          <PrivateRoute
            exact
            path={RoutesPath.GESTIONES}
            component={Authorization(
              Gestiones,
              "3ba1f88d-3cf1-4bc2-90c4-74a5388acb10"
            )}
          />
          <PrivateRoute
            exact
            path={RoutesPath.GESTIONES_HISTORIAL}
            component={Authorization(
              GestionesHistory,
              "3ba1f88d-3cf1-4bc2-90c4-74a5388acb10"
            )}
          />
          <PrivateRoute
            exact
            path={RoutesPath.GESTIONES_NUEVA}
            component={Authorization(
              GestionesForm,
              "3ba1f88d-3cf1-4bc2-90c4-74a5388acb10"
            )}
          />
          <PrivateRoute
            exact
            path={RoutesPath.GESTIONES_UPDATE_WITH_PARAMS}
            component={Authorization(
              GestionesForm,
              "3ba1f88d-3cf1-4bc2-90c4-74a5388acb10"
            )}
          />
          <PrivateRoute
            exact
            path={RoutesPath.GESTIONES_PAQUETES_WITH_PARAMS}
            component={Authorization(
              Paquetes,
              "3ba1f88d-3cf1-4bc2-90c4-74a5388acb10"
            )}
          />
          <PrivateRoute
            exact
            path={RoutesPath.GESTIONES_PAQUETE_PRODUCTOS_WITH_PARAMS}
            component={Authorization(
              PaquetesContent,
              "3ba1f88d-3cf1-4bc2-90c4-74a5388acb10"
            )}
          />

          {/**FIN RUTAS Gestiones*/}
          <Redirect to="/" />
        </Switch>
      </MainLayout>
    </Router>
  );
}

export default App;
