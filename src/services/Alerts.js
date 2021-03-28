import Swal from "sweetalert2";
import toastr from "toastr";

class Alerts {
  //funcion de éxito al guardar
  alertSuccessSave(nombreModulo, nombreModuloPlural) {
    Swal.fire({
      icon: "success",
      title: "Registro de " + nombreModulo + " guardado con éxito",
      text: "Administración de " + nombreModuloPlural,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      focusConfirm: true,
      timer: 3000,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }
  //funcion de éxito al eliminar o desactivar
  alertSuccessDelete(nombreModulo, nombreModuloPlural) {
    Swal.fire({
      icon: "success",
      title: "Registro de " + nombreModulo + " eliminado con éxito",
      text: "Administración de " + nombreModuloPlural,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      focusConfirm: true,
      timer: 3000,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }
  alertSuccessDisable(nombreModulo, nombreModuloPlural) {
    Swal.fire({
      icon: "success",
      title: "Registro de " + nombreModulo + " desactivado con éxito",
      text: "Administración de " + nombreModuloPlural,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      focusConfirm: true,
      timer: 3000,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }
  //funcion de error al eliminar o desactivar
  alertErrorDelete(tituto, nombreModuloPlural) {
    Swal.fire({
      icon: "error",
      title: "Error al eliminar " + tituto,
      text: "Administración de " + nombreModuloPlural,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      focusConfirm: true,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }
  //funcion de éxito al activar
  alertSuccessEnable(nombreModulo, nombreModuloPlural) {
    Swal.fire({
      icon: "success",
      title: "Registro de " + nombreModulo + " activado con éxito",
      text: "Administración de " + nombreModuloPlural,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      focusConfirm: true,
      timer: 3000,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }
  //funcion de error al activar
  alertErrorEnable(tituto, nombreModuloPlural) {
    Swal.fire({
      icon: "error",
      title: "Error al activar " + tituto,
      text: "Administración de " + nombreModuloPlural,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      focusConfirm: true,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }
  //funcion de error al guardar
  alertErrorSave(nombreModulo, nombreModuloPlural) {
    Swal.fire({
      icon: "error",
      title: "Error al guardar " + nombreModulo,
      text: "Administración de " + nombreModuloPlural,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      focusConfirm: true,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }

  //funcion de éxito al actualizar
  alertSuccessUpdate(nombreModulo, nombreModuloPlural) {
    Swal.fire({
      icon: "success",
      title: "Registro de " + nombreModulo + " actualizado con éxito",
      text: "Administración de " + nombreModuloPlural,
      focusConfirm: true,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      timer: 3000,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }

  //funcion de error al actualizar
  alertErrorUpdate(tituto, nombreModuloPlural) {
    Swal.fire({
      icon: "error",
      title: "Error al actualizar " + tituto,
      text: "Administración de " + nombreModuloPlural,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      focusConfirm: true,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }

  //funcion de alerta para confirmar proceso
  async alertConfirm(title, text) {
    return await Swal.fire({
      title: title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#278eb6",
      cancelButtonColor: "#93908F",
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      cancelButtonText: '<i class="fa fa-times-circle"></i> Cancelar',
      focusCancel: true,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    }).then((result) => {
      if (result.value) {
        return true;
      } else {
        return false;
      }
    });
  }

  //funcion de alerta para confirmar proceso
  async Question(title, text) {
    return await Swal.fire({
      title: title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1A76D2",
      cancelButtonColor: "#93908F",
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      cancelButtonText: '<i class="fa fa-times-circle"></i> Cancelar',
      focusCancel: true,
    }).then((result) => {
      if (result.value) {
        return true;
      } else {
        return false;
      }
    });
  }
  async QuestionYesNo(title, text, type = "question") {
    return await Swal.fire({
      title: title,
      text: text,
      icon: type,
      showCancelButton: true,
      confirmButtonColor: "#278eb6",
      cancelButtonColor: "#93908F",
      confirmButtonText: '<i class="fa fa-check"></i> SI',
      cancelButtonText: '<i class="fa fa-times-circle"></i> NO',
      focusCancel: true,
    }).then((result) => {
      if (result.value) {
        return true;
      } else {
        return false;
      }
    });
  }
  //funcion de error de servidor
  alertErrorServer() {
    Swal.fire({
      icon: "error",
      title: "Error al conectar con el servidor ",
      text:
        "Es posible que no tenga conexión a internet ó el servidor esté fuera de linea, si el problema persiste contactese con el administrador.",
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      focusConfirm: true,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }

  //funcion para configuracion general y emplearla en cualquier caso
  alertEmpty(titulo_principal, texto, tipo) {
    Swal.fire({
      icon: tipo,
      title: titulo_principal,
      allowOutsideClick: false,
      text: texto,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: true,
      focusConfirm: true,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    });
  }

  //funcion para configuracion general y emplearla en cualquier caso
  async alertEmptyResponse(titulo_principal, texto, tipo) {
    return await Swal.fire({
      allowOutsideClick: false,

      icon: tipo,
      title: titulo_principal,
      text: texto,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      showCloseButton: false,
      focusConfirm: true,
      footer: process.env.REACT_APP_FOOTER_ALERTAS,
    }).then((result) => {
      if (result.value) {
        return true;
      } else {
        return false;
      }
    });
  }

  loading_reload(flag) {
    let myalert;
    if (flag) {
      myalert = Swal.fire({
        title: "¡Cargando...!",
        html: "Por favor espere...",
        allowOutsideClick: false,

        onBeforeOpen: () => {
          Swal.showLoading();
        },
        // onClose: () => {

        // }
      });
    } else {
      Swal.close(myalert);
    }
  }

  warning(text, position = "center") {
    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: `toast-top-${position}`,
      preventDuplicates: true,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "6000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
    toastr.error(text);
  }

  toast_info(text, position = "center") {
    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: `toast-top-${position}`,
      preventDuplicates: true,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "6000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
    toastr.info(text);
  }

  toast(text, tipo) {
    Swal.fire({
      position: "top-end",
      icon: tipo,
      title: text,
      showConfirmButton: false,
      timer: 2000,
    });
  }
}

export default new Alerts();
