import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

const params = {
    TableName: 'sensei',
    IndexName: 'SK-data-index',
    KeyConditionExpression: 'SK = :sk',
    ExpressionAttributeValues: {
        ":sk": "READING"
    }
}

const getReadings = (req, res, next) => {
    try {
        docClient.query(params, (err, data) => {
            if (err) throw new Error(err);
            else res.send(data);
        });
    } catch(e) {
        next(e);
    }
}

export default getReadings;