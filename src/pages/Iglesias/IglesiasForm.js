import React, { Component } from "react";
import LayoutPanelFormulario from "../../components/layouts/panels/LayoutPanelFormulario";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import HTTP from "../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";

export default class IglesiasForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: this.props.match.params.id
      ? "Actualización de Iglesias"
      : "Registro de Iglesias",

    //para selects
    tipos_iglesias: [],
    tipo_iglesia: "",
    disabled_select_tipo_iglesia: true,

    departamentos: [],
    departamento: "",
    disabled_select_departamento: true,

    municipios: [],
    municipio: "",
    disabled_select_municipio: true,

    cantones: [],
    canton: "",
    disabled_select_canton: true,

    distritos: [],
    distrito: "",
    disabled_select_distrito: true,

    zonas: [],
    zona: "",
    disabled_select_zona: true,

    nombre: "",
    telefono: "",
    direccion: "",
    src_google: "",
    fecha_ordenamiento: "",

    loading: false,

    redirect: false,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    this.setState({
      zonas: this.getZonas(),
      departamentos: this.getDepartamentos(),
      tipos_iglesias: this.getTiposIglesias(),
    });

    document.getElementById("nombre").focus();

    this.getById();
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  hide_alert_validator() {
    this.validator.hideMessages();
    this.forceUpdate();
  }

  //PARA OBTENER LAS ZONAS

  getZonasParam = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "zonas/select").then((data) => {
          if (data !== false) {
            data.forEach((element) => {
              tempArray.push({
                label: element.nombre,
                value: element.id,
                codigo: element.codigo,
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

  getZonas() {
    let data = [];

    HTTP.findAll("zonas/select").then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
          codigo: element.codigo,
        });
      });

      this.setState({ disabled_select_zona: false });
    });

    return data;
  }

  //PARA OBTENER LOS DISTRITOS

  getDistritosParam = (inputValue, callback) => {
    const tempArray = [];

    if (this.state.zona !== "" && this.state.zona !== null) {
      if (inputValue !== "" && inputValue !== null) {
        clearTimeout(this.timer_cuentas);
        this.timer_cuentas = setTimeout(() => {
          HTTP.findById(
            inputValue,
            `distritos/select/${this.state.zona.codigo}`
          ).then((data) => {
            if (data !== false) {
              data.forEach((element) => {
                tempArray.push({
                  label: element.nombre,
                  value: element.id,
                  codigo: element.codigo,
                });
              });
              callback(tempArray);
            } else {
              callback([]);
            }
          });
        }, 500);
      }
    } else {
      callback([]);
    }
  };

  getDistritos(codigo_zona) {
    let data = [];

    HTTP.findAll(`distritos/select/${codigo_zona}`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
          codigo: element.codigo,
        });
      });

      this.setState({ disabled_select_distrito: false });
    });

    return data;
  }

  ///PARA OBTENER DEPARTAMENTOS
  getDepartamentos() {
    let data = [];

    HTTP.findAll(`generales/departamentos`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });

      this.setState({ disabled_select_departamento: false });
    });

    return data;
  }

  ///PARA OBTENER Municipio

  getMunicipiosParam = (inputValue, callback) => {
    const tempArray = [];

    if (this.state.departamento !== "" && this.state.departamento !== null) {
      if (inputValue !== "" && inputValue !== null) {
        clearTimeout(this.timer_cuentas);
        this.timer_cuentas = setTimeout(() => {
          HTTP.findById(
            inputValue,
            `generales/municipios/${this.state.departamento.value}`
          ).then((data) => {
            if (data !== false) {
              data.forEach((element) => {
                tempArray.push({
                  label: element.nombre,
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
    } else {
      callback([]);
    }
  };
  getMunicipios(departamento) {
    let data = [];

    HTTP.findAll(`generales/municipios/${departamento}`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });

      this.setState({ disabled_select_municipio: false });
    });

    return data;
  }

  ///PARA OBTENER Cantones

  getCantonesParam = (inputValue, callback) => {
    const tempArray = [];

    if (this.state.canton !== "" && this.state.canton !== null) {
      if (inputValue !== "" && inputValue !== null) {
        clearTimeout(this.timer_cuentas);
        this.timer_cuentas = setTimeout(() => {
          HTTP.findById(
            inputValue,
            `generales/cantones/${this.state.canton.value}`
          ).then((data) => {
            if (data !== false) {
              data.forEach((element) => {
                tempArray.push({
                  label: element.nombre,
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
    } else {
      callback([]);
    }
  };
  getCantones(municipio) {
    let data = [];

    HTTP.findAll(`generales/cantones/${municipio}`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });

      this.setState({ disabled_select_canton: false });
    });

    return data;
  }

  //para obtener los tipos de iglesia
  getTiposIglesias() {
    let data = [];

    HTTP.findAll(`generales/tipo_iglesia`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });

      this.setState({ disabled_select_tipo_iglesia: false });
    });

    return data;
  }

  getById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "iglesias").then((result) => {
        if (result !== false) {
          this.setState(result);

          this.setState({
            disabled_select_departamento: false,
            disabled_select_municipio: false,
            disabled_select_canton: false,
            disabled_select_zona: false,
            disabled_select_distrito: false,
            municipios: this.getMunicipios(
              result.departamento !== "" && result.departamento !== null
                ? result.departamento.value
                : null
            ),
            cantones: this.getCantones(
              result.municipio !== "" && result.municipio !== null
                ? result.municipio.value
                : null
            ),
            distritos: this.getDistritos(
              result.zona !== "" && result.zona !== null
                ? result.zona.codigo
                : null
            ),
          });
        } else {
          this.setState({ redirect: true });
        }
      });
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      this.setState({ loading: true });

      if (this.props.match.params.id) {
        const data = {
          code: this.props.match.params.id,
          nombre: this.state.nombre,
          telefono: this.state.telefono,
          departamento:
            this.state.departamento !== "" && this.state.departamento !== null
              ? this.state.departamento.value
              : null,
          municipio:
            this.state.municipio !== "" && this.state.municipio !== null
              ? this.state.municipio.value
              : null,
          canton:
            this.state.canton !== "" && this.state.canton !== null
              ? this.state.canton.value
              : null,
          direccion: this.state.direccion,
          src_google: this.state.src_google,
          distrito:
            this.state.distrito !== "" && this.state.distrito !== null
              ? this.state.distrito.codigo
              : 0,
          fecha_ordenamiento: this.state.fecha_ordenamiento,
          tipo_iglesia:
            this.state.tipo_iglesia !== "" && this.state.tipo_iglesia !== null
              ? this.state.tipo_iglesia.value
              : 0,
          zona:
            this.state.zona !== "" && this.state.zona !== null
              ? this.state.zona.codigo
              : 0,
        };
        HTTP.update(data, "iglesia", "Iglesias", "iglesias").then((result) => {
          this.setState({ loading: false });
          if (result !== false) {
            this.setState({ redirect: true });
          }
        });
      } else {
        const data = {
          nombre: this.state.nombre,
          telefono: this.state.telefono,
          departamento:
            this.state.departamento !== "" && this.state.departamento !== null
              ? this.state.departamento.value
              : null,
          municipio:
            this.state.municipio !== "" && this.state.municipio !== null
              ? this.state.municipio.value
              : null,
          canton:
            this.state.canton !== "" && this.state.canton !== null
              ? this.state.canton.value
              : null,
          direccion: this.state.direccion,
          src_google: this.state.src_google,
          distrito:
            this.state.distrito !== "" && this.state.distrito !== null
              ? this.state.distrito.codigo
              : 0,
          fecha_ordenamiento: this.state.fecha_ordenamiento,
          tipo_iglesia:
            this.state.tipo_iglesia !== "" && this.state.tipo_iglesia !== null
              ? this.state.tipo_iglesia.value
              : 0,
          zona:
            this.state.zona !== "" && this.state.zona !== null
              ? this.state.zona.codigo
              : 0,
        };
        HTTP.create(data, "Iglesia", "Iglesias", "iglesias").then((result) => {
          this.setState({ loading: false });
          if (result !== false) {
            this.setState({ redirect: true });
          }
        });
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/organizacion/iglesias" />;
    }
    return (
      <React.Fragment>
        <LayoutPanelFormulario
          titulo={this.state.title}
          submit={this.onSubmit}
          buttons={
            <div className="card-footer text-center">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-outline-inverse mr-2 "
                  onClick={() => {
                    this.setState({ redirect: true });
                  }}
                  disabled={this.state.loading}
                >
                  <i className="fa fa-close mr-2"></i>CANCELAR
                </button>

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
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-lg-3 form-group">
                <label htmlFor="">Nombre:(*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  id="nombre"
                  value={this.state.nombre}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "nombre",
                  this.state.nombre,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "nombre",
                      this.state.nombre,
                      "required"
                    )}
                  </span>
                )}
              </div>

              <div className="col-lg-3 form-group">
                <label htmlFor="">Teléfono:</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Teléfono"
                  id="telefono"
                  value={this.state.telefono}
                  onChange={this.handleInputChange}
                />
                {/* {this.validator.message(
                  "teléfono",
                  this.state.telefono,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "teléfono",
                      this.state.telefono,
                      "required"
                    )}
                  </span>
                )} */}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Departamento: (*)</label>

                <Select
                  id="departamento"
                  name="departamento"
                  placeholder="Seleccione una opción"
                  value={this.state.departamento}
                  isClearable={true}
                  options={this.state.departamentos}
                  isDisabled={this.state.disabled_select_zona}
                  onChange={(e) => {
                    this.setState({
                      departamento: e,
                      municipio: "",
                      municipios: [],
                      disabled_select_municipio: true,
                      canton: "",
                      cantones: [],
                      disabled_select_canton: true,
                    });
                    this.refs.select_municipio.blur();
                    this.refs.select_canton.blur();
                    if (e !== null) {
                      this.setState({
                        municipios: this.getMunicipios(e.value),
                      });
                    } else {
                      this.setState({
                        municipio: "",
                        municipios: [],
                        disabled_select_municipio: true,
                        canton: "",
                        cantones: [],
                        disabled_select_canton: true,
                      });
                      this.refs.select_municipio.blur();
                      this.refs.select_canton.blur();
                    }
                  }}
                />
                {this.validator.message(
                  "departamento",
                  this.state.departamento,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "departamento",
                      this.state.departamento,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Municipio: (*)</label>

                <AsyncSelect
                  id="municipio"
                  name="municipio"
                  placeholder="Seleccione una opción"
                  value={this.state.municipio}
                  isClearable={true}
                  loadOptions={this.getMunicipiosParam}
                  defaultOptions={this.state.municipios}
                  isDisabled={this.state.disabled_select_municipio}
                  ref="select_municipio"
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({
                      municipio: e,
                      canton: "",
                      cantones: [],
                      disabled_select_canton: true,
                    });
                    this.refs.select_canton.blur();

                    if (e !== null) {
                      this.setState({ cantones: this.getCantones(e.value) });
                    } else {
                      this.setState({
                        canton: "",
                        cantones: [],
                        disabled_select_canton: true,
                      });
                      this.refs.select_canton.blur();
                    }
                  }}
                  noOptionsMessage={(e) => {
                    return "No existen datos";
                  }}
                />
                {this.validator.message(
                  "municipio",
                  this.state.municipio,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "municipio",
                      this.state.municipio,
                      "required"
                    )}
                  </span>
                )}
              </div>

              <div className="col-lg-3 form-group">
                <label htmlFor="">Cantón: (*)</label>

                <AsyncSelect
                  id="canton"
                  name="canton"
                  placeholder="Seleccione una opción"
                  value={this.state.canton}
                  isClearable={true}
                  loadOptions={this.getCantonesParam}
                  defaultOptions={this.state.cantones}
                  isDisabled={this.state.disabled_select_canton}
                  ref="select_canton"
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({ canton: e });
                  }}
                  noOptionsMessage={(e) => {
                    return "No existen datos";
                  }}
                />
              </div>

              <div className="col-lg-3 form-group">
                <label htmlFor="">Zona: (*)</label>

                <AsyncSelect
                  id="zona"
                  name="zona"
                  placeholder="Seleccione una opción"
                  value={this.state.zona}
                  isClearable={true}
                  loadOptions={this.getZonasParam}
                  defaultOptions={this.state.zonas}
                  isDisabled={this.state.disabled_select_zona}
                  onChange={(e) => {
                    this.setState({
                      zona: e,
                      distrito: "",
                      distritos: [],
                      disabled_select_distrito: true,
                    });
                    this.refs.select_distrito.blur();
                    if (e !== null) {
                      this.setState({
                        distritos: this.getDistritos(e.codigo),
                      });
                    } else {
                      this.setState({
                        distrito: "",
                        distritos: [],
                        disabled_select_distrito: true,
                      });
                      this.refs.select_distrito.blur();
                    }
                  }}
                  noOptionsMessage={(e) => {
                    return "No existen datos";
                  }}
                />
                {this.validator.message(
                  "zona",
                  this.state.zona,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "zona",
                      this.state.zona,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Distrito: (*)</label>

                <AsyncSelect
                  id="distrito"
                  name="distrito"
                  placeholder="Seleccione una opción"
                  value={this.state.distrito}
                  isClearable={true}
                  loadOptions={this.getDistritosParam}
                  defaultOptions={this.state.distritos}
                  isDisabled={this.state.disabled_select_distrito}
                  ref={"select_distrito"}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({ distrito: e });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                />
                {this.validator.message(
                  "distrito",
                  this.state.distrito,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "distrito",
                      this.state.distrito,
                      "required"
                    )}
                  </span>
                )}
              </div>

              <div className="col-lg-3 form-group">
                <label htmlFor="">Tipo Iglesia: (*)</label>

                <Select
                  id="tipo_iglesia"
                  name="tipo_iglesia"
                  placeholder="Seleccione una opción"
                  value={this.state.tipo_iglesia}
                  isClearable={true}
                  options={this.state.tipos_iglesias}
                  isDisabled={this.state.disabled_select_tipo_iglesia}
                  onChange={(e) => {
                    this.setState({ tipo_iglesia: e });
                  }}
                />
                {this.validator.message(
                  "tipo iglesia",
                  this.state.tipo_iglesia,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "tipo iglesia",
                      this.state.tipo_iglesia,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Fecha Ordenamiento:</label>

                <input
                  type="date"
                  className="form-control"
                  id="fecha_ordenamiento"
                  value={this.state.fecha_ordenamiento}
                  onChange={this.handleInputChange}
                />
                {/* {this.validator.message(
                  "fecha ordenamiento",
                  this.state.fecha_ordenamiento,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "fecha ordenamiento",
                      this.state.fecha_ordenamiento,
                      "required"
                    )}
                  </span>
                )} */}
              </div>
              <div className="col-lg-4 form-group">
                <label htmlFor="">Dirección: </label>

                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Escriba dirección"
                  id="direccion"
                  rows="5"
                  value={this.state.direccion}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="col-lg-5 form-group">
                <label htmlFor="">Src Google: </label>

                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Escriba url de Google maps"
                  id="src_google"
                  rows="5"
                  value={this.state.src_google}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
        </LayoutPanelFormulario>
      </React.Fragment>
    );
  }
}
