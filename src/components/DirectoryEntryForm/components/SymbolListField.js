import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Select,
  TextField,
  Row,
  Col,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import { required } from '../../../util/validators';

class SymbolListField extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      map: PropTypes.func,
    })),
    namingAuthorities: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })),
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
  };

  renderAddSymbol = () => {
    return (
      <Button
        id="add-symbol-btn"
        onClick={() => this.props.onAddField()}
      >
        <FormattedMessage id="ui-directory.information.symbols.add" />
      </Button>
    );
  }

  render() {
    const { items, namingAuthorities, onDeleteField } = this.props;
    return (
      <>
        {items?.map((symbol, index) => {
          return (
              <EditCard
                  header={<FormattedMessage id="ui-directory.information.symbol.index" values={{ index }} />}
                  key={`symbols[${index}].editCard`}
                  onDelete={() => onDeleteField(index)}
                  deleteButtonTooltipText={
                    <FormattedMessage
                        id="ui-directory.information.symbols.deleteText"
                        values={{
                          authority: symbol?.authority?.symbol,
                          symbol: symbol?.symbol
                        }}
                    />
                  }
              >
              <Row>
                <Col md={4}>
                  <Field
                    name={`symbols[${index}].authority`}
                    component={Select}
                    dataOptions={[{ value:'', label: '' }, ...namingAuthorities]}
                    label={<FormattedMessage id="ui-directory.information.symbols.authority" />}
                    format={v => v?.id}
                    required
                    validate={required}
                  />
                </Col>
                <Col md={4}>
                  <Field
                    name={`symbols[${index}].symbol`}
                    label={<FormattedMessage id="ui-directory.information.symbols.symbol" />}
                    component={TextField}
                    required
                    validate={required}
                  />
                </Col>
                <Col md={4}>
                  <Field
                    name={`symbols[${index}].priority`}
                    label={<FormattedMessage id="ui-directory.information.symbols.priority" />}
                    component={TextField}
                  />
                </Col>
              </Row>
            </EditCard>
          );
        })}
        {this.renderAddSymbol()}
      </>
    );
  }
}

export default withKiwtFieldArray(SymbolListField);
