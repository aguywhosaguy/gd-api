import * as utils from "../utils.js"

async function searchuser(username) {
    let accountid = false
    let failed = false
    let data = {
        str: username,
        secret: "Wmfd2893gb7"
    }
    let values = await utils.request('http://www.boomlings.com/database/getGJUsers20.php', data)
    if (values == "-1") {
        values = await utils.request('http://www.boomlings.com/database/getGJUserInfo20.php', {targetAccountID: username, secret: "Wmfd2893gb7"})
        if (values == "-1") {
            failed = true
            return {code: 400, payload: {message: "User not found"}}
        } else {
            accountid = true
        }
    }
    
    if (!failed) {
        if (!accountid) {
            values = utils.splitter(values, ":")
            data = {
                targetAccountID: parseInt(values[16]),
                secret: "Wmfd2893gb7"
            }
            values = await utils.request('http://www.boomlings.com/database/getGJUserInfo20.php', data)
        }
        values = utils.splitter(values, ":")
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


export { searchuser }