import React, { Component } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import "react-contexify/dist/ReactContexify.min.css";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import hotkeys from "hotkeys-js";
import "./tabla.css";

const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total ml-3">
    Mostrando {from} a {to} de {size} Resultados
  </span>
);

const options = {
  paginationSize: 10,
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
  paginationTotalRenderer: customTotal,
  sizePerPageList: [
    {
      text: "10",
      value: 10,
    },
    {
      text: "20",
      value: 20,
    },
    {
      text: "30",
      value: 30,
    },
  ], // A numeric array is also available. the purpose of above example is custom the text
};

const MySearch = (props) => {
  let input;
  const handle = () => {
    props.onSearch(input.value);
  };
  return (
    <div className="row">
      <div className="col-sm-4">
        <label htmlFor="">{props.titulo_tabla} </label>
        <input
          className="form-control"
          // style={{ backgroundColor: 'pink' }}
          ref={(n) => (input = n)}
          type="text"
          placeholder="Buscar..."
          onChange={handle}
          id="buscar"
          autoComplete="off"
        />
      </div>
    </div>
  );
};
export default class TablaSearch extends Component {
  componentWillUnmount() {
    hotkeys.deleteScope("tabla");
  }
  componentDidMount() {
    document.getElementById("buscar").focus();
  }

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 table-responsive">
            {
              <ToolkitProvider
                keyField={this.props.identificador}
                bootstrap4
                data={this.props.data}
                columns={this.props.columns}
                defaultSorted={this.props.ordenar}
                search
              >
                {(props) => (
                  <div>
                    <div className="form-group mb-2">
                      {/* <SearchBar {...props.searchProps} placeholder="Buscar" className="buscar" /> */}
                      <MySearch
                        {...props.searchProps}
                        titulo_tabla={this.props.titulo_tabla}
                      />
                    </div>

                    <BootstrapTable
                      {...props.baseProps}
                      pagination={paginationFactory(options)}
                      rowEvents={this.props.rowEvents}
                      hover
                      noDataIndication={"No existen datos"}
                      classes="table color-bordered-table muted-bordered-table"
                      expandRow={this.props.expandRow}
                    />
                  </div>
                )}
              </ToolkitProvider>
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}
