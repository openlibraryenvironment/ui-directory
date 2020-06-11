import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import {
  Pane,
} from '@folio/stripes/components';
import { withStripes } from '@folio/stripes/core';

import ServiceListFieldArray from './components/ServiceListFieldArray';

class ServiceSettings extends React.Component {
  static manifest = Object.freeze({
    services: {
      type: 'okapi',
      path: 'directory/service',
      params: { perPage: '100' },
    },
    type: {
      type: 'okapi',
      path: 'directory/refdata?filters=desc=Service.Type',
    },
    businessFunction: {
      type: 'okapi',
      path: 'directory/refdata?filters=desc=Service.BusinessFunction',
    },
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      services: PropTypes.object,
    }),
  };

  handleSubmit = (service) => {
    console.log("SUBMITTING: %o", service)
    const mutator = this.props.mutator.services;
    const promise = mutator.PUT(service);
    return promise;
  }

  render() {
    const { resources: { services, type, businessFunction } } = this.props;
    const { records: serviceRecords } = services || [];
    const { records: typeRecords } = type || [];
    const { records: businessFunctionRecords } = businessFunction || [];

    // We need to store the IDs of the refdata values rather than objects
    const initialValues = { 'services': serviceRecords?.map(obj => ({ ...obj, type: obj.type?.id, businessFunction: obj.businessFunction?.id })) };
    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        enableReinitialize
        keepDirtyOnReinitialize
        mutators={{
          setServiceValue: (args, state, tools) => {
            tools.changeValue(state, args[0], () => args[1]);
          },
          ...arrayMutators
        }}
        subscription={{ value: true }}
        navigationCheck
      >
        {({ form, handleSubmit }) => {
          return (
            <Pane
              defaultWidth="fill"
              id="services"
              paneTitle={<FormattedMessage id="ui-directory.settings.services" />}
            >
              <form onSubmit={handleSubmit}>
                <FieldArray
                  component={ServiceListFieldArray}
                  name="services"
                  onSave={this.handleSubmit}
                  mutators={form.mutators}
                  data={{
                    types: typeRecords,
                    functions: businessFunctionRecords
                  }}
                  initialValues={initialValues}
                />
              </form>
            </Pane>
          );
        }}
      </Form>
    );
  }
}

export default withStripes(ServiceSettings);
