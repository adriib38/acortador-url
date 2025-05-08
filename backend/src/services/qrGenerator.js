const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const getQrFromUrl = async (url, slug) => {
    try {
        const qrCode = await QRCode.toDataURL(url);
        let base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
        let name = `qr${slug}`;
        let filePath = path.join(__dirname, "..", "..", "public", "static", "qrs", `${name}.png`);

        fs.writeFileSync(filePath, base64Data, "base64", function (err) {
            console.log(err);
        });
    
        return `${name}.png`;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to generate QR code");
    }
}


module.exports = getQrFromUrl;
