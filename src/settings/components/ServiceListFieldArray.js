import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Row,
} from '@folio/stripes/components';

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

  state = { disableNewButton: false };

  handleSave = (index) => {
    const service = this.props.fields.value[index];

    if (!service.id) {
      this.setState({ disableNewButton: false });
    }

    return this.props.onSave(service);
  }

  handleDelete = (index) => {
    const { fields, onDelete } = this.props;
    const service = fields.value[index];

    if (service.id) {
      onDelete(service);
    } else {
      fields.remove(index);
      this.setState({ disableNewButton: false });
    }
  }

  handleNew = () => {
    const { fields } = this.props;
    fields.push({});
    this.setState({ disableNewButton: true });
  };

  render() {
    const { data, fields, mutators } = this.props;

    return (
      <>
        <Row end="sm">
          <Col>
            <Button
              buttonStyle="primary"
              disabled={this.state.disableNewButton}
              id="clickable-new-service"
              onClick={this.handleNew}
            >
              <FormattedMessage id="ui-directory.settings.services.new" />
            </Button>
          </Col>
        </Row>
        {(fields.value || []).map((service, i) => {
          const fieldName = `${fields.name}[${i}]`;
          return (
            <Field
              component={ServiceField}
              key={service.id || 'new'}
              name={fieldName}
              mutators={mutators}
              onSave={() => this.handleSave(i)}
              onDelete={() => this.handleDelete(i)}
              serviceData={{
                functions: data?.functions?.map(obj => ({ value: obj.id, label: obj.label })) || [],
                types: data?.types?.map(obj => ({ value: obj.id, label: obj.label })) || []
              }}
              initialValues={this.props.initialValues}
              // This `validate` appears stupid and like a no-op, but it's necessary because of the way
              // that RFF decides whether to run validation: https://github.com/final-form/final-form/pull/267
              // We want this Field to have validation info (meta.invalid) upon mount because some of the
              // child Fields are required and they will run validation.
              validate={() => {}}
            />
          );
        })}
      </>
    );
  }
}

export default ServiceListFieldArray;
