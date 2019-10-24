import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  ButtonGroup,
  Col,
  ExpandAllButton,
  Layout,
  Row
} from '@folio/stripes/components';

import {
  DirectoryEntryFormInfo,
  DirectoryEntryFormCustProps,
} from './sectionsShared';

import {
  LocalDirectoryEntryFormInfo,
} from './sectionsLocal';

class DirectoryEntryForm extends React.Component {
  static propTypes = {
    parentResources: PropTypes.object,
  }

  state = {
    sectionsShared: {
      directoryEntryFormInfo: true,
      directoryEntryFormCustProps: false,
    },
    sectionsLocal: {
      localDirectoryEntryFormInfo: true,
    },
    tab: 'shared',
  }

  getSectionProps() {
    return {
      onToggle: this.handleSectionToggle,
      parentResources: this.props.parentResources,
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

  handleAllSectionsToggle = (sectionsShared, sectionsLocal) => {
    this.setState({ sectionsShared, sectionsLocal });
  }

  render() {
    const sectionProps = this.getSectionProps();
    const { sectionsShared, sectionsLocal, tab } = this.state;
    return (
      <div>
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
          <AccordionSet>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton
                  accordionStatus={sectionsShared}
                  onToggle={this.handleAllSectionsToggle}
                />
              </Col>
            </Row>
            <DirectoryEntryFormInfo id="directoryEntryFormInfo" open={sectionsShared.directoryEntryFormInfo} {...sectionProps} />
            <DirectoryEntryFormCustProps id="directoryEntryFormCustProps" open={sectionsShared.directoryEntryFormCustProps} {...sectionProps}/>
          </AccordionSet>
        }
        {tab === 'local' &&
          <AccordionSet>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton
                  accordionStatus={sectionsLocal}
                  onToggle={this.handleAllSectionsToggle}
                />
              </Col>
            </Row>
            <LocalDirectoryEntryFormInfo id="localDirectoryEntryFormInfo" open={sectionsLocal.localDirectoryEntryFormInfo} {...sectionProps} />
          </AccordionSet>
        }
      </div>
    );
  }
}

export default DirectoryEntryForm;
