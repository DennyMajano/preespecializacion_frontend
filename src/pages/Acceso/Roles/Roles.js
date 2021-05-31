import React, { Component } from "react";
import LayoutPanelTable from "../../../components/layouts/panels/LayoutPanelTable";
import TablaFilter from "../../../components/tablas/TablaFilter";
import { Menu, Item, Separator, contextMenu, IconFont } from "react-contexify";
import HTTP from "../../../helpers/HTTP";

export default class Roles extends Component {
  columns = [
    {
      dataField: "rol_id",
      text: "CÓDIGO",
      hidden: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "name",
      text: "NOMBRE MÓDULO",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-3">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "date",
      text: "FECHA REGISTRO",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent !== null) {
          return (
            <p>
              {cellContent
                .toLowerCase()
                .replace(/(?<= )[^\s]|^./g, (a) => a.toUpperCase())}
            </p>
          );
        } else {
          return <p className="text-center">N/A</p>;
        }
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "date_update",
      text: "FECHA ÚLT. ACTUALIZACIÓN",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent !== null) {
          return (
            <p>
              {cellContent
                .toLowerCase()
                .replace(/(?<= )[^\s]|^./g, (a) => a.toUpperCase())}
            </p>
          );
        } else {
          return <p className="text-center">N/A</p>;
        }
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
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
      },
    },
  ];
  desactivar = async ({ event, props }) => {
    const data = {
      code: props.id,
      status: 0,
    };
    HTTP.disable(data, "rol", "roles", "roles").then((result) => {
      this.refs.tabla.getData("roles/all");
    });
  };
  activar = async ({ event, props }) => {
    const data = {
      code: props.id,
      status: 1,
    };
    HTTP.disable(data, "rol", "roles", "roles").then((result) => {
      this.refs.tabla.getData("roles/all");
    });
  };
  update = ({ event, props }) => {
    this.props.history.push("/administracion/roles/update/" + props.id);
  };
  agregarModulos = ({ event, props }) => {
    this.props.history.push("/administracion/roles/asignacion/" + props.id);
  };
  rowEvents = {
    onContextMenu: (e, row, rowIndex) => {
      e.preventDefault();

      if (row.status === 1) {
        contextMenu.show({
          id: "menu_roles",
          event: e,
          props: {
            id: row.rol_id,
          },
        });
      } else {
        contextMenu.show({
          id: "menu_roles_disable",
          event: e,
          props: {
            id: row.rol_id,
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
          titulo="Administración de roles"
          rutacreate="/administracion/roles/new"
        >
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-12 form-group">
                <TablaFilter
                  ref="tabla"
                  ruta={"roles/all"}
                  rowEvents={this.rowEvents}
                  identificador={"rol_id"}
                  columns={this.columns}
                  titulo_tabla="Escriba el registro que desea buscar"
                />
                <Menu id={"menu_roles"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" /> ACTUALIZAR
                  </Item>
                  <Item onClick={this.agregarModulos}>
                    <IconFont className="fa fa-plus" /> ASIGNAR MÓDULOS
                  </Item>
                  <Separator />
                  <Item onClick={this.desactivar}>
                    <IconFont className="fa fa-close" />
                    DESACTIVAR
                  </Item>
                </Menu>
                <Menu id={"menu_roles_disable"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" /> ACTUALIZAR
                  </Item>
                  <Item onClick={this.agregarModulos}>
                    <IconFont className="fa fa-plus" /> ASIGNAR MÓDULOS
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
