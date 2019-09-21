import React from "react";
import classnames from "classnames";
import { isNone, stripQuotes } from "utils/utils";
import Select from "react-select";
import jquery from "jquery";
import Creatable from "react-select/lib/Creatable";

export function validateField(formApi, field, validator, errorMsg) {
  return !validator(field) ? errorMsg : null;
}

export function formFieldProps(fieldType, formProps, fieldName, classNames) {
  const valueField = fieldType == "checkbox" ? "checked" : "value";
  return {
    id: fieldName,
    [valueField]: formProps.values[fieldName],
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

export function FormFieldLabel(props) {
  return (
    <div className="flex flex-row">
      <label
        className={classnames("mt-2 font-bold", props.classNames)}
        htmlFor={props.fieldName}
      >
        {props.label}
      </label>
      {props.buttons}
    </div>
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

export function FormField(props) {
  const htmlElement = React.useRef(null);

  const selectAllOnFocus = event => {
    event.target.select();
  };
  const textField =
    props.type.toLowerCase() == "textarea" ? (
      <textarea
        ref={htmlElement}
        placeholder={props.placeholder}
        disabled={props.disabled}
        autoFocus={props.autoFocus}
        {...formFieldProps(props.type, props.formProps, props.fieldName, [
          "formField__field",
        ])}
      />
    ) : (
      <input
        ref={htmlElement}
        type={props.type}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onFocus={selectAllOnFocus}
        autoFocus={props.autoFocus}
        {...formFieldProps(props.type, props.formProps, props.fieldName, [
          "formField__field",
        ])}
      />
    );

  const formFieldLabel = (
    <FormFieldLabel
      fieldName={props.fieldName}
      label={props.label}
      buttons={props.buttons}
      classNames={["formField__label"]}
    />
  );

  return (
    <div className={`my-2 ${props.classNames}`}>
      {props.label && formFieldLabel}
      {textField}
      {formFieldError(props.formProps, props.fieldName, ["formField__error"])}
    </div>
  );
}

export function Row2({ w1, w2, padding = 1 }) {
  return (
    <div className="w-full flex flex-wrap">
      <div className={`w-full md:w-1/2 md:pr-${padding}`}>{w1}</div>
      <div className={`w-full md:w-1/2 md:pl-${padding}`}>{w2}</div>
    </div>
  );
}

export function handleEnterAsTabToNext(event: any, isPreventDefault: boolean) {
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

export function getValueFromPicker(picker: any, defaultValue: any) {
  const value = picker.state.value;
  return value
    ? jquery.isArray(value)
      ? value.map(x => x.value)
      : value.value
    : defaultValue;
}

export function strToPickerValue(value: string) {
  return {
    value: stripQuotes(value),
    label: stripQuotes(value),
  };
}
