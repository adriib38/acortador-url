require("dotenv").config();
const { getUrlByShort, getUrlShorted } = require("../services/shortRoutesService.js");
const { Url } = require("../models/Url.js");
const AccessUrls = require("../models/AccessUrls.js");
const { validateUrl } = require("../utils/validationService.js");
const { v4: uuidv4 } = require('uuid');

//Recive a long URL and return a short URL
const shortRoute = async (req, res) => {
    let url = req.body.url;

    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
        return res.status(400).json({
            message: urlValidation.message,
        });
    }

    try {
        const result = await getUrlShorted(url, req.userUuid);
        return res.status(200).json({
            url: url,
            shortUrl: result,
        });
    } catch (err) {
        return res.status(500).json({
            error: "Error creating short URL",
        });
    }
};

const redirectToLongUrl = async (req, res) => {
    let short = `${process.env.URL_BASE_SHORT}/${req.params.ext}`;
    let longUrl = await getUrlByShort(short);

    if (!longUrl) {
        return res.status(404).json({
            error: "URL not found",
        });
    }

    saveAccessUrl(
        {
            uuid: uuidv4(),
            shortUrl: short, 
            url: longUrl.long,
            navigatorLenguage: req.headers['accept-language'],
            navigatorAgent: req.headers['user-agent'],
            createdAt: new Date(),
        }
    );

    return res.redirect(longUrl.long);
}


const saveAccessUrl = async (access) => {
    await AccessUrls.create(access);
}


module.exports = {
    shortRoute,
    redirectToLongUrl,
};