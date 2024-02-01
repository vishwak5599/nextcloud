const axios = require('axios');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const nextcloudUrl = 'http://localhost:8080';


app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const pathOfFile = req.body.pathOfFile;
    const username = req.body.username;
    const password = req.body.password;

    const filePath = path.join('/remote.php/dav/files/vishwak5599', pathOfFile, file.originalname);
    const response = await axios.put(`${nextcloudUrl}${filePath}`, file.buffer, {
      auth: {
        username,
        password,
      },
      headers: {
        'Content-Type': file.mimetype,
      },
    });

    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file :', error.message);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.post('/api/download', async (req, res) => {
  try {
    const { fileName } = req.body;
    const username = process.env.USERNAMEFORNEXTCLOUD;
    const password = process.env.PASSWORDFORNEXTCLOUD;
    const filePathSegments = fileName.split('/');
    const filePath = path.join('/remote.php/dav/files/vishwak5599', ...filePathSegments);

    const response = await axios.get(`${nextcloudUrl}${filePath}`, {
      auth: {
        username,
        password,
      },
      responseType: 'stream',
    });

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error.message);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

app.post('/api/fetch', async (req, res) => {
  try {
    const { fileName } = req.body;
    const username = process.env.USERNAMEFORNEXTCLOUD;
    const password = process.env.PASSWORDFORNEXTCLOUD;
    const filePathSegments = fileName.split('/');
    const filePath = path.join('/remote.php/dav/files/vishwak5599', ...filePathSegments);

    const response = await axios.get(`${nextcloudUrl}${filePath}`, {
      auth: {
        username,
        password,
      },
      responseType: 'arraybuffer',
    });

    let contentType = "";
    const fileExtension = path.extname(fileName).toLowerCase();

    if (fileExtension === '.txt' || fileExtension==='.md' || fileExtension ==='.pem') {
      contentType = 'text/plain';
    } else if (fileExtension=== '.png' || fileExtension === '.jpeg' || fileExtension==='.jpg') {
      contentType = 'image/jpeg';
    }

    res.setHeader('Content-Type', contentType);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching file content:', error.message);
    res.status(500).json({ error: 'Failed to fetch file content!' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

let list = [1,2,3,4,5];
const listElements = list.map((id)=>{
  return id;
})

let list1 = [1,2,3,4,5];
const listElements1 = list.map((id)=>{
  return id;
})
console.log(listElements);
console.log(listElements1);