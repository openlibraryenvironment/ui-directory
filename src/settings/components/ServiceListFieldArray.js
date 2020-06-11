import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import ServiceField from './ServiceField';

class ServiceListFieldArray extends React.Component {
  static propTypes = {
    fields: PropTypes.object,
    onSave: PropTypes.func,
    data: PropTypes.shape({
      functions: PropTypes.arrayOf(PropTypes.object),
      types: PropTypes.arrayOf(PropTypes.object)
    }),
    mutators: PropTypes.object,
    initialValues: PropTypes.object
  };

  handleSave = (index) => {
    const setting = this.props.fields.value[index];
    return this.props.onSave(setting);
  }

  render() {
    const { data, fields, mutators } = this.props;

    return (
      // Returns the services
      (fields.value || []).map((service, i) => (
        <Field
          component={ServiceField}
          key={`${fields.name}[${i}]`}
          name={`${fields.name}[${i}]`}
          mutators={mutators}
          onSave={() => this.handleSave(i)}
          serviceData={{
            currentService: service,
            types: (data?.types || [])[0]?.values?.map(obj => ({ value: obj.id, label: obj.label })) || [],
            functions: (data?.functions || [])[0]?.values?.map(obj => ({ value: obj.id, label: obj.label })) || []
          }}
          initialValues={this.props.initialValues}
        />
      ))
    );
  }
}

export default ServiceListFieldArray;
