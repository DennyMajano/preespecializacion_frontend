import React, { Component } from "react";
import LayoutPanelTable from "../../components/layouts/panels/LayoutPanelTable";
import TablaFilter from "../../components/tablas/TablaFilter";
import { Menu, Item, Separator, contextMenu, IconFont } from "react-contexify";
import HTTP from "../../helpers/HTTP";
import IglesiasModal from "../../components/Iglesias/IglesiasModal";

export default class Iglesias extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iglesia: [],
    };
  }
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
      dataField: "distrito",
      text: "distrito",
      hidden: true,
    },
    {
      dataField: "codigo",
      text: "Código",
      hidden: false,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "10%", textAlign: "center" };
      },
    },
    {
      dataField: "nombre",
      text: "Nombre Iglesia",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "departamento",
      text: "Departamento - Municipio",
      sort: true,
      formatter: (cellContent, row) => {
        return (
          <p className="text-center">{`${row.departamento.toUpperCase()} - ${row.municipio.toUpperCase()}`}</p>
        );
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "municipio",
      text: "Municipio",
      sort: true,
      hidden: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "10%", textAlign: "center" };
      },
    },
    {
      dataField: "tipo_iglesia",
      text: "Tipo",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "10%", textAlign: "center" };
      },
    },
    {
      dataField: "zona",
      text: "Zona - Distrito",
      sort: true,
      formatter: (cellContent, row) => {
        return (
          <p className="text-center">{`${row.zona.toUpperCase()} - ${row.distrito.toUpperCase()}`}</p>
        );
      },
      headerStyle: () => {
        return { width: "18%", textAlign: "center" };
      },
    },
    {
      dataField: "condicion",
      text: "ESTADO",
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
        return { width: "10%", textAlign: "center" };
      },
    },
  ];
  desactivar = async ({ event, props }) => {
    const data = {
      code: props.id,
      status: 0,
    };
    HTTP.disable(data, "Iglesia", "Iglesias", "iglesias").then((result) => {
      this.refs.tabla.clear();
    });
  };
  activar = async ({ event, props }) => {
    const data = {
      code: props.id,
      status: 1,
    };
    HTTP.enable(data, "Iglesia", "Iglesias", "iglesias").then((result) => {
      this.refs.tabla.clear();
    });
  };
  update = ({ event, props }) => {
    this.props.history.push("/organizacion/iglesias/update/" + props.id);
  };
  asignacion = ({ event, props }) => {
    this.props.history.push(
      "/organizacion/iglesias/asignacion_resportes/" + props.id
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
  setIglesia = (data) => {
    this.setState({ iglesia: data });
  };
  render() {
    return (
      <React.Fragment>
        <LayoutPanelTable
          titulo="Administración de distritos"
          rutacreate="/organizacion/iglesias/new"
        >
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-12 form-group">
                <button
                  type="button"
                  onClick={() => {
                    this.refs.modal_iglesia.ActionModal();
                  }}
                >
                  TEST MODAL USER
                </button>
                <TablaFilter
                  ref="tabla"
                  ruta={"iglesias/all"}
                  rowEvents={this.rowEvents}
                  identificador={"id"}
                  columns={this.columns}
                  titulo_tabla="Escriba el registro que desea buscar"
                />
                <Menu id={"menu"}>
                  <Item onClick={this.asignacion}>
                    <IconFont className="fa fa-plus" /> ASIGNAR REPORTES
                  </Item>
                  <Separator />
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
                  <Item onClick={this.asignacion}>
                    <IconFont className="fa fa-plus" /> ASIGNAR REPORTES
                  </Item>
                  <Separator />
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
        <IglesiasModal ref="modal_iglesia" getData={this.setIglesia} />
      </React.Fragment>
    );
  }
}
