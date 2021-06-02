import React, { Component } from "react";
import HTTP from "../../../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../../../helpers/ValidatorTranslate_es";
import Request from "../../../../../services/Request";
import Alerts from "../../../../../services/Alerts";
import LayoutPanelEmpty from "../../../../../components/layouts/panels/LayoutPanelEmpty";
import Redondeo from "../../../../../helpers/Redondeo";
export default class InformeTesoreroMensual extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: "Informe Mensual al Tesorero Nacional",
    nombre: "",
    loading: false,
    tab_active: "",
    gestiones: null,
    actualizando: false,
    iglesia: null,
    redirect: false,

    //estodos para informe

    diezmosRecibidosIglesia: parseFloat(0).toFixed(2),
    diezmoEnviadoOficina: parseFloat(0).toFixed(2),
    diezmosEntregadosPastor: parseFloat(0).toFixed(2),
    membresiaPatrimonioHistorico: "",
    ofrendaMisioneraSegundoDomingo: parseFloat(0).toFixed(2),
    impulsoMisiones: parseFloat(0).toFixed(2),
    porcentajeMisionerosOficina: parseFloat(0).toFixed(2),
    misionesNacionales: parseFloat(0).toFixed(2),
    entradaFondoLocal: parseFloat(0).toFixed(2),
    diezmosFondoLocal: parseFloat(0).toFixed(2),
    fondoRetiroPastoral: parseFloat(0).toFixed(2),
    dineroOtrosPropositos: parseFloat(0).toFixed(2),
    ofrendaEmergenciaNacional: parseFloat(0).toFixed(2),
    fondoSolidarioMinisterial: parseFloat(0).toFixed(2),
    totalMiembros: "",
    masculinos: "",
    femeninos: "",
    excluidos: "",
    trasladados: "",
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
        "informe/tesorero/mensual/info"
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

          diezmosRecibidosIglesia:
            this.state.diezmosRecibidosIglesia !== "" &&
            this.state.diezmosRecibidosIglesia !== null
              ? this.state.diezmosRecibidosIglesia
              : 0,
          diezmoEnviadoOficina:
            this.state.diezmoEnviadoOficina !== "" &&
            this.state.diezmoEnviadoOficina !== null
              ? this.state.diezmoEnviadoOficina
              : 0,
          diezmosEntregadosPastor:
            this.state.diezmosEntregadosPastor !== "" &&
            this.state.diezmosEntregadosPastor !== null
              ? this.state.diezmosEntregadosPastor
              : 0,
          membresiaPatrimonioHistorico:
            this.state.membresiaPatrimonioHistorico !== "" &&
            this.state.membresiaPatrimonioHistorico !== null
              ? this.state.membresiaPatrimonioHistorico
              : 0,
          ofrendaMisioneraSegundoDomingo:
            this.state.ofrendaMisioneraSegundoDomingo !== "" &&
            this.state.ofrendaMisioneraSegundoDomingo !== null
              ? this.state.ofrendaMisioneraSegundoDomingo
              : 0,
          impulsoMisiones:
            this.state.impulsoMisiones !== "" &&
            this.state.impulsoMisiones !== null
              ? this.state.impulsoMisiones
              : 0,
          porcentajeMisionerosOficina:
            this.state.porcentajeMisionerosOficina !== "" &&
            this.state.porcentajeMisionerosOficina !== null
              ? this.state.porcentajeMisionerosOficina
              : 0,
          misionesNacionales:
            this.state.misionesNacionales !== "" &&
            this.state.misionesNacionales !== null
              ? this.state.misionesNacionales
              : 0,
          entradaFondoLocal:
            this.state.entradaFondoLocal !== "" &&
            this.state.entradaFondoLocal !== null
              ? this.state.entradaFondoLocal
              : 0,
          diezmosFondoLocal:
            this.state.diezmosFondoLocal !== "" &&
            this.state.diezmosFondoLocal !== null
              ? this.state.diezmosFondoLocal
              : 0,
          fondoRetiroPastoral:
            this.state.fondoRetiroPastoral !== "" &&
            this.state.fondoRetiroPastoral !== null
              ? this.state.fondoRetiroPastoral
              : 0,
          dineroOtrosPropositos:
            this.state.dineroOtrosPropositos !== "" &&
            this.state.dineroOtrosPropositos !== null
              ? this.state.dineroOtrosPropositos
              : 0,
          ofrendaEmergenciaNacional:
            this.state.ofrendaEmergenciaNacional !== "" &&
            this.state.ofrendaEmergenciaNacional !== null
              ? this.state.ofrendaEmergenciaNacional
              : 0,
          fondoSolidarioMinisterial:
            this.state.fondoSolidarioMinisterial !== "" &&
            this.state.fondoSolidarioMinisterial !== null
              ? this.state.fondoSolidarioMinisterial
              : 0,
          totalMiembros:
            this.state.totalMiembros !== "" && this.state.totalMiembros !== null
              ? this.state.totalMiembros
              : 0,
          masculinos:
            this.state.masculinos !== "" && this.state.masculinos !== null
              ? this.state.masculinos
              : 0,
          femeninos:
            this.state.femeninos !== "" && this.state.femeninos !== null
              ? this.state.femeninos
              : 0,
          excluidos:
            this.state.excluidos !== "" && this.state.excluidos !== null
              ? this.state.excluidos
              : 0,
          trasladados:
            this.state.trasladados !== "" && this.state.trasladados !== null
              ? this.state.trasladados
              : 0,
          estado: 1,
        };
        Request.PUT("informe/tesorero/mensual/detalle", data).then((result) => {
          Alerts.loading_reload(false);

          if (result !== false) {
            if (result.status === 200) {
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
        });
      } else if (estado === 2) {
        const data = {
          codigoInforme: this.props.match.params.ide,

          diezmosRecibidosIglesia:
            this.state.diezmosRecibidosIglesia !== "" &&
            this.state.diezmosRecibidosIglesia !== null
              ? this.state.diezmosRecibidosIglesia
              : 0,
          diezmoEnviadoOficina:
            this.state.diezmoEnviadoOficina !== "" &&
            this.state.diezmoEnviadoOficina !== null
              ? this.state.diezmoEnviadoOficina
              : 0,
          diezmosEntregadosPastor:
            this.state.diezmosEntregadosPastor !== "" &&
            this.state.diezmosEntregadosPastor !== null
              ? this.state.diezmosEntregadosPastor
              : 0,
          membresiaPatrimonioHistorico:
            this.state.membresiaPatrimonioHistorico !== "" &&
            this.state.membresiaPatrimonioHistorico !== null
              ? this.state.membresiaPatrimonioHistorico
              : 0,
          ofrendaMisioneraSegundoDomingo:
            this.state.ofrendaMisioneraSegundoDomingo !== "" &&
            this.state.ofrendaMisioneraSegundoDomingo !== null
              ? this.state.ofrendaMisioneraSegundoDomingo
              : 0,
          impulsoMisiones:
            this.state.impulsoMisiones !== "" &&
            this.state.impulsoMisiones !== null
              ? this.state.impulsoMisiones
              : 0,
          porcentajeMisionerosOficina:
            this.state.porcentajeMisionerosOficina !== "" &&
            this.state.porcentajeMisionerosOficina !== null
              ? this.state.porcentajeMisionerosOficina
              : 0,
          misionesNacionales:
            this.state.misionesNacionales !== "" &&
            this.state.misionesNacionales !== null
              ? this.state.misionesNacionales
              : 0,
          entradaFondoLocal:
            this.state.entradaFondoLocal !== "" &&
            this.state.entradaFondoLocal !== null
              ? this.state.entradaFondoLocal
              : 0,
          diezmosFondoLocal:
            this.state.diezmosFondoLocal !== "" &&
            this.state.diezmosFondoLocal !== null
              ? this.state.diezmosFondoLocal
              : 0,
          fondoRetiroPastoral:
            this.state.fondoRetiroPastoral !== "" &&
            this.state.fondoRetiroPastoral !== null
              ? this.state.fondoRetiroPastoral
              : 0,
          dineroOtrosPropositos:
            this.state.dineroOtrosPropositos !== "" &&
            this.state.dineroOtrosPropositos !== null
              ? this.state.dineroOtrosPropositos
              : 0,
          ofrendaEmergenciaNacional:
            this.state.ofrendaEmergenciaNacional !== "" &&
            this.state.ofrendaEmergenciaNacional !== null
              ? this.state.ofrendaEmergenciaNacional
              : 0,
          fondoSolidarioMinisterial:
            this.state.fondoSolidarioMinisterial !== "" &&
            this.state.fondoSolidarioMinisterial !== null
              ? this.state.fondoSolidarioMinisterial
              : 0,
          totalMiembros:
            this.state.totalMiembros !== "" && this.state.totalMiembros !== null
              ? this.state.totalMiembros
              : 0,
          masculinos:
            this.state.masculinos !== "" && this.state.masculinos !== null
              ? this.state.masculinos
              : 0,
          femeninos:
            this.state.femeninos !== "" && this.state.femeninos !== null
              ? this.state.femeninos
              : 0,
          excluidos:
            this.state.excluidos !== "" && this.state.excluidos !== null
              ? this.state.excluidos
              : 0,
          trasladados:
            this.state.trasladados !== "" && this.state.trasladados !== null
              ? this.state.trasladados
              : 0,
          estado: 2,
        };

        Request.PUT("informe/tesorero/mensual/detalle", data).then((result) => {
          Alerts.loading_reload(false);

          if (result !== false) {
            if (result.status === 200) {
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
        });
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
            telefono: "5555-5555",
            direccion: "Col Las Olivas",
            mail: "tesorero@mail.com",
            estado: 1,
          },
          detalle: {
            diezmosRecibidosIglesia:
              this.state.diezmosRecibidosIglesia !== "" &&
              this.state.diezmosRecibidosIglesia !== null
                ? this.state.diezmosRecibidosIglesia
                : 0,
            diezmoEnviadoOficina:
              this.state.diezmoEnviadoOficina !== "" &&
              this.state.diezmoEnviadoOficina !== null
                ? this.state.diezmoEnviadoOficina
                : 0,
            diezmosEntregadosPastor:
              this.state.diezmosEntregadosPastor !== "" &&
              this.state.diezmosEntregadosPastor !== null
                ? this.state.diezmosEntregadosPastor
                : 0,
            membresiaPatrimonioHistorico:
              this.state.membresiaPatrimonioHistorico !== "" &&
              this.state.membresiaPatrimonioHistorico !== null
                ? this.state.membresiaPatrimonioHistorico
                : 0,
            ofrendaMisioneraSegundoDomingo:
              this.state.ofrendaMisioneraSegundoDomingo !== "" &&
              this.state.ofrendaMisioneraSegundoDomingo !== null
                ? this.state.ofrendaMisioneraSegundoDomingo
                : 0,
            impulsoMisiones:
              this.state.impulsoMisiones !== "" &&
              this.state.impulsoMisiones !== null
                ? this.state.impulsoMisiones
                : 0,
            porcentajeMisionerosOficina:
              this.state.porcentajeMisionerosOficina !== "" &&
              this.state.porcentajeMisionerosOficina !== null
                ? this.state.porcentajeMisionerosOficina
                : 0,
            misionesNacionales:
              this.state.misionesNacionales !== "" &&
              this.state.misionesNacionales !== null
                ? this.state.misionesNacionales
                : 0,
            entradaFondoLocal:
              this.state.entradaFondoLocal !== "" &&
              this.state.entradaFondoLocal !== null
                ? this.state.entradaFondoLocal
                : 0,
            diezmosFondoLocal:
              this.state.diezmosFondoLocal !== "" &&
              this.state.diezmosFondoLocal !== null
                ? this.state.diezmosFondoLocal
                : 0,
            fondoRetiroPastoral:
              this.state.fondoRetiroPastoral !== "" &&
              this.state.fondoRetiroPastoral !== null
                ? this.state.fondoRetiroPastoral
                : 0,
            dineroOtrosPropositos:
              this.state.dineroOtrosPropositos !== "" &&
              this.state.dineroOtrosPropositos !== null
                ? this.state.dineroOtrosPropositos
                : 0,
            ofrendaEmergenciaNacional:
              this.state.ofrendaEmergenciaNacional !== "" &&
              this.state.ofrendaEmergenciaNacional !== null
                ? this.state.ofrendaEmergenciaNacional
                : 0,
            fondoSolidarioMinisterial:
              this.state.fondoSolidarioMinisterial !== "" &&
              this.state.fondoSolidarioMinisterial !== null
                ? this.state.fondoSolidarioMinisterial
                : 0,
            totalMiembros:
              this.state.totalMiembros !== "" &&
              this.state.totalMiembros !== null
                ? this.state.totalMiembros
                : 0,
            masculinos:
              this.state.masculinos !== "" && this.state.masculinos !== null
                ? this.state.masculinos
                : 0,
            femeninos:
              this.state.femeninos !== "" && this.state.femeninos !== null
                ? this.state.femeninos
                : 0,
            excluidos:
              this.state.excluidos !== "" && this.state.excluidos !== null
                ? this.state.excluidos
                : 0,
            trasladados:
              this.state.trasladados !== "" && this.state.trasladados !== null
                ? this.state.trasladados
                : 0,
          },
        };
        this.setState({
          loading: true,
        });
        Alerts.loading_reload(true);
        Request.POST("informe/tesorero/mensual", data).then((result) => {
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
                telefono: "5555-5555",
                direccion: "Col Las Olivas",
                mail: "tesorero@mail.com",
                estado: 2,
              },
              detalle: {
                diezmosRecibidosIglesia:
                  this.state.diezmosRecibidosIglesia !== "" &&
                  this.state.diezmosRecibidosIglesia !== null
                    ? this.state.diezmosRecibidosIglesia
                    : 0,
                diezmoEnviadoOficina:
                  this.state.diezmoEnviadoOficina !== "" &&
                  this.state.diezmoEnviadoOficina !== null
                    ? this.state.diezmoEnviadoOficina
                    : 0,
                diezmosEntregadosPastor:
                  this.state.diezmosEntregadosPastor !== "" &&
                  this.state.diezmosEntregadosPastor !== null
                    ? this.state.diezmosEntregadosPastor
                    : 0,
                membresiaPatrimonioHistorico:
                  this.state.membresiaPatrimonioHistorico !== "" &&
                  this.state.membresiaPatrimonioHistorico !== null
                    ? this.state.membresiaPatrimonioHistorico
                    : 0,
                ofrendaMisioneraSegundoDomingo:
                  this.state.ofrendaMisioneraSegundoDomingo !== "" &&
                  this.state.ofrendaMisioneraSegundoDomingo !== null
                    ? this.state.ofrendaMisioneraSegundoDomingo
                    : 0,
                impulsoMisiones:
                  this.state.impulsoMisiones !== "" &&
                  this.state.impulsoMisiones !== null
                    ? this.state.impulsoMisiones
                    : 0,
                porcentajeMisionerosOficina:
                  this.state.porcentajeMisionerosOficina !== "" &&
                  this.state.porcentajeMisionerosOficina !== null
                    ? this.state.porcentajeMisionerosOficina
                    : 0,
                misionesNacionales:
                  this.state.misionesNacionales !== "" &&
                  this.state.misionesNacionales !== null
                    ? this.state.misionesNacionales
                    : 0,
                entradaFondoLocal:
                  this.state.entradaFondoLocal !== "" &&
                  this.state.entradaFondoLocal !== null
                    ? this.state.entradaFondoLocal
                    : 0,
                diezmosFondoLocal:
                  this.state.diezmosFondoLocal !== "" &&
                  this.state.diezmosFondoLocal !== null
                    ? this.state.diezmosFondoLocal
                    : 0,
                fondoRetiroPastoral:
                  this.state.fondoRetiroPastoral !== "" &&
                  this.state.fondoRetiroPastoral !== null
                    ? this.state.fondoRetiroPastoral
                    : 0,
                dineroOtrosPropositos:
                  this.state.dineroOtrosPropositos !== "" &&
                  this.state.dineroOtrosPropositos !== null
                    ? this.state.dineroOtrosPropositos
                    : 0,
                ofrendaEmergenciaNacional:
                  this.state.ofrendaEmergenciaNacional !== "" &&
                  this.state.ofrendaEmergenciaNacional !== null
                    ? this.state.ofrendaEmergenciaNacional
                    : 0,
                fondoSolidarioMinisterial:
                  this.state.fondoSolidarioMinisterial !== "" &&
                  this.state.fondoSolidarioMinisterial !== null
                    ? this.state.fondoSolidarioMinisterial
                    : 0,
                totalMiembros:
                  this.state.totalMiembros !== "" &&
                  this.state.totalMiembros !== null
                    ? this.state.totalMiembros
                    : 0,
                masculinos:
                  this.state.masculinos !== "" && this.state.masculinos !== null
                    ? this.state.masculinos
                    : 0,
                femeninos:
                  this.state.femeninos !== "" && this.state.femeninos !== null
                    ? this.state.femeninos
                    : 0,
                excluidos:
                  this.state.excluidos !== "" && this.state.excluidos !== null
                    ? this.state.excluidos
                    : 0,
                trasladados:
                  this.state.trasladados !== "" &&
                  this.state.trasladados !== null
                    ? this.state.trasladados
                    : 0,
              },
            };
            this.setState({
              loading: true,
            });
            Alerts.loading_reload(true);
            Request.POST("informe/tesorero/mensual", data).then((result) => {
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
                titulo_panel={"Datos Informe Mensual al Tesorero Nacional"}
                buttons={
                  <React.Fragment>
                    <button
                      type="button"
                      className="btn btn-outline-inverse mr-2 "
                      onClick={() => {
                        this.setState({ redirect: true });
                      }}
                    >
                      <i className="fa fa-arrow-left mr-2"></i>SALIR
                    </button>
                    <button
                      type="button"
                      className="btn btn-info mr-2"
                      onClick={this.guardar.bind(this, 2)}
                    >
                      <i className="fa fa-send mr-2"></i>
                      ENVIAR
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={this.guardar.bind(this, 1)}
                    >
                      <i className="fa fa-save mr-2"></i>
                      GUARDAR
                    </button>
                  </React.Fragment>
                }
              >
                <h3 className="card-title">Finanzas</h3>
                <hr />
                <div className="row">
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Diezmos Recibidos por la Iglesia: </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="diezmosRecibidosIglesia"
                        value={this.state.diezmosRecibidosIglesia}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Diezmos Enviados Oficinas Int.:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="diezmoEnviadoOficina"
                        value={this.state.diezmoEnviadoOficina}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Diezmos Entregados a Pastor:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="diezmosEntregadosPastor"
                        value={this.state.diezmosEntregadosPastor}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Ofrenda Misionera 2do Dom.:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="ofrendaMisioneraSegundoDomingo"
                        value={this.state.ofrendaMisioneraSegundoDomingo}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Impulso Misiones Marzo/Octubre:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="impulsoMisiones"
                        value={this.state.impulsoMisiones}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 form-group">
                    <label htmlFor="">50% de Ministerios a Oficina Nac.:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="porcentajeMisionerosOficina"
                        value={this.state.porcentajeMisionerosOficina}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Misiones Nac. Julio/Diciembre:</label>
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
                    <label htmlFor="">Entrada Total al Fondo Local:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="entradaFondoLocal"
                        value={this.state.entradaFondoLocal}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Diezmos del Fondo Local:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="diezmosFondoLocal"
                        value={this.state.diezmosFondoLocal}
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
                    <label htmlFor="">Fondo Retiro Pastoral:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="fondoRetiroPastoral"
                        value={this.state.fondoRetiroPastoral}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Otros patrocinios:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="dineroOtrosPropositos"
                        value={this.state.dineroOtrosPropositos}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Of. Emergencia. Nac.:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="ofrendaEmergenciaNacional"
                        value={this.state.ofrendaEmergenciaNacional}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="card-title">Membresía</h3>
                <hr />
                <div className="row">
                  <div
                    className="col-lg-4 form-group"
                    title="Membresía Patrimonio Hístorico"
                  >
                    <label htmlFor="">Membresía Patri. Hístorico:</label>

                    <input
                      type="number"
                      id="membresiaPatrimonioHistorico"
                      value={this.state.membresiaPatrimonioHistorico}
                      className="form-control"
                      onChange={this.handleInputChange}
                      placeholder="Membresía Patrim. Hís."
                    />
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Total de Miembros:</label>

                    <input
                      type="number"
                      id="totalMiembros"
                      value={this.state.totalMiembros}
                      className="form-control"
                      onChange={this.handleInputChange}
                      placeholder="Total Miembros"
                    />
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Masculinos:</label>

                    <input
                      type="number"
                      id="masculinos"
                      value={this.state.masculinos}
                      className="form-control"
                      onChange={this.handleInputChange}
                      placeholder="Masculinos"
                    />
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Femeninos:</label>

                    <input
                      type="number"
                      id="femeninos"
                      value={this.state.femeninos}
                      className="form-control"
                      onChange={this.handleInputChange}
                      placeholder="Femeninos"
                    />
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Excluidos:</label>

                    <input
                      type="number"
                      id="excluidos"
                      value={this.state.excluidos}
                      className="form-control"
                      onChange={this.handleInputChange}
                      placeholder="Excluidos"
                    />
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="">Traslados:</label>

                    <input
                      type="number"
                      id="trasladados"
                      value={this.state.trasladados}
                      className="form-control"
                      onChange={this.handleInputChange}
                      placeholder="Trasladados"
                    />
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
