import React, { Component } from "react";
import LayoutPanelTable from "../../../components/layouts/panels/LayoutPanelTable";
import TablaFilter from "../../../components/tablas/TablaFilter";
import { Menu, Item, Separator, contextMenu, IconFont } from "react-contexify";
import HTTP from "../../../helpers/HTTP";

export default class Modulos extends Component {
  columns = [
    {
      dataField: "modulo_id",
      text: "CÓDIGO",
      hidden: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      }
    },
    {
      dataField: "name",
      text: "NOMBRE MÓDULO",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      }
    },
    {
      dataField: "padre",
      text: "MÓDULO PRINCIPAL",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent !== null) {
          return <p>{cellContent.toUpperCase()}</p>;
        } else {
          return <p>N/A</p>;
        }
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      }
    },
    {
      dataField: "is_principal",
      text: "TIPO DE MÓDULO",
      sort: true,
      formatter: (cellContent, row) => {
        if (row.is_principal === 1) {
          return (
            <p className="text-center">
              <span className="label label-info"> PRINCIPAL</span>
            </p>
          );
        } else {
          return (
            <p className="text-center">
              <span className="label label-light-info">SECUNDARIO</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      }
    },
    {
      dataField: "status",
      text: "ESTADO",
      sort: true,
      formatter: (cellContent, row) => {
        if (row.status === 1) {
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
        return { width: "20%", textAlign: "center" };
      }
    }
  ];
  desactivar = async ({ event, props }) => {
    const data = {
      code: props.id,
      status: 0
    };
    HTTP.disable(data, "módulo", "módulos", "modulos").then(result => {
      this.refs.tabla.getData("modulos/all");
    });
  };
  activar = async ({ event, props }) => {
    const data = {
      code: props.id,
      status: 1
    };
    HTTP.enable(data, "módulo", "módulos", "modulos").then(result => {
      this.refs.tabla.getData("modulos/all");
    });
  };
  update = ({ event, props }) => {
    this.props.history.push("/administracion/modulos/update/" + props.id);
  };
  rowEvents = {
    onContextMenu: (e, row, rowIndex) => {
      e.preventDefault();

      if (row.status === 1) {
        contextMenu.show({
          id: "menu_modulos",
          event: e,
          props: {
            id: row.modulo_id
          }
        });
      } else {
        contextMenu.show({
          id: "menu_modulos_disable",
          event: e,
          props: {
            id: row.modulo_id
          }
        });
      }
    }
  };
  componentDidMount() {
    document.getElementById("buscar").focus();
  }
  render() {
    return (
      <React.Fragment>
        <LayoutPanelTable
          titulo="Administración de módulos"
          rutacreate="/administracion/modulos/new"
        >
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-12 form-group">
                <TablaFilter
                  ref="tabla"
                  ruta={"modulos/all"}
                  rowEvents={this.rowEvents}
                  identificador={"modulo_id"}
                  columns={this.columns}
                  titulo_tabla="Escriba el registro que desea buscar"
                />
                <Menu id={"menu_modulos"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" /> ACTUALIZAR
                  </Item>
                  <Separator />
                  <Item onClick={this.desactivar}>
                    <IconFont className="fa fa-close" />
                    DESACTIVAR
                  </Item>
                </Menu>
                <Menu id={"menu_modulos_disable"}>
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
      </React.Fragment>
    );
  }
}
