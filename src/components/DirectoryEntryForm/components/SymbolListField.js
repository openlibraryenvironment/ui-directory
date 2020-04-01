import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

class SymbolListField extends React.Component {
  static propTypes = {
    items: PropTypes.shape({
      map: PropTypes.func.isRequired,
    }),
    namingAuthorities: PropTypes.object,
    onAddField: PropTypes.func.isRequired,
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
    const { items, namingAuthorities } = this.props;
    return (
      <>
        {items?.map((symbol, index) => {
          return (
            <EditCard
              header={<FormattedMessage id="ui-directory.information.symbol.index" values={{ index }} />}
            >
              <Field
                name={`symbols[${index}].authority`}
                component={Select}
                dataOptions={namingAuthorities}
                label={<FormattedMessage id="ui-directory.information.symbols.authority" />}
                format={v => v?.id}
              />
              <Field
                name={`symbols[${index}].symbol`}
                label={<FormattedMessage id="ui-directory.information.symbols.symbol" />}
                component={TextField}
              />
            </EditCard>
          );
        })}
        {this.renderAddSymbol()}
      </>
    );
  }
}

export default withKiwtFieldArray(SymbolListField);
