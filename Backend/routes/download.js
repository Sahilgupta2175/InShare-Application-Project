const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    const file = await File.findOne({uuid: req.params.uuid});
    if(!file) {
        return res.render('download', {error: 'Link has been expired'});
    }

    const filePath = `${file.path}`;
    res.download(filePath);
})

module.exports = router;