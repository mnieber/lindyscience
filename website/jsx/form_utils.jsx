import React from 'react'
import classnames from 'classnames';


export function formField(errors, label, field) {
  return [
    <div key={1} htmlFor={field.props.id} className="labeledField__label">{label}</div>,
    <div key={2} className="labeledField__field">{field}</div>,
    <div key={3} className="labeledField__error">{errors[field.props.field]}</div>,
  ]
}

export function isNonEmptyString(x) {
  return (x || '').trim() !== '';
}

export function validateField(formApi, field, validator, errorMsg) {
  return (!validator(field)) ? errorMsg : null;
}

export function formFieldProps(formProps, fieldName, classNames) {
  return {
    id: fieldName,
    value: formProps.values[fieldName],
    onChange: formProps.handleChange,
    onBlur: formProps.handleBlur,
    className: classnames(
      classNames,
      {'error': formProps.errors[fieldName] && formProps.touched[fieldName]}
    )
  }
}

export function formFieldLabel(fieldName, label, classNames) {
  return (
    <div className="mt-2">
        <label
          className={classnames(classNames)}
          htmlFor={fieldName}
        >
          {label}
        </label>
    </div>
  )
}

export function formFieldError(formProps, fieldName, classNames) {
  if (formProps.errors[fieldName] && formProps.touched[fieldName]) {
      return (
        <div className={classnames(classNames)}>
            {formProps.errors[fieldName]}
        </div>
      )
  }
  return undefined;
}

export function FormField({formProps, fieldName, label, type, placeholder, classNames=''}) {
    const textField = type.toLowerCase() == 'textarea'
        ? <textarea
          placeholder={placeholder}
          {...formFieldProps(formProps, fieldName, ['formField__field'])}
        />
        : <input
          type={type}
          placeholder={placeholder}
          {...formFieldProps(formProps, fieldName, ['formField__field'])}
        />;

    return (
        <div className={`my-2 ${classNames}`}>
            {formFieldLabel(fieldName, label, ['formField__label'])}
            {textField}
            {formFieldError(formProps, fieldName, ['formField__error'])}
        </div>
    )
}

export function Row2({w1, w2, padding=1}) {
    return (
        <div className="w-full flex flex-wrap">
            <div className={`w-full md:w-1/2 md:pr-${padding}`}>
                {w1}
            </div>
            <div className={`w-full md:w-1/2 md:pl-${padding}`}>
                {w2}
            </div>
        </div>
    );
}