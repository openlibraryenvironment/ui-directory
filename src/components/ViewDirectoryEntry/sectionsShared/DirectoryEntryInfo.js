import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  NoValue,
  Row
} from '@folio/stripes/components';

function makeUnitList(units) {
  if (!units || units.length === 0) return null;

  return (
    <ul>
      {units.map(e => (
        <li key={e.id}><Link to={e.id}>{e.name}</Link></li>
      ))}
    </ul>
  );
}

function makeMemberList(members) {
  if (!members || members.length === 0) return null;

  return (
    <ul>
      {members.map(e => (
        <li key={e.id}><Link to={e.id}>{e.name}</Link></li>
      ))}
    </ul>
  );
}

class DirectoryEntryInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { record } = this.props;
    const unitList = makeUnitList(record.units);
    const memberList = makeMemberList(record.members);

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.directoryEntry" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.name" />}
              value={record.name}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.type" />}
              value={record.type?.label || <NoValue />}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.slug" />}
              value={record.slug}
            />
          </Col>
        </Row>

        {!record.description ? '' :
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.description" />}
              value={record.description}
            />
          </Col>
        </Row>
        }

        {!record.symbolSummary ? '' :
        <Row>
          <Col xs={8}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.symbols" />}
              value={record.symbolSummary}
            />
          </Col>
          {!record.lmsLocationCode ? '' :
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.lmsLocationCode" />}
              value={record.lmsLocationCode}
            />
          </Col>
          }
        </Row>
        }

        {record.fullyQualifiedName === record.name ? '' :
        <>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-directory.information.qualifiedName" />}
                value={record.fullyQualifiedName}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Link to={record.parent.id}>
                <KeyValue
                  label={<FormattedMessage id="ui-directory.information.parent" />}
                  value={record.parent.name}
                />
              </Link>
            </Col>
          </Row>
        </>
        }

        {!unitList ? '' :
        <>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-directory.information.units" />}
                value={unitList}
              />
            </Col>
          </Row>
        </>
        }

        {!memberList ? '' :
        <>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-directory.information.members" />}
                value={memberList}
              />
            </Col>
          </Row>
        </>
        }

        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.tags" />}
              value={record.tagSummary}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default DirectoryEntryInfo;
