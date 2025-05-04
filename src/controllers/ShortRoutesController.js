const { v4: uuidv4 } = require('uuid');
const AccessUrls = require("../models/AccessUrls.js");
const { getUrlByShort, getUrlShorted, deleteShortUrlByUuid } = require("../services/shortRoutesService.js");
const { validateUrl, validateTimestamp } = require("../utils/validationService.js");
const { isDatePast } = require("../utils/validationDates.js");
const path = require("path");

require("dotenv").config();

//Recive a long URL and return a short URL
const shortRoute = async (req, res) => {
    let url = req.body.url;
    let expirationDate = req.body.expirationDate || null;

    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
        return res.status(400).json({
            message: urlValidation.message,
        });
    }

    //If exist expirationDate, validate it
    if (expirationDate) {
        const expirationDateValidation = validateTimestamp(expirationDate);

        if (!expirationDateValidation.valid) {
            return res.status(400).json({
                message: expirationDateValidation.message,
            });
        }

        //If expirationDate is in the past, return error
        if (isDatePast(expirationDate)) {
            return res.status(400).json({
                message: "Expiration date is in the past",
            });
        }
    }

    try {
        const urlShort = await getUrlShorted(url, expirationDate, req.userUuid);

        return res.status(200).json({
            short: urlShort.short,
            qrFileName: `${process.env.URL_BASE_SHORT}/static/qrs/${urlShort.qrFileName}`,
            expirationDate: urlShort.expirationDate,
        });
    } catch (err) {
        return res.status(500).json({
            error: "Error creating short URL",
            message: err.message,
        });
    }
};

const deleteShortUrl = async (req, res) => {
    let urlUuid = req.params.urlUuid;
    if (!urlUuid) {
        return res.status(400).json({
            error: "URL UUID is required",
        });
    }

    try {
        let isDeleted = await deleteShortUrlByUuid(urlUuid, req.userUuid);
        if (!isDeleted) {
            return res.status(404).json({
                error: "URL not found",
            });
        } else {
            return res.status(200).json({
                message: "URL deleted successfully",
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: "Error deleting URL",
            message: err.message,
        });
    } 
}

const redirectToLongUrl = async (req, res) => {
    let short = `${process.env.URL_BASE_SHORT}/${req.params.ext}`;
    let longUrl = await getUrlByShort(short);

    if (!longUrl) {
        // Url not found
        let filePath = path.join(__dirname, "..", "..", "public", "static", "404.html");
        return res.status(404).sendFile(filePath);
   
        // return res.status(404).json({
        //     error: "URL not found",
        // });
    }

    if(isDatePast(longUrl.expirationDate)) {
        let filePath = path.join(__dirname, "..", "..", "public", "static", "410.html");
        return res.status(410).sendFile(filePath);

        // return res.status(410).json({
        //     error: "URL expired",
        // });
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
    deleteShortUrl,
};