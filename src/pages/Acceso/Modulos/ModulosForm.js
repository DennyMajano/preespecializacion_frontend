import React, { Component } from "react";
import LayoutPanelFormulario from "../../../components/layouts/panels/LayoutPanelFormulario";
import AsyncSelect from "react-select/async";
import HTTP from "../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../helpers/ValidatorTranslate_es";

export default class ModulosForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: this.props.match.params.id
      ? "Actualización de módulos"
      : "Registro de módulos",
    modulos_principales: [],
    modulo_principal: "",
    nombre: "",
    loading: false,
    es_principal: 0,
    redirect: false,
    disabled_select: true,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  getModulosPrincipalesParam = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "modulos/select").then((data) => {
          if (data !== false) {
            data.forEach((element) => {
              tempArray.push({
                label: `${element.name}`,
                value: element.modulo_id,
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

  componentDidMount() {
    this.setState({ modulos_principales: this.getModulosPrincipales() });

    document.getElementById("nombre").focus();

    this.getModuloById();
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  hide_alert_validator() {
    this.validator.hideMessages();
    this.forceUpdate();
  }
  getModulosPrincipales() {
    let data = [];

    HTTP.findAll("modulos/select").then((result) => {
      result.forEach((element) => {
        data.push({ label: element.name, value: element.modulo_id });
      });

      this.setState({ disabled_select: false });
    });

    return data;
  }

  getModuloById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "modulos").then((result) => {
        if (result !== false) {
          this.setState({
            nombre: result.name,
            modulo_principal:
              result.padre_name !== null
                ? { label: result.padre_name, value: result.padre_id }
                : "",
            es_principal: parseInt(result.is_principal),
            disabled_select: parseInt(result.is_principal) === 1 ? true : false,
          });
          if (parseInt(result.is_principal) === 1) {
            document.getElementById("es_principal").checked = true;
          }
          if (result.padre_name !== null) {
            document.getElementById("es_principal").disabled = true;
          }
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
          name: this.state.nombre,
          principal:
            this.state.modulo_principal !== "" &&
            this.state.modulo_principal !== null
              ? this.state.modulo_principal.value
              : 0,
          modulo_principal: this.state.es_principal,
        };
        HTTP.update(data, "módulo", "módulos", "modulos").then((result) => {
          this.setState({ loading: false });
          if (result !== false) {
            this.setState({ redirect: true });
          }
        });
      } else {
        const data = {
          name: this.state.nombre,
          principal:
            this.state.modulo_principal !== "" &&
            this.state.modulo_principal !== null
              ? this.state.modulo_principal.value
              : 0,
          modulo_principal: this.state.es_principal,
        };
        HTTP.create(data, "módulo", "módulos", "modulos").then((result) => {
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
      return <Redirect to="/administracion/modulos" />;
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
              <div className="col-lg-4 form-group">
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
              <div className="col-lg-4 form-group">
                <label htmlFor="">Módulo principal:</label>

                <AsyncSelect
                  id="modulo_principal"
                  name="modulo_principal"
                  placeholder="Seleccione una opción"
                  value={this.state.modulo_principal}
                  isClearable={true}
                  loadOptions={this.getModulosPrincipalesParam}
                  defaultOptions={this.state.modulos_principales}
                  isDisabled={this.state.disabled_select}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({ modulo_principal: e });
                    if (e !== null) {
                      document.getElementById("es_principal").checked = false;
                      document.getElementById("es_principal").disabled = true;
                      this.setState({
                        es_principal: 0,
                      });
                    } else {
                      document.getElementById("es_principal").disabled = false;
                    }
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
              </div>

              <div className="col-lg-4 form-group text-center">
                <input
                  type="checkbox"
                  className="form-check-input filled-in chk-col-light-blue"
                  id="es_principal"
                  onChange={() => {
                    if (document.getElementById("es_principal").checked) {
                      this.setState({
                        es_principal: 1,
                        disabled_select: true,
                        modulo_principal: "",
                      });
                    } else {
                      this.setState({
                        es_principal: 0,
                        disabled_select: false,
                      });
                    }
                  }}
                  value={this.state.es_principal}
                />
                <label className="form-check-label mt-4" htmlFor="es_principal">
                  Es módulo principal
                </label>
              </div>
            </div>
          </div>
        </LayoutPanelFormulario>
      </React.Fragment>
    );
  }
}
