import React, { Component } from "react";
import LayoutPanelTable from "../../../components/layouts/panels/LayoutPanelTable";
import HTTP from "../../../helpers/HTTP";
import Encrypt from "../../../services/Encrypt";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import LayoutPanelEmpty from "../../../components/layouts/panels/LayoutPanelEmpty";
import Alerts from "../../../services/Alerts";

export default class PresentacionInformes extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.state.usuario = Encrypt.getSession("codigo_persona");
    this.ActionModalDetalle = this.ActionModalDetalle.bind(this);
  }

  inicial_state = {
    iglesias: [],
    iglesia_seleccionada: [],
    usuario: "",
    cargadas: false,
    modal_detalle: false,
  };
  componentDidMount() {
    this.getIglesias();
  }
  ActionModalDetalle(flag = true) {
    this.setState((prevState) => ({
      modal_detalle: !prevState.modal_detalle,
    }));
    if (flag) {
    } else {
      this.setState({
        iglesia_seleccionada: null,
      });
    }
  }
  getIglesias() {
    HTTP.findById(this.state.usuario, "usuarios/iglesias_asignadas").then(
      (result) => {
        this.setState({ cargadas: true });
        if (result !== false) {
          console.log(result);
          this.setState({ iglesias: result });
        }
      }
    );
  }

  getIglesia(id) {
    Alerts.loading_reload(true);
    HTTP.findById(id, "iglesias/detalle").then(async (result) => {
      Alerts.loading_reload(false);

      if (result !== false) {
        await this.setState({ iglesia_seleccionada: result });
        this.ActionModalDetalle();
      }
    });
  }
  render() {
    return (
      <div>
        <LayoutPanelTable
          titulo="Presentación de informes"
          titulo_panel="Iglesias Asignadas"
        >
          {this.state.cargadas === true ? (
            <div className="row">
              {this.state.iglesias.length > 0 ? (
                this.state.iglesias.map((element) => {
                  return (
                    <div
                      className="col-lg-4 col-md-4 col-sm-6 col-xs-12 mx-auto"
                      key={element.codigo}
                    >
                      <div className="card  border border-dark">
                        <div className="card-header">
                          <h4 className="m-b-0 text-black">
                            <strong>{element.iglesia.toUpperCase()}</strong>
                          </h4>
                        </div>
                        <div className="card-body">
                          <h3 className="card-title text-center">
                            <strong>Pastor</strong>:{" "}
                            {element.pastor !== "" && element.pastor !== null
                              ? element.pastor
                              : "SIN PASTOR NOMBRADO"}
                          </h3>
                          {element.cantidad_informes_pendientes > 0 ? (
                            <div className="text-center">
                              {" "}
                              <span className=" text-danger">
                                Pendiente de enviar:{" "}
                                {element.cantidad_informes_pendientes} Informes
                              </span>
                            </div>
                          ) : (
                            <div className="text-center">
                              {" "}
                              <span className="text-info">
                                No hay informes pendientes de envío
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="card-footer text-center">
                          <div className="btn-group-vertical">
                            <button
                              onClick={this.getIglesia.bind(
                                this,
                                element.codigo
                              )}
                              className="btn btn-secondary mb-2"
                            >
                              <i className="fa fa-clipboard mr-1"></i> Ver
                              Detalle Iglesia
                            </button>
                            <button
                              onClick={() => {
                                this.props.history.push(
                                  `/presentacion_informes/iglesia/${element.codigo}`
                                );
                              }}
                              className="btn btn-outline-info "
                            >
                              <i className="fa fa-file-o mr-1"></i> Presentar
                              Informes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center">
                  <h1>NO TIENE IGLESIAS ASIGNADAS</h1>
                  <span>
                    Si concidera que fue un error, comuniquese con el
                    administrador
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </LayoutPanelTable>

        <Modal
          size="lg"
          style={{ maxWidth: "1600px", width: "75%" }}
          isOpen={this.state.modal_detalle}
        >
          <ModalHeader
            toggle={this.ActionModalDetalle.bind(
              this.ActionModalDetalle,
              false
            )}
          >
            Información de Iglesia
          </ModalHeader>
          <ModalBody>
            <h3 className="card-title">Información General</h3>
            <hr />
            <div className="row">
              <div className="col-lg-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Pastor</th>
                      <th>Teléfono</th>
                      <th>Tipo Iglesia</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.codigo
                          : ""}
                      </td>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.nombre
                          : ""}
                      </td>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.pastor !== "" &&
                            this.state.iglesia_seleccionada.pastor !== null
                            ? this.state.iglesia_seleccionada.pastor
                            : "Sin Nombramiento"
                          : null}
                      </td>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.telefono !== "" &&
                            this.state.iglesia_seleccionada.telefono !== null
                            ? this.state.iglesia_seleccionada.telefono
                            : "No Registrado"
                          : null}
                      </td>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.tipo_iglesia
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="card-title">Información Organizacional</h3>
            <hr />
            <div className="row">
              <div className="col-lg-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Región</th>
                      <th>Zona</th>
                      <th>Distrito</th>
                      <th>Fecha de Afiliación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {/* {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.codigo
                          : ""} */}
                      </td>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.zona
                          : ""}
                      </td>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.distrito
                          : ""}
                      </td>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada
                              .fecha_ordenamiento !== "" &&
                            this.state.iglesia_seleccionada
                              .fecha_ordenamiento !== null
                            ? this.state.iglesia_seleccionada.fecha_ordenamiento
                            : "Sin Fecha establecida"
                          : null}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <h3 className="card-title">Información Geográfica</h3>
            <hr />
            <div className="row">
              <div className="col-lg-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Departamento</th>
                      <th>Municipio</th>
                      <th>Cantón</th>
                      <th>Dirección</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.departamento
                          : ""}
                      </td>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.municipio
                          : ""}
                      </td>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.canton !== "" &&
                            this.state.iglesia_seleccionada.canton !== null
                            ? this.state.iglesia_seleccionada.canton
                            : "N/A"
                          : null}
                      </td>
                      <td>
                        {this.state.iglesia_seleccionada !== null
                          ? this.state.iglesia_seleccionada.direccion
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="text-right"></ModalFooter>
        </Modal>
      </div>
    );
  }
}
