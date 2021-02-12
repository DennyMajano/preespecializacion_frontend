import React from "react";
import { Route } from "react-router-dom";
import Encryptation from "../../services/Encrypt";

//Funcion para rutas publicas esta es para mostrar componentes que no tienen restricion de rol
const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      // se evalua si se esta logueado y si la session no esta bloqueda
      Encryptation.getSession("token") ? (
        //renderiza el componete
        <Component {...props} />
      ) : //no renderiza ningun componente
      null
    }
  />
);

export default PublicRoute;
