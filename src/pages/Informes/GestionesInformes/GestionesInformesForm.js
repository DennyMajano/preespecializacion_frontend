import React, { Component } from "react";
import LayoutPanelFormulario from "../../../components/layouts/panels/LayoutPanelFormulario";
import HTTP from "../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../helpers/ValidatorTranslate_es";
import Request from "../../../services/Request";
import Alerts from "../../../services/Alerts";

export default class GestionesInformesForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: this.props.match.params.id
      ? "Actualización gestiones de informe"
      : "Registro gestiones de informe",

    descripcion: "",
    tipo: "",
    tipos: [],
    fecha_recibir_inicio: "",
    fecha_recibir_final: "",
    loading: false,
    actualizando: false,
    redirect: false,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    document.getElementById("nombre").focus();
    this.getbyId();
  }
  getbyId() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "zonas").then((result) => {
        if (result !== false) {
          this.setState({
            nombre: result.nombre,
          });
        } else {
          this.setState({ redirect: true });
        }
      });
    }
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  hide_alert_validator() {
    this.validator.hideMessages();
    this.forceUpdate();
  }

  updateZona() {
    if (this.validator.allValid()) {
      this.setState({ actualizando: true });
      const data = {
        code: this.props.match.params.id,
        nombre: this.state.nombre,
      };
      HTTP.update(data, "zona", "zonas", "zonas").then((result) => {
        this.setState({ actualizando: false });

        if (result !== false) {
          this.setState({ redirect: true });
        }
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  asignacionDepartamentos() {
    if (this.validator.allValid()) {
      this.setState({
        loading: true,
      });
      if (this.props.match.params.id) {
        const data = {
          code: this.props.match.params.id,
          nombre: this.state.nombre,
        };
        HTTP.update(data, "zona", "zonas", "zonas").then((result) => {
          this.setState({ actualizando: false });

          if (result !== false) {
            this.props.history.push(
              `/informes_mensuales/gestiones_entrega/asignacion/${this.props.match.params.id}`
            );
          }
        });
      } else {
        const data = {
          nombre: this.state.nombre,
        };
        Request.POST("zonas", data).then((result) => {
          this.setState({
            loading: false,
          });
          if (result !== false) {
            if (result.status === 201) {
              this.props.history.push(
                `/informes_mensuales/gestiones_entrega/asignacion/${result.data.zona}`
              );
            } else {
              Alerts.alertEmpty(
                "¡No se pudo crear!",
                "Administración de zonas",
                "error"
              );
            }
          }
        });
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/informes_mensuales/gestiones_entrega" />;
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
                  disabled={
                    this.state.actualizando === true ||
                    this.state.loading === true
                      ? true
                      : false
                  }
                >
                  <i className="fa fa-close mr-2"></i>CANCELAR
                </button>
                {this.props.match.params.id && (
                  <button
                    type="button"
                    className="btn btn-info mr-2"
                    disabled={
                      this.state.actualizando === true ||
                      this.state.loading === true
                        ? true
                        : false
                    }
                    onClick={this.updateZona.bind(this)}
                  >
                    <i className="fa fa-save mr-2"></i>
                    {this.state.actualizando === false
                      ? "GUARDAR Y SALIR"
                      : "GUARDANDO..."}
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-info mr-2"
                  disabled={
                    this.state.actualizando === true ||
                    this.state.loading === true
                      ? true
                      : false
                  }
                  onClick={this.asignacionDepartamentos.bind(this)}
                >
                  <i className="fa fa-plus mr-2"></i>
                  {this.state.loading === false
                    ? "GUARDAR Y ASIGNAR MÓDULOS"
                    : "CARGANDO..."}
                </button>
              </div>
            </div>
          }
        >
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-lg-6 form-group">
                <label htmlFor="">Nombre: (*)</label>

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
            </div>
          </div>
        </LayoutPanelFormulario>
      </React.Fragment>
    );
  }
}
