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

class ServiceAccountListFieldArray extends React.Component {
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

  render() {
    const { items } = this.props;
    return (
      <>
        {items?.map((service, index) => {
          return (
            <EditCard
              header={<FormattedMessage id="ui-directory.information.services.header" values={{ index }} />}
              key={`${this.props.name}[${index}].editCard`}
              onDelete={() => this.props.onDeleteField(index, service)}
            >
              <Row>
                <Col xs={6}>
                  <FormattedMessage id="ui-directory.information.services.slug">
                    {placeholder => (
                      <Field
                        id="edit-directory-entry-slug"
                        name="slug"
                        label={placeholder}
                        component={TextField}
                        placeholder={placeholder}
                        required
                        validate={required}
                      />
                    )}
                  </FormattedMessage>
                </Col>
                <Col xs={6}>
                  <FormattedMessage id="ui-directory.information.services.slug">
                    {placeholder => (
                      <Field
                        id="edit-directory-entry-slug"
                        name="slug"
                        label={placeholder}
                        component={Select}
                        placeholder={placeholder}
                        required
                        validate={required}
                      />
                    )}
                  </FormattedMessage>
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

export default injectIntl(withKiwtFieldArray(ServiceAccountListFieldArray));
