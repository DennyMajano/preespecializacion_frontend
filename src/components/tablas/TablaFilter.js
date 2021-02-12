import React, { Component } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import "react-contexify/dist/ReactContexify.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Request from "../../services/Request";
import "./tabla.css";
const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    {" "}
    Mostrando {from} a {to} de {size} Resultados
  </span>
);

const link = "#";
const sizePerPageOptionRenderer = ({ text, page, onSizePerPageChange }) => (
  <li
    onMouseDown={(e) => {
      e.preventDefault();
      onSizePerPageChange(page);
    }}
    key={text}
    role="presentation"
    className="dropdown-item"
  >
    <a
      href={link}
      onClick={(e) => {
        e.preventDefault();
      }}
      tabIndex="-1"
      role="menuitem"
      data-page={page}
      onMouseDown={(e) => {
        e.preventDefault();
        onSizePerPageChange(page);
      }}
      style={{ color: "red" }}
    >
      {text}
    </a>
  </li>
);

const options = {
  paginationSize: 5,
  pageStartIndex: 1,
  alwaysShowAllBtns: true, // Always show next and previous button
  withFirstAndLast: true, // Hide the going to First and Last page button
  hideSizePerPage: false, // Hide the sizePerPage dropdown always
  hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
  prePageText: "Atras",
  nextPageText: "Sig.",
  nextPageTitle: "Página siguiente",
  prePageTitle: "Página anterior",
  firstPageTitle: "Primera Página",
  lastPageTitle: "Última Página",

  firstPageText: "<<<",

  lastPageText: ">>>",
  showTotal: true,
  disablePageTitle: true,
  paginationTotalRenderer: customTotal,

  sizePerPageList: [
    {
      text: "5",
      value: 5,
    },
    {
      text: "10",
      value: 10,
    },
    {
      text: "20",
      value: 20,
    },
  ],
  sizePerPageOptionRenderer,
};

export default class TablaFilter extends Component {
  constructor(props) {
    super(props);

    this.state.buscador = this.props.buscador === false ? false : true;
  }

  state = {
    buscar: "",
    data: [],
    mensaje: "NO EXISTEN DATOS",
    busqueda_anterior: "",
    buscador: "",
  };
  timer = null;

  componentDidMount() {
    if (this.props.objectname) {
      this.getDataObject(
        this.props.ruta,
        this.state.buscar,
        this.props.objectname
      );
    } else {
      if (this.props.ruta !== "") {
        this.getData(this.props.ruta, this.state.buscar);
      }
    }
    if (this.state.buscador === true) {
      document.getElementById("buscar").focus();
    }

    // this.getDataAuto()
  }

  clear() {
    this.setState({ buscar: "" });

    this.componentDidMount();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  getDataAuto() {
    this.timer = setInterval(() => {
      if (this.state.buscar === "") {
        this.getData(this.props.ruta);
      }

      console.log("TESt");
    }, 2000);
  }
  onKeyUpBuscar(ruta, parametro) {
    clearTimeout(this.timer);

    if (this.props.objectname) {
      if (this.state.buscar !== "") {
        if (this.state.buscar !== this.state.busqueda_anterior) {
          this.timer = setTimeout(() => {
            this.setState({
              data: [],
              mensaje: <i className="fa fa-spinner fa-spin font-26"></i>,
            });
            Request.GET(ruta, parametro).then((result) => {
              if (result !== false) {
                if (result.status === 200) {
                  this.setState({
                    data: result.data[this.props.objectname],
                    busqueda_anterior: parametro,
                  });
                } else {
                  this.setState({
                    data: [],
                    mensaje: "NO EXISTEN DATOS",
                    busqueda_anterior: parametro,
                  });
                }
                //   console.log(result.data[0])
              }
            });
          }, 500);
        }
      } else {
        this.getDataObject(ruta, parametro, this.props.objectname);
      }
    } else {
      if (this.state.buscar !== "") {
        if (this.state.buscar !== this.state.busqueda_anterior) {
          this.timer = setTimeout(() => {
            this.setState({
              data: [],
              mensaje: <i className="fa fa-spinner fa-spin font-26"></i>,
            });
            Request.GET(ruta, parametro).then((result) => {
              if (result !== false) {
                if (result.status === 200) {
                  this.setState({
                    data: result.data,
                    busqueda_anterior: parametro,
                  });

                  if (result.data.length > 0) {
                    this.setState({
                      data: result.data,
                      busqueda_anterior: parametro,
                    });
                  } else {
                    this.setState({
                      data: [],
                      busqueda_anterior: parametro,
                      mensaje: "NO EXISTEN DATOS",
                    });
                  }
                } else {
                  this.setState({
                    data: [],
                    mensaje: "NO EXISTEN DATOS",
                    busqueda_anterior: parametro,
                  });
                }
                //   console.log(result.data[0])
              }
            });
          }, 500);
        }
      } else {
        this.getData(ruta, parametro);
      }
    }

    // clearTimeout(timer);
  }

  onInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;

    this.setState({ [idComponente]: valorComponente });
  };
  getData(ruta, parametro = "") {
    this.setState({
      mensaje: <i className="fa fa-spinner fa-spin font-26"></i>,
    });
    Request.GET(ruta, parametro).then((result) => {
      if (result !== false) {
        if (result.status === 200 || result.status === 201) {
          if (result.data.length > 0) {
            this.setState({
              data: result.data,
            });
          } else {
            this.setState({
              data: [],
              mensaje: "NO EXISTEN DATOS",
            });
          }
        } else {
          this.setState({
            data: [],
            mensaje: "NO EXISTEN DATOS",
          });
        }
        //   console.log(result.data[0])
      }
    });
  }

  getDataObject(ruta, parametro = "", objetoname) {
    this.setState({
      mensaje: <i className="fa fa-spinner fa-spin font-26"></i>,
    });
    Request.GET(ruta, parametro).then((result) => {
      if (result !== false) {
        if (result.status === 200) {
          this.setState({
            data: result.data[objetoname],
          });
        } else {
          this.setState({
            data: [],
            mensaje: <div>NO EXISTEN DATOS</div>,
          });
        }
        //   console.log(result.data[0])
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.buscador === true ? (
          <div className="row">
            <div className="col-lg-4 col-md-5 col-sm-12 mb-1">
              <label htmlFor="">{this.props.titulo_tabla}:</label>
              <input
                className="form-control"
                type="text"
                placeholder="Buscar..."
                onKeyUp={this.onKeyUpBuscar.bind(
                  this,
                  this.props.ruta,
                  this.state.buscar
                )}
                onChange={this.onInputChange}
                value={this.state.buscar}
                // onBlur={() => {
                //     this.setState({ buscar: "" })
                //     this.getData(this.props.ruta)
                // }}
                autoComplete="off"
                id="buscar"
              />
            </div>
            <div className="col-8 text-right mt-5">{this.props.tools}</div>

            <div className="col-12">
              <hr></hr>
            </div>
          </div>
        ) : null}
        <div className="row">
          <div className="col-12 table-responsive">
            <BootstrapTable
              keyField={this.props.identificador}
              bootstrap4
              data={this.state.data}
              columns={this.props.columns}
              pagination={paginationFactory(options)}
              rowEvents={this.props.rowEvents}
              hover
              condensed
              noDataIndication={this.state.mensaje}
              rowStyle={this.props.estilos}
              expandRow={this.props.expand}
              rowClasses={this.props.rowClasses}
              selectRow={this.props.selectRow}
              classes="table color-bordered-table info-bordered-table"
              bordered={true}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
