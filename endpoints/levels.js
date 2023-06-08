import * as utils from "../utils.js"
import * as users from "./users.js"
import * as misc from "./misc.js"

async function download(id) {
    let data = {
        levelID: id,
        secret: "Wmfd2893gb7"
    } 
    let values = await utils.request('http://www.boomlings.com/database/downloadGJLevel22.php', data)
    if (values != "-1") {
        let payload = {}
        values = utils.splitter(values, ":")
        payload['id'] = parseInt(values[1])
        payload['title'] = values[2]
        utils.b64(values[3]) == "" ? payload['description'] = "(No description provided)" : payload['description'] = utils.b64(values[3])
        let creatordata = await users.searchuser(values[6])
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
            let sinfo = await misc.songinfo(parseInt(values[35]))
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
            const songinfo = misc.mainSongs[parseInt(values[12]) + 1]
            payload['song'] = songinfo['name']
            payload['songID'] = parseInt(songinfo['id'])
            payload['songArtist'] = songinfo['artist']
        }
        let passone = utils.xor(values[27], "26364")
        parseInt(values[19]) == 0 ? payload['featured'] = false : payload['featured'] = true
        parseInt(values[42]) == 0 ? payload['epic'] = false : payload['epic'] = true
        parseInt(values[25]) == 1 ? payload['auto'] = true : payload['auto'] = false
        parseInt(values[30]) == id ? payload['copied'] = false : payload['copied'] = true
        payload['copiedLevel'] = parseInt(values[30])
        payload['editorTime'] = parseInt(values[46])
        payload['editorTimeInCopies'] = parseInt(values[47])
        utils.xor(values[27], "26364") == "1" ? payload['password'] = 0 : payload['password'] = utils.xor(values[27], "26364").substring(1, utils.xor(values[27], "26364").length)
        payload['uploadedAt'] = values[28]
        payload['updatedAt'] = values[29]
        return {code: 200, payload: payload}
    } else {
        return {code: 400, payload: {message: "Level not found"}}
    }
}

export {download}