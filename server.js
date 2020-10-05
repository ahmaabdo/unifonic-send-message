const Express = require('express');
const https = require('https')
const fs = require('fs')
const multer = require('multer');
const bodyParser = require('body-parser');

const app = Express();

app.use(bodyParser.json());

const port = process.env.PORT || 5000;
const filesDir = 'Files';
var fileName = "";
var objData = "";

const options = {
    hostname: 'sandbox.apis.unifonic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
        'PublicId': 'b4005d93-90cb-40be-82c7-e67946ad0958',
        'Secret': 'a4f695c03d2c451286f522efd7a3d2ac',
        'Content-Type': 'application/json'
    }
};


var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (fs.existsSync(filesDir)) {
            fs.rmdir(filesDir, { recursive: true }, (err) => {
                if (err) {
                    console.log(err)
                    throw err;
                }
                fs.mkdirSync(filesDir);
                callback(null, "./Files");
                console.log(`${filesDir} is deleted!`);
            });

        } else {
            fs.mkdirSync(filesDir);
            callback(null, "./Files");
        }

    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
        fileName = file.originalname;
    }
});

var upload = multer({ storage: Storage }).array("imgUploader", 1); //Field name and max count

app.use(Express.static("myWebApp/web"))

// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/index.html");
// });

app.post("/api/objData", function (req, res) {
    objData = req.body;
    return res.end();
});

app.get("/file.type", function (req, res) {
    console.log(fileName)
    res.sendFile(__dirname + "/Files/" + fileName);
});

app.post("/api/sendMessage/:contact/:channel/:type", function (req, res) {

    var contact = req.params.contact;
    var channel = req.params.channel;
    var type = req.params.type;

    if (!contact || !channel || !type) {
        return res.end(JSON.stringify({ "message": "Please check contact, channel and Phone number" }));
    }

    upload(req, res, function (err) {
        if (err) {
            console.log(err)
            return res.end(JSON.stringify({ "message": "Something went wrong!" }));
        }

        var data = JSON.stringify(
            {
                "recipient": {
                    "contact": contact,
                    "channel": channel
                },
                "content": {
                    "type": type,
                    "url": "https://sample-upload-multer.herokuapp.com/file.type"
                    // "url": "1234"
                }
            }
        );
        console.log(data)

        var sendMsgRequest = https.request(options, resp => {
            // console.log(`statusCode: ${resp.statusCode}`)

            resp.on('data', d => {
                process.stdout.write(d)
                // objData = {};
                return res.end(d);
            })
        });


        sendMsgRequest.on('error', error => {
            console.log('error')
            console.error(error)
        })

        sendMsgRequest.write(data);
        sendMsgRequest.end();
    });
});

app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});