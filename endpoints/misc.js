import * as utils from "../utils.js"




async function songinfo(songid) {
    let data = {
        songID: songid,
        secret: "Wmfd2893gb7"
    }
    let values = await utils.request('http://www.boomlings.com/database/getGJSongInfo.php', data)
    if (values == "-1") {
        return {code: 400, payload: {message: "Song not found"}}
    } else {
        values = values + "~|~"
        values = values.split("~|~")
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


async function timely(type = "daily") {
    type == "daily" ? type = 1 : type = 0
    let data = {
        weekly: type,
        secret: "Wmfd2893gb7"
    }
    let cvalues = await utils.request('http://www.boomlings.com/database/getGJDailyLevel.php', data)
    let index = [...cvalues.matchAll(/\|/g)][0].index
    if (parseInt(cvalues) == -1) {
        return {code: 400, payload: "Invalid request"}
    } else {
        return {code: 200, payload: {id: parseInt(cvalues.substring(0, index)), secondsLeft: parseInt(cvalues.substring(index + 1))}}
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

export {songinfo, mainSongs, timely}
