import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { SearchAndSort } from '@folio/stripes/smart-components';

import ViewDirectoryEntry from '../components/directory-entry/view-directory-entry';
import EditDirectoryEntry from '../components/directory-entry/edit-directory-entry';
import packageInfo from '../../package';
import getSASParams from '../util/getSASParams';

const INITIAL_RESULT_COUNT = 100;

const filterConfig = [
];

export default class DirectoryEntries extends React.Component {
  static manifest = Object.freeze({
    dirents: {
      type: 'okapi',
      path: 'directory/entry',
      params: getSASParams({
        searchKey: 'name',
        columnMap: {
          'fullyQualifiedName': 'name',
          'tagSummary': 'tags.value',
          'symbolSummary': 'symbols.symbol',
        }
      }),
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      resultCount: { initialValue: INITIAL_RESULT_COUNT },
    },
    selectedPatronRequest: {
      type: 'okapi',
      path: 'directory/entry/${directoryEntryId}', // eslint-disable-line no-template-curly-in-string
      fetch: false,
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },

    // If this (query) isn't here, then we get this.props.parentMutator.query is undefined in the UI
    query: {},

    selectedDirectoryEntryId: { initialValue: '' },
  });

  static propTypes = {
    resources: PropTypes.object,
    mutator: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = { };
  }

  onClose() {
    this.toggleModal(false);
  }

  handleUpdate = (patronRequest) => {
    // console.log('handleUpdate %o', patronRequest);
    this.props.mutator.selectedPatronRequestId.replace(patronRequest.id);
    return this.props.mutator.selectedPatronRequest.PUT(patronRequest);
  }

  render() {
    const { mutator, resources } = this.props;
    const path = '/directory/entries';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="dirents"
          objectName="dirents"
          packageInfo={packageInfo}
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          viewRecordComponent={ViewDirectoryEntry}
          editRecordComponent={EditDirectoryEntry}
          viewRecordPerms="module.directory.enabled"
          newRecordPerms="module.directory.enabled"
          detailProps={{
            onUpdate: this.handleUpdate
          }}
          parentResources={{
            ...resources,
            records: resources.dirents,
          }}
          parentMutator={{
            ...mutator,
            records: mutator.dirents,
          }}
          showSingleResult
          visibleColumns={[
            'fullyQualifiedName',
            'tagSummary',
            'symbolSummary'
          ]}
          columnMapping={{
            fullyQualifiedName: <FormattedMessage id="ui-directory.entries.name" />,
            tagSummary: <FormattedMessage id="ui-directory.entries.tagSummary" />,
            symbolSummary: <FormattedMessage id="ui-directory.entries.symbolSummary" />,
          }}
          columnWidths={{
            fullyQualifiedName: '40%',
            tagSummary: '30%',
            symbolSummary: '30%',
          }}
          resultsFormatter={{
            parent: a => a.parent && a.parent.name,
            symbolSummary: a => a.symbolSummary || '',
          }}
        />
      </React.Fragment>
    );
  }
}
