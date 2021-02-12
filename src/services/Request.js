import axios from "axios";
//import Alert from './Alert';
import Encryption from "./Encrypt";

// Clase http la cual se maneja las peticiones a la api.
class Request {
  getHeader(ip) {
    const header = {
      //Se obtiene el token de la session
      Authorization: `bearer ${Encryption.getSession("token")}`,
      ipaddress: ip,
    };

    return header;
  }

  getHeaderReportes() {
    const header = {
      //Se obtiene el token de la session
      Authorization: Encryption.getSession("token"),
    };

    return header;
  }
  // Funcion para las peticione POST
  async POST(nombre_ruta, body, ip = "") {
    //peticion con axios post recibe como argumento la ruta de la api, los datos, y las cabeceras donde va el token
    return await axios
      .post(process.env.REACT_APP_URL + nombre_ruta, body, {
        headers: this.getHeader(ip),
      })
      .then((response) => {
        if (!response) {
          // si no hay respuesta del servidor retorna falso
          return false;
        }

        //si existe respuesta envia la respuesta
        return response;
      })
      .catch((error) => {
        //si no existe un error por parte del servidor
        if (!error.response) {
          //Se genera una alerta de error al servidor
          //Alert.alertErrorServer()
          //restorna false
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }

  // Funcion para las peticione POST
  async POST_FILE(nombre_ruta, body) {
    //peticion con axios post recibe como argumento la ruta de la api, los datos, y las cabeceras donde va el token
    return await axios
      .post(process.env.REACT_APP_URL + nombre_ruta, body, {
        headers: {
          Authorization: Encryption.getSession("token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (!response) {
          // si no hay respuesta del servidor retorna falso
          return false;
        }

        //si existe respuesta envia la respuesta
        return response;
      })
      .catch((error) => {
        //si no existe un error por parte del servidor
        if (!error.response) {
          //Se genera una alerta de error al servidor
          //  Alert.alertErrorServer()
          //restorna false
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }

  //funcion post sin enviar las cabeceras
  async POST_A(nombre_ruta, body, ip = "0.0.0.0") {
    return await axios
      .post(process.env.REACT_APP_URL + nombre_ruta, body, {
        headers: { ipaddress: ip },
      })
      .then((response) => {
        if (!response) {
          return false;
        }

        return response;
      })
      .catch((error) => {
        if (!error.response) {
          //  Alert.alertErrorServer()
          return false;
        }

        return error.response;
      });
  }

  // funcion para peticiones PUT para actualizar registros, recibe la ruta, la data pero ademas recibe las restricciones de los campos
  //Y que si no tiene permiso a un campo ese valor no se envia
  async PUT(nombre_ruta, body, ip = "") {
    // se  valida la data con los permiso en la funcion validar data para no enviar datos que no tiene permiso
    return await axios
      .put(process.env.REACT_APP_URL + nombre_ruta, body, {
        headers: this.getHeader(ip),
      })
      .then((response) => {
        if (!response) {
          return false;
        }

        return response;
      })
      .catch((error) => {
        if (!error.response) {
          //Alert.alertErrorServer()
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }
  //Funcion put para actualizar registros pero para administracion ya que no valida restriccion de campos
  async PUT_A(nombre_ruta, body, ip = "") {
    return await axios
      .put(process.env.REACT_APP_URL + nombre_ruta, body, {
        headers: this.getHeader(ip),
      })
      .then((response) => {
        if (!response) {
          return false;
        }

        return response;
      })
      .catch((error) => {
        if (!error.response) {
          // Alert.alertErrorServer()
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }
  // Funcion para las peticione POSY
  async PUT_FILE(nombre_ruta, body) {
    //peticion con axios post recibe como argumento la ruta de la api, los datos, y las cabeceras donde va el token
    return await axios
      .put(process.env.REACT_APP_URL + nombre_ruta, body, {
        headers: {
          Authorization: "Bearer " + Encryption.getSession("token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (!response) {
          // si no hay respuesta del servidor retorna falso
          return false;
        }

        //si existe respuesta envia la respuesta
        return response;
      })
      .catch((error) => {
        //si no existe un error por parte del servidor
        if (!error.response) {
          //Se genera una alerta de error al servidor
          //  Alert.alertErrorServer()
          //restorna false
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }

  //Funcion get recibe como argumento el nombre de la ruta, y el id en caso que exista como valor predeterminado es vacio
  async GET(nombre_ruta, id = "", ip = "") {
    // en esta peticion se concatena a la ruta el id si existiera se escribe el valor si no es vacio
    return await axios
      .get(process.env.REACT_APP_URL + nombre_ruta + "/" + id, {
        headers: this.getHeader(ip),
      })
      .then((response) => {
        if (!response) {
          return false;
        }

        return response;
      })
      .catch((error) => {
        if (!error.response) {
          //  Alert.alertErrorServer()
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }

  //Funcion get recibe como argumento el nombre de la ruta, y el id en caso que exista como valor predeterminado es vacio
  async GET_SIN_PARAM(nombre_ruta, ip = "") {
    // en esta peticion se concatena a la ruta el id si existiera se escribe el valor si no es vacio
    return await axios
      .get(process.env.REACT_APP_URL + nombre_ruta, {
        headers: this.getHeader(ip),
      })
      .then((response) => {
        if (!response) {
          return false;
        }

        return response;
      })
      .catch((error) => {
        if (!error.response) {
          //  Alert.alertErrorServer()
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }

  async GET_IMAGE(nombre_ruta, id = "", ip = "") {
    // en esta peticion se concatena a la ruta el id si existiera se escribe el valor si no es vacio
    return await axios
      .get(process.env.REACT_APP_URL + nombre_ruta + "/" + id, {
        headers: this.getHeader(ip),
        responseType: "arraybuffer",
      })
      .then((response) => {
        if (!response) {
          return false;
        }

        return response;
      })
      .catch((error) => {
        if (!error.response) {
          //Alert.alertErrorServer()
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }
  //Funcion get recibe como argumento el nombre de la ruta, y el id en caso que exista como valor predeterminado es vacio
  async GET_PDF(nombre_ruta, ip = "") {
    // en esta peticion se concatena a la ruta el id si existiera se escribe el valor si no es vacio
    return await axios
      .get(process.env.REACT_APP_URL + nombre_ruta, {
        headers: this.getHeaderReportes(),
        responseType: "arraybuffer",
      })
      .then((response) => {
        if (!response) {
          return false;
        }

        return response;
      })
      .catch((error) => {
        if (!error.response) {
          //Alert.alertErrorServer()
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }
  async GET_DOWNLOAD(nombre_ruta, id = "", ip = "") {
    // en esta peticion se concatena a la ruta el id si existiera se escribe el valor si no es vacio
    return await axios
      .get(process.env.REACT_APP_URL_REPORTES + nombre_ruta + "/" + id, {
        headers: this.getHeader(ip),
        responseType: "blob",
      })
      .then((response) => {
        if (!response) {
          return false;
        }

        return response;
      })
      .catch((error) => {
        if (!error.response) {
          //Alert.alertErrorServer()
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }
  // funcion para desactivar o eliminar registros
  async DELETE(nombre_ruta, body, ip = "") {
    return await axios
      .delete(process.env.REACT_APP_URL + nombre_ruta, {
        headers: this.getHeader(ip),
        data: body,
      })
      .then((response) => {
        if (!response) {
          return false;
        }

        return response;
      })
      .catch((error) => {
        if (!error.response) {
          //  Alert.alertErrorServer()
          return false;
        }
        if (error.response.status === 401) {
          //Borra todas las Sesiones guardadas en sessionStorage
          sessionStorage.clear();

          //redirerecciona al Login
          window.location.href = "/login";
        }
        return error.response;
      });
  }
}

export default new Request();
