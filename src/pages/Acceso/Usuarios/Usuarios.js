import React, { Component } from "react";
import LayoutPanelTable from "../../../components/layouts/panels/LayoutPanelTable";
import TablaFilter from "../../../components/tablas/TablaFilter";
import { Menu, Item, Separator, contextMenu, IconFont } from "react-contexify";
import Encrypt from "../../../services/Encrypt";
import Request from "../../../services/Request";
import Alerts from "../../../services/Alerts";

export default class Usuarios extends Component {
  columns = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
    },
    {
      dataField: "correo",
      text: "correo",
      hidden: true,
    },
    {
      dataField: "persona_codigo",
      text: "CÓDIGO",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "10%", textAlign: "center" };
      },
    },
    {
      dataField: "nombre",
      text: "NOMBRE",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "correo_electronico",
      text: "CORREO",
      sort: true,
      formatter: (cellContent, row) => {
        return <p>{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "ultimo_login",
      text: "ÚLT. LOGIN",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent !== null) {
          return <p className="text-center">{cellContent}</p>;
        } else {
          return <p className="text-center">SIN INICIOS</p>;
        }
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },

    {
      dataField: "estado",
      text: "ESTADO",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent === 1) {
          return (
            <p className="text-center">
              <span className="label label-info">ACTIVO</span>
            </p>
          );
        } else if (cellContent === 0) {
          return (
            <p className="text-center">
              <span className="label label-danger">BLOQUEADO</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return { width: "8%", textAlign: "center" };
      },
    },
    {
      dataField: "password_defecto",
      text: "PASSWORD CAMBIO",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent === 0) {
          return (
            <p className="text-center">
              <span className="label label-info">SI</span>
            </p>
          );
        } else {
          return (
            <p className="text-center">
              <span className="label label-inverse">NO</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return { width: "12%", textAlign: "center" };
      },
    },
  ];
  update = async ({ event, props }) => {
    this.props.history.push(`/administracion/usuarios/update/${props.id}`);
  };

  resetPassword = async ({ event, props }) => {
    Alerts.Question(
      "¿Está seguro que desea restablecer la contraseña para el usuario?",
      "Administración de usuarios"
    ).then((res) => {
      if (res) {
        Alerts.loading_reload(true);
        const data = {
          code: props.id,
          correo: props.correo,
        };

        Request.PUT("usuarios/restablecer_pass", data).then((result) => {
          Alerts.loading_reload(false);

          if (result !== false) {
            if (result.status === 200) {
              Alerts.alertEmpty(
                "¡Contraseña restablecida con éxito!",
                "Administración de usuarios",
                "success"
              );
            } else {
              Alerts.alertEmpty(
                "No fue posible restablecer la contraseña!",
                "Administración de usuarios",
                "error"
              );
            }
          } else {
            Alerts.alertEmpty(
              "No fue posible restablecer la contraseña!",
              "Administración de usuarios",
              "error"
            );
          }
        });
      }
    });
  };
  bloquear = async ({ event, props }) => {
    Alerts.Question(
      "¿Está seguro que desea bloquear el usuario?",
      "Administración de usuarios"
    ).then((res) => {
      if (res) {
        const data = {
          code: props.id,
          status: 0,
        };

        Request.PUT("usuarios/disable_enable", data).then((result) => {
          if (result !== false) {
            if (result.status === 200) {
              Alerts.alertEmpty(
                "¡Usuario bloqueado con éxito!",
                "Administración de usuarios",
                "success"
              );
              this.refs.tabla.getData("usuarios/all");
            } else {
              Alerts.alertEmpty(
                "No fue posible bloquear el usuario!",
                "Administración de usuarios",
                "error"
              );
            }
          } else {
            Alerts.alertEmpty(
              "No fue posible bloquear el usuario!",
              "Administración de usuarios",
              "error"
            );
          }
        });
      }
    });
  };
  desbloquear = async ({ event, props }) => {
    Alerts.Question(
      "¿Está seguro que desea desbloquear el usuario?",
      "Administración de usuarios"
    ).then((res) => {
      if (res) {
        const data = {
          code: props.id,
          status: 1,
        };

        Request.PUT("usuarios/disable_enable", data).then((result) => {
          if (result !== false) {
            if (result.status === 200) {
              Alerts.alertEmpty(
                "¡Usuario desbloqueado con éxito!",
                "Administración de usuarios",
                "success"
              );
              this.refs.tabla.getData("usuarios/all");
            } else {
              Alerts.alertEmpty(
                "No fue posible desbloquear el usuario!",
                "Administración de usuarios",
                "error"
              );
            }
          } else {
            Alerts.alertEmpty(
              "No fue posible desbloquear el usuario!",
              "Administración de usuarios",
              "error"
            );
          }
        });
      }
    });
  };

  rowEvents = {
    onContextMenu: (e, row, rowIndex) => {
      e.preventDefault();

      if (row.id !== Encrypt.getSession("usuario")) {
        if (row.condicion === 1) {
          contextMenu.show({
            id: "menu_usuarios",
            event: e,
            props: {
              id: row.id,
              correo: row.correo,
            },
          });
        } else if (row.condicion === 0) {
          contextMenu.show({
            id: "menu_usuarios_bloqueado",
            event: e,
            props: {
              id: row.id,
              correo: row.correo,
            },
          });
        }
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
          titulo="Administración de Usuarios"
          rutacreate="/administracion/usuarios/new"
        >
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-12 form-group">
                <TablaFilter
                  ref="tabla"
                  ruta={"usuarios/all"}
                  rowEvents={this.rowEvents}
                  identificador={"id"}
                  columns={this.columns}
                  titulo_tabla="Escriba el registro que desea buscar"
                />
                <Menu id={"menu_usuarios"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" />
                    ACTUALIZAR
                  </Item>
                  <Separator />
                  <Item onClick={this.bloquear}>
                    <IconFont className="fa fa-lock" /> BLOQUEAR
                  </Item>
                  <Separator />
                  <Item onClick={this.resetPassword}>
                    <IconFont className="fa fa-key" /> RESTABLECER CONTRASEÑA
                  </Item>
                </Menu>
                <Menu id={"menu_usuarios_bloqueado"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" />
                    ACTUALIZAR
                  </Item>
                  <Separator />
                  <Item onClick={this.desbloquear}>
                    <IconFont className="fa fa-pencil" /> DESBLOQUEAR
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
