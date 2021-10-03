

const url = 'http://127.0.0.1:5001'

const get = (uri, params, callback) => {
    fetch(`${url}${uri}` + (params !== null ? ('?' + ( new URLSearchParams( params ) ).toString()) : ''), {method: 'GET'})
        .then(res => res.json())
        .then(res => callback(res))
        .catch(e => {
            console.error(e);
            callback({status: 'failed', info: 'Bad Network!'});
        });
};

const post = (uri, body, callback) => {
    fetch(`${url}${uri}`, {method: 'POST', body})
        .then(res => res.json())
        .then(res => callback(res))
        .catch(e => {
            console.error(e);
            callback({status: 'failed', info: 'Bad Network!'});
        });
};

const put = (uri, body, callback) => {
    fetch(`${url}${uri}`, {method: 'PUT', body})
        .then(res => res.json())
        .then(res => callback(res))
        .catch(e => {
            console.error(e);
            callback({status: 'failed', info: 'Bad Network!'});
        });
};

const del = (uri, callback = null) => {
    fetch(`${url}${uri}`, {method: 'DELETE'})
        .then(res => res.json())
        .then(res => callback(res))
        .catch(e => {
            console.error(e);
            callback({status: 'failed', info: 'Bad Network!'});
        });
};

export {get, post, put, del};