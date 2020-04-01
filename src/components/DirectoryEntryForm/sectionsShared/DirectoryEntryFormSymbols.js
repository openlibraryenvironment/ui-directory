import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import {
  Accordion,
  Col,
  Row,
} from '@folio/stripes/components';

import { SymbolListField } from '../components';

class DirectoryEntryFormSymbols extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      mutators: PropTypes.shape({
        pop: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
      }),
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
      records: PropTypes.object,
    }),
    values: PropTypes.object,
  };

  render() {
    const namingAuthorities = this.props?.parentResources?.namingAuthorities?.records.map(obj => ({ value: obj.id, label: obj.symbol }));
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.symbols" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <React.Fragment>
          <Row>
            <Col xs={12}>
              <FieldArray
                name="symbols"
                label={<FormattedMessage id="ui-directory.information.symbols" />}
              >
                {({ fields, input, meta }) => <SymbolListField {... { fields, input, meta, namingAuthorities }} /> }
              </FieldArray>
            </Col>
          </Row>
        </React.Fragment>
      </Accordion>
    );
  }
}

export default DirectoryEntryFormSymbols;
