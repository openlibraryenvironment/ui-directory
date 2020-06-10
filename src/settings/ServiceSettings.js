import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import {
  Pane,
  PaneHeader
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
    intl: PropTypes.object,
    resources: PropTypes.shape({
      services: PropTypes.object,
    }),
  };


  render() {
    const { stripes, intl } = this.props;
    return (
      <Pane
        renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle={intl.formatMessage({ id: 'ui-directory.settings.services', defaultMessage: 'Services' })} />}
      >
        <Form
          onSubmit={() => window.alert("Hi")}
          mutators={{ ...arrayMutators }}
          render={({ handleSubmit }) => (
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <FieldArray
                name="services"
                component={ServiceListFieldArray}
                parentProps={({ ...this.props })}
              />
            </form>
          )}
        />
      </Pane>
    );
  }
}

export default injectIntl(withStripes(ServiceSettings));
