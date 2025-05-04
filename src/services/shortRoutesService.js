const { v4: uuidv4 } = require("uuid");
const Url = require("../models/Url.js");
const accessUrls = require("../models/AccessUrls.js");
const getQrFromUrl = require("../services/qrGenerator.js");
const e = require("express");
const URL_BASE_SHORT = process.env.URL_BASE_SHORT;

require("dotenv").config();

const getUrlShorted = async (url, expirationDate=null, user) => {
  try {
    const urlUuid = uuidv4();
    const ext = urlUuid.split("-")[0];

    const shortUrl = `${URL_BASE_SHORT}/${ext}`;
    const qr = await getQrFromUrl(shortUrl, ext);

    await Url.create({
      uuid: urlUuid,
      long: url,
      short: shortUrl,
      qrFileName: qr,
      expirationDate: expirationDate,
      user: user,
    });
    return {
      short: shortUrl,
      qrFileName: qr,
      expirationDate: expirationDate,
    };
  } catch (error) {
    throw new Error("Error creating short URL");
  }
};

const getUrlByShort = async (short) => {
  try {
    const url = await Url.findOne({
      where: {
        short: short,
      },
    });
    if (!url) {
      throw new Error("URL not found");
    }
    return url;
  } catch (error) {
    console.error("Error retrieving URL:", short, error);
    throw new Error("Error retrieving URL");
  }
};

const getEndpointsByUser = async (user) => {
  try {
    const urls = await Url.findAll({
      where: {
        user: user,
      },
      attributes: ["long", "short", "expirationDate", "qrFileName", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    const urlsWithVisits = await Promise.all(
      urls.map(async (url) => {
        console.log(url);
        const visits = await accessUrls.count({
          where: {
            shortUrl: url.dataValues.short,
          },
        });
        return {
          long: url.long,
          short: url.short,
          expirationDate: url.expirationDate,
          isExpired: url.expirationDate ? new Date(url.expirationDate) < new Date() : false,
          qrFileName: `${process.env.URL_BASE_SHORT}/static/qrs/${url.qrFileName}`,
          createdAt: url.createdAt,
          visits: visits,
        };
      })
    );
    return urlsWithVisits;
  } catch (error) {
    console.error("Error retrieving URLs:", error);
    throw new Error("Error retrieving URLs");
  }
}

module.exports = {
  getUrlShorted,
  getUrlByShort,
  getEndpointsByUser,
}