import * as crypto from './crypto.js';
import fetch from 'node-fetch'
async function request(url, data) {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'User-Agent': '',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
    })
    let text = await response.text()
    return text
}




async function songinfo(songid) {
    let data = {
        songID: songid,
        secret: "Wmfd2893gb7"
    }
    let values = await request('http://www.boomlings.com/database/getGJSongInfo.php', data)
    if (values == "-1") {
        return {code: 400, payload: {message: "Song not found"}}
    } else {
        values = values + "~|~"
        values = crypto.splitter(values, "~|~")
        let payload = {}
        payload['songID'] = parseInt(songid)
        payload['songName'] = values[2]
        payload['artistID'] = parseInt(values[3])
        payload['artistName'] = values[4]
        payload['size'] = parseInt(values[5])
        payload['youtubeVideoID'] = values[6]
        payload['artistYoutube'] = values[7]
        parseInt(values[8]) == 1 ? payload['scouted'] = true : payload['scouted'] = false
        payload['songPriority'] = parseInt(values[9])
        payload['mp3'] = values[10]
        return {code: 200, payload: payload}
    }
}





const mainSongs = {
    //list of data replacements for the main songs in the 2013 game geometry dash. 
    1: {
        name: "Stereo Madness",
        id: -1,
        artist: "ForeverBound"
    },
    2: {
        name: "Back On Track",
        id: -2,
        artist: "DJVI"
    },
    3: {
        name: "Polargeist",
        id: -3,
        artist: "Step"
    },
    4: {
        name: "Dry Out",
        id: -4,
        artist: "DJVI"
    },
    5: {
        name: "Base After Base",
        id: -5,
        artist: "DJVI"
    },
    6: {
        name: "Cant Let Go",
        id: -6,
        artist: "DJVI"
    },
    7: {
        name: "Jumper",
        id: -7,
        artist: "Waterflame"
    },
    8: {
        name: "Time Machine",
        id: -8,
        artist: "Waterflame"
    },
    9: {
        name: "Cycles",
        id: -9,
        artist: "DJVI"
    },
    10: {
        name: "xStep",
        id: -10,
        artist: "DJVI"
    },
    11: {
        name: "Clutterfunk",
        id: -11,
        artist: "Waterflame"
    },
    12: {
        name: "Theory of Everything",
        id: -12,
        artist: "dj-Nate"
    },
    13: {
        name: "Electroman Adventures",
        id: -13,
        artist: "Waterflame"
    },
    14: {
        name: "Clubstep",
        id: -14,
        artist: "dj-Nate"
    },
    15: {
        name: "Electrodynamix",
        id: -15,
        artist: "dj-Nate"
    },
    16: {
        name: "Hexagon Force",
        id: -16,
        artist: "Waterflame"
    },
    17: {
        name: "Blast Processing",
        id: -17,
        artist: "Waterflame"
    },
    18: {
        name: "Theory of Everything 2",
        id: -18,
        artist: "dj-Nate"
    },
    19: {
        name: "Geometrical Dominator",
        id: -19,
        artist: "Waterflame"
    },
    20: {
        name: "Deadlocked",
        id: -20,
        artist: "F-777"
    },
    21: {
        name: "Fingerdash",
        id: -21,
        artist: "MDK"
    },
    22: {
        name: "The Seven Seas",
        id: -22,
        artist: "F-777"
    },
    23: {
        name: "Viking Arena",
        id: -23,
        artist: "F-777"
    },
    24: {
        name: "Airbone Robots",
        id: -24,
        artist: "F-777"
    },
    25: {
        name: "Secret",
        id: -25,
        artist: "RobTop"
    },
    26: {
        name: "Payload",
        id: -26,
        artist: "Dex Arson"
    },
    27: {
        name: "Beast Mode",
        id: -27,
        artist: "Dex Arson"
    },
    28: {
        name: "Machina",
        id: -28,
        artist: "Dex Arson"
    },
    29: {
        name: "Years",
        id: -29,
        artist: "Dex Arson"
    },
    30: {
        name: "Frontlines",
        id: -30,
        artist: "Dex Arson"
    },
    31: {
        name: "Space Pirates",
        id: -31,
        artist: "Waterflame"
    },
    32: {
        name: "Striker",
        id: -32,
        artist: "Waterflame"
    },
    33: {
        name: "Embers",
        id: -33,
        artist: "Dex Arson"
    },
    34: {
        name: "Round 1",
        id: -34,
        artist: "Dex Arson"
    },
    35: {
        name: "Monster Dance Off",
        id: -35,
        artist: "F-777"
    }
}

async function download(id) {
    let data = {
        levelID: id,
        secret: "Wmfd2893gb7"
    } 
    let values = await request('http://www.boomlings.com/database/downloadGJLevel22.php', data)
    if (values != "-1") {
        let payload = {}
        values = crypto.splitter(values, ":")
        payload['id'] = parseInt(values[1])
        payload['title'] = values[2]
        crypto.b64(values[3]) == "" ? payload['description'] = "(No description provided)" : payload['description'] = crypto.b64(values[3])
        let creatordata = await searchuser(values[6])
        if (creatordata['code'] == 200) {
            payload['creator'] = creatordata['payload']['username']
            payload['creatorUserID'] = parseInt(creatordata['payload']['userID'])
            payload['creatorAccountID'] = parseInt(creatordata['payload']['accountID'])
        } else {
            payload['creator'] = "-"
            payload['creatorUserID'] = parseInt(values[6])
            payload['creatorAccountID'] = null
        }
        payload['likes'] = parseInt(values[14])
        payload['downloads'] = parseInt(values[10])
        payload['stars'] = parseInt(values[18])
        switch (parseInt(values[9])) {
            case 0:
                payload['difficulty'] = "n/a"
                break
            case 10:
                if (values[17] == "1") {
                    payload['difficulty'] = "easy demon"
                } else {
                    payload['difficulty'] = "easy"
                }
                break
            case 20:
                if (values[17] == "1") {
                    payload['difficulty'] = "medium demon"
                } else {
                    payload['difficulty'] = "normal"
                }
                break
            case 30:
                if (values[17] == "1") {
                    payload['difficulty'] = "hard demon"
                } else {
                    payload['difficulty'] = "hard"
                }
                break
            case 40:
                if (values[17] == "1") {
                    payload['difficulty'] = "insane demon"
                } else {
                    payload['difficulty'] = "harder"
                }
                break
            case 50:
                if (values[17] == "1") {
                    payload['difficulty'] = "extreme demon"
                } else {
                    payload['difficulty'] = "insane"
                }
                break
            default:
                payload['difficulty'] = "unavailable"
                break
        }
        payload['version'] = parseInt(values[5])
        switch (parseInt(values[15])) {
            case 0:
                payload['length'] = "tiny"
                break
            case 1:
                payload['length'] = "short"
                break
            case 2:
                payload['length'] = "medium"
                break
            case 3:
                payload['length'] = "long"
                break
            case 4:
                payload['length'] = "xl"
                break
            default:
                payload['length'] = "unavailable"
                break
        }
        switch (parseInt(values[13])) {
            case 1:
                payload['gameVersion'] = "1.0"
                break
            case 2:
                payload['gameVersion'] = "1.1"
                break
            case 3:
                payload['gameVersion'] = "1.2"
                break
            case 4:
                payload['gameVersion'] = "1.3"
                break
            case 5:
                payload['gameVersion'] = "1.4"
                break
            case 6:
                payload['gameVersion'] = "1.5"
                break
            case 7:
                payload['gameVersion'] = "1.6"
                break
            case 10:
                payload['gameVersion'] = "1.7"
                break
            default:
                if (values[13] >= 18) {
                    payload['gameVersion'] = values[13] / 10
                } else {
                    payload['gameVersion'] = "unavailable"
                }
                break
        }
        parseInt(values[17]) == 1 ? payload['demon'] = true : payload['demon'] = false
        switch (payload['stars']) {
            case 2:
                payload['orbs'] = 50
                payload['diamonds'] = 4
                break
            case 3:
                payload['orbs'] = 75
                payload['diamonds'] = 5
                break
            case 4:
                payload['orbs'] = 125
                payload['diamonds'] = 6
                break
            case 5:
                payload['orbs'] = 150
                payload['diamonds'] = 7
                break
            case 6:
                payload['orbs'] = 225
                payload['diamonds'] = 8
                break
            case 7:
                payload['orbs'] = 275
                payload['diamonds'] = 9
                break
            case 8:
                payload['orbs'] = 350
                payload['diamonds'] = 10
                break
            case 9:
                payload['orbs'] = 425
                payload['diamonds'] = 11
                break
            case 10:
                payload['orbs'] = 500
                payload['diamonds'] = 12
                break
            default:
                payload['orbs'] = 0
                payload['diamonds'] = 0
                break
        }
        payload['coins'] = parseInt(values[37])
        parseInt(values[38]) == 1 ? payload['verifiedCoins'] = true : payload['verifiedCoins'] = false
        payload['starsRequested'] = parseInt(values[39])
        parseInt(values[40]) == 1 ? payload['lowDetail'] = true : payload['lowDetail'] = false
        parseInt(values[44]) == 1 ? payload['inGauntlet'] = true : payload['inGauntlet'] = false
        payload['objects'] = parseInt(values[45])
        payload['objects'] == 40000 ? payload['large'] = true : payload['large'] = false
        if (parseInt(values[35])) {
            let sinfo = await songinfo(parseInt(values[35]))
            if (sinfo['code'] == 200) {
                payload['song'] = sinfo['payload']['songName']
                payload['songID'] = parseInt(sinfo['payload']['songID'])
                payload['songArtist'] = sinfo['payload']['artistName']
            } else {
                payload['song'] = "-"
                payload['songID'] = null
                payload['songArtist'] = "-"
            }
        } else {
            const songinfo = mainSongs[parseInt(values[12]) + 1]
            payload['song'] = songinfo['name']
            payload['songID'] = parseInt(songinfo['id'])
            payload['songArtist'] = songinfo['artist']
        }
        let passone = crypto.xor(values[27], "26364")
        parseInt(values[19]) == 0 ? payload['featured'] = false : payload['featured'] = true
        parseInt(values[42]) == 0 ? payload['epic'] = false : payload['epic'] = true
        parseInt(values[25]) == 1 ? payload['auto'] = true : payload['auto'] = false
        parseInt(values[30]) == id ? payload['copied'] = false : payload['copied'] = true
        payload['copiedLevel'] = parseInt(values[30])
        payload['editorTime'] = parseInt(values[46])
        payload['editorTimeInCopies'] = parseInt(values[47])
        crypto.xor(values[27], "26364") == "1" ? payload['password'] = 0 : payload['password'] = crypto.xor(values[27], "26364").substring(1, crypto.xor(values[27], "26364").length)
        payload['uploadedAt'] = values[28]
        payload['updatedAt'] = values[29]
        return {code: 200, payload: payload}
    } else {
        return {code: 400, payload: {message: "Level not found"}}
    }
}

async function searchuser(username) {
    let accountid = false
    let failed = false
    let data = {
        str: username,
        secret: "Wmfd2893gb7"
    }
    let values = await request('http://www.boomlings.com/database/getGJUsers20.php', data)
    if (values == "-1") {
        values = await request('http://www.boomlings.com/database/getGJUserInfo20.php', {targetAccountID: username, secret: "Wmfd2893gb7"})
        if (values == "-1") {
            failed = true
            return {code: 400, payload: {message: "User not found"}}
        } else {
            accountid = true
        }
    }
    
    if (!failed) {
        if (!accountid) {
            values = crypto.splitter(values, ":")
            data = {
                targetAccountID: parseInt(values[16]),
                secret: "Wmfd2893gb7"
            }
            values = await request('http://www.boomlings.com/database/getGJUserInfo20.php', data)
        }
        values = crypto.splitter(values, ":")
        let payload = {}
        payload['username'] = values[1]
        payload['userID'] = parseInt(values[2])
        if (payload['userID'] === null) {
            return null
        }
        payload['accountID'] = parseInt(values[16])
        payload['stars'] = parseInt(values[3])
        payload['diamonds'] = parseInt(values[46])
        payload['demons'] = parseInt(values[4])
        payload['creatorPoints'] = parseInt(values[8])
        payload['primaryColor'] = parseInt(values[10])
        payload['secondaryColor'] = parseInt(values[11])
        switch (parseInt(values[49])) {
            case 0:
                payload['moderatorStatus'] = "none"
                break
            case 1:
                payload['moderatorStatus'] = "moderator"
                break
            case 2:
                payload['moderatorStatus'] = "elder moderator"
                break
            default:
                payload['moderatorStatus'] = "unknown"
                break
        }
        payload['goldCoins'] = parseInt(values[13])
        payload['silverCoins'] = parseInt(values[17])
        switch (parseInt(values[18])) {
            case 0:
                payload['messagePolicy'] = "all"
                break
            case 1:
                payload['messagePolicy'] = "friends"
                break
            default:
                payload['messagePolicy'] = "none"
                break
        }
        parseInt(values[19]) == 0 ? payload['friendPolicy'] = "all" : payload['friendPolicy'] = "none"
        switch (parseInt(values[50])) {
            case 0:
                payload['commentHistoryPolicy'] = "all"
                break
            case 1:
                payload['commentHistoryPolicy'] = "friends"
                break
            default:
                payload['commentHistoryPolicy'] = "none"
                break
        }
        payload['cube'] = parseInt(values[21])
        payload['ship'] = parseInt(values[22])
        payload['ball'] = parseInt(values[23])
        payload['ufo'] = parseInt(values[24])
        payload['wave'] = parseInt(values[25])
        payload['robot'] = parseInt(values[26])
        payload['spider'] = parseInt(values[43])
        payload['explosion'] = parseInt(values[48])
        payload['youtube'] = values[20]
        payload['twitter'] = values[44]
        payload['twitch'] = values[45] 
        return {code: 200, payload: payload}
    }
}
async function comment(username, password, comment, levelID, percent) {
    //salt: 0xPT6iUrtws0J
    //key: 29481
    if (percent > 100 || percent < 0) {
        return {code: 400, payload: {message: "Percentage out of range"}}
    } else if (comment.length > 100) {
        return {code: 400, payload: {message: "Comment too long"}}
    }
    let userinfo = await searchuser(username)
    if (userinfo['code'] == 200) {
        var accid = userinfo['payload']['accountID']
    } else {
        return userinfo
    }
    let bcomment = crypto.b64(comment, false)
    password = crypto.gjp(password)
    let data = {
        accountID: accid,
        gjp: password,
        userName: username,
        comment: bcomment,
        levelID: levelID,
        percent: percent,
        chk: crypto.chk([username, bcomment, levelID, percent, 0], "29481", "xPT6iUrtws0J"),
        secret: "Wmfd2893gb7"
    }
    let values = await request('http://www.boomlings.com/database/uploadGJComment21.php', data)
    if (parseInt(values) == -1) {
        return {code: 400, payload: "Invalid request"}
    } else {
        return {code: 201, payload: values}
    }
}
async function profileComment(username, password, comment) {
    let userinfo = await searchuser(username)
    if (userinfo['code'] == 200) {
        var accid = userinfo['payload']['accountID']
    } else {
        return userinfo
    }
    let data = {
        accountID: accid,
        gjp: crypto.gjp(password),
        comment: crypto.b64(comment, false),
        secret: "Wmfd2893gb7"
    }
    let values = await request('http://www.boomlings.com/database/uploadGJAccComment20.php', data)
    if (parseInt(values) == -1) {
        return {code: 400, payload: "Invalid request"}
    } else {
        return {code: 201, payload: values}
    }
}

async function deleteComment(username, password, levelID, commentID) {
    let userinfo = await searchuser(username)
    if (userinfo['code'] == 200) {
        var accid = userinfo['payload']['accountID']
    } else {
        return {code: 400, payload: "User not found"}
    }
    let data = {
        accountID: accid,
        gjp: crypto.gjp(password),
        commentID: commentID,
        levelID: levelID,
        secret: "Wmfd2893gb7"
    }
    let values = await request('http://www.boomlings.com/database/deleteGJComment20.php', data)
    if (parseInt(values) == 1) {
        return {code: 200, payload: "Comment deleted"}
    } else {
        return {code: 400, payload: "Invalid request"}
    }
}
async function deleteAccountComment(username, password, commentID) {
    let userinfo = await searchuser(username)
    if (userinfo['code'] == 200) {
        var accid = userinfo['payload']['accountID']
    } else {
        return {code: 400, payload: "User not found"}
    }
    let data = {
        accountID: accid,
        gjp: crypto.gjp(password),
        commentID: commentID,
        secret: "Wmfd2893gb7"
    }
    let values = await request('http://www.boomlings.com/database/deleteGJAccComment20.php', data)
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
    let userinfo = await searchuser(username)
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
    let cvalues = await request('http://www.boomlings.com/database/getGJCommentHistory.php', data)
    if (parseInt(cvalues) == -1) {
        return {code: 400, payload: "Invalid request"}
    } else {
        let values = []
        let arr = crypto.commentsplitter(cvalues, true)
        let objs = []
        for (let i = 0; i < arr.length; i++) {
            let topush = []
            let comment = crypto.commentsplitter(arr[i])
            for (let j = 0; j < 2; j++) {
                topush.push(crypto.splitter(comment[j], "~"))
            }
            objs.push(topush)
        }
        for (let i = 0; i < objs.length; i++) {
            let topush = {}
            let object = objs[i]
            let comobj = object[0]
            let userobj = object[1]
            topush['levelID'] = parseInt(comobj[1])
            let resp = await download(topush['levelID'])
            if (resp['code'] == 200) {
                topush['level'] = resp['payload']['title']
            } else {
                topush['level'] = "Level not found"
            }
            topush['comment'] = crypto.b64(comobj[2])
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

async function comments(id, page, mode = "recent") {
    page = page - 1
    if (mode == "recent") {
        mode = 0
    } else if (mode == "liked") {
        mode = 1
    }
    let data = {
        levelID: id,
        page: page,
        mode: mode,
        secret: "Wmfd2893gb7"
    }
    let cvalues = await request('http://www.boomlings.com/database/getGJComments21.php', data)
    if (parseInt(cvalues) == -1) {
        return {code: 400, payload: "Invalid request"}
    } else {
        let values = []
        let arr = crypto.commentsplitter(cvalues, true)
        let objs = []
        for (let i = 0; i < arr.length; i++) {
            let topush = []
            let comment = crypto.commentsplitter(arr[i])
            for (let j = 0; j < 2; j++) {
                topush.push(crypto.splitter(comment[j], "~"))
            }
            objs.push(topush)
        }
        for (let i = 0; i < objs.length; i++) {
            let topush = {}
            let object = objs[i]
            let comobj = object[0]
            let userobj = object[1]
            topush['levelID'] = id
            let resp = await download(topush['levelID'])
            if (resp['code'] == 200) {
                topush['level'] = resp['payload']['title']
            } else {
                topush['level'] = "Level not found"
            }
            topush['comment'] = crypto.b64(comobj[2])
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

async function profileComments(username, page) {
    page = page - 1
    let values = []
    let userinfo = await searchuser(username)
    if (userinfo['code'] == 200) {
        let data = {
            accountID: userinfo['payload']['accountID'],
            page: page,
            secret: "Wmfd2893gb7"
        }
        let cvalues = await request('http://www.boomlings.com/database/getGJAccountComments20.php', data)
        if (parseInt(cvalues) == -1) {
            return {code: 400, payload: "Invalid request"}
        }
        let split = crypto.commentsplitter(cvalues, true)
        for (let i = 0; i < split.length; i++) {
            let topush = {}
            let comment = crypto.splitter(split[i], "~")
            try {
                topush["comment"] = crypto.b64(comment[2])
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
async function timely(type = "daily") {
    type == "daily" ? type = 1 : type = 0
    let data = {
        weekly: type,
        secret: "Wmfd2893gb7"
    }
    let cvalues = await request('http://www.boomlings.com/database/getGJDailyLevel.php', data)
    let index = [...cvalues.matchAll(/\|/g)][0].index
    if (parseInt(cvalues) == -1) {
        return {code: 400, payload: "Invalid request"}
    } else {
        return {code: 200, payload: {id: parseInt(cvalues.substring(0, index)), secondsLeft: parseInt(cvalues.substring(index + 1))}}
    }
}
async function messages(username, password, page = 1, mode = "received") {
    page = page - 1
    let accountID
    if (mode == "received") {
        mode = 0
    } else if (mode == "sent") {
        mode = 1
    }
    let userinfo = await searchuser(username)
    if (userinfo['code'] == 200) {
        accountID = userinfo['payload']['accountID']
    } else {
        return {code: 400, payload: "Invalid request"}
    }
    let data = {
        accountID: accountID,
        gjp: crypto.gjp(password),
        page: page,
        getSent: mode,
        secret: "Wmfd2893gb7"
    }
    let cvalues = await request('http://www.boomlings.com/database/getGJMessages20.php', data)
    if (parseInt(cvalues) == -1) {
        return {code: 400, payload: "Invalid request"}
    }
    let split = crypto.commentsplitter(cvalues, true)

    let values = []
    for (let i = 0; i < split.length; i++) {
        let topush = {}
        let comment = crypto.splitter(split[i], ":")
        data = {
            accountID: accountID,
            gjp: crypto.gjp(password),
            messageID: parseInt(comment[1]),
            secret: "Wmfd2893gb7"
        }
        console.log(data)
        cvalues = await request('http://www.boomlings.com/database/downloadGJMessage20.php', data)
        console.log(cvalues)
        if (parseInt(cvalues) == -1) {
            topush['message'] = "Invalid request"
        } else {
            console.log(cvalues)
            comment = crypto.splitter(cvalues, ":")
            console.log(comment)
            topush["id"] = parseInt(comment[1])
            topush["accountId"] = parseInt(comment[2])
            topush["playerId"] = parseInt(comment[3])
            topush["title"] = crypto.b64(comment[4])
            topush["message"] = crypto.xor(comment[5] || "", 14251)
            topush["username"] = comment[6]
            topush["age"] = comment[7]
            parseInt(comment[8]) == 0 ? topush["read"] = false : topush["read"] = true
            parseInt(comment[9]) == 0 ? topush["sender"] = "receiving" : topush["sender"] = "sent"
        }
        values.push(topush)
    }
    return {code: 200, payload: values}
}
export { messages, request, download, searchuser, songinfo, comment, profileComment, deleteComment, deleteAccountComment, commentHistory, comments, profileComments, timely}