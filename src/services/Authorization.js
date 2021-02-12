import React from "react";
import Encryption from "../services/Encrypt";
import { Redirect } from "react-router-dom";

//Funcion para proteger las vistas de la aplicacion, recibe argumento el Componente, y el nombre del modulo
const Authorization = (Componente, modulo) => {
  return class WithAuthorization extends React.Component {
    render() {
      // se evalua si se tiene autorizacion para ese modulo en un arreglo que contendrá el código o nombre identificador el modulo
      if (JSON.parse(Encryption.getSession("modulos")).includes(modulo)) {
        //si tiene autorizacion renderiza el componente
        return <Componente {...this.props} />;
      } else {
        // de lo contrario redirecciona a home
        return <Redirect to="/" />;
      }
    }
  };
};

export default Authorization;
