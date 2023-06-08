import * as utils from "../utils.js"
import * as users from "./users.js"
import * as levels from "./levels.js"


async function comment(username, password, comment, levelID, percent) {
    //salt: 0xPT6iUrtws0J
    //key: 29481
    if (percent > 100 || percent < 0) {
        return {code: 400, payload: {message: "Percentage out of range"}}
    } else if (comment.length > 100) {
        return {code: 400, payload: {message: "Comment too long"}}
    }
    let userinfo = await users.searchuser(username)
    if (userinfo['code'] == 200) {
        var accid = userinfo['payload']['accountID']
    } else {
        return userinfo
    }
    let bcomment = utils.b64(comment, false)
    password = utils.gjp(password)
    let data = {
        accountID: accid,
        gjp: password,
        userName: username,
        comment: bcomment,
        levelID: levelID,
        percent: percent,
        chk: utils.chk([username, bcomment, levelID, percent, 0], "29481", "xPT6iUrtws0J"),
        secret: "Wmfd2893gb7"
    }
    let values = await utils.request('http://www.boomlings.com/database/uploadGJComment21.php', data)
    if (parseInt(values) == -1) {
        return {code: 400, payload: "Invalid request"}
    } else {
        return {code: 201, payload: values}
    }
}
async function profileComment(username, password, comment) {
    let userinfo = await users.searchuser(username)
    if (userinfo['code'] == 200) {
        var accid = userinfo['payload']['accountID']
    } else {
        return userinfo
    }
    let data = {
        accountID: accid,
        gjp: utils.gjp(password),
        comment: utils.b64(comment, false),
        secret: "Wmfd2893gb7"
    }
    let values = await utils.request('http://www.boomlings.com/database/uploadGJAccComment20.php', data)
    if (parseInt(values) == -1) {
        return {code: 400, payload: "Invalid request"}
    } else {
        return {code: 201, payload: values}
    }
}

async function deleteComment(username, password, levelID, commentID) {
    let userinfo = await users.searchuser(username)
    if (userinfo['code'] == 200) {
        var accid = userinfo['payload']['accountID']
    } else {
        return {code: 400, payload: "User not found"}
    }
    let data = {
        accountID: accid,
        gjp: utils.gjp(password),
        commentID: commentID,
        levelID: levelID,
        secret: "Wmfd2893gb7"
    }
    let values = await utils.request('http://www.boomlings.com/database/deleteGJComment20.php', data)
    if (parseInt(values) == 1) {
        return {code: 200, payload: "Comment deleted"}
    } else {
        return {code: 400, payload: "Invalid request"}
    }
}
async function deleteAccountComment(username, password, commentID) {
    let userinfo = await users.searchuser(username)
    if (userinfo['code'] == 200) {
        var accid = userinfo['payload']['accountID']
    } else {
        return {code: 400, payload: "User not found"}
    }
    let data = {
        accountID: accid,
        gjp: utils.gjp(password),
        commentID: commentID,
        secret: "Wmfd2893gb7"
    }
    let values = await utils.request('http://www.boomlings.com/database/deleteGJAccComment20.php', data)
    if (parseInt(values) == 1) {
        return {code: 200, payload: "Comment deleted"}
    } else {
        return {code: 400, payload: "Invalid request"}
    }
}

async function commentHistory(username, page, mode = "recent") {
    page = page - 1
    if (mode == "recent") {
        mode = 0
    } else if (mode == "liked") {
        mode = 1
    }
    let userinfo = await users.searchuser(username)
    if (userinfo['code'] == 200) {
        var usid = userinfo['payload']['userID']
    } else {
        return {code: 400, payload: "User not found or invalid comment history mode"}
    }
    let data = {
        userID: usid,
        page: page,
        mode: mode,
        secret: "Wmfd2893gb7"
    }
    let cvalues = await utils.request('http://www.boomlings.com/database/getGJCommentHistory.php', data)
    if (parseInt(cvalues) == -1) {
        return {code: 400, payload: "Invalid request"}
    } else {
        let values = []
        let arr = utils.commentsplitter(cvalues, true)
        let objs = []
        for (let i = 0; i < arr.length; i++) {
            let topush = []
            let comment = utils.commentsplitter(arr[i])
            for (let j = 0; j < 2; j++) {
                topush.push(utils.splitter(comment[j], "~"))
            }
            objs.push(topush)
        }
        for (let i = 0; i < objs.length; i++) {
            let topush = {}
            let object = objs[i]
            let comobj = object[0]
            let userobj = object[1]
            topush['levelID'] = parseInt(comobj[1])
            let resp = await levels.download(topush['levelID'])
            if (resp['code'] == 200) {
                topush['level'] = resp['payload']['title']
            } else {
                topush['level'] = "Level not found"
            }
            topush['comment'] = utils.b64(comobj[2])
            topush['likes'] = parseInt(comobj[4])
            topush['username'] = userobj[1]
            if (comobj[7]) {
                topush['spam'] = true
            } else {
                topush['spam'] = false
            }
            topush['age'] = comobj[9]
            topush['percent'] = parseInt(comobj[10])
            switch (parseInt(comobj[11])) {
                case 0:
                    topush['moderatorStatus'] = "none"
                    break;
                case 1:
                    topush['moderatorStatus'] = "moderator"
                    break;
                case 2:
                    topush['moderatorStatus'] = "elder moderator"
                    break;
                default:
                    topush['moderatorStatus'] = "none"
                    break;
            }
            topush['icon'] = userobj[9]
            topush['primaryColor'] = parseInt(userobj[10])
            topush['secondaryColor'] = parseInt(userobj[11])
            if (parseInt(userobj[15]) == 0) {
                topush['glow'] = false
            } else {
                topush['glow'] = true
            }
            switch (parseInt(userobj[14])) {
                case 0:
                    topush['gamemode'] = "cube"
                    break;
                case 1:
                    topush['gamemode'] = "ship"
                    break;
                case 2:
                    topush['gamemode'] = "ball"
                    break;
                case 3:
                    topush['gamemode'] = "ufo"
                    break;
                case 4:
                    topush['gamemode'] = "wave"
                    break;
                case 5:
                    topush['gamemode'] = "robot"
                    break;
                case 6:
                    topush['gamemode'] = "spider"
                    break;
                default:
                    topush['gamemode'] = "cube"
                    break;
            }
            values.push(topush)
        }
        return {code: 200, payload: values}
    }
}

async function comments(id, page = 1, mode = "recent") {
    page = page - 1
    if (mode == "recent") {
        mode = 0
    } else {
        mode = 1
    }
    let data = {
        levelID: id,
        page: page,
        mode: mode,
        secret: "Wmfd2893gb7"
    }
    let cvalues = await utils.request('http://www.boomlings.com/database/getGJComments21.php', data)
    cvalues = cvalues.split("#")[0]
    console.log(cvalues)
    if (parseInt(cvalues) == -1) {
        return {code: 400, payload: "Invalid request"}
    } else {
        let values = []
        let arr = cvalues.split("|")
        let objs = []
        for (let i = 0; i < arr.length; i++) {
            const up = arr[i].split(":")
            objs.push([utils.splitter(up[0], "~"), utils.splitter(up[1], "~")])
        }
        for (let i = 0; i < objs.length; i++) {
            let topush = {}
            let object = objs[i]
            let comobj = object[0]
            let userobj = object[1]
            topush['levelID'] = id
            let resp = await levels.download(topush['levelID'])
            if (resp['code'] == 200) {
                topush['level'] = resp['payload']['title']
            } else {
                topush['level'] = "Level not found"
            }
            topush['comment'] = utils.b64(comobj[2])
            topush['likes'] = parseInt(comobj[4])
            topush['username'] = userobj[1]
            if (comobj[7]) {
                topush['spam'] = true
            } else {
                topush['spam'] = false
            }
            topush['age'] = comobj[9]
            topush['percent'] = parseInt(comobj[10])
            switch (parseInt(comobj[11])) {
                case 0:
                    topush['moderatorStatus'] = "none"
                    break;
                case 1:
                    topush['moderatorStatus'] = "moderator"
                    break;
                case 2:
                    topush['moderatorStatus'] = "elder moderator"
                    break;
                default:
                    topush['moderatorStatus'] = "none"
                    break;
            }
            topush['icon'] = userobj[9]
            topush['primaryColor'] = parseInt(userobj[10])
            topush['secondaryColor'] = parseInt(userobj[11])
            if (parseInt(userobj[15]) == 0) {
                topush['glow'] = false
            } else {
                topush['glow'] = true
            }
            switch (parseInt(userobj[14])) {
                case 0:
                    topush['gamemode'] = "cube"
                    break;
                case 1:
                    topush['gamemode'] = "ship"
                    break;
                case 2:
                    topush['gamemode'] = "ball"
                    break;
                case 3:
                    topush['gamemode'] = "ufo"
                    break;
                case 4:
                    topush['gamemode'] = "wave"
                    break;
                case 5:
                    topush['gamemode'] = "robot"
                    break;
                case 6:
                    topush['gamemode'] = "spider"
                    break;
                default:
                    topush['gamemode'] = "cube"
                    break;
            }
            values.push(topush)
        }
        return {code: 200, payload: values}
    }
}

async function profileComments(username, page = 1) {
    page = page - 1
    let values = []
    let userinfo = await users.searchuser(username)
    if (userinfo['code'] == 200) {
        let data = {
            accountID: userinfo['payload']['accountID'],
            page: page,
            secret: "Wmfd2893gb7"
        }
        let cvalues = await utils.request('http://www.boomlings.com/database/getGJAccountComments20.php', data)
        if (parseInt(cvalues) == -1) {
            return {code: 400, payload: "Invalid request"}
        }
        let split = utils.commentsplitter(cvalues, true)
        for (let i = 0; i < split.length; i++) {
            let topush = {}
            let comment = utils.splitter(split[i], "~")
            try {
                topush["comment"] = utils.b64(comment[2])
            } catch (e) {
                return {code: 400, payload: "Invalid request"}
            }
            topush["likes"] = parseInt(comment[4])
            topush["age"] = comment[9]
            topush["id"] = parseInt(comment[6])
            values.push(topush)
        }
        console.log(values)
        return {code: 200, payload: values}
    } else {
        return {code: 400, payload: "Invalid request"}
    }
}

export {comment, commentHistory, comments, profileComment, profileComments, deleteComment, deleteAccountComment}