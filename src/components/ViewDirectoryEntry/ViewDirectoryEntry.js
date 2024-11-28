import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import {getUnsyncedFields} from '../../util/transformAndCompareRecords';

import {
  AccordionSet,
  Accordion,
  Button,
  Col,
  Icon,
  IconButton,
  Layer,
  Layout,
  MessageBanner,
  Pane,
  PaneMenu,
  Row,
  ButtonGroup,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import permissionToEdit from '../../util/permissionToEdit';
import EditDirectoryEntry from '../EditDirectoryEntry';
import css from './ViewDirectoryEntry.css';

import {
  CustomProperties
} from './components';

import {
  DirectoryEntryInfo,
  ContactInformation,
  ServiceAccounts,
} from './sectionsShared';

class ViewDirectoryEntry extends React.Component {
  static manifest = Object.freeze({
    selectedRecord: {
      type: 'okapi',
      path: 'directory/entry/:{id}',
      throwErrors: false,
    },
    DELETE: {
      path: 'directory/entry/:{id}',
    },
    modRsRecord: {
      type: 'okapi',
      path: 'rs/directoryEntry/:{id}?full=true',
      throwErrors: false,
      shouldFetch: false,
    },
    query: {},
    featureFlag: {
      type: 'okapi',
      path: 'rs/settings/appSettings',
      params: {
        filters: 'hidden=true&&key=~relax-man&&key=~ged-edit.feature_flag',
        perPage: '1'
      },
      shouldFetch: true
    },
  });

  static propTypes = {
    editLink: PropTypes.string,
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        replace: PropTypes.func,
      }),
      selectedRecord: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }),
    onClose: PropTypes.func,
    onCloseEdit: PropTypes.func,
    onCreate: PropTypes.func,
    onEdit: PropTypes.func,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    resources: PropTypes.shape({
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
      selectedRecord: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
      modRsRecord: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }),
    stripes: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired
  };

  state = {
    sectionsShared: {
      directoryEntryInfo: true,
      contactInformation: true,
      services: false,
      customProperties: false,
      developerInfo: false,
    },
    sectionsLocal: {
      localDirectoryEntryInfo: false,
    },
    tab: 'shared',
    showUnsyncedMessage: true,
  }

  timeoutId = null;
  timeout = 3000;

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({ shouldFetchModRsRecord: true });
      this.initiateModRsRecordFetch();
    }, this.timeout);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.shouldFetchModRsRecord && !prevState.shouldFetchModRsRecord) {
      this.initiateModRsRecordFetch();
    }
  }

  initiateModRsRecordFetch() {
    this.props.mutator.query.update({
      modRsRecordFetchTrigger: Date.now(),
    });
  }

  syncRecord = () => {
    const recordId = this.getRecord()?.id;
    if (recordId) {
      this.props.mutator.selectedRecord.PUT({ id: recordId })
          .then(response => {
            console.log('Record synchronized successfully!', response);
            this.setState({ showUnsyncedMessage: false });
            this.props.history.push(`/directory/entries/view/${recordId}?filters=type.institution&sort=fullyQualifiedName`);
          })
          .catch(error => {
            console.error('Error syncing record:', error);
          });
    } else {
      console.warn('No record ID found for syncing.');
    }
  }

  getRecord() {
    return get(this.props.resources.selectedRecord, ['records', 0], {});
  }

  getModRsRecord() {
    return get(this.props.resources.modRsRecord, ['records', 0], {});
  }

  handleToggleHelper = (helper, mutator, resources) => {
    const currentHelper = resources?.query?.helper;
    const nextHelper = currentHelper !== helper ? helper : null;
    mutator.query.update({ helper: nextHelper });
  };

  handleToggleTags = (mutator, resources) => {
    this.handleToggleHelper('tags', mutator, resources);
  };

  getInitialValues = () => {
    const record = { ...this.getRecord() };
    return record;
  }

  getParentValues = () => {
    const record = { ...this.getRecord() };
    const parentRecord = { parent: record };
    return parentRecord;
  }

  getSectionProps() {
    return {
      record: this.getRecord(),
      onToggle: this.handleSectionToggle,
      stripes: this.props.stripes,
    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sectionsShared: {
        ...prevState.sectionsShared,
        [id]: !prevState.sectionsShared[id],
      },
      sectionsLocal: {
        ...prevState.sectionsLocal,
        [id]: !prevState.sectionsLocal[id],
      }
    }));
  }

  renderEditLayer() {
    const { resources: { query } } = this.props;

    return (
      <FormattedMessage id="ui-directory.editDirectoryEntry">
        {layerContentLabel => (
          <Layer
            isOpen={query.layer === 'edit'}
            contentLabel={layerContentLabel}
          >
            <EditDirectoryEntry
              {...this.props}
              onCancel={this.props.onCloseEdit}
              onSubmit={this.handleSubmit}
              initialValues={this.getInitialValues()}
            />
          </Layer>
        )}
      </FormattedMessage>
    );
  }

  renderUnitLayer() {
    const { resources: { query } } = this.props;

    return (
      <FormattedMessage id="ui-directory.editDirectoryEntry">
        {layerContentLabel => (
          <Layer
            isOpen={query.layer === 'unit'}
            contentLabel={layerContentLabel}
          >
            <EditDirectoryEntry
              {...this.props}
              onCancel={this.props.onCloseEdit}
              onSubmit={this.props.onCreate}
              initialValues={this.getParentValues()}
            />
          </Layer>
        )}
      </FormattedMessage>
    );
  }

  switchLayer(newLayer) {
    const { mutator } = this.props;
    mutator.query.replace({ layer: newLayer });
  }

  paneButtons = (mutator, resources) => {
    return (
      <PaneMenu>
        {this.handleToggleTags &&
        <FormattedMessage id="ui-rs.view.showTags">
          {ariaLabel => (
            <IconButton
              icon="tag"
              badgeCount={resources?.selectedRecord.records[0]?.tags?.length || 0}
              onClick={() => this.handleToggleTags(mutator, resources)}
              ariaLabel={ariaLabel[0]}
            />
          )}
        </FormattedMessage>
        }
      </PaneMenu>
    );
  };

  handleDeleteConfirmation = () => {
    if (window.confirm("Do you really want to delete this directory?")) {
      this.handleDeleteDirectory();
    }
  };

  handleDeleteDirectory = () => {
    const { mutator, resources: { selectedRecord } } = this.props;
    const recordId = selectedRecord?.records[0]?.id;

    if (recordId) {
      mutator.selectedRecord.DELETE({ id: recordId });
      this.props.history.push('/directory/entries?filters=type.institution&sort=fullyQualifiedName');
    }
  };

  getActionMenu = ({ onToggle }, showEditButton, showCreateUnitButton, showDeleteButton) => {
    if (!showEditButton && !showCreateUnitButton && !showDeleteButton) {
      // Nothing to include in the menu, so don't make one at all
      return null;
    }

    return (
      <>
        {showEditButton ? (
          <Button
            buttonStyle="dropdownItem"
            href={this.props.editLink}
            id="clickable-edit-directoryentry"
            onClick={() => {
              this.props.onEdit();
              onToggle();
            }}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-directory.edit" />
            </Icon>
          </Button>
        ) : null}
        {showCreateUnitButton ? (
          <Button
            buttonStyle="dropdownItem"
            id="clickable-create-new-unit-directoryentry"
            onClick={() => {
              this.switchLayer('unit');
              onToggle();
            }}
          >
            <Icon icon="plus-sign">
              <FormattedMessage id="ui-directory.createUnit" />
            </Icon>
          </Button>
        ) : null}
        {showDeleteButton ? (
            <Button
                buttonStyle="dropdownItem"
                id="clickable-delete-directoryentry"
                onClick={() => {
                  onToggle();
                  this.handleDeleteConfirmation();
                }}
            >
              <Icon icon="trash">
                <FormattedMessage id="ui-directory.deleteUnit" />
              </Icon>
            </Button>
        ) : null}
      </>
    );
  }

  render() {
    const { mutator, resources, stripes } = this.props;
    const record = this.getRecord();
    const sectionProps = this.getSectionProps();
    let title = record.name || 'Directory entry details';
    if (record.status) title += ` (${record.status.label})`;
    const { tab } = this.state;
    const directoryEntry = record.name || <FormattedMessage id="ui-directory.information.titleNotFound" />;
    const showEditButton = permissionToEdit(stripes, record);
    const showCreateUnitButton = stripes.hasPerm('ui-directory.create');
    let showDeleteButton = false;

    const { featureFlag } = this.props.resources;
    let hideMessage = true;
    if (featureFlag.hasLoaded && record.status) {
      const relaxManaged = featureFlag.records || [];
      const featureFlagEnabled = relaxManaged.length > 0 && relaxManaged[0]?.value === 'true';
      hideMessage = record.status?.value !== 'reference' && featureFlagEnabled;
      showDeleteButton = featureFlagEnabled;
    }

    const unsyncedFields =  getUnsyncedFields(record, this.getModRsRecord());
    const { showUnsyncedMessage } = this.state;
    const hasUnsyncedFields = unsyncedFields && Object.keys(unsyncedFields).length > 0;
    if (hasUnsyncedFields) {
      console.warn("Unsynced fields detected:", unsyncedFields);
    }

    return (
      <Pane
        id="pane-view-directoryentry"
        defaultWidth={this.props.paneWidth}
        paneTitle={title}
        dismissible
        onClose={this.props.onClose}
        lastMenu={this.paneButtons(mutator, resources)}
        actionMenu={(x) => this.getActionMenu(x, showEditButton, showCreateUnitButton, showDeleteButton)}
      >
        <Layout className="textCentered">
          <ButtonGroup>
            <Button
              onClick={() => this.setState({ tab: 'shared' })}
              buttonStyle={tab === 'shared' ? 'primary' : 'default'}
              id="clickable-nav-shared"
            >
              <FormattedMessage id="ui-directory.information.tab.shared" />
            </Button>
            <Button
              onClick={() => this.setState({ tab: 'local' })}
              buttonStyle={tab === 'local' ? 'primary' : 'default'}
              id="clickable-nav-local"
            >
              <FormattedMessage id="ui-directory.information.tab.local" />
            </Button>
          </ButtonGroup>
        </Layout>
        {tab === 'shared' &&
          <>
            {!hideMessage &&
              <Row>
                <Col xs={12} lgOffset={1} lg={10}>
                  <MessageBanner>
                    <FormattedMessage id="ui-directory.information.heading.display-text" values={{ directory_entry: directoryEntry }} />
                  </MessageBanner>
                </Col>
              </Row>
            }
            {hasUnsyncedFields && showUnsyncedMessage && (
              <Row className={css.marginBottom15}>
                <Col xs={12} lgOffset={1} lg={10}>
                  <MessageBanner>
                    <div className="content">
                      <span>
                        <FormattedMessage
                          id="information.heading.items-not-synced"
                          defaultMessage="Directory record is not in sync with mod-rs. Click to "
                        />
                        <span className={css.syncLink} onClick={this.syncRecord}>
                          sync
                        </span>
                        <FormattedMessage
                          id="information.heading.sync-now"
                          defaultMessage=" now."
                        />
                      </span>
                    </div>
                  </MessageBanner>
                </Col>
              </Row>
            )}
            <AccordionSet accordionStatus={this.state.sectionsShared}>
              <DirectoryEntryInfo id="directoryEntryInfo" {...sectionProps} />
              <ContactInformation id="contactInformation" {...sectionProps} />
              <ServiceAccounts id="services" {...sectionProps} />
              <CustomProperties id="customProperties" {...{ defaultInternal: false, ...sectionProps }} />
              <Accordion
                id="developerInfo"
                label={<FormattedMessage id="ui-directory.information.heading.developer" />}
                displayWhenClosed={<FormattedMessage id="ui-directory.information.heading.developer.help" />}
              >
                <pre>{JSON.stringify(record, null, 2)}</pre>
              </Accordion>
            </AccordionSet>
          </>
        }
        {tab === 'local' &&
          <>
            {!hideMessage &&
              <Row>
                <Col xs={12} lgOffset={1} lg={10}>
                  <MessageBanner>
                    <FormattedMessage id="ui-directory.information.local.heading.display-text" />
                  </MessageBanner>
                </Col>
              </Row>
            }
            <AccordionSet accordionStatus={this.state.sectionsLocal}>
              <CustomProperties id="customProperties" {...sectionProps} />
            </AccordionSet>
          </>
        }
        { this.renderEditLayer() }
        { this.renderUnitLayer() }
      </Pane>
    );
  }
}

export default stripesConnect(ViewDirectoryEntry);
