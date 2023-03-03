const express = require("express");
const cors = require("cors");
const canvas = require("canvas");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.get("/", (req, res) => res.send({ message: "Hello world!" }));
app.get("/headline", async (req, res) => {
    // return res.send(req.query)
    const end_of_line = "\r\n"
    const config = {
        width: 800,
        height: 500,
        font: 'bold 48pt Arial',
        bgColor: '#f7ab07',
        textColor: '#ffffff',
        padding: 40,
        text: "Hello world!",
        ...req.query
    }
    const listKeyInt = ["width", "height", "padding"]
    for (const key of listKeyInt) {
        config[key] = parseInt(config[key])
    }
    const width = config.width
    const height = config.height
    const imageCanvas = canvas.createCanvas(width, height)
    const context = imageCanvas.getContext('2d')

    // create text
    context.font = config.font
    context.textBaseline = 'top'
    context.textAlign = 'left'

    const listText = config.text.split(" ")
    let firstText = listText.shift()
    let resultText = firstText
    while (listText.length) {
        firstText = listText.shift()
        if (
            context.measureText(resultText + ' ' + firstText).width >
            config.width - config.padding * 2
        ) {
            resultText += end_of_line + firstText
        } else {
            resultText += ' ' + firstText
        }
    }
    // console.log(resultText)
    const imgText = resultText
    const imgTextMeta = context.measureText(imgText)
    const textHeight = imgTextMeta.actualBoundingBoxAscent + imgTextMeta.actualBoundingBoxDescent

    // create box
    context.fillStyle = config.bgColor
    const rectTop = config.height - (textHeight + config.padding * 2)
    // const rectTop = 0
    context.fillRect(0, rectTop, config.width, textHeight + config.padding * 2)

    // add text
    context.fillStyle = config.textColor
    context.fillText(
        imgText,
        config.padding,
        rectTop + (config.padding * 2) / 3
    )

    res.writeHead(200, { "Content-Type": "image/png", });
    res.end(imageCanvas.toBuffer("image/png"));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
