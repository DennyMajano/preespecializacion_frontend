import React, { Component } from "react";
import LayoutPanelTable from "../../components/layouts/panels/LayoutPanelTable";
import TablaFilter from "../../components/tablas/TablaFilter";
import { Menu, Item, Separator, contextMenu, IconFont } from "react-contexify";
import HTTP from "../../helpers/HTTP";

export default class MaestroInformes extends Component {
  columns = [
    {
      dataField: "id",
      text: "id",
      hidden: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },

    {
      dataField: "nombre",
      text: "Nombre Informe",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "tipo_informe",
      text: "Tipo",
      sort: true,
      formatter: (cellContent, row) => {
        return <p>{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },

    {
      dataField: "condicion",
      text: "Estado",
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
        return { width: "20%", textAlign: "center" };
      },
    },
  ];
  desactivar = async ({ event, props }) => {
    const data = {
      code: props.id,
      status: 0,
    };
    HTTP.disable(
      data,
      "informe",
      "maestro de informes",
      "maestro_informe"
    ).then((result) => {
      this.refs.tabla.clear();
    });
  };
  activar = async ({ event, props }) => {
    const data = {
      code: props.id,
      status: 1,
    };
    HTTP.enable(data, "informe", "maestro de informes", "maestro_informe").then(
      (result) => {
        this.refs.tabla.clear();
      }
    );
  };
  update = ({ event, props }) => {
    this.props.history.push(
      "/organizacion/maestro_informes/update/" + props.id
    );
  };
  rowEvents = {
    onContextMenu: (e, row, rowIndex) => {
      e.preventDefault();

      if (row.condicion === 1) {
        contextMenu.show({
          id: "menu",
          event: e,
          props: {
            id: row.id,
          },
        });
      } else {
        contextMenu.show({
          id: "menu_disable",
          event: e,
          props: {
            id: row.id,
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
          titulo="Administración de maestro de informes"
          rutacreate="/organizacion/maestro_informes/new"
        >
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-12 form-group">
                <TablaFilter
                  ref="tabla"
                  ruta={"maestro_informe/all"}
                  rowEvents={this.rowEvents}
                  identificador={"id"}
                  columns={this.columns}
                  titulo_tabla="Escriba el registro que desea buscar"
                />
                <Menu id={"menu"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" /> ACTUALIZAR
                  </Item>
                  <Separator />
                  <Item onClick={this.desactivar}>
                    <IconFont className="fa fa-close" />
                    DESACTIVAR
                  </Item>
                </Menu>
                <Menu id={"menu_disable"}>
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
