import React, { Component } from "react";
import LayoutPanelTable from "../../components/layouts/panels/LayoutPanelTable";
import TablaFilter from "../../components/tablas/TablaFilter";
import { Menu, Item, Separator, contextMenu, IconFont } from "react-contexify";
import HTTP from "../../helpers/HTTP";
import PersonasBuscadorModal from "../../components/Personas/PersonasBuscadorModal";
export default class Pastores extends Component {
  constructor(props) {
    super(props);
    this.setState({
      persona: "q",
    });
    this.setPersona = this.setPersona.bind(this);
  }

  setPersona(data) {
    this.setState({ persona: data });
  }
  columns = [
    {
      dataField: "id",
      text: "ID",
      hidden: false,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { textAlign: "center" };
      },
    },
    {
      dataField: "codigo",
      text: "CÓDIGO",
      formatter: (cellContent, row) => {
        return <p className="ml-2">{cellContent}</p>;
      },
      headerStyle: () => {
        return { textAlign: "center" };
      },
    },
    {
      dataField: "nombres",
      text: "Nombre",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-2">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return {textAlign: "center" };
      },
    },
    {
      dataField: "apellidos",
      text: "Apellidos",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-2">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return {textAlign: "center" };
      },
    },
    {
      dataField: "nivel_academico",
      text: "NIVEL ACADÉMICO",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-2">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { textAlign: "center" };
      },
    },
    {
      dataField: "nivel_pastoral",
      text: "NIVEL PASTORAL",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-2 text-center">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { textAlign: "center" };
      },
    },
    {
      dataField: "status",
      text: "ESTADO",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent === 0) {
            return (
                <p className="text-center">
                  <span className="label label-light-danger">INACTIVO</span>
                </p>
              );
        }
        else if (cellContent === 1) {
          return (
            <p className="text-center">
              <span className="label label-light-info">ACTIVO</span>
            </p>
          );
        }
        else if (cellContent === 2) {
            return (
              <p className="text-center">
                <span className="label label-light-info">RETIRADO</span>
              </p>
            );
          } 
        else {
          return (
            <p className="text-center">
              <span className="label label-light-info">PERMISO</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return {textAlign: "center" };
      },
    },
    {
      dataField: "condicion",
      text: "CONDICIÓN",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent === 1) {
          return (
            <p className="text-center">
              <span className="label label-light-info"> ACTIVO</span>
            </p>
          );
        } else {
          return (
            <p className="text-center">
              <span className="label label-light-danger">INACTIVO</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return { textAlign: "center" };
      },
    },
  ];
  desactivar = async ({ event, props }) => {
      
    const data = {
      code: props.codigo,
      status: 0,
    };
    console.log(data);
    HTTP.putRequest(
      data,
      "Pastor modificada",
      "Error al modificar el pastor",
      "pastores/enable"
    ).then((result) => {
      this.refs.tabla.getData("pastores/all");
    });
  };
  activar = async ({ event, props }) => {
    const data = {
      code: props.codigo,
      status: 1,
    };
    HTTP.putRequest(
      data,
      "Pastor modificado",
      "Error al modificar el pastor",
      "pastores/enable"
    ).then((result) => {
      this.refs.tabla.getData("pastores/all");
    });
  };
  update = ({ event, props }) => {
    this.props.history.push("/recursos_humanos/pastores/update/" + props.id);
  };
  rowEvents = {
    onContextMenu: (e, row, rowIndex) => {
      e.preventDefault();
      console.log(row);
      if (row.condicion === 1) {
        contextMenu.show({
          id: "menu_disable",
          event: e,
          props: {
            id: row.id,
            codigo: row.codigo,
          },
        });
      } 
      else {
        contextMenu.show({
          id: "menu_enable",
          event: e,
          props: {
            id: row.id,
            codigo: row.codigo,
          },
        });
      }
    },
  };
  componentDidMount() {
    document.getElementById("buscar").focus();
  }
  render() {
    return (
      <React.Fragment>
        <LayoutPanelTable
          titulo="Administración de pastores"
          rutacreate="/recursos_humanos/pastores/new"
        >
          <div className="form-body">
            <button
              type="button"
              onClick={() => {
                this.refs.per.toggle();
              }}
            >
              TEST PERSONAS
            </button>
            <div className="row p-t-20">
              <div className="col-12 form-group">
                <TablaFilter
                  ref="tabla"
                  ruta={"pastores/all"}
                  rowEvents={this.rowEvents}
                  identificador={"modulo_id"}
                  columns={this.columns}
                  titulo_tabla="Escriba el pastor que desea buscar"
                />
                <Menu id={"menu_disable"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" /> ACTUALIZAR
                  </Item>
                  <Separator />
                  <Item onClick={this.desactivar}>
                    <IconFont className="fa fa-close" />
                    DESACTIVAR
                  </Item>
                </Menu>
        
                <Menu id={"menu_enable"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" /> ACTUALIZAR
                  </Item>
                  <Separator />
                  <Item onClick={this.activar}>
                    <IconFont className="fa fa-check" />
                    ACTIVAR
                  </Item>
                </Menu>
              </div>
            </div>
          </div>
        </LayoutPanelTable>
        <PersonasBuscadorModal
          ref="per"
          getPersona={this.setPersona}
        ></PersonasBuscadorModal>
      </React.Fragment>
    );
  }
}
