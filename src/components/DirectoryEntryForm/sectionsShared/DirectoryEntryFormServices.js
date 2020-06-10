import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Accordion,
} from '@folio/stripes/components';


class DirectoryEntryFormServices extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
      selectedRecord: PropTypes.shape({
        records: PropTypes.array
      }),
      custprops: PropTypes.array,
    }),
  };

  render() {
    const { id, onToggle, open } = this.props;
    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-directory.information.heading.services" />}
        open={open}
        onToggle={onToggle}
      >
        <p> Hi there </p>
      </Accordion>
    );
  }
}

export default DirectoryEntryFormServices;
