import { put } from '#root/db';
import { handleError, sendResponse } from './utils';

const params = {};

const createReading = (req, res, next) => {
    return put(params)
        .then(sendResponse)
        .catch(handleError(next));
}

export default createReading;