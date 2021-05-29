import React, { Component } from "react";

export default class UITextarea extends Component {
  render() {
    return (
      <div className={this.props.divClass} {...this.props.divProps}>
        <label>{this.props.label}</label>
        <textarea
          disabled={this.props.disabled}
          className="form-control"
          id={this.props.id}
          name={this.props.id}
          value={this.props.value}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder}
          {...this.props.textareaProps}
        ></textarea>
      </div>
    );
  }

  static defaultProps = {
    disabled: false,
    id: "id",
    value: "valor",
    placeholder: "escribe algo",
    onChange: () => {
      console.log("textarea sin handler");
    },
    label: "textarea Label",
    divClass: "col-lg-6 form-group",
    textareaProps: {},
  };
}
