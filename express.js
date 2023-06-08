import * as comments from './endpoints/comments.js';
import * as levels from './endpoints/levels.js';
import * as misc from './endpoints/misc.js';
import * as users from './endpoints/users.js';
import * as messages from './endpoints/messages.js'
import express from 'express';
//"http://boomlings.com/database/downloadGJLevel22.php"
//Wmfd2893gb7
//81207780
const app = express();
const port = process.env.PORT || 3000;
app.get('/levels/downloadLevel', (req, res) => {
    const id = req.query.id;
    levels.download(id).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
});
app.get('/misc/timely', (req, res) => {
    misc.timely(req.query.type.toLowerCase()).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    }
    )
})
app.get('/users/getUserInfo', (req, res) => {
    const username = req.query.username.toLowerCase();
    users.searchuser(username).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
});
app.get('/misc/getSongInfo', (req, res) => {
    const id = req.query.songid;
    misc.songinfo(id).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
});
app.get('/comments/getCommentHistory', (req, res) => {
    const user = req.query.username.toLowerCase();
    const page = req.query.page;
    const mode = req.query.mode.toLowerCase();
    comments.commentHistory(user, page, mode).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.get('/comments/getComments', (req, res) => {
    const id = req.query.id;
    const page = req.query.page;
    const mode = req.query.mode.toLowerCase();
    comments.comments(id, page, mode).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.get('/comments/getProfileComments', (req, res) => {
    const user = req.query.username.toLowerCase();
    const page = req.query.page;
    comments.profileComments(user, page).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.post('/comments/postComment', (req, res) => {
    const username = req.query.username.toLowerCase();
    const password = req.query.password.toLowerCase();
    const content = req.query.content.toLowerCase();
    const id = req.query.id;
    const percent = req.query.percent || 0;
    comments.comment(username, password, content, id, percent).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
});

app.post('/comments/postProfileComment', (req, res) => {
    const username = req.query.username.toLowerCase();
    const password = req.query.password.toLowerCase();
    const content = req.query.content.toLowerCase();
    comments.profileComment(username, password, content).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
}
);

app.delete('/comments/deleteComment', (req, res) => {
    const username = req.query.username.toLowerCase();
    const password = req.query.password.toLowerCase();
    const cid = req.query.commentid;
    const lid = req.query.levelid;
    comments.deleteComment(username, password, lid, cid).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.delete('/comments/deleteAccountComment', (req, res) => {
    const username = req.query.username.toLowerCase();
    const password = req.query.password.toLowerCase();
    const cid = req.query.commentid;
    comments.deleteAccountComment(username, password, cid).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.get('/messages/getMessages', (req, res) => {
    const username = req.query.username.toLowerCase();
    const password = req.query.password.toLowerCase();
    const page = req.query.page;
    const mode = req.query.mode.toLowerCase();
    messages.messages(username, password, page, mode).then(data => {
        res.statusCode = data['code'];
        res.send(data['payload']);
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))