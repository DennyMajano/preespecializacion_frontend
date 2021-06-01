import React, { Component } from "react";
import LayoutPanelTable from "../../../components/layouts/panels/LayoutPanelTable";
import HTTP from "../../../helpers/HTTP";
import Encrypt from "../../../services/Encrypt";

export default class PresentacionInformes extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.state.usuario = Encrypt.getSession("codigo_persona");
  }

  inicial_state = {
    iglesias: [],
    usuario: "",
    cargadas: false,
  };
  componentDidMount() {
    this.getIglesias();
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
                    <div className="col-lg-3 mx-auto" key={element.codigo}>
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
                              // onClick={() => {
                              //   this.props.history.push(
                              //     `/presentacion_informes/iglesia/${element.codigo}`
                              //   );
                              // }}
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
      </div>
    );
  }
}
