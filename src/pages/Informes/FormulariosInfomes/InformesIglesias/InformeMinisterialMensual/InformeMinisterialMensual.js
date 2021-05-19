import React, { Component } from "react";
import HTTP from "../../../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../../../helpers/ValidatorTranslate_es";
import Request from "../../../../../services/Request";
import Alerts from "../../../../../services/Alerts";
import { Tabs, Tab } from "react-bootstrap";
import TablaFilter from "../../../../../components/tablas/TablaFilter";
import LayoutPanelFormulario from "../../../../../components/layouts/panels/LayoutPanelFormulario";
import LayoutPanel from "../../../../../components/layouts/panels/LayoutPanel";
import LayoutPanelEmpty from "../../../../../components/layouts/panels/LayoutPanelEmpty";
export default class InformeMinisterialMensual extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: "Informe Ministerial Mensual",
    nombre: "",
    loading: false,
    tab_active: "",
    gestiones: null,
    actualizando: false,
    iglesia: null,
    redirect: false,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    // document.getElementById("nombre").focus();
    this.getIglesia();
    // this.getGestiones();
  }

  getGestiones() {
    if (this.props.match.params.id) {
      HTTP.findById(
        this.props.match.params.id,
        "gestiones/disponibles/iglesia"
      ).then((result) => {
        if (result !== false) {
          this.setState({
            gestiones: result,
            tab_active: result.length > 0 ? result[0].codigo : "",
          });
        } else {
          this.setState({ redirect: true });
        }
      });
    }
  }
  getIglesia() {
    if (this.props.match.params.iglesia) {
      HTTP.findById(this.props.match.params.iglesia, "iglesias/detalle").then(
        (result) => {
          if (result !== false) {
            this.setState({
              iglesia: result,
            });
          } else {
            this.setState({ redirect: true });
          }
        }
      );
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
              `/organizacion/zonas/asignacion/${this.props.match.params.id}`
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
                `/organizacion/zonas/asignacion/${result.data.zona}`
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
      return <Redirect to="/presentacion_informes" />;
    }
    return (
      <React.Fragment>
        {/* ============================================================== */}
        {/* Bread crumb and right sidebar toggle */}
        {/* ============================================================== */}
        <div className="row page-titles">
          <div className="col-md-5 align-self-center">
            <h3 className="text-themecolor">{this.state.title}</h3>
          </div>
        </div>
        {/* ============================================================== */}
        {/* End Bread crumb and right sidebar toggle */}
        {/* ============================================================== */}
        {/* ============================================================== */}
        {/* Container fluid  */}
        {/* ============================================================== */}
        <div className="container-fluid">
          {/* ============================================================== */}
          {/* Start Page Content */}
          {/* ============================================================== */}
          {/* Row */}
          <div className="row">
            {/* Column */}
            <div className="col-lg-3 col-xlg-3 col-md-5">
              <div className="card">
                <div className="card-body">
                  <center className="m-t-30">
                    {" "}
                    {/* <img
                      src="../assets/images/users/5.jpg"
                      className="img-circle"
                      width={150}
                    /> */}
                    <h4 className="card-title m-t-10">
                      {this.state.iglesia !== null
                        ? this.state.iglesia.nombre
                        : null}
                    </h4>
                    <h6 className="card-subtitle">
                      {this.state.iglesia !== null
                        ? this.state.iglesia.codigo
                        : null}
                    </h6>
                    {/* <div className="row text-center justify-content-md-center">
                      <div className="col-4">
                        <a href="javascript:void(0)" className="link">
                          <i className="icon-people" />{" "}
                          <font className="font-medium">254</font>
                        </a>
                      </div>
                      <div className="col-4">
                        <a href="javascript:void(0)" className="link">
                          <i className="icon-picture" />{" "}
                          <font className="font-medium">54</font>
                        </a>
                      </div>
                    </div> */}
                  </center>
                </div>
                <div>
                  <hr />{" "}
                </div>
                <div className="card-body">
                  {" "}
                  <small className="text-muted">Zona:</small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.zona
                      : null}
                  </h6>{" "}
                  <small className="text-muted p-t-15 db">Distrito:</small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.distrito
                      : null}
                  </h6>{" "}
                  <small className="text-muted p-t-15 db">
                    Departamento - Municipio:
                  </small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.departamento
                      : null}{" "}
                    -{" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.municipio
                      : null}
                  </h6>{" "}
                  <small className="text-muted p-t-15 db">Dirección:</small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.direccion
                      : null}
                  </h6>
                  <div className="map-box">
                    {this.state.iglesia !== null ? (
                      this.state.iglesia.ruta_mapa !== "" &&
                      this.state.iglesia.ruta_mapa !== null ? (
                        <iframe
                          title="mapa"
                          src={this.state.iglesia.ruta_mapa}
                          width="100%"
                          height={150}
                          frameBorder={0}
                          style={{ border: 0 }}
                          allowFullScreen
                        />
                      ) : null
                    ) : null}
                  </div>{" "}
                  <small className="text-muted p-t-15 db">Teléfono:</small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.telefono
                      : null}
                  </h6>
                </div>
              </div>
            </div>
            {/* Column */}
            {/* Column */}
            <div className="col-lg-9 col-xlg-9 col-md-7">
              <LayoutPanelEmpty
                titulo_panel={"Datos Informe Ministerial"}
                buttons={
                  <React.Fragment>
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
                      {this.state.loading === false
                        ? "GUARDAR"
                        : "GUARDANDO..."}
                    </button>
                  </React.Fragment>
                }
              ></LayoutPanelEmpty>
            </div>
            {/* Column */}
          </div>
          {/* Row */}
        </div>
        {/* ============================================================== */}
        {/* End Container fluid  */}
        {/* ============================================================== */}
      </React.Fragment>
    );
  }
}
