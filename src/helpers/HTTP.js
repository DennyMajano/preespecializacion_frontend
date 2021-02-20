import Request from "../services/Request";
import Alert from "../services/Alerts";

class HTTP {
  async create(
    data,
    nombre_modulo,
    nombre_modulo_plural,
    ruta_api_name,
    ip = ""
  ) {
    let resp;
    await Request.POST(ruta_api_name, data, ip).then((result) => {
      if (result !== false) {
        if (result.status === 200 || result.status === 201) {
          Alert.alertSuccessSave(nombre_modulo, nombre_modulo_plural);
          resp = {
            status: true,
            data: result.data,
          };
        } else {
          Alert.alertErrorSave(nombre_modulo, nombre_modulo_plural);
          resp = false;
        }
      } else {
        resp = false;
      }
    });

    return resp;
  }

  async update(
    data_update,
    nombre_modulo,
    nombre_modulo_plural,
    ruta_api_name,
    ip = ""
  ) {
    let resp = null;

    await Request.PUT(ruta_api_name, data_update, ip).then((result) => {
      if (result !== false) {
        if (result.status === 200 || result.status === 201) {
          Alert.alertSuccessUpdate(nombre_modulo, nombre_modulo_plural);
          resp = true;
        } else {
          Alert.alertErrorUpdate(nombre_modulo, nombre_modulo_plural);
          resp = false;
        }
      } else {
        resp = false;
      }
    });
    return resp;
  }
  async putRequest(
    data_update,
    mensaje_exito,
    mensaje_error,
    ruta_api_name,
    ip = ""
  ) {
    let resp = null;

    await Request.PUT(ruta_api_name, data_update, ip).then((result) => {
      if (result !== false) {
        if (result.status === 200 || result.status === 201) {
          Alert.alertEmpty("Completado",mensaje_exito,"success");
          resp = true;
        } else {
          Alert.alertEmpty("Error",mensaje_error,"error")
          resp = false;
        }
      } else {
        resp = false;
      }
    });
    return resp;
  }
  async update_admin(
    data_update,
    nombre_modulo,
    nombre_modulo_plural,
    ruta_api_name,
    ip = ""
  ) {
    let resp = null;

    await Request.PUT_A(ruta_api_name, data_update, ip).then((result) => {
      if (result.status === 200) {
        Alert.alertSuccessUpdate(nombre_modulo, nombre_modulo_plural);
        resp = true;
      } else {
        Alert.alertErrorUpdate(nombre_modulo, nombre_modulo_plural);
        resp = false;
      }
    });
    return resp;
  }

  async enable(
    data,
    nombre_modulo,
    nombre_modulo_plural,
    ruta_api_name,
    ip = ""
  ) {
    let resp;

    const mensaje = await Alert.alertConfirm(
      "¿Esta seguro que desea activar el registro?",
      "¡El registro será habilitado en el sistema!"
    );

    if (mensaje) {
      await Request.DELETE(ruta_api_name, data, ip).then((response) => {
        if (response !== false) {
          if (response.status === 200 || response.status === 201) {
            Alert.alertSuccessEnable(nombre_modulo, nombre_modulo_plural);
            // this.getData()
            resp = true;
          } else {
            Alert.alertErrorEnable(nombre_modulo, nombre_modulo_plural);
          }
        }
      });
    }

    return resp;
  }
  async disable(
    data,
    nombre_modulo,
    nombre_modulo_plural,
    ruta_api_name,
    ip = ""
  ) {
    let resp;

    const mensaje = await Alert.alertConfirm(
      `¿Esta seguro que desea desactivar el registro de ${nombre_modulo}?`,
      `Administración de ${nombre_modulo_plural}`
    );

    if (mensaje) {
      await Request.DELETE(ruta_api_name, data, ip).then((response) => {
        if (response !== false) {
          if (response.status === 200 || response.status === 201) {
            Alert.alertSuccessDisable(nombre_modulo, nombre_modulo_plural);
            // this.getData()
            resp = true;
          } else {
            Alert.alertErrorDelete(nombre_modulo, nombre_modulo_plural);
            resp = false;
          }
        }
      });
    } else {
      resp = false;
    }

    return resp;
  }
  async delete_disable(
    data,
    nombre_modulo,
    nombre_modulo_plural,
    ruta_api_name,
    ip = ""
  ) {
    let resp;

    const mensaje = await Alert.alertConfirm(
      `¿Esta seguro que desea eliminar el ${nombre_modulo}?`,
      `Administración de ${nombre_modulo_plural}`
    );

    if (mensaje) {
      await Request.DELETE(ruta_api_name, data, ip).then((response) => {
        if (response !== false) {
          if (response.status === 200 || response.status === 201) {
            Alert.alertSuccessDelete(nombre_modulo, nombre_modulo_plural);
            // this.getData()
            resp = true;
          } else {
            Alert.alertErrorDelete(nombre_modulo, nombre_modulo_plural);
            resp = false;
          }
        }
      });
    } else {
      resp = false;
    }

    return resp;
  }

  // async findAll(ruta_api_name) {
  //   let data = null;
  //   await Request.GET(ruta_api_name).then(result => {
  //     if (result !== false && result.status !== 404 && result.status !== 500 && result.status !== 400 && result.status !== 403 && result.status !== 401) {
  //       data = result.data;
  //     } else {
  //       data = [];
  //     }
  //   });
  //   return data;
  // }
  async findAll(ruta_api_name, ip = "") {
    let data = null;
    await Request.GET_SIN_PARAM(ruta_api_name, ip).then((result) => {
      if (
        result !== false &&
        result.status !== 404 &&
        result.status !== 500 &&
        result.status !== 400 &&
        result.status !== 403 &&
        result.status !== 401
      ) {
        data = result.data;
      } else {
        data = [];
      }
    });
    return data;
  }
  async findById(idregistro, ruta_api_name, ip = "") {
    let data;
    await Request.GET(ruta_api_name, idregistro, ip).then((result) => {
      if (result !== false && result.status === 200) {
        data = result.data;
      } else {
        data = false;
      }
    });

    return data;
  }

  async postRequest(data, ruta_api_name, ip = "") {
    await Request.POST(ruta_api_name, data, ip).then((result) => {
      if (result !== false && result.status === 200) {
        data = result.data;
      } else {
        data = false;
      }
    });

    return data;
  }
}

export default new HTTP();
