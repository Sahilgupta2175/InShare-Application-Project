const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = file.originalname;
        cb(null, uniqueName);
    }
});

let upload = multer({
    storage,
    limits: { fileSize: 1000000 * 100 }, // 100mb
}).single('myfile');

router.post('/', (req, res) => {
    // Store file
    upload(req, res, async (err) => {
        // console.log(req.file);
        // Validate request
        if (!req.file) {
            return res.json({ error: 'All fields are required.' });
        }

        if (err) {
            return res.status(500).send({ error: err.message });
        }
        // Store into Database 
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });

        const response = await file.save();
        return res.json({
            // url = http://localhost:8080/files/046522405-20skjhd2047.png
            file: `https://inshare-application-five.vercel.app/files/${response.uuid}`
        });
    });
});

router.post('/send', async (req, res) => {
    // console.log(req.body);
    // return res.send({});
    const {uuid, emailTo: emailReceiver, emailFrom: emailSender } = req.body;
    // Validate request
    if(!uuid || !emailReceiver || !emailSender) {
        return res.status(422).send({error: 'All fields are required.'});
    }

    // Get data from database
    const file = await File.findOne({uuid: uuid});
    if(file.sender) {
        return res.status(422).send({error: 'Email already sent.'});
    }
    
    file.sender = emailSender;
    file.receiver = emailReceiver;
    const response = await file.save();

    // Send email
    const sendMail = require('../services/emailService');
    sendMail({
        from: emailSender,
        to: emailReceiver,
        subject: 'InShare File Sharing',
        text: `${emailSender} shared a file with you.`,
        html: require('../services/emailTemplate')({
            emailFrom: emailSender,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + ' KB',
            expires: '24 hours'
        })
    });

    return res.send({success: true});
})

module.exports = router;