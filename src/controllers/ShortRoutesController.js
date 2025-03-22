require("dotenv").config();
const Shortener = require('../services/urlShorter.js');
const shortener = new Shortener();
const { getUrlByShort } = require('../services/urlShorter.js');   
const { Url, AccessUrls } = require('../Models/models.js');
const validateUrl = require("../utils/validateUrl.js");
const { v4: uuidv4 } = require('uuid');

const shortRoute = async (req, res) => {
    let url = validateUrl(req.body.url);

    if (!url) {
        return res.
            status(400).
            json({
                error: "URL is required",
            });
    }

    await shortener.getUrlShorted(url, (err, result) => {
        if (err) {
            return res.
                status(400).json({
                    error: "Invalid URL",
                });
        }
        return res.
            status(200).
            json({
                url: url,
                shortUrl: result,
            });
    });
}


const redirectToUrl = async (req, res) => {
    let short = `${process.env.URL_BASE_SHORT}/${req.params.ext}`;
    let url = await shortener.getUrlByShort(short);

    if (!url) {
        return res.status(404).json({
            error: "URL not found",
        });
    }

    saveAccessUrl(
        {
            uuid: uuidv4(),
            shortUrl: short, 
            url: url.long,
            navigatorLenguage: req.headers['accept-language'],
            navigatorAgent: req.headers['user-agent'],
            createdAt: new Date(),
        }
    );

    return res.redirect(url.long);
}


const saveAccessUrl = async (access) => {
    await AccessUrls.create(access);
}


module.exports = {
    shortRoute,
    redirectToUrl,
};