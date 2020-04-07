import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import compose from 'compose-function';
import { SearchAndSort, withTags } from '@folio/stripes/smart-components';
import { Tags as ERMTags } from '@folio/stripes-erm-components';
import getSASParams from '@folio/stripes-erm-components/lib/getSASParams';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import ViewDirectoryEntry from '../components/ViewDirectoryEntry';
import EditDirectoryEntry from '../components/EditDirectoryEntry';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

const searchableIndexes = [
  { label: 'Search all fields', value: 'name,tags.value,symbols.symbol' },
  { label: 'Name', value: 'name' },
  { label: 'Tags', value: 'tags.value' },
  { label: 'Symbols', value: 'symbols.symbol' },
];

const filterConfig = [
  {
    label: 'Tag',
    name: 't',
    cql: 'tags.value',
    values: [], // will be filled in by componentDidUpdate
  },
];

// Provide the specific mapping that getSASParams wants
function filterConfig2filterKeys(config) {
  return config.reduce((a, e) => Object.assign({}, a, { [e.name]: e.cql }), {});
}


class DirectoryEntries extends React.Component {
  static manifest = Object.freeze({
    custprops: {
      type: 'okapi',
      path: 'directory/custprops',
      shouldRefresh: () => false,
    },
    dirents: {
      type: 'okapi',
      path: 'directory/entry',
      params: getSASParams({
        searchKey: 'name',
        columnMap: {
          'fullyQualifiedName': 'name',
          'tagSummary': 'tags.value',
          'symbolSummary': 'symbols.symbol',
        },
        filterKeys: filterConfig2filterKeys(filterConfig),
      }),
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      resultCount: { initialValue: INITIAL_RESULT_COUNT },
      throwErrors: false
    },
    namingAuthorities: {
      type: 'okapi',
      path: 'directory/namingAuthority',
      params: { perPage: '100' },
    },
    refdata: {
      type: 'okapi',
      path: 'directory/refdata',
      params: { perPage: '100' },
    },
    selectedRecord: {
      type: 'okapi',
      path: 'directory/entry/${selectedRecordId}', // eslint-disable-line no-template-curly-in-string
      fetch: false,
    },
    symbols: {
      type: 'okapi',
      path: 'directory/symbol',
      params: { perPage: '100' },
    },
    directoryTags: {
      type: 'okapi',
      path: 'directory/tags',
      params: { perPage: '100' },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },

    // If this (query) isn't here, then we get this.props.parentMutator.query is undefined in the UI
    query: {},

    selectedRecordId: { initialValue: '' },
  });

  static contextType = CalloutContext;

  static propTypes = {
    resources: PropTypes.shape({
      query: PropTypes.shape({
        qindex: PropTypes.string,
      }),
      directoryTags: PropTypes.shape({
        records: PropTypes.array,
      }),
      custprops: PropTypes.object,
      symbols: PropTypes.object,
      namingAuthorities: PropTypes.object,
      refdata: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.shape({
          values: PropTypes.array,
        })),
      }),
    }),

    mutator: PropTypes.object,

    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func,
      }),
    }),
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = { initializedFilterConfig: false };
  }

  componentDidUpdate() {
    if (!this.state.initializedFilterConfig) {
      const tags = (this.props.resources.directoryTags || {}).records || [];

      if (tags.length > 0) {
        const tagsFilterConfig = filterConfig.find(g => g.name === 't');
        // WS response contains a dummy value and duplicates, and is unsorted
        tagsFilterConfig.values = _.uniq(
          tags
            .map(rec => rec.value)
            .filter(v => v !== 'system-default')
            .sort()
        );

        // Setting state triggers re-render
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ initializedFilterConfig: true });
      }
    }
  }

  onClose() {
    this.toggleModal(false);
  }

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    this.props.stripes.logger.log('action', `changed query-index to '${qindex}'`);
    this.props.mutator.query.update({ qindex });
  }

  handleCreate = (record) => {
    const { mutator } = this.props;

    mutator.dirents.POST(record)
      .then((newRecord) => {
        this.context.sendCallout({ message: <SafeHTMLMessage id="ui-directory.create.callout" values={{ name: newRecord.name }} /> });
        mutator.query.update({
          _path: `/directory/entries/view/${newRecord.id}`,
          layer: '',
        });
      })
      .catch(response => {
        response.json()
          .then(error => this.context.sendCallout({ type: 'error', message: <SafeHTMLMessage id="ui-directory.create.callout.error" values={{ err: error.message }} /> }))
          .catch(() => this.context.sendCallout({ type: 'error', message: <SafeHTMLMessage id="ui-directory.create.callout.error" values={{ err: '' }} /> }));
      });
  };

  handleUpdate = (record) => {
    this.props.mutator.selectedRecordId.replace(record.id);
    return this.props.mutator.selectedRecord.PUT(record);
  }

  render() {
    const { mutator, resources } = this.props;
    const helperApps = { tags: ERMTags };
    const path = '/directory/entries';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="dirents"
          objectName="dirents"
          packageInfo={packageInfo}
          searchableIndexes={searchableIndexes}
          selectedIndex={_.get(this.props.resources.query, 'qindex')}
          onChangeIndex={this.onChangeIndex}
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          getHelperComponent={(name) => helperApps[name]}
          getHelperResourcePath={(helper, id) => `directory/entry/${id}`}
          viewRecordComponent={ViewDirectoryEntry}
          editRecordComponent={EditDirectoryEntry}
          viewRecordPerms="module.directory.enabled"
          newRecordPerms="module.directory.enabled"
          onCreate={this.handleCreate}
          detailProps={{
            onCreate: this.handleCreate,
            onUpdate: this.handleUpdate
          }}
          parentResources={{
            ...resources,
            records: resources.dirents,
            custprops: _.get(resources, 'custprops.records', []),
          }}
          parentMutator={{
            query: mutator.query,
            resultCount: mutator.resultCount,
          }}
          showSingleResult
          visibleColumns={[
            'fullyQualifiedName',
            'type',
            'tagSummary',
            'symbolSummary'
          ]}
          columnMapping={{
            fullyQualifiedName: <FormattedMessage id="ui-directory.entries.name" />,
            type: <FormattedMessage id="ui-directory.entries.type" />,
            tagSummary: <FormattedMessage id="ui-directory.entries.tagSummary" />,
            symbolSummary: <FormattedMessage id="ui-directory.entries.symbolSummary" />,
          }}
          columnWidths={{
            fullyQualifiedName: '40%',
            type: '20%',
            tagSummary: '20%',
            symbolSummary: '20%',
          }}
          resultsFormatter={{
            type: a => a.type?.label || '',
            tagSummary: a => a.tagSummary || '',
            symbolSummary: a => a.symbolSummary || '',
          }}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  stripesConnect,
  withTags,
)(DirectoryEntries);
