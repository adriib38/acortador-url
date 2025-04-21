require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { Url } = require("../Models/models");

const URL_BASE_SHORT = process.env.URL_BASE_SHORT;


class Shortener {
  async getUrlShorted(url, user, cb) {
    
    if (url === "") {
      return cb("Invalid URL", null);
    }
    
    const _uuid = uuidv4();
    const ext = _uuid.split("-")[0];

    const shortUrl = `${URL_BASE_SHORT}/${ext}`;

    const _url = await Url.create({
      uuid: _uuid,
      long: url,
      short: shortUrl,
      user: user
    });

    return cb(null, shortUrl);
  }

  async getUrlByShort(short) {
    const url = await Url.findOne({
      where: {
        short: short,
      },
    });

    return url;
  }
}



module.exports = Shortener;