import React, { Component } from "react";
import LayoutPanelFormulario from "../../../components/layouts/panels/LayoutPanelFormulario";
import HTTP from "../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../helpers/ValidatorTranslate_es";
import Request from "../../../services/Request";
import Alerts from "../../../services/Alerts";
import Select from "react-select";

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
    periodo_actual: null,
    loading: false,
    disabled_select_tipo: true,
    actualizando: false,
    redirect: false,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    document.getElementById("descripcion").focus();
    this.setState({
      tipos: this.getTiposInforme(),
    });
    this.getPeriodoVigente();
    this.getbyId();
  }

  getPeriodoVigente() {
    HTTP.findById(2, "periodos/estado").then((result) => {
      if (result !== false) {
        this.setState({
          periodo_actual: result.length > 0 ? result[0] : null,
        });
      }
    });
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

  asignacionInformes() {
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
          descripcion: this.state.descripcion,
          tipo:
            this.state.tipo !== "" && this.state.tipo !== null
              ? this.state.tipo.value
              : null,
          fechaRecibirFin: this.state.fecha_recibir_final,
          fechaRecibirInicio: this.state.fecha_recibir_inicio,
          periodo:
            this.state.periodo_actual !== null
              ? this.state.periodo_actual.codigo
              : null,
        };
        Request.POST("gestiones", data).then((result) => {
          this.setState({
            loading: false,
          });
          if (result !== false) {
            if (result.status === 201) {
              this.props.history.push(
                `/informes_mensuales/gestiones_entrega/asignacion_informes/${result.data.id}`
              );
            } else {
              Alerts.alertEmpty(
                "¡No se pudo crear!",
                "Administración de gestiones de informe",
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
  getTiposInforme() {
    let data = [];

    HTTP.findAll(`generales/tipo_informe`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });

      this.setState({ disabled_select_tipo: false });
    });

    return data;
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
                  onClick={this.asignacionInformes.bind(this)}
                >
                  <i className="fa fa-plus mr-2"></i>
                  {this.state.loading === false
                    ? "Guardar y Asignar Informes"
                    : "CARGANDO..."}
                </button>
              </div>
            </div>
          }
        >
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-lg-3 form-group">
                <label htmlFor="">Descripción: (*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Descripción"
                  id="descripcion"
                  value={this.state.descripcion}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "descripción",
                  this.state.descripcion,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "descripción",
                      this.state.descripcion,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Tipo Gestión informes: (*)</label>

                <Select
                  id="tipo"
                  name="tipo"
                  placeholder="Seleccione una opción"
                  value={this.state.tipo}
                  isClearable={true}
                  options={this.state.tipos}
                  isDisabled={this.state.disabled_select_tipo}
                  onChange={(e) => {
                    this.setState({
                      tipo: e,
                    });
                  }}
                />
                {this.validator.message(
                  "tipo",
                  this.state.tipo,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "tipo",
                      this.state.tipo,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Fecha inicio recepción: (*)</label>

                <input
                  type="date"
                  className="form-control"
                  id="fecha_recibir_inicio"
                  value={this.state.fecha_recibir_inicio}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "Fecha inicio recepción",
                  this.state.fecha_recibir_inicio,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "Fecha inicio recepción",
                      this.state.fecha_recibir_inicio,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Fecha fin recepción: (*)</label>

                <input
                  type="date"
                  className="form-control"
                  id="fecha_recibir_final"
                  value={this.state.fecha_recibir_final}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "Fecha fin recepción",
                  this.state.fecha_recibir_final,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "Fecha fin recepción",
                      this.state.fecha_recibir_final,
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
