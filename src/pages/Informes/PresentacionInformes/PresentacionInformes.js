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
                    <div class="col-lg-4">
                      <div class="card card-outline-info border border-dark">
                        <div class="card-header">
                          <h4 class="m-b-0 text-white">{element.iglesia}</h4>
                        </div>
                        <div class="card-body">
                          <h3 class="card-title">Información:</h3>
                          <div className="row">
                            <div className="col-lg-12 text-center">
                              <table className="table table-bordered">
                                <tbody>
                                  <tr>
                                    <td className="text-right">
                                      <h4>Código:</h4>
                                    </td>
                                    <td className="text-left">
                                      {element.codigo}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-right">
                                      <h4>Pastor:</h4>
                                    </td>
                                    <td className="text-left">
                                      {element.pastor}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-right">
                                      <h4>Departamento:</h4>
                                    </td>
                                    <td className="text-left">
                                      {element.departamento}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-right">
                                      <h4>Municipio:</h4>
                                    </td>
                                    <td className="text-left">
                                      {element.municipio}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-right">
                                      <h4>Cantón:</h4>
                                    </td>
                                    <td className="text-left">
                                      {element.canton}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-right">
                                      <h4>Zona:</h4>
                                    </td>
                                    <td className="text-left">
                                      {element.zona}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-right">
                                      <h4>Distrito:</h4>
                                    </td>
                                    <td className="text-left">
                                      {element.distrito}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer text-center">
                          <button
                            onClick={() => {
                              this.props.history.push(
                                `/presentacion_informes/iglesia/${element.codigo}`
                              );
                            }}
                            class="btn btn-inverse"
                          >
                            Presentar Informes
                          </button>
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
