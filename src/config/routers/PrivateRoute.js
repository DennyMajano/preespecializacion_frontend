import React from "react";
import { Route, Redirect } from "react-router-dom";
import Encryption from "../../services/Encrypt";
//import Authentication from '../Services/Authentication'
//Funcion para rutas privadas esta evaluan si existe un login para funcionar
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      //Se evalua si existe un login y si existe action
      Encryption.getSession("token") ? (
        //si no existe el timeout, se crea la variable url donde se guarda la location de esa ruta en ese momento
        //Luego se evalua si la ruta en al que se esta en ese momento, si esta es diferente a la url_save destruye el trabajo guardaro
        //Luego reporta el componente
        //Si no se cumplen se realiza un logout
        <Component {...props} />
      ) : (
        //Si no esta logueado se eliminan las sesiones
        //Encryption.clearSession(),
        <Redirect to="/login" /> // window.location.href = "/login"
      )
    }
  />
);

export default PrivateRoute;
