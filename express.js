import { download, searchuser, songinfo, comment, profileComment } from './requests.js';
import express from 'express';
//"http://boomlings.com/database/downloadGJLevel22.php"
//Wmfd2893gb7
//81207780
const app = express();
const port = process.env.PORT || 3000;
app.get('/download', (req, res) => {
    const id = req.query.id;
    download(id).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
        console.log(data)
    })
});
app.get('/userInfo', (req, res) => {
    const username = req.query.username;
    searchuser(username).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
        console.log(data)
    })
});
app.get('/songInfo', (req, res) => {
    const id = req.query.songid;
    songinfo(id).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
        console.log(data)
    })
});
app.post('/postComment', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const content = req.query.content;
    const id = req.query.id;
    const percent = req.query.percent || 0;
    comment(username, password, content, id, percent).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
        console.log(data)
    })
});

app.post('/postProfileComment', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const content = req.query.content;
    profileComment(username, password, content).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
}
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))