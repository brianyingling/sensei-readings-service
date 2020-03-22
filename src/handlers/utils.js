const flatten = results => [].concat(...results);

const handleError = (next) => (e) => next(e); 

const sendResponse = res => data => res.send(data); 

export {
    flatten,
    handleError,
    sendResponse
};