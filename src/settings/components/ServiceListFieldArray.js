import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import ServiceField from './ServiceField';

class ServiceListFieldArray extends React.Component {
  static propTypes = {
    fields: PropTypes.object,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    data: PropTypes.shape({
      functions: PropTypes.arrayOf(PropTypes.object),
      types: PropTypes.arrayOf(PropTypes.object)
    }),
    mutators: PropTypes.object,
    initialValues: PropTypes.object
  };

  handleSave = (index) => {
    const service = this.props.fields.value[index];
    return this.props.onSave(service);
  }

  handleDelete = (index) => {
    const service = this.props.fields.value[index];
    return this.props.onDelete(service);
  }

  render() {
    const { data, fields, mutators } = this.props;

    return (
      // Returns the services
      (fields.value || []).map((service, i) => {
        const fieldName = `${fields.name}[${i}]`;
        return (
          <Field
            component={ServiceField}
            key={fieldName}
            name={fieldName}
            mutators={mutators}
            onSave={() => this.handleSave(i)}
            onDelete={() => this.handleDelete(i)}
            serviceData={{
              currentService: service,
              functions: (data?.functions || [])[0]?.values?.map(obj => ({ value: obj.id, label: obj.label })) || [],
              types: (data?.types || [])[0]?.values?.map(obj => ({ value: obj.id, label: obj.label })) || []
            }}
            initialValues={this.props.initialValues}
          />
        );
      })
    );
  }
}

export default ServiceListFieldArray;
