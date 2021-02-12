import React, { Component } from "react";
import LayoutPanelFormulario from "../../../components/layouts/panels/LayoutPanelFormulario";
import AsyncSelect from "react-select/async";
import HTTP from "../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../helpers/ValidatorTranslate_es";

export default class Configuracion extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    loading: false,

    redirect: false,
    id: null,
    nombre_reportes: "",
    direccion_esa: "",
    direccion_usa: "",
    numero_registro_mercancias: "",
    decreto: "",
    gestor: "",
    codigo_gestor: "",
    fecha_revision: "",
    limite_productos_item_general: "",
    limite_monetario_general: "",
    cantidad_limite_monetario_general: "",
    iva_por_exceso_limite_monetario_general: "",
    condicion: "",
    update_time: "",
    fecha_registro: "",
    codigo_aduana: "",
    usuarios: [],
    tasas_iva: [],
    iva: "",
    disabled_select: true,
    disabled_tasa_iva: true,
    disable_limite_monetario: true,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    this.setState({
      usuarios: this.getUsuarios(),
      tasas_iva: this.getTasaIva(),
    });
    this.getConfiguracion();
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  hide_alert_validator() {
    this.validator.hideMessages();
    this.forceUpdate();
  }

  getConfiguracion() {
    HTTP.findById("", "configuracion").then((result) => {
      if (result !== false) {
        this.setState(result);

        if (result.limite_monetario_general === 1) {
          document.getElementById("limite_monetario_general").checked = true;
          this.setState({ disable_limite_monetario: false });
        } else {
          document.getElementById("limite_monetario_general").checked = false;
          this.setState({ disable_limite_monetario: true });
        }
      }
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      this.setState({ loading: true });

      if (this.state.id !== null) {
        const data = {
          code: this.state.id,
          nombre_reportes: this.state.nombre_reportes,
          direccion_esa: this.state.direccion_esa,
          direccion_usa: this.state.direccion_usa,
          numero_registro_mercancias: this.state.numero_registro_mercancias,
          decreto: this.state.decreto,
          gestor:
            this.state.gestor !== "" && this.state.gestor !== null
              ? this.state.gestor.value
              : null,
          codigo_gestor: this.state.codigo_gestor,
          fecha_revision: this.state.fecha_revision,
          limite_productos_item_general: this.state
            .limite_productos_item_general,
          limite_monetario_general: this.state.limite_monetario_general,
          cantidad_limite_monetario_general:
            this.state.cantidad_limite_monetario_general !== "" &&
            this.state.cantidad_limite_monetario_general !== null
              ? this.state.cantidad_limite_monetario_general
              : 0.0,
          iva_por_exceso_limite_monetario_general:
            this.state.iva_por_exceso_limite_monetario_general !== "" &&
            this.state.iva_por_exceso_limite_monetario_general !== null
              ? this.state.iva_por_exceso_limite_monetario_general.value
              : 0,
          fecha_registro: this.state.fecha_registro,
          codigo_aduana: this.state.codigo_aduana,
          iva:
            this.state.iva !== "" && this.state.iva !== null
              ? this.state.iva.value
              : null,
          tasa_iva:
            this.state.iva !== "" && this.state.iva !== null
              ? this.state.iva.tasa_iva
              : null,
          porcentaje_iva:
            this.state.iva !== "" && this.state.iva !== null
              ? this.state.iva.porcentaje_iva
              : null,
        };
        HTTP.update(
          data,
          "configuración",
          "configuración global",
          "configuracion"
        ).then((result) => {
          this.setState({ loading: false });
          this.getConfiguracion();
        });
      } else {
        const data = {
          nombre_reportes: this.state.nombre_reportes,
          direccion_esa: this.state.direccion_esa,
          direccion_usa: this.state.direccion_usa,
          numero_registro_mercancias: this.state.numero_registro_mercancias,
          decreto: this.state.decreto,
          gestor:
            this.state.gestor !== "" && this.state.gestor !== null
              ? this.state.gestor.value
              : null,
          codigo_gestor: this.state.codigo_gestor,
          fecha_revision: this.state.fecha_revision,
          limite_productos_item_general: this.state
            .limite_productos_item_general,
          limite_monetario_general: this.state.limite_monetario_general,
          cantidad_limite_monetario_general: this.state
            .cantidad_limite_monetario_general,
          iva_por_exceso_limite_monetario_general:
            this.state.iva_por_exceso_limite_monetario_general !== "" &&
            this.state.iva_por_exceso_limite_monetario_general !== null
              ? this.state.iva_por_exceso_limite_monetario_general.value
              : 0,
          fecha_registro: this.state.fecha_registro,
          codigo_aduana: this.state.codigo_aduana,
          iva:
            this.state.iva !== "" && this.state.iva !== null
              ? this.state.iva.value
              : null,
          tasa_iva:
            this.state.iva !== "" && this.state.iva !== null
              ? this.state.iva.tasa_iva
              : null,
          porcentaje_iva:
            this.state.iva !== "" && this.state.iva !== null
              ? this.state.iva.porcentaje_iva
              : null,
        };
        HTTP.create(
          data,
          "configuración",
          "configuración global",
          "configuracion"
        ).then((result) => {
          this.setState({ loading: false });

          this.getConfiguracion();
        });
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  getTasaIvaParam = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "tasas_iva/select").then((data) => {
          if (data !== false) {
            data.forEach((element) => {
              tempArray.push({
                label: element.nombre,
                value: element.id,
                porcentaje_iva: element.porcentaje_iva,
                tasa_iva: element.tasa_iva,
              });
            });
            callback(tempArray);
          } else {
            callback([]);
          }
        });
      }, 500);
    }
  };
  getTasaIva() {
    let data = [];

    HTTP.findAll("tasas_iva/select").then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
          porcentaje_iva: element.porcentaje_iva,
          tasa_iva: element.tasa_iva,
        });
      });

      this.setState({
        disabled_tasa_iva: false,
      });
    });

    return data;
  }
  getUsuariosParam = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "usuarios/all").then((data) => {
          if (data !== false) {
            data.forEach((element) => {
              tempArray.push({
                label: `${element.nombre}`,
                value: element.id,
              });
            });
            callback(tempArray);
          } else {
            callback([]);
          }
        });
      }, 500);
    }
  };
  getUsuarios() {
    let data = [];

    HTTP.findAll("usuarios/all").then((result) => {
      result.forEach((element) => {
        data.push({ label: element.nombre, value: element.id });
      });

      this.setState({ disabled_select: false });
    });

    return data;
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/administracion/usuarios" />;
    }
    return (
      <React.Fragment>
        <LayoutPanelFormulario
          titulo={"Configuración General"}
          submit={this.onSubmit}
          titulo_panel="Formulario de datos de configuración general"
          buttons={
            <div className="card-footer text-center">
              <div className="btn-group">
                <button
                  type="submit"
                  className="btn btn-info"
                  disabled={this.state.loading}
                >
                  <i className="fa fa-save mr-2"></i>
                  {this.state.loading === false ? "GUARDAR" : "GUARDANDO..."}
                </button>
              </div>
            </div>
          }
        >
          <h3 className="card-title">Configuración Básica</h3>
          <hr />
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-lg-3 form-group">
                <label htmlFor="">Usuario Gestor: (*)</label>

                <AsyncSelect
                  id="gestor"
                  name="gestor"
                  placeholder="Seleccione una opción"
                  value={this.state.gestor}
                  isClearable={true}
                  loadOptions={this.getUsuariosParam}
                  defaultOptions={this.state.usuarios}
                  isDisabled={this.state.disabled_select}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({ gestor: e });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                  // onFocus={() => {
                  //   this.handleFocusSelect(false)

                  // }}
                  // onBlur={() => {
                  //   this.handleFocusSelect(true)
                  // }}
                />
                {this.validator.message(
                  "gestor",
                  this.state.gestor,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "gestor",
                      this.state.gestor,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Nombre de gestor: (*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe nombre gestor"
                  id="nombre_reportes"
                  value={this.state.nombre_reportes}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "nombre de gestor",
                  this.state.nombre_reportes,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "nombre de gestor",
                      this.state.nombre_reportes,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Código Gestor: (*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  id="codigo_gestor"
                  value={this.state.codigo_gestor}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "gestor",
                  this.state.codigo_gestor,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "gestor",
                      this.state.codigo_gestor,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">No. Registro: (*)</label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Escribe número registro"
                  id="numero_registro_mercancias"
                  value={this.state.numero_registro_mercancias}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "número registro",
                  this.state.numero_registro_mercancias,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "número registro",
                      this.state.numero_registro_mercancias,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Decreto: (*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe decreto"
                  id="decreto"
                  value={this.state.decreto}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "descreto",
                  this.state.decreto,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "descreto",
                      this.state.decreto,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Aduana: (*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe número aduana"
                  id="codigo_aduana"
                  value={this.state.codigo_aduana}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "aduana",
                  this.state.codigo_aduana,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "aduana",
                      this.state.codigo_aduana,
                      "required"
                    )}
                  </span>
                )}
              </div>

              <div className="col-lg-3 form-group">
                <label htmlFor="">Revisión: (*)</label>

                <input
                  type="date"
                  className="form-control"
                  id="fecha_revision"
                  value={this.state.fecha_revision}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "revisión",
                  this.state.fecha_revision,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "revisión",
                      this.state.fecha_revision,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Fecha registro: (*)</label>

                <input
                  type="date"
                  className="form-control"
                  id="fecha_registro"
                  value={this.state.fecha_registro}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "fecha registro",
                  this.state.fecha_registro,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "fecha registro",
                      this.state.fecha_registro,
                      "required"
                    )}
                  </span>
                )}
              </div>

              <div className="col-lg-6 form-group">
                <label htmlFor="">Dirección en el salvador: (*)</label>

                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Escriba la direccion del gestor en El Salvador"
                  id="direccion_esa"
                  value={this.state.direccion_esa}
                  onChange={this.handleInputChange}
                  cols="30"
                  rows="4"
                />
                {this.validator.message(
                  "dirección en el salvador",
                  this.state.direccion_esa,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "dirección en el salvador",
                      this.state.direccion_esa,
                      "required"
                    )}
                  </span>
                )}
              </div>

              <div className="col-lg-6 form-group">
                <label htmlFor="">Dirección en EEUU: (*)</label>

                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Escriba la direccion del gestor en EEUU"
                  id="direccion_usa"
                  value={this.state.direccion_usa}
                  onChange={this.handleInputChange}
                  cols="30"
                  rows="4"
                />
                {this.validator.message(
                  "dirección en EEUU",
                  this.state.direccion_usa,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "dirección en EEUU",
                      this.state.direccion_usa,
                      "required"
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
          <h3 className="card-title">Configuración de paquetes</h3>
          <hr />
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-lg-3 form-group">
                <label htmlFor="">Límite productos por ítem: (*)</label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Escriba cantidad límite"
                  id="limite_productos_item_general"
                  value={this.state.limite_productos_item_general}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "límite productos por ítem",
                  this.state.limite_productos_item_general,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "límite productos por ítem",
                      this.state.limite_productos_item_general,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Tasa IVA: (*)</label>

                <AsyncSelect
                  id="iva"
                  name="iva"
                  placeholder="Seleccione una opción"
                  value={this.state.iva}
                  isDisabled={this.state.disabled_tasa_iva}
                  isClearable={true}
                  loadOptions={this.getTasaIvaParam}
                  defaultOptions={this.state.tasas_iva}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({
                      iva: e,
                    });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                  // onFocus={() => {
                  //   this.handleFocusSelect(false)

                  // }}
                  // onBlur={() => {
                  //   this.handleFocusSelect(true)
                  // }}
                />
                {this.validator.message(
                  "IVA por exceso monetario",
                  this.state.iva,

                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "IVA por exceso monetario",
                      this.state.iva,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group text-center">
                <input
                  type="checkbox"
                  className="form-check-input filled-in chk-col-light-blue"
                  id="limite_monetario_general"
                  onChange={() => {
                    if (
                      document.getElementById("limite_monetario_general")
                        .checked
                    ) {
                      this.setState({
                        limite_monetario_general: 1,
                        disable_limite_monetario: false,
                      });
                    } else {
                      this.setState({
                        limite_monetario_general: 0,
                        disable_limite_monetario: true,
                        cantidad_limite_monetario_general: "",
                        iva_por_exceso_limite_monetario_general: "",
                      });
                    }
                  }}
                  value={this.state.limite_monetario_general}
                />
                <label
                  className="form-check-label mt-4"
                  htmlFor="limite_monetario_general"
                >
                  Establecer limite monetario
                </label>
              </div>

              <div className="col-lg-3 form-group">
                <label htmlFor="">Límite monetario por paquete: (*)</label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Nombre"
                  id="cantidad_limite_monetario_general"
                  value={this.state.cantidad_limite_monetario_general}
                  onChange={this.handleInputChange}
                  disabled={this.state.disable_limite_monetario}
                />
                {this.validator.message(
                  "límite monetario por paquete",
                  this.state.limite_monetario_general === 1
                    ? this.state.cantidad_limite_monetario_general
                    : 1,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "límite monetario por paquete",
                      this.state.limite_monetario_general === 1
                        ? this.state.cantidad_limite_monetario_general
                        : 1,
                      "required"
                    )}
                  </span>
                )}
              </div>

              <div className="col-lg-3 form-group">
                <label htmlFor="">IVA por exceso monetario: (*)</label>

                <AsyncSelect
                  id="iva_por_exceso_limite_monetario_general"
                  name="iva_por_exceso_limite_monetario_general"
                  placeholder="Seleccione una opción"
                  value={this.state.iva_por_exceso_limite_monetario_general}
                  isClearable={true}
                  loadOptions={this.getTasaIvaParam}
                  defaultOptions={this.state.tasas_iva}
                  isDisabled={this.state.disable_limite_monetario}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({
                      iva_por_exceso_limite_monetario_general: e,
                    });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                  // onFocus={() => {
                  //   this.handleFocusSelect(false)

                  // }}
                  // onBlur={() => {
                  //   this.handleFocusSelect(true)
                  // }}
                />
                {this.validator.message(
                  "IVA por exceso monetario",
                  this.state.limite_monetario_general === 1
                    ? this.state.iva_por_exceso_limite_monetario_general
                    : 1,

                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "IVA por exceso monetario",
                      this.state.limite_monetario_general === 1
                        ? this.state.iva_por_exceso_limite_monetario_general
                        : 1,
                      "required"
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </LayoutPanelFormulario>
      </React.Fragment>
    );
  }
}
