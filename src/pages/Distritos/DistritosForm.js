import React, { Component } from "react";
import LayoutPanelFormulario from "../../components/layouts/panels/LayoutPanelFormulario";
import AsyncSelect from "react-select/async";
import HTTP from "../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";

export default class DistritosForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: this.props.match.params.id
      ? "Actualización de distritos"
      : "Registro de distritos",
    zonas: [],
    zona: "",
    nombre: "",
    loading: false,

    redirect: false,
    disabled_select_zona: true,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    this.setState({ zonas: this.getZonas() });

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

  getById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "distritos").then((result) => {
        if (result !== false) {
          this.setState({
            nombre: result.nombre,
            zona: result.zona,
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
          zona:
            this.state.zona !== "" && this.state.zona !== null
              ? this.state.zona.codigo
              : 0,
        };
        HTTP.update(data, "distrito", "distritos", "distritos").then(
          (result) => {
            this.setState({ loading: false });
            if (result !== false) {
              this.setState({ redirect: true });
            }
          }
        );
      } else {
        const data = {
          nombre: this.state.nombre,
          zona:
            this.state.zona !== "" && this.state.zona !== null
              ? this.state.zona.codigo
              : 0,
        };
        HTTP.create(data, "distrito", "distritos", "distritos").then(
          (result) => {
            this.setState({ loading: false });
            if (result !== false) {
              this.setState({ redirect: true });
            }
          }
        );
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/organizacion/distritos" />;
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
              <div className="col-lg-6 form-group">
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
              <div className="col-lg-6 form-group">
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
                    // this.handleFocusSelect(true)
                    this.setState({ zona: e });
                  }}
                  noOptionsMessage={() => {
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
            </div>
          </div>
        </LayoutPanelFormulario>
      </React.Fragment>
    );
  }
}
