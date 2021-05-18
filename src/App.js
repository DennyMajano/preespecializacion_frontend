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
import Personas from "./pages/Personas/Personas";
import PersonasForm from "./pages/Personas/PersonasForm";
import MaestroInformes from "./pages/Maestro_Informes/MaestroInformes";
import MaestroInformesForm from "./pages/Maestro_Informes/MaestroInformesForm";
import NivelesPastorales from "./pages/NivelesPastorales/NivelesPastorales";
import NivelesPastoralesForm from "./pages/NivelesPastorales/NivelesPastoralesForm";
import Iglesias from "./pages/Iglesias/Iglesias";
import IglesiasForm from "./pages/Iglesias/IglesiasForm";
import IglesiasReportes from "./pages/Iglesias/IglesiasReportes";
import NivelesAcademicos from "./pages/NivelesAcademicos/NivelesAcademicos";
import NivelesAcademicoForm from "./pages/NivelesAcademicos/NivelesAcademicoForm";
import Pastores from "./pages/Pastores/Pastores";
import PastoresForm from "./pages/Pastores/PastoresForm";
import PeriodosMinisteriales from "./pages/PeriodosMinisteriales/PeriodosMinisteriales";
import PeriodosMinisterialesForm from "./pages/PeriodosMinisteriales/PeriodosMinisterialesForm";
import GestionesInformes from "./pages/Informes/GestionesInformes/GestionesInformes";
import GestionesInformesForm from "./pages/Informes/GestionesInformes/GestionesInformesForm";
import GestionesAsignacionInformes from "./pages/Informes/GestionesInformes/GestionesAsignacionInformes";
import PresentacionInformesIglesia from "./pages/Informes/PresentacionInformes/PresentacionInformesIglesia";
import PresentacionInformes from "./pages/Informes/PresentacionInformes/PresentacionInformes";
import InformeFinancieroMensual from "./pages/Informes/FormulariosInfomes/InformesIglesias/InformeFinancieroMensual/InformeFinancieroMensual";
import InformeMinisterialMensual from "./pages/Informes/FormulariosInfomes/InformesIglesias/InformeMinisterialMensual/InformeMinisterialMensual";
import InformeTesoreroMensual from "./pages/Informes/FormulariosInfomes/InformesIglesias/InformeTesoreroMensual/InformeTesoreroMensual";

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
          {/**INICO RUTAS personas */}
          <PrivateRoute
            exact
            path="/recursos_humanos/personas"
            component={Authorization(
              Personas,
              "9c464bd0-6015-4927-a881-9b0005c645ed"
            )}
          />
          <PrivateRoute
            exact
            path="/recursos_humanos/personas/new"
            component={Authorization(
              PersonasForm,
              "9c464bd0-6015-4927-a881-9b0005c645ed"
            )}
          />
          <PrivateRoute
            exact
            path="/recursos_humanos/personas/update/:codigo"
            component={Authorization(
              PersonasForm,
              "9c464bd0-6015-4927-a881-9b0005c645ed"
            )}
          />
          {/**FIN RUTAS personas */}

          {/**INICIO RUTAS Maestro de informes */}
          <PrivateRoute
            exact
            path="/administracion/maestro_informes"
            component={Authorization(
              MaestroInformes,
              "6036af3b-234f-4c74-bdec-53a457f39d0a"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/maestro_informes/new"
            component={Authorization(
              MaestroInformesForm,
              "6036af3b-234f-4c74-bdec-53a457f39d0a"
            )}
          />
          <PrivateRoute
            exact
            path="/administracion/maestro_informes/update/:id"
            component={Authorization(
              MaestroInformesForm,
              "6036af3b-234f-4c74-bdec-53a457f39d0a"
            )}
          />
          {/**FIN RUTAS Maestro de informes */}

          {/**INICIO RUTAS NIVELES PASTORALES */}
          <PrivateRoute
            exact
            path="/recursos_humanos/niveles_pastorales"
            component={Authorization(
              NivelesPastorales,
              "1a087be0-a30e-4d26-af29-1846a20e2d1a"
            )}
          />
          <PrivateRoute
            exact
            path="/recursos_humanos/niveles_pastorales/new"
            component={Authorization(
              NivelesPastoralesForm,
              "1a087be0-a30e-4d26-af29-1846a20e2d1a"
            )}
          />
          <PrivateRoute
            exact
            path="/recursos_humanos/niveles_pastorales/update/:id"
            component={Authorization(
              NivelesPastoralesForm,
              "1a087be0-a30e-4d26-af29-1846a20e2d1a"
            )}
          />
          {/**FIN RUTAS NIVELES PASTORALES */}

          {/**INICIO RUTAS IGLESIAS */}
          <PrivateRoute
            exact
            path="/organizacion/iglesias"
            component={Authorization(
              Iglesias,
              "ca8b7b5c-652d-46db-a640-6ce29b6e7457"
            )}
          />
          <PrivateRoute
            exact
            path="/organizacion/iglesias/new"
            component={Authorization(
              IglesiasForm,
              "ca8b7b5c-652d-46db-a640-6ce29b6e7457"
            )}
          />
          <PrivateRoute
            exact
            path="/organizacion/iglesias/update/:id"
            component={Authorization(
              IglesiasForm,
              "ca8b7b5c-652d-46db-a640-6ce29b6e7457"
            )}
          />
          <PrivateRoute
            exact
            path="/organizacion/iglesias/asignacion_resportes/:id"
            component={Authorization(
              IglesiasReportes,
              "ca8b7b5c-652d-46db-a640-6ce29b6e7457"
            )}
          />
          {/**FIN RUTAS IGLESIAS */}

          {/**INICIO RUTAS NIVELES Academicos */}
          <PrivateRoute
            exact
            path="/recursos_humanos/niveles_academicos"
            component={Authorization(
              NivelesAcademicos,
              "68ff3ca6-05c7-450b-9d6f-5e315ef76d6e"
            )}
          />
          <PrivateRoute
            exact
            path="/recursos_humanos/niveles_academicos/new"
            component={Authorization(
              NivelesAcademicoForm,
              "68ff3ca6-05c7-450b-9d6f-5e315ef76d6e"
            )}
          />
          <PrivateRoute
            exact
            path="/recursos_humanos/niveles_academicos/update/:id"
            component={Authorization(
              NivelesAcademicoForm,
              "68ff3ca6-05c7-450b-9d6f-5e315ef76d6e"
            )}
          />
          {/**FIN RUTAS NIVELES Academicos */}
          {/**INICIO RUTAS PASTORES */}
          <PrivateRoute
            exact
            path="/recursos_humanos/pastores"
            component={Authorization(
              Pastores,
              "753278e6-c194-4858-ab8e-5d3760cf5ea4"
            )}
          />
          <PrivateRoute
            exact
            path="/recursos_humanos/pastores/update/:codigo"
            component={Authorization(
              PastoresForm,
              "753278e6-c194-4858-ab8e-5d3760cf5ea4"
            )}
          />
          <PrivateRoute
            exact
            path="/recursos_humanos/pastores/new"
            component={Authorization(
              PastoresForm,
              "753278e6-c194-4858-ab8e-5d3760cf5ea4"
            )}
          />

          {/**FIN RUTAS PASTORES */}
          {/**INICIO RUTAS PERIODOS MINISTERIALES */}
          <PrivateRoute
            exact
            path="/periodos_ministeriales"
            component={Authorization(
              PeriodosMinisteriales,
              "18130aec-698b-4d2e-8f24-461eff84c4af"
            )}
          />
          <PrivateRoute
            exact
            path="/periodos_ministeriales/new"
            component={Authorization(
              PeriodosMinisterialesForm,
              "18130aec-698b-4d2e-8f24-461eff84c4af"
            )}
          />
          <PrivateRoute
            exact
            path="/periodos_ministeriales/update/:id"
            component={Authorization(
              PeriodosMinisterialesForm,
              "18130aec-698b-4d2e-8f24-461eff84c4af"
            )}
          />
          {/**FIN RUTAS NIVELES PERIODOS MINISTERIALES */}

          {/**INICIO RUTAS GESTIONES DE INFORMES */}
          <PrivateRoute
            exact
            path="/informes_mensuales/gestiones_entrega"
            component={Authorization(
              GestionesInformes,
              "069c8570-a351-4e5b-9228-448893c18e49"
            )}
          />
          <PrivateRoute
            exact
            path="/informes_mensuales/gestiones_entrega/new"
            component={Authorization(
              GestionesInformesForm,
              "069c8570-a351-4e5b-9228-448893c18e49"
            )}
          />
          <PrivateRoute
            exact
            path="/informes_mensuales/gestiones_entrega/asignacion_informes/:id"
            component={Authorization(
              GestionesAsignacionInformes,
              "069c8570-a351-4e5b-9228-448893c18e49"
            )}
          />
          <PrivateRoute
            exact
            path="/informes_mensuales/gestiones_entrega/asignados/:gestion_activa"
            component={Authorization(
              GestionesAsignacionInformes,
              "069c8570-a351-4e5b-9228-448893c18e49"
            )}
          />
          <PrivateRoute
            exact
            path="/informes_mensuales/gestiones_entrega/update/:id"
            component={Authorization(
              GestionesInformesForm,
              "069c8570-a351-4e5b-9228-448893c18e49"
            )}
          />
          {/**FIN RUTAS GESTIONES DE INFORMES */}

          {/**INCIO RUTAS PRESENTAR INFORMES */}
          <PrivateRoute
            exact
            path="/presentacion_informes"
            component={Authorization(
              PresentacionInformes,
              "32c9c5a4-6b90-4c08-bed4-57caa03ff573"
            )}
          />
          <PrivateRoute
            exact
            path="/presentacion_informes/iglesia/:id"
            component={Authorization(
              PresentacionInformesIglesia,
              "32c9c5a4-6b90-4c08-bed4-57caa03ff573"
            )}
          />

          <PrivateRoute
            exact
            path="/presentacion_informes/informe_financiero_mensual/create/:gestion"
            component={Authorization(
              InformeFinancieroMensual,
              "32c9c5a4-6b90-4c08-bed4-57caa03ff573"
            )}
          />
          <PrivateRoute
            exact
            path="/presentacion_informes/informe_financiero_mensual/update/:gestion/:ide"
            component={Authorization(
              InformeFinancieroMensual,
              "32c9c5a4-6b90-4c08-bed4-57caa03ff573"
            )}
          />

          <PrivateRoute
            exact
            path="/presentacion_informes/informe_ministerial_mensual/create/:gestion"
            component={Authorization(
              InformeMinisterialMensual,
              "32c9c5a4-6b90-4c08-bed4-57caa03ff573"
            )}
          />
          <PrivateRoute
            exact
            path="/presentacion_informes/informe_ministerial_mensual/update/:gestion/:ide"
            component={Authorization(
              InformeMinisterialMensual,
              "32c9c5a4-6b90-4c08-bed4-57caa03ff573"
            )}
          />

          <PrivateRoute
            exact
            path="/presentacion_informes/informe_tesorero_mensual/create/:gestion"
            component={Authorization(
              InformeTesoreroMensual,
              "32c9c5a4-6b90-4c08-bed4-57caa03ff573"
            )}
          />
          <PrivateRoute
            exact
            path="/presentacion_informes/informe_tesorero_mensual/update/:gestion/:ide"
            component={Authorization(
              InformeTesoreroMensual,
              "32c9c5a4-6b90-4c08-bed4-57caa03ff573"
            )}
          />
          {/**FIN RUTAS PRESENTAR INFORMES */}

          <Redirect to="/" />
        </Switch>
      </MainLayout>
    </Router>
  );
}

export default App;
