import { makeQuery } from '#root/db';
import { handleError, sendResponse } from './utils';

const buildLocationParams = (locationId) => ({
    TableName: 'sensei',
    KeyConditionExpression: 'SK = :sk and PK = :pk',
    ExpressionAttributeValues: {
        ":sk": "LOCATION",
        ":pk": locationId    
    }
});

const buildReadingParams = (deviceId) => ({
    TableName: 'sensei',
    IndexName: 'SK-data-index',
    KeyConditionExpression: 'SK = :sk and begins_with(#d, :data)',
    ExpressionAttributeNames: {
        '#d': 'data'
    },
    ExpressionAttributeValues: {
        ':sk': 'READING',
        ':data': deviceId,
    }
});

const getDevice = (locationId) => (
    makeQuery(buildLocationParams(locationId))
);

const getReadings = ({Items: items = []}) => {
    const [item] = items;
    const deviceId = item.data;
    
    return makeQuery(buildReadingParams(deviceId))
        .then(data => ({ item, rawReadings: data.Items}));
};

const buildResponse = ({ item, rawReadings }) => ({
    id: item.PK,
    name: item.name,
    deviceId: item.data,
    readings: rawReadings.map(rawReading => ({
        id: rawReading.PK,
        createdAt: rawReading.createdAt,
        scale: rawReading.scale,
        value: rawReading.value
    }))
});

const getReadingsByLocation = (req, res, next) => {
    getDevice(req.params.id)
        .then(getReadings)
        .then(buildResponse)
        .then(sendResponse(res))
        .catch(handleError(next));
}

export default getReadingsByLocation;