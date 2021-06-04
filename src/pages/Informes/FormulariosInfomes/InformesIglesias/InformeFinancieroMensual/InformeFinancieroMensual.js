import React, { Component } from "react";
import HTTP from "../../../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../../../helpers/ValidatorTranslate_es";
import Request from "../../../../../services/Request";
import Alerts from "../../../../../services/Alerts";
import LayoutPanelEmpty from "../../../../../components/layouts/panels/LayoutPanelEmpty";
import Redondeo from "../../../../../helpers/Redondeo";
export default class InformeFinancieroMensual extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: "Informe Financiero Mensual",
    nombre: "",
    loading: false,
    tab_active: "",
    gestiones: null,
    actualizando: false,
    iglesia: null,
    redirect: false,

    //estodos para informe
    oficinasInternacionales: parseFloat(0).toFixed(2),
    sociosAmip: parseFloat(0).toFixed(2),
    misionesMundiales: parseFloat(0).toFixed(2),
    tributosAnuales: parseFloat(0).toFixed(2),
    ministroOrdenado: parseFloat(0).toFixed(2),
    pastorLaico: parseFloat(0).toFixed(2),
    fondoLocal: parseFloat(0).toFixed(2),
    retiroPastoral: parseFloat(0).toFixed(2),
    segundaParteOfrendaministerios: parseFloat(0).toFixed(2),
    fondoEmergenciaNacional: parseFloat(0).toFixed(2),
    misionesNacionales: parseFloat(0).toFixed(2),
    diezmosMinistros: parseFloat(0).toFixed(2),
    compraPropiedadNacional: parseFloat(0).toFixed(2),
    construccionTemplosNuevos: parseFloat(0).toFixed(2),
    cotizacionPrestaciones: parseFloat(0).toFixed(2),
    seguroVida: parseFloat(0).toFixed(2),
    fondoSolidarioMinisterial: parseFloat(0).toFixed(2),
    otros: parseFloat(0).toFixed(2),
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    // document.getElementById("nombre").focus();
    this.getIglesia();
    this.getByID();
  }

  getByID() {
    if (this.props.match.params.ide) {
      HTTP.findById(
        this.props.match.params.ide,
        "informe/financiero/mensual/info"
      ).then((result) => {
        if (result !== false) {
          this.setState(result);
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
  handleFocus = (event) => event.target.select();
  handleBlur = (event) => {
    if (this.state[event.target.id] === "") {
      this.setState({ [event.target.id]: parseFloat(0).toFixed(2) });
    } else {
      this.setState({
        [event.target.id]: parseFloat(this.state[event.target.id]).toFixed(2),
      });
    }
  };
  handleChangeNumber = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;

    this.setState({
      [idComponente]: Redondeo.dosDecimalesInput(valorComponente),
    });
  };
  async guardar(estado) {
    if (this.props.match.params.ide) {
      Alerts.loading_reload(true);

      if (estado === 1) {
        const data = {
          codigoInforme: this.props.match.params.ide,
          oficinasInternacionales:
            this.state.oficinasInternacionales !== "" &&
            this.state.oficinasInternacionales !== null
              ? this.state.oficinasInternacionales
              : 0,
          sociosAmip:
            this.state.sociosAmip !== "" && this.state.sociosAmip !== null
              ? this.state.sociosAmip
              : 0,
          misionesMundiales:
            this.state.misionesMundiales !== "" &&
            this.state.misionesMundiales !== null
              ? this.state.misionesMundiales
              : 0,
          tributosAnuales:
            this.state.tributosAnuales !== "" &&
            this.state.tributosAnuales !== null
              ? this.state.tributosAnuales
              : 0,
          ministroOrdenado:
            this.state.ministroOrdenado !== "" &&
            this.state.ministroOrdenado !== null
              ? this.state.ministroOrdenado
              : 0,
          pastorLaico:
            this.state.pastorLaico !== "" && this.state.pastorLaico !== null
              ? this.state.pastorLaico
              : 0,
          fondoLocal:
            this.state.fondoLocal !== "" && this.state.fondoLocal !== null
              ? this.state.fondoLocal
              : 0,
          retiroPastoral:
            this.state.retiroPastoral !== "" &&
            this.state.retiroPastoral !== null
              ? this.state.retiroPastoral
              : 0,
          segundaParteOfrendaministerios:
            this.state.segundaParteOfrendaministerios !== "" &&
            this.state.segundaParteOfrendaministerios !== null
              ? this.state.segundaParteOfrendaministerios
              : 0,
          fondoEmergenciaNacional:
            this.state.fondoEmergenciaNacional !== "" &&
            this.state.fondoEmergenciaNacional !== null
              ? this.state.fondoEmergenciaNacional
              : 0,
          misionesNacionales:
            this.state.misionesNacionales !== "" &&
            this.state.misionesNacionales !== null
              ? this.state.misionesNacionales
              : 0,
          diezmosMinistros:
            this.state.diezmosMinistros !== "" &&
            this.state.diezmosMinistros !== null
              ? this.state.diezmosMinistros
              : 0,
          compraPropiedadNacional:
            this.state.compraPropiedadNacional !== "" &&
            this.state.compraPropiedadNacional !== null
              ? this.state.compraPropiedadNacional
              : 0,
          construccionTemplosNuevos:
            this.state.construccionTemplosNuevos !== "" &&
            this.state.construccionTemplosNuevos !== null
              ? this.state.construccionTemplosNuevos
              : 0,
          cotizacionPrestaciones:
            this.state.cotizacionPrestaciones !== "" &&
            this.state.cotizacionPrestaciones !== null
              ? this.state.cotizacionPrestaciones
              : 0,
          seguroVida:
            this.state.seguroVida !== "" && this.state.seguroVida !== null
              ? this.state.seguroVida
              : 0,
          fondoSolidarioMinisterial:
            this.state.fondoSolidarioMinisterial !== "" &&
            this.state.fondoSolidarioMinisterial !== null
              ? this.state.fondoSolidarioMinisterial
              : 0,
          otros:
            this.state.otros !== "" && this.state.otros !== null
              ? this.state.otros
              : 0,
          estado: 1,
        };
        Request.PUT("informe/financiero/mensual", data).then(
          (result) => {
            Alerts.loading_reload(false);

            if (result !== false) {
              if (result.status === 201) {
                Alerts.alertEmpty(
                  "¡Informe actualizado con éxito!",
                  "Administración de informes",
                  "success"
                );
                this.setState({
                  redirect: true,
                });
              } else {
                Alerts.alertEmpty(
                  "¡No se pudo actualizar el informe debido a un error!",
                  "Administración de informes",
                  "error"
                );
              }
            } else {
              Alerts.alertEmpty(
                "¡No se pudo actualizar el informe debido a un error!",
                "Administración de informes",
                "error"
              );
            }
          }
        );
      } else if (estado === 2) {
        const data = {
          codigoInforme: this.props.match.params.ide,
          oficinasInternacionales:
            this.state.oficinasInternacionales !== "" &&
            this.state.oficinasInternacionales !== null
              ? this.state.oficinasInternacionales
              : 0,
          sociosAmip:
            this.state.sociosAmip !== "" && this.state.sociosAmip !== null
              ? this.state.sociosAmip
              : 0,
          misionesMundiales:
            this.state.misionesMundiales !== "" &&
            this.state.misionesMundiales !== null
              ? this.state.misionesMundiales
              : 0,
          tributosAnuales:
            this.state.tributosAnuales !== "" &&
            this.state.tributosAnuales !== null
              ? this.state.tributosAnuales
              : 0,
          ministroOrdenado:
            this.state.ministroOrdenado !== "" &&
            this.state.ministroOrdenado !== null
              ? this.state.ministroOrdenado
              : 0,
          pastorLaico:
            this.state.pastorLaico !== "" && this.state.pastorLaico !== null
              ? this.state.pastorLaico
              : 0,
          fondoLocal:
            this.state.fondoLocal !== "" && this.state.fondoLocal !== null
              ? this.state.fondoLocal
              : 0,
          retiroPastoral:
            this.state.retiroPastoral !== "" &&
            this.state.retiroPastoral !== null
              ? this.state.retiroPastoral
              : 0,
          segundaParteOfrendaministerios:
            this.state.segundaParteOfrendaministerios !== "" &&
            this.state.segundaParteOfrendaministerios !== null
              ? this.state.segundaParteOfrendaministerios
              : 0,
          fondoEmergenciaNacional:
            this.state.fondoEmergenciaNacional !== "" &&
            this.state.fondoEmergenciaNacional !== null
              ? this.state.fondoEmergenciaNacional
              : 0,
          misionesNacionales:
            this.state.misionesNacionales !== "" &&
            this.state.misionesNacionales !== null
              ? this.state.misionesNacionales
              : 0,
          diezmosMinistros:
            this.state.diezmosMinistros !== "" &&
            this.state.diezmosMinistros !== null
              ? this.state.diezmosMinistros
              : 0,
          compraPropiedadNacional:
            this.state.compraPropiedadNacional !== "" &&
            this.state.compraPropiedadNacional !== null
              ? this.state.compraPropiedadNacional
              : 0,
          construccionTemplosNuevos:
            this.state.construccionTemplosNuevos !== "" &&
            this.state.construccionTemplosNuevos !== null
              ? this.state.construccionTemplosNuevos
              : 0,
          cotizacionPrestaciones:
            this.state.cotizacionPrestaciones !== "" &&
            this.state.cotizacionPrestaciones !== null
              ? this.state.cotizacionPrestaciones
              : 0,
          seguroVida:
            this.state.seguroVida !== "" && this.state.seguroVida !== null
              ? this.state.seguroVida
              : 0,
          fondoSolidarioMinisterial:
            this.state.fondoSolidarioMinisterial !== "" &&
            this.state.fondoSolidarioMinisterial !== null
              ? this.state.fondoSolidarioMinisterial
              : 0,
          otros:
            this.state.otros !== "" && this.state.otros !== null
              ? this.state.otros
              : 0,
          estado: 2,
        };

        Request.PUT("informe/financiero/mensual", data).then(
          (result) => {
            Alerts.loading_reload(false);

            if (result !== false) {
              if (result.status === 201) {
                Alerts.alertEmpty(
                  "¡Informe enviado con éxito!",
                  "Administración de informes",
                  "success"
                );
                this.setState({
                  redirect: true,
                });
              } else {
                Alerts.alertEmpty(
                  "¡No se pudo enviar el informe debido a un error!",
                  "Administración de informes",
                  "error"
                );
              }
            } else {
              Alerts.alertEmpty(
                "¡No se pudo enviar el informe debido a un error!",
                "Administración de informes",
                "error"
              );
            }
          }
        );
      }
    } else {
      if (estado === 1) {
        const data = {
          cabecera: {
            codigoIglesia: this.props.match.params.iglesia,
            codigoPastor:
              this.state.iglesia !== null
                ? this.state.iglesia.codigo_pastor !== "" &&
                  this.state.iglesia.codigo_pastor !== null
                  ? this.state.iglesia.codigo_pastor
                  : null
                : null,
            codigoGestion: this.props.match.params.gestion,
            nombreTesorero: "HARDCODED",
            estado: 1,
          },
          detalle: {
            oficinasInternacionales:
              this.state.oficinasInternacionales !== "" &&
              this.state.oficinasInternacionales !== null
                ? this.state.oficinasInternacionales
                : 0,
            sociosAmip:
              this.state.sociosAmip !== "" && this.state.sociosAmip !== null
                ? this.state.sociosAmip
                : 0,
            misionesMundiales:
              this.state.misionesMundiales !== "" &&
              this.state.misionesMundiales !== null
                ? this.state.misionesMundiales
                : 0,
            tributosAnuales:
              this.state.tributosAnuales !== "" &&
              this.state.tributosAnuales !== null
                ? this.state.tributosAnuales
                : 0,
            ministroOrdenado:
              this.state.ministroOrdenado !== "" &&
              this.state.ministroOrdenado !== null
                ? this.state.ministroOrdenado
                : 0,
            pastorLaico:
              this.state.pastorLaico !== "" && this.state.pastorLaico !== null
                ? this.state.pastorLaico
                : 0,
            fondoLocal:
              this.state.fondoLocal !== "" && this.state.fondoLocal !== null
                ? this.state.fondoLocal
                : 0,
            retiroPastoral:
              this.state.retiroPastoral !== "" &&
              this.state.retiroPastoral !== null
                ? this.state.retiroPastoral
                : 0,
            segundaParteOfrendaministerios:
              this.state.segundaParteOfrendaministerios !== "" &&
              this.state.segundaParteOfrendaministerios !== null
                ? this.state.segundaParteOfrendaministerios
                : 0,
            fondoEmergenciaNacional:
              this.state.fondoEmergenciaNacional !== "" &&
              this.state.fondoEmergenciaNacional !== null
                ? this.state.fondoEmergenciaNacional
                : 0,
            misionesNacionales:
              this.state.misionesNacionales !== "" &&
              this.state.misionesNacionales !== null
                ? this.state.misionesNacionales
                : 0,
            diezmosMinistros:
              this.state.diezmosMinistros !== "" &&
              this.state.diezmosMinistros !== null
                ? this.state.diezmosMinistros
                : 0,
            compraPropiedadNacional:
              this.state.compraPropiedadNacional !== "" &&
              this.state.compraPropiedadNacional !== null
                ? this.state.compraPropiedadNacional
                : 0,
            construccionTemplosNuevos:
              this.state.construccionTemplosNuevos !== "" &&
              this.state.construccionTemplosNuevos !== null
                ? this.state.construccionTemplosNuevos
                : 0,
            cotizacionPrestaciones:
              this.state.cotizacionPrestaciones !== "" &&
              this.state.cotizacionPrestaciones !== null
                ? this.state.cotizacionPrestaciones
                : 0,
            seguroVida:
              this.state.seguroVida !== "" && this.state.seguroVida !== null
                ? this.state.seguroVida
                : 0,
            fondoSolidarioMinisterial:
              this.state.fondoSolidarioMinisterial !== "" &&
              this.state.fondoSolidarioMinisterial !== null
                ? this.state.fondoSolidarioMinisterial
                : 0,
            otros:
              this.state.otros !== "" && this.state.otros !== null
                ? this.state.otros
                : 0,
          },
        };
        this.setState({
          loading: true,
        });
        Alerts.loading_reload(true);
        Request.POST("informe/financiero/mensual", data).then((result) => {
          Alerts.loading_reload(false);

          if (result !== false) {
            if (result.status === 201) {
              Alerts.alertEmpty(
                "¡Informe guardado con éxito!",
                "Administración de informes",
                "success"
              );

              this.setState({
                loading: false,
                redirect: true,
              });
            } else {
              Alerts.alertEmpty(
                "¡No se pudo enviar el informe debido a un error!",
                "Administración de informes",
                "error"
              );
            }
          } else {
            Alerts.alertEmpty(
              "¡No se pudo enviar el informe debido a un error!",
              "Administración de informes",
              "error"
            );
          }
        });
      } else if (estado === 2) {
        Alerts.QuestionYesNo(
          "¿Está seguro que desea enviar el informe?",
          "¡Una vez enviado no podrá ser editado!",
          "question"
        ).then((resp) => {
          if (resp) {
            const data = {
              cabecera: {
                codigoIglesia: this.props.match.params.iglesia,
                codigoPastor:
                  this.state.iglesia !== null
                    ? this.state.iglesia.codigo_pastor !== "" &&
                      this.state.iglesia.codigo_pastor !== null
                      ? this.state.iglesia.codigo_pastor
                      : null
                    : null,
                codigoGestion: this.props.match.params.gestion,
                nombreTesorero: "HARDCODED",
                estado: 2,
              },
              detalle: {
                oficinasInternacionales:
                  this.state.oficinasInternacionales !== "" &&
                  this.state.oficinasInternacionales !== null
                    ? this.state.oficinasInternacionales
                    : 0,
                sociosAmip:
                  this.state.sociosAmip !== "" && this.state.sociosAmip !== null
                    ? this.state.sociosAmip
                    : 0,
                misionesMundiales:
                  this.state.misionesMundiales !== "" &&
                  this.state.misionesMundiales !== null
                    ? this.state.misionesMundiales
                    : 0,
                tributosAnuales:
                  this.state.tributosAnuales !== "" &&
                  this.state.tributosAnuales !== null
                    ? this.state.tributosAnuales
                    : 0,
                ministroOrdenado:
                  this.state.ministroOrdenado !== "" &&
                  this.state.ministroOrdenado !== null
                    ? this.state.ministroOrdenado
                    : 0,
                pastorLaico:
                  this.state.pastorLaico !== "" &&
                  this.state.pastorLaico !== null
                    ? this.state.pastorLaico
                    : 0,
                fondoLocal:
                  this.state.fondoLocal !== "" && this.state.fondoLocal !== null
                    ? this.state.fondoLocal
                    : 0,
                retiroPastoral:
                  this.state.retiroPastoral !== "" &&
                  this.state.retiroPastoral !== null
                    ? this.state.retiroPastoral
                    : 0,
                segundaParteOfrendaministerios:
                  this.state.segundaParteOfrendaministerios !== "" &&
                  this.state.segundaParteOfrendaministerios !== null
                    ? this.state.segundaParteOfrendaministerios
                    : 0,
                fondoEmergenciaNacional:
                  this.state.fondoEmergenciaNacional !== "" &&
                  this.state.fondoEmergenciaNacional !== null
                    ? this.state.fondoEmergenciaNacional
                    : 0,
                misionesNacionales:
                  this.state.misionesNacionales !== "" &&
                  this.state.misionesNacionales !== null
                    ? this.state.misionesNacionales
                    : 0,
                diezmosMinistros:
                  this.state.diezmosMinistros !== "" &&
                  this.state.diezmosMinistros !== null
                    ? this.state.diezmosMinistros
                    : 0,
                compraPropiedadNacional:
                  this.state.compraPropiedadNacional !== "" &&
                  this.state.compraPropiedadNacional !== null
                    ? this.state.compraPropiedadNacional
                    : 0,
                construccionTemplosNuevos:
                  this.state.construccionTemplosNuevos !== "" &&
                  this.state.construccionTemplosNuevos !== null
                    ? this.state.construccionTemplosNuevos
                    : 0,
                cotizacionPrestaciones:
                  this.state.cotizacionPrestaciones !== "" &&
                  this.state.cotizacionPrestaciones !== null
                    ? this.state.cotizacionPrestaciones
                    : 0,
                seguroVida:
                  this.state.seguroVida !== "" && this.state.seguroVida !== null
                    ? this.state.seguroVida
                    : 0,
                fondoSolidarioMinisterial:
                  this.state.fondoSolidarioMinisterial !== "" &&
                  this.state.fondoSolidarioMinisterial !== null
                    ? this.state.fondoSolidarioMinisterial
                    : 0,
                otros:
                  this.state.otros !== "" && this.state.otros !== null
                    ? this.state.otros
                    : 0,
              },
            };
            this.setState({
              loading: true,
            });
            Alerts.loading_reload(true);
            Request.POST("informe/financiero/mensual", data).then((result) => {
              Alerts.loading_reload(false);

              if (result !== false) {
                if (result.status === 201) {
                  Alerts.alertEmpty(
                    "¡Informe enviado con éxito!",
                    "Administración de informes",
                    "success"
                  );
                  this.setState({
                    loading: false,
                    redirect: true,
                  });
                } else {
                  Alerts.alertEmpty(
                    "¡No se pudo enviar el informe debido a un error!",
                    "Administración de informes",
                    "error"
                  );
                }
              } else {
                Alerts.alertEmpty(
                  "¡No se pudo enviar el informe debido a un error!",
                  "Administración de informes",
                  "error"
                );
              }
            });
          }
        });
      }
    }
  }
  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={`/presentacion_informes/iglesia/${this.props.match.params.iglesia}`}
        />
      );
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
                  <small className="text-muted">Pastor:</small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.pastor
                      : "SIN PASTOR ASIGNADO"}
                  </h6>{" "}
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
                titulo_panel={"Datos Informe Financiero"}
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
                      <i className="fa fa-arrow-left mr-2"></i>SALIR
                    </button>
                    <button
                      type="button"
                      className="btn btn-info mr-2"
                      disabled={this.state.loading}
                      onClick={this.guardar.bind(this, 2)}
                    >
                      <i className="fa fa-send mr-2"></i>
                      ENVIAR
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      disabled={this.state.loading}
                      onClick={this.guardar.bind(this, 1)}
                    >
                      <i className="fa fa-save mr-2"></i>
                      GUARDAR
                    </button>
                  </React.Fragment>
                }
              >
                <h3 className="card-title">Oficinas Internaciones</h3>
                <hr />
                <div className="row">
                  <div className="col-lg-3 form-group">
                    <label htmlFor="">10% Oficinas Inter.:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="oficinasInternacionales"
                        value={this.state.oficinasInternacionales}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Socios A.M.I.P:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="sociosAmip"
                        value={this.state.sociosAmip}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Misiones Mundiales:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="misionesMundiales"
                        value={this.state.misionesMundiales}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div
                    className="col-lg-3 form-group"
                    title="Bautizados con el Espíritu Santo"
                  >
                    <label htmlFor="">Tributos Anuales:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="tributosAnuales"
                        value={this.state.tributosAnuales}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="card-title">Oficinas Nacionales</h3>
                <hr />
                <div className="row">
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">10% Min. Ordenado:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="ministroOrdenado"
                        value={this.state.ministroOrdenado}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">10% Pastor Laico:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="pastorLaico"
                        value={this.state.pastorLaico}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 form-group">
                    <label htmlFor="">10% Fondo Local:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="fondoLocal"
                        value={this.state.fondoLocal}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">%5 F. Retiro Pastoral:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="retiroPastoral"
                        value={this.state.retiroPastoral}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div
                    className="col-lg-4 form-group"
                    title="Segunda parte de ofrenda de ministerios"
                  >
                    <label
                      title="Segunda parte de ofrenda de ministerios"
                      htmlFor=""
                    >
                      2° Prte. Ofren. Mins.:
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        title="Segunda parte de ofrenda de ministerios"
                        type="number"
                        id="segundaParteOfrendaministerios"
                        value={this.state.segundaParteOfrendaministerios}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 form-group">
                    <label htmlFor="">F. Emergencia Nac.:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="fondoEmergenciaNacional"
                        value={this.state.fondoEmergenciaNacional}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Misiones Nacionales:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="misionesNacionales"
                        value={this.state.misionesNacionales}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Diezmos Ministerios:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="diezmosMinistros"
                        value={this.state.diezmosMinistros}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Of. Compra Prop. Nac.:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="compraPropiedadNacional"
                        value={this.state.compraPropiedadNacional}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Of. Constr. templos Nuevos:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="construccionTemplosNuevos"
                        value={this.state.construccionTemplosNuevos}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Cotización ISSS y AFP:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="cotizacionPrestaciones"
                        value={this.state.cotizacionPrestaciones}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Seguro de vida ASESUISA:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="seguroVida"
                        value={this.state.seguroVida}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Fondo Solidario Ministerial:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="fondoSolidarioMinisterial"
                        value={this.state.fondoSolidarioMinisterial}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Otros:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="otros"
                        value={this.state.otros}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </LayoutPanelEmpty>
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
