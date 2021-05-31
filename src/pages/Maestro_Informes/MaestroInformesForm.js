import React, { Component } from "react";
import LayoutPanelFormulario from "../../components/layouts/panels/LayoutPanelFormulario";
import Select from "react-select";
import HTTP from "../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";

export default class MaestroInformesForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: this.props.match.params.id
      ? "Actualización de informes"
      : "Registro de informe",
    tipos_informe: [],
    tipo_informe: "",
    nombre: "",
    ruta: "",
    loading: false,

    redirect: false,
    disabled_select_tipo_informe: true,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    this.setState({ tipos_informe: this.getTiposInforme() });

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

  getTiposInforme() {
    let data = [];

    HTTP.findAll("generales/tipo_informe").then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });

      this.setState({ disabled_select_tipo_informe: false });
    });

    return data;
  }

  getById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "maestro_informe").then(
        (result) => {
          if (result !== false) {
            this.setState({
              nombre: result.nombre,
              tipo_informe: result.tipo_informe,
              ruta: result.ruta,
            });
          } else {
            this.setState({ redirect: true });
          }
        }
      );
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
          tipo_informe:
            this.state.tipo_informe !== "" && this.state.tipo_informe !== null
              ? this.state.tipo_informe.value
              : 0,
          ruta: this.state.ruta,
        };
        HTTP.update(
          data,
          "informe",
          "maestro de informes",
          "maestro_informe"
        ).then((result) => {
          this.setState({ loading: false });
          if (result !== false) {
            this.setState({ redirect: true });
          }
        });
      } else {
        const data = {
          nombre: this.state.nombre,
          tipo_informe:
            this.state.tipo_informe !== "" && this.state.tipo_informe !== null
              ? this.state.tipo_informe.value
              : 0,
          ruta: this.state.ruta,
        };
        HTTP.create(
          data,
          "informe",
          "maestro de informes",
          "maestro_informe"
        ).then((result) => {
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
      return <Redirect to="/administracion/maestro_informes" />;
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
                <label htmlFor="">Ruta: (*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Ruta: /informe/ministerial"
                  id="ruta"
                  value={this.state.ruta}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "ruta",
                  this.state.ruta,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "ruta",
                      this.state.ruta,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-4 form-group">
                <label htmlFor="">Tipo Informe: (*)</label>

                <Select
                  id="tipo_informe"
                  name="tipo_informe"
                  placeholder="Seleccione una opción"
                  value={this.state.tipo_informe}
                  isClearable={true}
                  options={this.state.tipos_informe}
                  isDisabled={this.state.disabled_select_tipo_informe}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({ tipo_informe: e });
                  }}
                />
                {this.validator.message(
                  "Tipo Informe",
                  this.state.tipo_informe,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "Tipo Informe",
                      this.state.tipo_informe,
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
