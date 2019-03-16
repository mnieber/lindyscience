import React from "react";
import classnames from "classnames";
import { isNone, stripQuotes } from "utils/utils";
import parse from "url-parse";
import Select from "react-select";
import jquery from "jquery";
import Creatable from "react-select/lib/Creatable";

export function formField(errors, label, field) {
  return (
    <React.Fragment>
      <div htmlFor={field.props.id} className="labeledField__label">
        {label}
      </div>
      <div className="labeledField__field">{field}</div>
      <div className="labeledField__error">{errors[field.props.field]}</div>
    </React.Fragment>
  );
}

export function isNonEmptyString(x) {
  return (x || "").trim() !== "";
}

export function validateField(formApi, field, validator, errorMsg) {
  return !validator(field) ? errorMsg : null;
}

export function formFieldProps(formProps, fieldName, classNames) {
  return {
    id: fieldName,
    value: formProps.values[fieldName],
    onChange: formProps.handleChange,
    onBlur: formProps.handleBlur,
    className: classnames(classNames, {
      error:
        formProps.errors &&
        formProps.errors[fieldName] &&
        formProps.touched[fieldName],
    }),
  };
}

export function FormFieldLabel({ fieldName, label, classNames }) {
  return (
    <label
      className={classnames("mt-2 font-bold", classNames)}
      htmlFor={fieldName}
    >
      {label}
    </label>
  );
}

export function formFieldError(formProps, fieldName, classNames, key) {
  if (
    formProps.errors &&
    formProps.errors[fieldName] &&
    formProps.touched[fieldName]
  ) {
    return (
      <div key={key} className={classnames(classNames)}>
        {formProps.errors[fieldName]}
      </div>
    );
  }
  return undefined;
}

export class FormField extends React.Component {
  constructor(props) {
    super(props);
    this.htmlElement = React.createRef();
  }

  render() {
    const textField =
      this.props.type.toLowerCase() == "textarea" ? (
        <textarea
          ref={this.htmlElement}
          placeholder={this.props.placeholder}
          autoFocus={this.props.autoFocus}
          {...formFieldProps(this.props.formProps, this.props.fieldName, [
            "formField__field",
          ])}
        />
      ) : (
        <input
          ref={this.htmlElement}
          type={this.props.type}
          placeholder={this.props.placeholder}
          autoFocus={this.props.autoFocus}
          {...formFieldProps(this.props.formProps, this.props.fieldName, [
            "formField__field",
          ])}
        />
      );

    const formFieldLabel = (
      <FormFieldLabel
        fieldName={this.props.fieldName}
        label={this.props.label}
        classNames={["formField__label"]}
      />
    );

    return (
      <div className={`my-2 ${this.props.classNames}`}>
        {this.props.label && formFieldLabel}
        {textField}
        {formFieldError(this.props.formProps, this.props.fieldName, [
          "formField__error",
        ])}
      </div>
    );
  }
}

export function Row2({ w1, w2, padding = 1 }) {
  return (
    <div className="w-full flex flex-wrap">
      <div className={`w-full md:w-1/2 md:pr-${padding}`}>{w1}</div>
      <div className={`w-full md:w-1/2 md:pl-${padding}`}>{w2}</div>
    </div>
  );
}

export function validateVideoLinkUrl(url) {
  const parsedUrl = parse(url);
  var netloc = parsedUrl.hostname;
  if (netloc.startsWith("www.")) {
    netloc = netloc.substring(4);
  }
  if (netloc.startsWith("youtube") || netloc.startsWith("youtu.be")) {
    const query = parse.qs.parse(parsedUrl.query);
    if (isNone(query["t"])) {
      return "Missing t=<timestamp> parameter in youtube url";
    }
  }
  return undefined;
}

export function handleEnterAsTabToNext(event, isPreventDefault) {
  const form = event.target.form;
  if (form && event.keyCode === 13) {
    const index = Array.prototype.indexOf.call(form, event.target);
    form.elements[index + 1].focus();
    if (isPreventDefault) {
      event.preventDefault();
    }
  }
}

export class ValuePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue,
      isFocused: false,
    };
  }

  handleFocus = () => {
    this.setState({ isFocused: true });
  };
  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  saveChanges = value => {
    if (!this.props.isMulti && jquery.isArray(value)) {
      this.setState({ value: null, label: "" });
    } else {
      this.setState({ value });
    }
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {
    const props = {
      isMulti: this.props.isMulti,
      name: this.props.fieldName,
      options: this.props.options,
      placeholder: this.props.placeholder,
      value: this.state.value,
      onChange: this.saveChanges,
      onKeyDown: e => {
        handleEnterAsTabToNext(e, false);
      },
      defaultValue: this.props.defaultValue,
    };

    const picker = this.props.isCreatable ? (
      <Creatable {...props} />
    ) : (
      <Select {...props} />
    );

    return (
      <div style={{ zIndex: this.props.zIndex }}>
        <FormFieldLabel
          fieldName={this.props.fieldName}
          label={this.props.label}
        />
        {picker}
      </div>
    );
  }
}

export function getValueFromPicker(picker, defaultValue) {
  const value = picker.state.value;
  return value
    ? jquery.isArray(value)
      ? value.map(x => x.value)
      : value.value
    : defaultValue;
}

export function strToPickerValue(value) {
  return {
    value: stripQuotes(value),
    label: stripQuotes(value),
  };
}
