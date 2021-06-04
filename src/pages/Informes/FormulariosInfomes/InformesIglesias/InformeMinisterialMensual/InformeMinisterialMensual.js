import React, { Component } from "react";
import HTTP from "../../../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../../../helpers/ValidatorTranslate_es";
import Request from "../../../../../services/Request";
import Alerts from "../../../../../services/Alerts";
import LayoutPanelEmpty from "../../../../../components/layouts/panels/LayoutPanelEmpty";
import Redondeo from "../../../../../helpers/Redondeo";
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

    //estodos para informe
    mensajes: "",
    convertidos: "",
    santificados: "",
    bautismosAgua: "",
    bautismosEs: "",
    agregados: "",
    hogaresMiembrosV: "",
    hogaresProspectosV: "",
    diezmoRecibido: "",
    diezmoPagado: "",
    ofrendaRecibida: "",
    diezmosIncluidosInforme: "",
    gastosMinisteriales: "",
    actividadesOracion: "",
    //es bool
    vidaOracion: 0,
    actividadesMisiones: "",
    actividadesLiderazgo: "",
    lideresInvolucrados: "",
    //es bool
    mejoraMinisterial: 0,
    miembrosActivos: "",
    miembrosSalvos: "",
    miembrosSantificados: "",
    miembrosBautizadosEs: "",
    promedioAsistenciaAdultos: "",
    promedioAsistenciaNiJov: "",
    //es bool
    ministerioAlcanceSemanal: 0,
    santaCena: 0,
    lavatorios: 0,
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
  getByID() {
    if (this.props.match.params.ide) {
      HTTP.findById(
        this.props.match.params.ide,
        "informe/ministerial/mensual/info"
      ).then((result) => {
        if (result !== false) {
          this.setState(result);
          if (result.vidaOracion === 1) {
            document.getElementById("vidaOracion").checked = true;
          }
          if (result.mejoraMinisterial === 1) {
            document.getElementById("mejoraMinisterial").checked = true;
          }
          if (result.ministerioAlcanceSemanal === 1) {
            document.getElementById("ministerioAlcanceSemanal").checked = true;
          }
          if (result.santaCena === 1) {
            document.getElementById("santaCena").checked = true;
          }
          if (result.lavatorios === 1) {
            document.getElementById("lavatorios").checked = true;
          }
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

  async guardar(estado) {
    if (this.props.match.params.ide) {
      Alerts.loading_reload(true);

      if (estado === 1) {
        const data = {
          codigoInforme: this.props.match.params.ide,
          mensajes:
            this.state.mensajes !== "" && this.state.mensajes !== null
              ? this.state.mensajes
              : 0,
          convertidos:
            this.state.convertidos !== "" && this.state.convertidos !== null
              ? this.state.convertidos
              : 0,
          santificados:
            this.state.santificados !== "" && this.state.santificados !== null
              ? this.state.santificados
              : 0,
          bautismosAgua:
            this.state.bautismosAgua !== "" && this.state.bautismosAgua !== null
              ? this.state.bautismosAgua
              : 0,
          bautismosEs:
            this.state.bautismosEs !== "" && this.state.bautismosEs !== null
              ? this.state.bautismosEs
              : 0,
          agregados:
            this.state.agregados !== "" && this.state.agregados !== null
              ? this.state.agregados
              : 0,
          hogaresMiembrosV:
            this.state.hogaresMiembrosV !== "" &&
            this.state.hogaresMiembrosV !== null
              ? this.state.hogaresMiembrosV
              : 0,
          hogaresProspectosV:
            this.state.hogaresProspectosV !== "" &&
            this.state.hogaresProspectosV !== null
              ? this.state.hogaresProspectosV
              : 0,
          diezmoRecibido:
            this.state.diezmoRecibido !== "" &&
            this.state.diezmoRecibido !== null
              ? this.state.diezmoRecibido
              : 0,
          diezmoPagado:
            this.state.diezmoPagado !== "" && this.state.diezmoPagado !== null
              ? this.state.diezmoPagado
              : 0,
          ofrendaRecibida:
            this.state.ofrendaRecibida !== "" &&
            this.state.ofrendaRecibida !== null
              ? this.state.ofrendaRecibida
              : 0,
          gastosMinisteriales:
            this.state.gastosMinisteriales !== "" &&
            this.state.gastosMinisteriales !== null
              ? this.state.gastosMinisteriales
              : 0,
          actividadesOracion:
            this.state.actividadesOracion !== "" &&
            this.state.actividadesOracion !== null
              ? this.state.actividadesOracion
              : 0,
          vidaOracion:
            this.state.vidaOracion !== "" && this.state.vidaOracion !== null
              ? this.state.vidaOracion
              : 0,
          actividadesMisiones:
            this.state.actividadesMisiones !== "" &&
            this.state.actividadesMisiones !== null
              ? this.state.actividadesMisiones
              : 0,
          actividadesLiderazgo:
            this.state.actividadesLiderazgo !== "" &&
            this.state.actividadesLiderazgo !== null
              ? this.state.actividadesLiderazgo
              : 0,
          lideresInvolucrados:
            this.state.lideresInvolucrados !== "" &&
            this.state.lideresInvolucrados !== null
              ? this.state.lideresInvolucrados
              : 0,
          mejoraMinisterial:
            this.state.mejoraMinisterial !== "" &&
            this.state.mejoraMinisterial !== null
              ? this.state.mejoraMinisterial
              : 0,
          miembrosActivos:
            this.state.miembrosActivos !== "" &&
            this.state.miembrosActivos !== null
              ? this.state.miembrosActivos
              : 0,
          miembrosSalvos:
            this.state.miembrosSalvos !== "" &&
            this.state.miembrosSalvos !== null
              ? this.state.miembrosSalvos
              : 0,
          miembrosSantificados:
            this.state.miembrosSantificados !== "" &&
            this.state.miembrosSantificados !== null
              ? this.state.miembrosSantificados
              : 0,
          miembrosBautizadosEs:
            this.state.miembrosBautizadosEs !== "" &&
            this.state.miembrosBautizadosEs !== null
              ? this.state.miembrosBautizadosEs
              : 0,
          promedioAsistenciaAdultos:
            this.state.promedioAsistenciaAdultos !== "" &&
            this.state.promedioAsistenciaAdultos !== null
              ? this.state.promedioAsistenciaAdultos
              : 0,
          promedioAsistenciaNiJov:
            this.state.promedioAsistenciaNiJov !== "" &&
            this.state.promedioAsistenciaNiJov !== null
              ? this.state.promedioAsistenciaNiJov
              : 0,
          ministerioAlcanceSemanal:
            this.state.ministerioAlcanceSemanal !== "" &&
            this.state.ministerioAlcanceSemanal !== null
              ? this.state.ministerioAlcanceSemanal
              : 0,
          santaCena:
            this.state.santaCena !== "" && this.state.santaCena !== null
              ? this.state.santaCena
              : 0,
          lavatorios:
            this.state.lavatorios !== "" && this.state.lavatorios !== null
              ? this.state.lavatorios
              : 0,
          estado: 1,
          diezmosIncluidosInforme:
            this.state.diezmosIncluidosInforme !== "" &&
            this.state.diezmosIncluidosInforme !== null
              ? this.state.diezmosIncluidosInforme
              : 0,
        };
        Request.PUT("informe/ministerial/mensual/detalle", data).then(
          (result) => {
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
          }
        );
      } else if (estado === 2) {
        const data = {
          codigoInforme: this.props.match.params.ide,
          mensajes:
            this.state.mensajes !== "" && this.state.mensajes !== null
              ? this.state.mensajes
              : 0,
          convertidos:
            this.state.convertidos !== "" && this.state.convertidos !== null
              ? this.state.convertidos
              : 0,
          santificados:
            this.state.santificados !== "" && this.state.santificados !== null
              ? this.state.santificados
              : 0,
          bautismosAgua:
            this.state.bautismosAgua !== "" && this.state.bautismosAgua !== null
              ? this.state.bautismosAgua
              : 0,
          bautismosEs:
            this.state.bautismosEs !== "" && this.state.bautismosEs !== null
              ? this.state.bautismosEs
              : 0,
          agregados:
            this.state.agregados !== "" && this.state.agregados !== null
              ? this.state.agregados
              : 0,
          hogaresMiembrosV:
            this.state.hogaresMiembrosV !== "" &&
            this.state.hogaresMiembrosV !== null
              ? this.state.hogaresMiembrosV
              : 0,
          hogaresProspectosV:
            this.state.hogaresProspectosV !== "" &&
            this.state.hogaresProspectosV !== null
              ? this.state.hogaresProspectosV
              : 0,
          diezmoRecibido:
            this.state.diezmoRecibido !== "" &&
            this.state.diezmoRecibido !== null
              ? this.state.diezmoRecibido
              : 0,
          diezmoPagado:
            this.state.diezmoPagado !== "" && this.state.diezmoPagado !== null
              ? this.state.diezmoPagado
              : 0,
          ofrendaRecibida:
            this.state.ofrendaRecibida !== "" &&
            this.state.ofrendaRecibida !== null
              ? this.state.ofrendaRecibida
              : 0,
          gastosMinisteriales:
            this.state.gastosMinisteriales !== "" &&
            this.state.gastosMinisteriales !== null
              ? this.state.gastosMinisteriales
              : 0,
          actividadesOracion:
            this.state.actividadesOracion !== "" &&
            this.state.actividadesOracion !== null
              ? this.state.actividadesOracion
              : 0,
          vidaOracion:
            this.state.vidaOracion !== "" && this.state.vidaOracion !== null
              ? this.state.vidaOracion
              : 0,
          actividadesMisiones:
            this.state.actividadesMisiones !== "" &&
            this.state.actividadesMisiones !== null
              ? this.state.actividadesMisiones
              : 0,
          actividadesLiderazgo:
            this.state.actividadesLiderazgo !== "" &&
            this.state.actividadesLiderazgo !== null
              ? this.state.actividadesLiderazgo
              : 0,
          lideresInvolucrados:
            this.state.lideresInvolucrados !== "" &&
            this.state.lideresInvolucrados !== null
              ? this.state.lideresInvolucrados
              : 0,
          mejoraMinisterial:
            this.state.mejoraMinisterial !== "" &&
            this.state.mejoraMinisterial !== null
              ? this.state.mejoraMinisterial
              : 0,
          miembrosActivos:
            this.state.miembrosActivos !== "" &&
            this.state.miembrosActivos !== null
              ? this.state.miembrosActivos
              : 0,
          miembrosSalvos:
            this.state.miembrosSalvos !== "" &&
            this.state.miembrosSalvos !== null
              ? this.state.miembrosSalvos
              : 0,
          miembrosSantificados:
            this.state.miembrosSantificados !== "" &&
            this.state.miembrosSantificados !== null
              ? this.state.miembrosSantificados
              : 0,
          miembrosBautizadosEs:
            this.state.miembrosBautizadosEs !== "" &&
            this.state.miembrosBautizadosEs !== null
              ? this.state.miembrosBautizadosEs
              : 0,
          promedioAsistenciaAdultos:
            this.state.promedioAsistenciaAdultos !== "" &&
            this.state.promedioAsistenciaAdultos !== null
              ? this.state.promedioAsistenciaAdultos
              : 0,
          promedioAsistenciaNiJov:
            this.state.promedioAsistenciaNiJov !== "" &&
            this.state.promedioAsistenciaNiJov !== null
              ? this.state.promedioAsistenciaNiJov
              : 0,
          ministerioAlcanceSemanal:
            this.state.ministerioAlcanceSemanal !== "" &&
            this.state.ministerioAlcanceSemanal !== null
              ? this.state.ministerioAlcanceSemanal
              : 0,
          santaCena:
            this.state.santaCena !== "" && this.state.santaCena !== null
              ? this.state.santaCena
              : 0,
          lavatorios:
            this.state.lavatorios !== "" && this.state.lavatorios !== null
              ? this.state.lavatorios
              : 0,
          estado: 2,
          diezmosIncluidosInforme:
            this.state.diezmosIncluidosInforme !== "" &&
            this.state.diezmosIncluidosInforme !== null
              ? this.state.diezmosIncluidosInforme
              : 0,
        };

        Request.PUT("informe/ministerial/mensual/detalle", data).then(
          (result) => {
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
            estado: 1,
          },
          detalle: {
            mensajes:
              this.state.mensajes !== "" && this.state.mensajes !== null
                ? this.state.mensajes
                : 0,
            convertidos:
              this.state.convertidos !== "" && this.state.convertidos !== null
                ? this.state.convertidos
                : 0,
            santificados:
              this.state.santificados !== "" && this.state.santificados !== null
                ? this.state.santificados
                : 0,
            bautismosAgua:
              this.state.bautismosAgua !== "" &&
              this.state.bautismosAgua !== null
                ? this.state.bautismosAgua
                : 0,
            bautismosEs:
              this.state.bautismosEs !== "" && this.state.bautismosEs !== null
                ? this.state.bautismosEs
                : 0,
            agregados:
              this.state.agregados !== "" && this.state.agregados !== null
                ? this.state.agregados
                : 0,
            hogaresMiembrosV:
              this.state.hogaresMiembrosV !== "" &&
              this.state.hogaresMiembrosV !== null
                ? this.state.hogaresMiembrosV
                : 0,
            hogaresProspectosV:
              this.state.hogaresProspectosV !== "" &&
              this.state.hogaresProspectosV !== null
                ? this.state.hogaresProspectosV
                : 0,
            diezmoRecibido:
              this.state.diezmoRecibido !== "" &&
              this.state.diezmoRecibido !== null
                ? this.state.diezmoRecibido
                : 0.0,
            diezmoPagado:
              this.state.diezmoPagado !== "" && this.state.diezmoPagado !== null
                ? this.state.diezmoPagado
                : 0.0,
            ofrendaRecibida:
              this.state.ofrendaRecibida !== "" &&
              this.state.ofrendaRecibida !== null
                ? this.state.ofrendaRecibida
                : 0.0,
            gastosMinisteriales:
              this.state.gastosMinisteriales !== "" &&
              this.state.gastosMinisteriales !== null
                ? this.state.gastosMinisteriales
                : 0.0,
            actividadesOracion:
              this.state.actividadesOracion !== "" &&
              this.state.actividadesOracion !== null
                ? this.state.actividadesOracion
                : 0,
            vidaOracion: parseInt(this.state.vidaOracion),
            actividadesMisiones:
              this.state.actividadesMisiones !== "" &&
              this.state.actividadesMisiones !== null
                ? this.state.actividadesMisiones
                : 0,
            actividadesLiderazgo:
              this.state.actividadesLiderazgo !== "" &&
              this.state.actividadesLiderazgo !== null
                ? this.state.actividadesLiderazgo
                : 0,
            lideresInvolucrados:
              this.state.lideresInvolucrados !== "" &&
              this.state.lideresInvolucrados !== null
                ? this.state.lideresInvolucrados
                : 0,
            mejoraMinisterial: parseInt(this.state.mejoraMinisterial),
            miembrosActivos:
              this.state.miembrosActivos !== "" &&
              this.state.miembrosActivos !== null
                ? this.state.miembrosActivos
                : 0,
            miembrosSalvos:
              this.state.miembrosSalvos !== "" &&
              this.state.miembrosSalvos !== null
                ? this.state.miembrosSalvos
                : 0,
            miembrosSantificados:
              this.state.miembrosSantificados !== "" &&
              this.state.miembrosSantificados !== null
                ? this.state.miembrosSantificados
                : 0,
            miembrosBautizadosEs:
              this.state.miembrosBautizadosEs !== "" &&
              this.state.miembrosBautizadosEs !== null
                ? this.state.miembrosBautizadosEs
                : 0,
            promedioAsistenciaAdultos:
              this.state.promedioAsistenciaAdultos !== "" &&
              this.state.promedioAsistenciaAdultos !== null
                ? this.state.promedioAsistenciaAdultos
                : 0,
            promedioAsistenciaNiJov:
              this.state.promedioAsistenciaNiJov !== "" &&
              this.state.promedioAsistenciaNiJov !== null
                ? this.state.promedioAsistenciaNiJov
                : 0,
            ministerioAlcanceSemanal: parseInt(
              this.state.ministerioAlcanceSemanal
            ),
            santaCena: parseInt(this.state.santaCena),
            lavatorios: parseInt(this.state.lavatorios),
            diezmosIncluidosInforme:
              this.state.diezmosIncluidosInforme !== "" &&
              this.state.diezmosIncluidosInforme !== null
                ? this.state.diezmosIncluidosInforme
                : 0,
          },
        };
        this.setState({
          loading: true,
        });
        Alerts.loading_reload(true);
        Request.POST("informe/ministerial/mensual", data).then((result) => {
          Alerts.loading_reload(false);
          this.setState({
            loading: false,
          });
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
                estado: 2,
              },
              detalle: {
                mensajes:
                  this.state.mensajes !== "" && this.state.mensajes !== null
                    ? this.state.mensajes
                    : 0,
                convertidos:
                  this.state.convertidos !== "" &&
                  this.state.convertidos !== null
                    ? this.state.convertidos
                    : 0,
                santificados:
                  this.state.santificados !== "" &&
                  this.state.santificados !== null
                    ? this.state.santificados
                    : 0,
                bautismosAgua:
                  this.state.bautismosAgua !== "" &&
                  this.state.bautismosAgua !== null
                    ? this.state.bautismosAgua
                    : 0,
                bautismosEs:
                  this.state.bautismosEs !== "" &&
                  this.state.bautismosEs !== null
                    ? this.state.bautismosEs
                    : 0,
                agregados:
                  this.state.agregados !== "" && this.state.agregados !== null
                    ? this.state.agregados
                    : 0,
                hogaresMiembrosV:
                  this.state.hogaresMiembrosV !== "" &&
                  this.state.hogaresMiembrosV !== null
                    ? this.state.hogaresMiembrosV
                    : 0,
                hogaresProspectosV:
                  this.state.hogaresProspectosV !== "" &&
                  this.state.hogaresProspectosV !== null
                    ? this.state.hogaresProspectosV
                    : 0,
                diezmoRecibido:
                  this.state.diezmoRecibido !== "" &&
                  this.state.diezmoRecibido !== null
                    ? this.state.diezmoRecibido
                    : 0.0,
                diezmoPagado:
                  this.state.diezmoPagado !== "" &&
                  this.state.diezmoPagado !== null
                    ? this.state.diezmoPagado
                    : 0.0,
                ofrendaRecibida:
                  this.state.ofrendaRecibida !== "" &&
                  this.state.ofrendaRecibida !== null
                    ? this.state.ofrendaRecibida
                    : 0.0,
                gastosMinisteriales:
                  this.state.gastosMinisteriales !== "" &&
                  this.state.gastosMinisteriales !== null
                    ? this.state.gastosMinisteriales
                    : 0.0,
                actividadesOracion:
                  this.state.actividadesOracion !== "" &&
                  this.state.actividadesOracion !== null
                    ? this.state.actividadesOracion
                    : 0,
                vidaOracion: parseInt(this.state.vidaOracion),
                actividadesMisiones:
                  this.state.actividadesMisiones !== "" &&
                  this.state.actividadesMisiones !== null
                    ? this.state.actividadesMisiones
                    : 0,
                actividadesLiderazgo:
                  this.state.actividadesLiderazgo !== "" &&
                  this.state.actividadesLiderazgo !== null
                    ? this.state.actividadesLiderazgo
                    : 0,
                lideresInvolucrados:
                  this.state.lideresInvolucrados !== "" &&
                  this.state.lideresInvolucrados !== null
                    ? this.state.lideresInvolucrados
                    : 0,
                mejoraMinisterial: parseInt(this.state.mejoraMinisterial),
                miembrosActivos:
                  this.state.miembrosActivos !== "" &&
                  this.state.miembrosActivos !== null
                    ? this.state.miembrosActivos
                    : 0,
                miembrosSalvos:
                  this.state.miembrosSalvos !== "" &&
                  this.state.miembrosSalvos !== null
                    ? this.state.miembrosSalvos
                    : 0,
                miembrosSantificados:
                  this.state.miembrosSantificados !== "" &&
                  this.state.miembrosSantificados !== null
                    ? this.state.miembrosSantificados
                    : 0,
                miembrosBautizadosEs:
                  this.state.miembrosBautizadosEs !== "" &&
                  this.state.miembrosBautizadosEs !== null
                    ? this.state.miembrosBautizadosEs
                    : 0,
                promedioAsistenciaAdultos:
                  this.state.promedioAsistenciaAdultos !== "" &&
                  this.state.promedioAsistenciaAdultos !== null
                    ? this.state.promedioAsistenciaAdultos
                    : 0,
                promedioAsistenciaNiJov:
                  this.state.promedioAsistenciaNiJov !== "" &&
                  this.state.promedioAsistenciaNiJov !== null
                    ? this.state.promedioAsistenciaNiJov
                    : 0,
                ministerioAlcanceSemanal: parseInt(
                  this.state.ministerioAlcanceSemanal
                ),
                santaCena: parseInt(this.state.santaCena),
                lavatorios: parseInt(this.state.lavatorios),
                diezmosIncluidosInforme:
                  this.state.diezmosIncluidosInforme !== "" &&
                  this.state.diezmosIncluidosInforme !== null
                    ? this.state.diezmosIncluidosInforme
                    : 0,
              },
            };
            this.setState({
              loading: true,
            });
            Alerts.loading_reload(true);
            Request.POST("informe/ministerial/mensual", data).then((result) => {
              Alerts.loading_reload(false);
              this.setState({
                loading: false,
              });
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
                <h3 className="card-title">Área de Responsabilidad</h3>
                <hr />
                <div className="row">
                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Mensajes:</label>
                    <input
                      type="text"
                      id="mensajes"
                      value={this.state.mensajes}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Mensajes Impartidos"
                    />
                  </div>

                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Convertidos:</label>
                    <input
                      type="text"
                      id="convertidos"
                      value={this.state.convertidos}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Convertidos"
                    />
                  </div>
                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Santificados:</label>
                    <input
                      type="text"
                      id="santificados"
                      value={this.state.santificados}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Santificados"
                    />
                  </div>
                  <div
                    className="col-lg-3 form-group"
                    title="Bautizados con el Espíritu Santo"
                  >
                    <label htmlFor="">Bautizados E.S:</label>
                    <input
                      type="text"
                      id="bautismosEs"
                      value={this.state.bautismosEs}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Bautizados Espírito Santo"
                    />
                  </div>
                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Añadidos a la Iglesia:</label>
                    <input
                      type="text"
                      id="agregados"
                      value={this.state.agregados}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Añadidos"
                    />
                  </div>
                  <div
                    className="col-lg-3 form-group"
                    title="Bautizados en agua"
                  >
                    <label htmlFor="">Bautizados E.A:</label>
                    <input
                      type="text"
                      id="bautismosAgua"
                      value={this.state.bautismosAgua}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Bautizados en Agua"
                    />
                  </div>
                  <div
                    className="col-lg-3 form-group"
                    title="Hogares de miembros visitados"
                  >
                    <label htmlFor="" title="Hogares de miembros visitados">
                      Hogares M. Visitados:
                    </label>
                    <input
                      type="text"
                      title="Hogares de miembros visitados"
                      id="hogaresMiembrosV"
                      value={this.state.hogaresMiembrosV}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="H. Miembros Visitados"
                    />
                  </div>
                  <div
                    className="col-lg-3 form-group"
                    title="Hogares de prospectos visitados"
                  >
                    <label htmlFor="" title="Hogares de prospectos visitados">
                      Hogares P. Visitados:
                    </label>
                    <input
                      type="text"
                      title="Hogares de prospectos visitados"
                      id="hogaresProspectosV"
                      value={this.state.hogaresProspectosV}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="H. Prospectos Visitados"
                    />
                  </div>
                </div>
                <h3 className="card-title">Área de Mayordomía</h3>
                <hr />
                <div className="row">
                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Diezmos recibidos:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="diezmoRecibido"
                        value={this.state.diezmoRecibido}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="Diezmo Recibido"
                      />
                    </div>
                  </div>
                  <div
                    className="col-lg-3 form-group"
                    title="Ofrenda recibida por el pastor"
                  >
                    <label htmlFor="" title="Ofrenda recibida por el pastor">
                      Ofrenda recibida por P.:
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        title="Ofrenda recibida por el pastor"
                        type="number"
                        id="ofrendaRecibida"
                        value={this.state.ofrendaRecibida}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="Ofrenda recibida"
                      />
                    </div>
                  </div>

                  <div
                    className="col-lg-3 form-group"
                    title="Diezmos pagados en la Iglesia"
                  >
                    <label htmlFor="" title="Diezmos pagados en la Iglesia">
                      Diezmos pagados en Ig.:
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        title="Diezmos pagados en la Iglesia"
                        type="number"
                        id="diezmoPagado"
                        value={this.state.diezmoPagado}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="Diezmo pagado"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Gastos en el ministerio:</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        type="number"
                        id="gastosMinisteriales"
                        value={this.state.gastosMinisteriales}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="Gastos Ministerio"
                      />
                    </div>
                  </div>
                  <div
                    className="col-lg-3 form-group"
                    title="Diezmos incluidos en el informe"
                  >
                    <label htmlFor="" title="Diezmos incluidos en el informe">
                      Diezmos inc. en informe:
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                      </div>
                      <input
                        title="Diezmos incluidos en el informe"
                        type="number"
                        id="diezmosIncluidosInforme"
                        value={this.state.diezmosIncluidosInforme}
                        className="form-control"
                        onChange={this.handleChangeNumber}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        placeholder="Diezmos en informe"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="card-title">
                  Información General y Valores Centrales
                </h3>
                <hr />
                <div className="row">
                  <div
                    className="col-lg-4 form-group"
                    title="Actividades para promover la oración"
                  >
                    <label
                      htmlFor=""
                      title="Actividades para promover la oración"
                    >
                      Act. para Prom. Oración:
                    </label>
                    <input
                      type="text"
                      title="Actividades para promover la oración"
                      id="actividadesOracion"
                      value={this.state.actividadesOracion}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Cantidad de actividades oración"
                    />
                  </div>

                  <div
                    className="col-lg-4 form-group"
                    title="Actividades para promover misiones, alcances y organización de la Iglesia"
                  >
                    <label
                      htmlFor=""
                      title="Actividades para promover misiones, alcances y organización de la Iglesia"
                    >
                      Act. misiones, alcance y Org.:
                    </label>
                    <input
                      title="Actividades para promover misiones, alcances y organización de la Iglesia"
                      type="text"
                      id="actividadesMisiones"
                      value={this.state.actividadesMisiones}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Cantidad de actividades misiones"
                    />
                  </div>
                  <div className="col-lg-4 form-group ">
                    <input
                      type="checkbox"
                      className="form-check-input filled-in chk-col-light-blue"
                      id="vidaOracion"
                      onChange={() => {
                        if (document.getElementById("vidaOracion").checked) {
                          this.setState({
                            vidaOracion: 1,
                          });
                        } else {
                          this.setState({
                            vidaOracion: 0,
                          });
                        }
                      }}
                      value={this.state.vidaOracion}
                    />
                    <label
                      className="form-check-label mt-4"
                      htmlFor="vidaOracion"
                    >
                      Goza vida de oración y adoración consistente
                    </label>
                  </div>
                </div>
                <h3 className="card-title">Desarrollo de liderazgo</h3>
                <hr />
                <div className="row">
                  <div
                    className="col-lg-4 form-group"
                    title="Actividades para promover el desarrollo de líderes"
                  >
                    <label
                      htmlFor=""
                      title="Actividades para promover el desarrollo de líderes"
                    >
                      Act. para desarrollo de líderes:
                    </label>
                    <input
                      title="Actividades para promover el desarrollo de líderes"
                      type="text"
                      id="actividadesLiderazgo"
                      value={this.state.actividadesLiderazgo}
                      onFocus={this.handleFocus}
                      className="form-control"
                      onChange={this.handleInputChange}
                      placeholder="Cantidad de actividades liderazgo"
                    />
                  </div>
                  <div
                    className="col-lg-4 form-group"
                    title="Líderes participantes en actividades"
                  >
                    <label
                      htmlFor=""
                      title="Líderes participantes en actividades"
                    >
                      Líderes participantes en Act.:
                    </label>
                    <input
                      title="Líderes participantes en actividades"
                      type="text"
                      id="lideresInvolucrados"
                      value={this.state.lideresInvolucrados}
                      onFocus={this.handleFocus}
                      className="form-control"
                      onChange={this.handleInputChange}
                      placeholder="Cantidad de lideres participantes"
                    />
                  </div>
                  <div className="col-lg-4 form-group ">
                    <input
                      type="checkbox"
                      className="form-check-input filled-in chk-col-light-blue"
                      id="mejoraMinisterial"
                      onChange={() => {
                        if (
                          document.getElementById("mejoraMinisterial").checked
                        ) {
                          this.setState({
                            mejoraMinisterial: 1,
                          });
                        } else {
                          this.setState({
                            mejoraMinisterial: 0,
                          });
                        }
                      }}
                      value={this.state.mejoraMinisterial}
                    />
                    <label
                      className="form-check-label mt-4"
                      htmlFor="mejoraMinisterial"
                    >
                      Continúa mejorando su ministerio
                    </label>
                  </div>
                </div>
                <h3 className="card-title">Área de Pastoral</h3>
                <hr />
                <div className="row">
                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Total Membresía:</label>

                    <input
                      type="number"
                      id="miembrosActivos"
                      value={this.state.miembrosActivos}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Membresía"
                    />
                  </div>
                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Miembros Salvos:</label>

                    <input
                      type="number"
                      id="miembrosSalvos"
                      value={this.state.miembrosSalvos}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Miembros Salvos"
                    />
                  </div>

                  <div className="col-lg-3 form-group">
                    <label htmlFor="">Miembros Santificados:</label>

                    <input
                      type="number"
                      id="miembrosSantificados"
                      value={this.state.miembrosSantificados}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Miembros Santificados"
                    />
                  </div>

                  <div
                    className="col-lg-3 form-group"
                    title="Miembros Bautizados por el Espírito Santo"
                  >
                    <label htmlFor="">Miembros Bautizados E.S:</label>

                    <input
                      type="number"
                      id="miembrosBautizadosEs"
                      value={this.state.miembrosBautizadosEs}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Miembros Bautizados E.S"
                    />
                  </div>
                  <div
                    className="col-lg-3 form-group"
                    title="Asistencia promedio adultos"
                  >
                    <label htmlFor="" title="Asistencia promedio adultos">
                      Asis. Promedio Adultos:
                    </label>

                    <input
                      title="Asistencia promedio adultos"
                      type="number"
                      id="promedioAsistenciaAdultos"
                      value={this.state.promedioAsistenciaAdultos}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Asistencia promedio adultos"
                    />
                  </div>

                  <div
                    className="col-lg-3 form-group"
                    title="Asistencia promedio Jóvenes y Niños"
                  >
                    <label
                      htmlFor=""
                      title="Asistencia promedio Jóvenes y Niños"
                    >
                      Asis. Prom. Jóv. y Niños:
                    </label>

                    <input
                      title="Asistencia promedio Jóvenes y Niños"
                      type="number"
                      id="promedioAsistenciaNiJov"
                      value={this.state.promedioAsistenciaNiJov}
                      className="form-control"
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocus}
                      placeholder="Asistencia promedio Jóvenes y Niños"
                    />
                  </div>
                  <div className="col-lg-3 form-group text-center">
                    <input
                      type="checkbox"
                      className="form-check-input filled-in chk-col-light-blue"
                      id="ministerioAlcanceSemanal"
                      onChange={() => {
                        if (
                          document.getElementById("ministerioAlcanceSemanal")
                            .checked
                        ) {
                          this.setState({
                            ministerioAlcanceSemanal: 1,
                          });
                        } else {
                          this.setState({
                            ministerioAlcanceSemanal: 0,
                          });
                        }
                      }}
                      value={this.state.ministerioAlcanceSemanal}
                    />
                    <label
                      className="form-check-label mt-4"
                      htmlFor="ministerioAlcanceSemanal"
                    >
                      Ministerio Semanal
                    </label>
                  </div>
                  <div className="col-lg-3 form-group text-center">
                    <input
                      type="checkbox"
                      className="form-check-input filled-in chk-col-light-blue"
                      id="santaCena"
                      onChange={() => {
                        if (document.getElementById("santaCena").checked) {
                          this.setState({
                            santaCena: 1,
                          });
                        } else {
                          this.setState({
                            santaCena: 0,
                          });
                        }
                      }}
                      value={this.state.santaCena}
                    />
                    <label
                      className="form-check-label mt-4"
                      htmlFor="santaCena"
                    >
                      Se realizó San Cena
                    </label>
                  </div>
                  <div className="col-lg-3 form-group text-center">
                    <input
                      type="checkbox"
                      className="form-check-input filled-in chk-col-light-blue"
                      id="lavatorios"
                      onChange={() => {
                        if (document.getElementById("lavatorios").checked) {
                          this.setState({
                            lavatorios: 1,
                          });
                        } else {
                          this.setState({
                            lavatorios: 0,
                          });
                        }
                      }}
                      value={this.state.lavatorios}
                    />
                    <label
                      className="form-check-label mt-4"
                      htmlFor="lavatorios"
                    >
                      Se realizó Lavarorio de Pies
                    </label>
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
