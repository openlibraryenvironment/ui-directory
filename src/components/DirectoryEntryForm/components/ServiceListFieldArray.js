import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import { required } from '../../../util/validators';
import getRefdataValuesFromParentResources from '../../../util/getRefdataValuesFromParentResources';

class ServiceListFieldArray extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      map: PropTypes.func,
    })),
    name: PropTypes.string,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    parentResources: PropTypes.shape({
      refdata: PropTypes.object,
    })
  };

  renderAddService = () => {
    return (
      <Button
        id="add-service-btn"
        onClick={() => this.props.onAddField()}
      >
        <FormattedMessage id="ui-directory.information.services.add" />
      </Button>
    );
  }

  renderCardHeader = (index) => {
    const { intl } = this.props;
    return (
      <Col xs={8}>
        <Field
          name={`${this.props.name}[${index}].service.name`}
          component={TextField}
          placeholder={intl.formatMessage({ id: 'ui-directory.information.services.namePlaceholder' })}
          required
          validate={required}
        />
      </Col>
    );
  }

  render() {
    const { items, parentResources } = this.props;
    const serviceTypes = getRefdataValuesFromParentResources(parentResources, 'Service.Type');
    const serviceFunctions = getRefdataValuesFromParentResources(parentResources, 'Service.BusinessFunction');
    return (
      <>
        {items?.map((service, index) => {
          return (
            <EditCard
              header={this.renderCardHeader(index)}
              key={`${this.props.name}[${index}].editCard`}
              onDelete={() => this.props.onDeleteField(index, service)}
            >
              <Row>
                <Col xs={6}>
                  <Field
                    component={Select}
                    dataOptions={serviceTypes}
                    name={`${this.props.name}[${index}].service.type`}
                    label={<FormattedMessage id="ui-directory.information.serviceType" />}
                    parse={v => v}
                    required
                    validate={required}
                  />
                </Col>
                <Col xs={6}>
                  <Field
                    component={Select}
                    dataOptions={serviceFunctions}
                    name={`${this.props.name}[${index}].service.businessFunction`}
                    label={<FormattedMessage id="ui-directory.information.serviceFunction" />}
                    parse={v => v}
                    required
                    validate={required}
                  />
                </Col>
                <Col xs={12}>
                  <Field
                    component={TextField}
                    name={`${this.props.name}[${index}].service.address`}
                    label={<FormattedMessage id="ui-directory.information.serviceAddress" />}
                    parse={v => v}
                    required
                    validate={required}
                  />
                </Col>
              </Row>
            </EditCard>
          );
        })}
        {this.renderAddService()}
      </>
    );
  }
}

export default injectIntl(withKiwtFieldArray(ServiceListFieldArray));