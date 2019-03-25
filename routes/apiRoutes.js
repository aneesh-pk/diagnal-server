const mongoose = require("mongoose");
const Media = require("../models/media");
const { _ } = require("lodash");
const INVALID_REQUEST_ERROR = {
    message: "Invalid request!"
};
const NOT_FOUND_ERROR = {
    message: "No data found!",
    found: 0
}

const handleMediaFetch = (req, res) => {
    try {
        let title = req.body.title;
        let page = req.body.page ? req.body.page : 1;
        let per_page = req.body.size ? req.body.size : 20;

        if(!title || title.trim().length == 0)
            throw INVALID_REQUEST_ERROR;

        Media.find({ title: title })
            .then((data) => {
                if (data && data.length > 0) {
                    let paginatedData = paginate(data, page, per_page);
                    res.status(200).json({
                        "title": title,
                        "total-content-items": data.length,
                        "page-num-requested": page,
                        "page-size-requested": per_page,
                        "page-size-returned": paginatedData.length,
                        "content-items": {
                            "content": paginatedData
                        }
                    });
                } else {
                    throw NOT_FOUND_ERROR;
                }
            }).catch(err => {
                res.status(500).send(err);
            });
    } catch (err) {
        res.status(500).send(err);
    }
}

const handleMediaSearch = (req, res) => {
    try {
        let title = req.body.title;
        let query_string = req.body.query_string;
        if(!title || !query_string || title.trim().length == 0 || query_string.trim().length == 0){
            throw INVALID_REQUEST_ERROR;
        } 
        Media.find({
            title: title,
            name: {
                $regex: new RegExp(".*" + query_string.toLowerCase() + ".*", "i") 
            }
        })
            .then((data) => {
                if (data && data.length > 0) {
                    data = formatMediaData(data);
                    res.status(200).json({
                        "title": title,
                        "query-string": query_string,
                        "found": data.length,
                        "content-items": {
                            "content": data
                        }
                    });
                    res.status(200).json();
                } else {
                    throw {
                        found: 0
                    };
                }
            }).catch(err => {
                res.status(500).send(NOT_FOUND_ERROR);
            });
    } catch (err) {
        res.status(500).send(err);
    }
}

const paginate = (data, page, per_page) => {
    let offset = (page - 1) * per_page;
    let paginatedData = _.drop(data, offset).slice(0, per_page);
    let formattedData = formatMediaData(paginatedData);
    return formattedData;
}

const formatMediaData = (paginatedData) => {
    let formattedData = _.map(paginatedData, function (o, key) {
        return _.omit(o.toObject(), "title");
    });
    return formattedData;
}


module.exports = app => {
    /**
     * paginated media fetch API
     */
    app.post('/get-media', (req, res) => handleMediaFetch(req, res));

    // /**
    //  * Media search API
    //  */
    app.post('/search-media', (req, res) => handleMediaSearch(req, res));

    app.get('/', (req, res) => {
        res.status(200).send("Welcome!");
    });
}