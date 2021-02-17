import React, { Component } from "react";
import LayoutPanelFormulario from "../../../components/layouts/panels/LayoutPanelFormulario";
import AsyncSelect from "react-select/async";
import HTTP from "../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../helpers/ValidatorTranslate_es";
import Request from "../../../services/Request";
import Alerts from "../../../services/Alerts";
import ExtFile from "../../../services/ExtFile";

export default class UsuariosForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: this.props.match.params.id
      ? "Actualización de usuarios"
      : "Registro de usuarios",

    persona: "",
    iglesia: "",

    alias: "",
    rol: "",
    roles: [],
    disabled_select_rol: true,
    disabled_select_persona: true,
    disabled_select_iglesi: true,
    correo: "",
    loading: false,

    redirect: false,

    personas: [],
    iglesias: [],
    //correo
    correo_old: null,
    correo_existe: false,
    //user
    persona_old: null,
    persona_existe: false,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };
  handleFileChange = (e) => {
    const idComponente = e.target.id;
    if (e.target.files[0] !== undefined) {
      let name = e.target.files[0].name;

      if (ExtFile.isImage(name)) {
        this.setState({
          [idComponente]: e.target.files[0],
        });
      } else {
        Alerts.alertEmpty(
          "¡El archivo seleccionado no es válido!",
          "Solo se permiten archivos PNG, JPG, JPEG",
          "warning"
        );
        e.target.value = null;
        this.setState({
          [idComponente]: null,
        });
      }
    } else {
      this.setState({
        [idComponente]: null,
      });
    }
  };
  componentDidMount() {
    this.setState({ roles: this.getRoles() });

    this.getUsuarioById();
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  hide_alert_validator() {
    this.validator.hideMessages();
    this.forceUpdate();
  }

  getRolesParam = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "roles/select").then((data) => {
          if (data !== false) {
            data.forEach((element) => {
              tempArray.push({
                label: `${element.name}`,
                value: element.rol_id,
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
  getRoles() {
    let data = [];

    HTTP.findAll("roles/select").then((result) => {
      result.forEach((element) => {
        data.push({ label: element.name, value: element.rol_id });
      });

      this.setState({ disabled_select_rol: false });
    });

    return data;
  }

  getUsuarioById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "usuarios").then((result) => {
        if (result !== false) {
          this.setState({
            nombre: result.nombre,
            alias: result.alias,
            correo: result.correo,
            rol: result.rol,
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
          nombre: this.state.nombre,
          alias: this.state.alias,
          rol:
            this.state.rol !== null && this.state.rol !== ""
              ? this.state.rol.value
              : null,
          correo: this.state.correo,
          code: this.props.match.params.id,
        };
        HTTP.update(data, "usuario", "usuarios", "usuarios").then((result) => {
          this.setState({ loading: false });
          if (result !== false) {
            this.setState({ redirect: true });
          }
        });
      } else {
        const data = new FormData();
        data.append("nombre", this.state.nombre);
        data.append("alias", this.state.alias);
        data.append(
          "rol",
          this.state.rol !== null && this.state.rol !== ""
            ? this.state.rol.value
            : null
        );
        data.append("correo", this.state.correo);
        data.append("user", this.state.username);
        if (this.state.imagen !== null) {
          data.append(
            "imagen",
            this.state.imagen,
            this.state.imagen.name ? this.state.imagen.name : ""
          );
        }
        HTTP.create(data, "usuario", "usuarios", "usuarios").then((result) => {
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

  /** Inicio validaciones  */
  timer_correo = null;
  validar_correo(correo) {
    clearTimeout(this.timer_correo);

    if (this.props.match.params.id) {
      if (this.state.correo_old !== null && correo !== this.state.correo_old) {
        this.timer_correo = setTimeout(() => {
          Request.GET("usuarios/validar/correo", correo).then((result) => {
            if (result !== false) {
              if (result.status === 200) {
                if (result.data.valor === 1) {
                  this.setState({ correo_existe: true });
                } else {
                  this.setState({ correo_existe: false });
                }
              } else {
                this.setState({ correo_existe: false });
              }
            } else {
              this.setState({ correo_existe: false });
            }
          });
        }, 800);
      }
    } else {
      this.timer_correo = setTimeout(() => {
        Request.GET("usuarios/validar/correo", correo).then((result) => {
          if (result !== false) {
            if (result.status === 200) {
              if (result.data.valor === 1) {
                this.setState({ correo_existe: true });
              } else {
                this.setState({ correo_existe: false });
              }
            } else {
              this.setState({ correo_existe: false });
            }
          } else {
            this.setState({ correo_existe: false });
          }
        });
      }, 800);
    }
  }

  timer_usuario = null;
  validar_persona(persona) {
    clearTimeout(this.timer_usuario);

    if (this.props.match.params.id) {
      if (
        this.state.persona_old !== null &&
        persona !== this.state.persona_old
      ) {
        this.timer_usuario = setTimeout(() => {
          Request.GET("usuarios/validar/persona", persona).then((result) => {
            if (result !== false) {
              if (result.status === 200) {
                if (result.data.valor === 1) {
                  this.setState({ persona_existe: true });
                } else {
                  this.setState({ persona_existe: false });
                }
              } else {
                this.setState({ persona_existe: false });
              }
            } else {
              this.setState({ persona_existe: false });
            }
          });
        }, 800);
      }
    } else {
      this.timer_usuario = setTimeout(() => {
        Request.GET("usuarios/validar/persona", persona).then((result) => {
          if (result !== false) {
            if (result.status === 200) {
              if (result.data.valor === 1) {
                this.setState({ persona_existe: true });
              } else {
                this.setState({ persona_existe: false });
              }
            } else {
              this.setState({ persona_existe: false });
            }
          } else {
            this.setState({ persona_existe: false });
          }
        });
      }, 800);
    }
  }
  /**Fin validciones de unicos */

  render() {
    if (this.state.redirect) {
      return <Redirect to="/administracion/usuarios" />;
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
                <label htmlFor="">Persona: (*)</label>

                <AsyncSelect
                  id="persona"
                  name="persona"
                  placeholder="Seleccione una opción"
                  value={this.state.persona}
                  isClearable={true}
                  loadOptions={this.getPersonasParam}
                  defaultOptions={this.state.personas}
                  isDisabled={this.state.disabled_select_persona}
                  onChange={(e) => {
                    this.setState({ persona: e });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                />
                {this.validator.message(
                  "persona",
                  this.state.persona,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "persona",
                      this.state.persona,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Iglesia: (*)</label>

                <AsyncSelect
                  id="iglesia"
                  name="iglesia"
                  placeholder="Seleccione una opción"
                  value={this.state.iglesia}
                  isClearable={true}
                  loadOptions={this.getIglesiasParam}
                  defaultOptions={this.state.iglesias}
                  isDisabled={this.state.disabled_select_iglesi}
                  onChange={(e) => {
                    this.setState({ iglesia: e });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                />
                {this.validator.message(
                  "iglesia",
                  this.state.iglesia,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "iglesia",
                      this.state.iglesia,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Correo electrónico:(*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Escriba correo electrónico"
                  id="correo"
                  value={this.state.correo}
                  onChange={this.handleInputChange}
                  onKeyUp={this.validar_correo.bind(this, this.state.correo)}
                />
                {this.validator.message(
                  "correo electrónico",
                  this.state.correo,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "correo electrónico",
                      this.state.correo,
                      "required"
                    )}
                  </span>
                )}

                {this.state.correo_existe === true ? (
                  <span className="label label-light-danger">
                    Correo electrónico ya éxiste
                  </span>
                ) : null}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Rol: (*)</label>

                <AsyncSelect
                  id="rol"
                  name="rol"
                  placeholder="Seleccione una opción"
                  value={this.state.rol}
                  isClearable={true}
                  loadOptions={this.getRolesParam}
                  defaultOptions={this.state.roles}
                  isDisabled={this.state.disabled_select_rol}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({ rol: e });
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
                {this.validator.message("rol", this.state.rol, "required") && (
                  <span className="label label-light-danger">
                    {this.validator.message("rol", this.state.rol, "required")}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Alias:(*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Alias"
                  id="alias"
                  value={this.state.alias}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "alias",
                  this.state.alias,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "alias",
                      this.state.alias,
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
