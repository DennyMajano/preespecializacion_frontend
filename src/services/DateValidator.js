import * as moment from "moment";
import es from "moment/locale/es";
class DateValidator {
  Es = es;

  getDiffMinutes(date) {
    let fechaactual = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
    let fechaRecibida = moment(date, "DD/MM/YYYY HH:mm:ss");
    return fechaactual.diff(fechaRecibida, "minutes");
  }
  getDiffHours(date) {
    let fechaactual = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
    let fechaRecibida = moment(date, "DD/MM/YYYY HH:mm:ss");
    return fechaactual.diff(fechaRecibida, "hours");
  }
  getDiffDays(date) {
    let fechaactual = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
    let fechaRecibida = moment(date, "DD/MM/YYYY HH:mm:ss");
    return fechaactual.diff(fechaRecibida, "days");
  }

  getDiffWeeks(date) {
    let fechaactual = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
    let fechaRecibida = moment(date, "DD/MM/YYYY HH:mm:ss");
    return fechaactual.diff(fechaRecibida, "weeks");
  }

  getDiffMonths(date) {
    let fechaactual = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
    let fechaRecibida = moment(date, "DD/MM/YYYY HH:mm:ss");
    return fechaactual.diff(fechaRecibida, "months");
  }

  getDiffYear(date) {
    let fechaactual = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
    let fechaRecibida = moment(date, "DD/MM/YYYY HH:mm:ss");
    return fechaactual.diff(fechaRecibida, "years");
  }

  ValidationFechas(fecha_primera, fecha_a_restar) {
    let fecha_primera_ = moment(fecha_primera, "DD/MM/YYYY HH:mm:ss");
    let fecha_a_restar_ = moment(fecha_a_restar, "DD/MM/YYYY HH:mm:ss");

    return fecha_primera_.diff(fecha_a_restar_, "days");
  }
  /**
   *
   * Para guardar fecha en la base de datos
   */
  validarFechas(fecha) {
    let date = moment(fecha, "DD/MM/YYYY HH:mm:ss");

    return date.format("YYYY-MM-DD");
  }

  validarPicker(fecha) {
    let date = moment(fecha, "DD/MM/YYYY");
    return new Date(
      date.format("YYYY"),
      date.format("M") - 1,
      date.format("D")
    );
    //return date.format("M")
  }
  validarPickerYMD(fecha) {
    let date = moment(fecha, "YYYYY-MM-DD");
    return new Date(
      date.format("YYYY"),
      date.format("M") - 1,
      date.format("D")
    );
    //return date.format("M")
  }
  fecha_larga(fecha) {
    moment.locale("es");
    let date = moment(fecha, "DD/MM/YYYY");
    return date.format("dddd DD [de] MMMM [de] YYYY");
  }

  fecha_por_guiones(fecha) {
    let date = moment(fecha, "DD/MM/YYYY HH:mm:ss");

    return date.format("DD-MM-YYYY");
  }

  fecha_por_guionesYMD(fecha) {
    let date = moment(fecha, "YYYYY-MM-DD");

    return date.format("DD-MM-YYYY");
  }
  fecha_y_hora(fecha) {
    let date = moment(fecha);

    return date.format("DD/MM/YYYY - hh:mm A");
  }
}

export default new DateValidator();
