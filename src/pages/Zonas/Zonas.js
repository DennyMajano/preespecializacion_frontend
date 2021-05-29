import React, { Component } from "react";
import LayoutPanelTable from "../../components/layouts/panels/LayoutPanelTable";
import TablaFilter from "../../components/tablas/TablaFilter";
import { Menu, Item, Separator, contextMenu, IconFont } from "react-contexify";
import HTTP from "../../helpers/HTTP";

export default class Zonas extends Component {
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
        }
      },
    {
      dataField: "codigo",
      text: "CÓDIGO",
      hidden: false,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      }
    },
    {
      dataField: "nombre",
      text: "NOMBRE ZONA",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-3">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      }
    },
    // {
    //   dataField: "date",
    //   text: "FECHA REGISTRO",
    //   sort: true,
    //   formatter: (cellContent, row) => {
    //     if (cellContent !== null) {
    //       return (
    //         <p>
    //           {cellContent
    //             .toLowerCase()
    //             .replace(/(?<= )[^\s]|^./g, a => a.toUpperCase())}
    //         </p>
    //       );
    //     } else {
    //       return <p className="text-center">N/A</p>;
    //     }
    //   },
    //   headerStyle: () => {
    //     return { width: "20%", textAlign: "center" };
    //   }
    // },
    // {
    //   dataField: "date_update",
    //   text: "FECHA ÚLT. ACTUALIZACIÓN",
    //   sort: true,
    //   formatter: (cellContent, row) => {
    //     if (cellContent !== null) {
    //       return (
    //         <p>
    //           {cellContent
    //             .toLowerCase()
    //             .replace(/(?<= )[^\s]|^./g, a => a.toUpperCase())}
    //         </p>
    //       );
    //     } else {
    //       return <p className="text-center">N/A</p>;
    //     }
    //   },
    //   headerStyle: () => {
    //     return { width: "20%", textAlign: "center" };
    //   }
    // },
    {
      dataField: "condicion",
      text: "ESTADO",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent === 1) {
          return (
            <p className="text-center">
              <span className="label label-light-info"> ACTIVA</span>
            </p>
          );
        } else {
          return (
            <p className="text-center">
              <span className="label label-light-danger">INACTIVA</span>
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
  
    HTTP.disable(data, "zona", "zonas", "zonas").then(result => {
    

      this.refs.tabla.getData("zonas/all");
    });
  };
  activar = async ({ event, props }) => {
    const data = {
      code: props.id,
      status: 1
    };
   

    HTTP.enable(data, "zona", "zonas", "zonas").then(result => {
    
      this.refs.tabla.getData("zonas/all");
    });
  };
  update = ({ event, props }) => {
    this.props.history.push("/organizacion/zonas/update/" + props.id);
  };
  agregarDepartamentos = ({ event, props }) => {
    this.props.history.push("/organizacion/zonas/asignacion/" + props.id);
  };
  rowEvents = {
    onContextMenu: (e, row, rowIndex) => {
      e.preventDefault();

      if (row.condicion === 1) {
        contextMenu.show({
          id: "menu",
          event: e,
          props: {
            id: row.id
          }
        });
      } else {
        contextMenu.show({
          id: "menu_disable",
          event: e,
          props: {
            id: row.id
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
          titulo="Administración de zonas"
          rutacreate="/organizacion/zonas/new"
        >
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-12 form-group">
                <TablaFilter
                  ref="tabla"
                  ruta={"zonas/all"}
                  rowEvents={this.rowEvents}
                  identificador={"id"}
                  columns={this.columns}
                  titulo_tabla="Escriba el registro que desea buscar"
                />
                <Menu id={"menu"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" /> ACTUALIZAR
                  </Item>
                  <Item onClick={this.agregarDepartamentos}>
                    <IconFont className="fa fa-plus" /> ASIGNAR DEPARTAMENTOS
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
                  <Item onClick={this.agregarDepartamentos}>
                    <IconFont className="fa fa-plus" /> ASIGNAR DEPARTAMENTOS
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
