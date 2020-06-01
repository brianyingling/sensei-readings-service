import { makeQuery } from '#root/db';
import { FIFTEEN_MINUTES, TWO_HOURS } from '#root/utils';
import { flatten, handleError, sendResponse } from './utils';

const locationsQueryParams = {
  TableName: 'sensei',
  IndexName: 'SK-data-index',
  KeyConditionExpression: 'SK = :sk',
  ExpressionAttributeValues: {
    ':sk': 'LOCATION',
  },
};

const buildLatestReadingsQueryParams = (deviceId) => {
  const THIRTY_MINUTES_AGO = new Date(Date.now() - TWO_HOURS).toISOString();
  return {
    TableName: 'sensei',
    IndexName: 'SK-data-index',
    KeyConditionExpression: 'SK = :sk and begins_with(#d, :data)',
    ExpressionAttributeNames: {
      '#d': 'data',
    },
    FilterExpression: 'createdAt > :date',
    ExpressionAttributeValues: {
      ':sk': 'READING',
      ':data': deviceId,
      ':date': THIRTY_MINUTES_AGO,
    },
  };
};

const getLocations = () => (
  makeQuery(locationsQueryParams)
);

const getLatestReadings = (deviceId) => {
  return makeQuery(buildLatestReadingsQueryParams(deviceId))
};

const promisifyAndMapLocationsWithLatestReadings = ({ Items: locations = [] }) => (
  locations.map((location) => ({
    ...location,
    readings: getLatestReadings(location.data),
  }))
);

const resolveLocationsWithLatestReadings = (locationsWithReadings) => {
  const latestReadings = locationsWithReadings.map(({ readings }) => readings);
  const result = Promise.all(latestReadings)
    .then((results) => results.map((result) => locationsWithReadings.reduce((memo, location) => {
      if (result.Items.length && location.data === result.Items[0].data) {
        return [...memo, { ...location, reading: result.Items[0] }];
      }
      return memo;
    }, [])))
    .catch(e => console.log('error here:', e));
  return result;
};

const format = (readings) => readings.map((data) => ({
  id: data.reading.PK,
  createdAt: data.reading.createdAt,
  deviceId: data.reading.data,
  location: {
    id: data.PK,
    name: data.name,
  },
  value: data.reading.value,
  scale: data.reading.scale,
}));

const getLatestReadingsByLocation = (req, res, next) => (
  getLocations()
    .then(promisifyAndMapLocationsWithLatestReadings)
    .then(resolveLocationsWithLatestReadings)
    .then(flatten)
    .then(format)
    .then(sendResponse(res))
    .catch(handleError(next))
);

export default getLatestReadingsByLocation;
