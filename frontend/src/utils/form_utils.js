// @flow

import React from 'react';
import classnames from 'classnames';

type FormFieldLabelPropsT = {
  classNames?: any,
  fieldName: string,
  label: string,
  buttons?: any,
};

export function FormFieldLabel(props: FormFieldLabelPropsT) {
  const ColWrapper =
    isNil(props.children) || isEmpty(props.children)
      ? React.Fragment
      : ({ children }) => <div className="flexcol">{children}</div>;

  const RowWrapper =
    isNil(props.buttons) || isEmpty(props.buttons)
      ? React.Fragment
      : ({ children }) => <div className="flexrow">{children}</div>;

  return (
    <ColWrapper>
      <RowWrapper>
        <label
          className={classnames('mt-2 font-bold', props.classNames)}
          htmlFor={props.fieldName}
        >
          {props.label}
        </label>
        {props.buttons}
      </RowWrapper>
    </ColWrapper>
  );
}

export type FormFieldErrorPropsT = {
  formProps: any,
  fieldName: string,
  classNames?: any,
  key?: any,
};

export function FormFieldError(props: FormFieldErrorPropsT) {
  if (
    props.formProps.errors &&
    props.formProps.errors[props.fieldName] &&
    props.formProps.touched[props.fieldName]
  ) {
    return (
      <div key={props.key} className={classnames(props.classNames || '')}>
        {props.formProps.errors[props.fieldName]}
      </div>
    );
  }
  return <React.Fragment />;
}

type FormFieldPropsT = {
  type?: string,
  postfix?: string,
  fieldName: string,
  formProps: any,
  buttons?: any,
  classNames?: any,
  label?: string,
  placeholder?: string,
  autoFocus?: boolean,
  disabled?: boolean,
  onChange?: Function,
};

export function FormField(props: FormFieldPropsT) {
  const htmlElement = React.useRef(null);

  const selectAllOnFocus = (event) => {
    event.target.select();
  };

  const formFieldProps = {
    id: props.fieldName,
    value: props.formProps.values[props.fieldName],
    onChange: (x) => {
      props.formProps.handleChange(x);
      if (props.onChange) {
        props.onChange(x);
      }
    },
    onBlur: props.formProps.handleBlur,
    className: classnames({
      formField__field: props.type != 'checkbox',
      error:
        props.formProps.errors &&
        props.formProps.errors[props.fieldName] &&
        props.formProps.touched[props.fieldName],
    }),
  };

  const textField =
    (props.type || '').toLowerCase() == 'textarea' ? (
      <textarea
        ref={htmlElement}
        placeholder={props.placeholder}
        disabled={props.disabled}
        autoFocus={props.autoFocus}
        {...formFieldProps}
      />
    ) : (
      <input
        // $FlowFixMe
        ref={htmlElement}
        type={props.type}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onFocus={selectAllOnFocus}
        autoFocus={props.autoFocus}
        {...formFieldProps}
      />
    );

  const postfix = (x) => {
    return props.postfix ? (
      <div className="flexrow items-center">
        {x}
        <div className="ml-2">{props.postfix}</div>
      </div>
    ) : (
      x
    );
  };

  const formFieldLabel = (
    <FormFieldLabel
      fieldName={props.fieldName}
      label={props.label || ''}
      buttons={props.buttons}
      classNames={['formField__label']}
    />
  );

  return (
    <div className={classnames('my-2', props.classNames)}>
      {props.label && formFieldLabel}
      {postfix(textField)}
      <FormFieldError
        formProps={props.formProps}
        fieldName={props.fieldName}
        classNames={['formField__error']}
      />
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
