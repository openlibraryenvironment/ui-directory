import isEqual from 'lodash/isEqual';

/**
 * Transforms a record by applying necessary changes.
 * @param {Object} record - The Directory Entry record object to transform.
 * @returns {Object} A new object that represents the transformed record.
 */
const transformRecord = (record) => {
  const { customProperties = {}, services = [] } = record || {};
  const extractValues = key => (customProperties[key] || []).map(item => item.value).sort();
  const sortSummary = summary => summary?.split(',').map(item => item.trim()).sort() || [];
  const getPropertyValue = obj => obj?.value || null;

  return {
    id: record.id,
    contactName: record.contactName,
    customProperties: {
      'local_institutionalPatronId': extractValues('local_institutionalPatronId'),
      'folio_location_filter': extractValues('folio_location_filter'),
      'policy.ill.loan_policy': extractValues('policy.ill.loan_policy'),
      'policy.ill.last_resort': extractValues('policy.ill.last_resort'),
      'policy.ill.returns': extractValues('policy.ill.returns'),
      'policy.ill.InstitutionalLoanToBorrowRatio': extractValues('policy.ill.InstitutionalLoanToBorrowRatio')
    },
    slug: record.slug,
    tagSummary: sortSummary(record.tagSummary),
    lmsLocationCode: record.lmsLocationCode,
    phoneNumber: record.phoneNumber,
    symbolSummary: sortSummary(record.symbolSummary),
    emailAddress: record.emailAddress,
    name: record.name,
    type: { value: getPropertyValue(record.type) },
    status: { value: getPropertyValue(record.status) },
    fullyQualifiedName: record.fullyQualifiedName,
    services: services.map(({ service = {} }) => ({
      service: {
        name: service.name,
        address: service.address,
        type: { value: getPropertyValue(service.type) },
        businessFunction: { value: getPropertyValue(service.businessFunction) }
      }
    }))
  };
};

/**
 * Compares two records after transforming them and checks if they are not synced.
 * @param {Object} record1 - The first record object.
 * @param {Object} record2 - The second record object.
 * @returns {boolean} True if the records are not synchronized (i.e., they differ), false otherwise.
 */
export const areRecordsNotSynced = (record1, record2) => {
  if (!record1 || !record2) {
    return false;
  }
  const transformedRecord1 = transformRecord(record1);
  const transformedRecord2 = transformRecord(record2);
  return !isEqual(transformedRecord1, transformedRecord2);
};
