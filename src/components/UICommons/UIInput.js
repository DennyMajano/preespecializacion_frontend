import React, { Component } from "react";

export default class UIInput extends Component {
  render() {
    return (
      <div className={this.props.divClass} {...this.props.divProps}>
        <label>{this.props.label}</label>
        <input
          disabled = {this.props.disabled}
          className="form-control"
          type={this.props.type}
          id={this.props.id}
          name={this.props.id}
          value={this.props.value}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder}
          {...this.props.inputProps}
        />

        {this.props.afterInput}
      </div>
    );
  }

  static defaultProps = {
    disabled : false,
    type: "text",
    id: "id",
    value: "valor",
    placeholder: "escribe algo",
    onChange: () => {
      console.log("input sin handler");
    },
    label: "Input Label",
    divClass: "col-lg-3 form-group",
    inputProps: {},
  };
}
