import * as users from "./users.js"
import * as utils from "../utils.js"

async function messages(username, password, page = 1, mode = "received") {
    page = page - 1
    let accountID
    if (mode == "received") {
        mode = 0
    } else if (mode == "sent") {
        mode = 1
    }
    let userinfo = await users.searchuser(username)
    if (userinfo['code'] == 200) {
        accountID = userinfo['payload']['accountID']
    } else {
        return {code: 400, payload: "Invalid request"}
    }
    let data = {
        accountID: accountID,
        gjp: utils.gjp(password),
        page: page,
        getSent: mode,
        secret: "Wmfd2893gb7"
    }
    let cvalues = await utils.request('http://www.boomlings.com/database/getGJMessages20.php', data)
    if (parseInt(cvalues) == -1) {
        return {code: 400, payload: "Invalid request"}
    }
    let split = utils.commentsplitter(cvalues, true)

    let values = []
    for (let i = 0; i < split.length; i++) {
        let topush = {}
        let comment = utils.splitter(split[i], ":")
        data = {
            accountID: accountID,
            gjp: utils.gjp(password),
            messageID: parseInt(comment[1]),
            secret: "Wmfd2893gb7"
        }
        cvalues = await utils.request('http://www.boomlings.com/database/downloadGJMessage20.php', data)
        if (parseInt(cvalues) == -1) {
            topush['message'] = "Invalid request"
        } else {
            comment = utils.splitter(cvalues, ":")
            topush["id"] = parseInt(comment[1])
            topush["accountId"] = parseInt(comment[2])
            topush["playerId"] = parseInt(comment[3])
            topush["title"] = utils.b64(comment[4])
            topush["message"] = utils.xor(comment[5] || "", "14251")
            topush["username"] = comment[6]
            topush["age"] = comment[7]
            parseInt(comment[8]) == 0 ? topush["read"] = false : topush["read"] = true
            parseInt(comment[9]) == 0 ? topush["sender"] = "receiving" : topush["sender"] = "sent"
        }
        values.push(topush)
    }
    return {code: 200, payload: values}
}

export {messages}