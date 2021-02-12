import React, { Component } from "react";
import LayoutPanelFormulario from "../../../components/layouts/panels/LayoutPanelFormulario";
import HTTP from "../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../helpers/ValidatorTranslate_es";
import Request from "../../../services/Request";
import Alerts from "../../../services/Alerts";

export default class RolesForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: this.props.match.params.id
      ? "Actualización de roles"
      : "Registro de roles",

    nombre: "",
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
    this.getRolById();
  }
  getRolById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "roles").then((result) => {
        if (result !== false) {
          this.setState({
            nombre: result.name,
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

  updateRole() {
    if (this.validator.allValid()) {
      this.setState({ actualizando: true });
      const data = {
        code: this.props.match.params.id,
        name: this.state.nombre,
      };
      HTTP.update(data, "rol", "roles", "roles").then((result) => {
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

  asignacionRoles() {
    if (this.validator.allValid()) {
      this.setState({
        loading: true,
      });
      if (this.props.match.params.id) {
        const data = {
          code: this.props.match.params.id,
          name: this.state.nombre,
        };
        HTTP.update(data, "rol", "roles", "roles").then((result) => {
          this.setState({ actualizando: false });

          if (result !== false) {
            this.props.history.push(
              `/administracion/roles/asignacion/${this.props.match.params.id}`
            );
          }
        });
      } else {
        const data = {
          name: this.state.nombre,
        };
        Request.POST("roles", data).then((result) => {
          this.setState({
            loading: false,
          });
          if (result !== false) {
            if (result.status === 201) {
              this.props.history.push(
                `/administracion/roles/asignacion/${result.data.id}`
              );
            } else {
              Alerts.alertEmpty(
                "¡No se pudo crear!",
                "Administración de roles",
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
      return <Redirect to="/administracion/roles" />;
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
                    onClick={this.updateRole.bind(this)}
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
                  onClick={this.asignacionRoles.bind(this)}
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
            </div>
          </div>
        </LayoutPanelFormulario>
      </React.Fragment>
    );
  }
}
