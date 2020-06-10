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
    const mutator = this.props.mutator.service;
    const promise = mutator.PUT(service);
    return promise;
  }


  render() {
    const { resources: { services, type, businessFunction } } = this.props;
    const { records: serviceRecords } = services || {};
    const { records: typeRecords } = type || {};
    const { records: businessFunctionRecords } = businessFunction || {};
    const initialValues = { 'services': serviceRecords }

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
        {({ handleSubmit, mutators }) => (
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
                mutators={mutators}
                data={{
                  types: typeRecords,
                  functions: businessFunctionRecords
                }}
                initialValues={initialValues}
              />
            </form>
          </Pane>
        )}
      </Form>
    );
  }
}

export default withStripes(ServiceSettings);
