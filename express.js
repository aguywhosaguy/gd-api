import * as requests from './requests.js';
import express from 'express';
//"http://boomlings.com/database/downloadGJLevel22.php"
//Wmfd2893gb7
//81207780
const app = express();
const port = process.env.PORT || 3000;
app.get('/download', (req, res) => {
    const id = req.query.id;
    requests.download(id).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
});
app.get('/timely', (req, res) => {
    requests.timely(req.query.type).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    }
    )
})
app.get('/userInfo', (req, res) => {
    const username = req.query.username;
    requests.searchuser(username).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
});
app.get('/songInfo', (req, res) => {
    const id = req.query.songid;
    requests.songinfo(id).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
});
app.get('/commentHistory', (req, res) => {
    const user = req.query.username;
    const page = req.query.page;
    const mode = req.query.mode;
    requests.commentHistory(user, page, mode).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.get('/comments', (req, res) => {
    const id = req.query.id;
    const page = req.query.page;
    const mode = req.query.mode;
    requests.comments(id, page, mode).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.get('/profileComments', (req, res) => {
    const user = req.query.username;
    const page = req.query.page;
    requests.profileComments(user, page).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.post('/postComment', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const content = req.query.content;
    const id = req.query.id;
    const percent = req.query.percent || 0;
    requests.comment(username, password, content, id, percent).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
});

app.post('/postProfileComment', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const content = req.query.content;
    requests.profileComment(username, password, content).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
}
);

app.delete('/deleteComment', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const cid = req.query.commentid;
    const lid = req.query.levelid;
    requests.deleteComment(username, password, lid, cid).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.delete('/deleteAccountComment', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const cid = req.query.commentid;
    requests.deleteAccountComment(username, password, cid).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.get('/messages', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const page = req.query.page;
    const mode = req.query.mode;
    requests.messages(username, password, page, mode).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))