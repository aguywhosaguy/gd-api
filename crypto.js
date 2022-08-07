import pako from 'pako';
import base64url from 'base64url';
import utf8 from 'utf8';
import pkg from 'base64-xor';
import crypto from 'crypto';
const { encode, decode } = pkg;
function zlib(str, decodestr = true) {
    //I do not know what any of this does but it works so :D
    if (decodestr) {
        var strData = atob(str);
        var charData = strData.split('').map(function(x){return x.charCodeAt(0);});
        var binData = new Uint8Array(charData);
        var data = pako.inflate(binData);
        var strData = String.fromCharCode.apply(null, new Uint16Array(data));
        return strData
    } else {
        var strData = utf8.encode(str);
        var charData = strData.split('').map(function(x){return x.charCodeAt(0);});
        var binData = new Uint8Array(charData);
        var data = pako.deflate(binData);
        var strData = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));
        return strData
    }
}
function b64(str, decodestr = true) {
    if (decodestr) {
        return base64url.decode(str)
    } else {
        return base64url.encode(str)
    }
}
function splitter(str, splitter) {
    let resp = splitter + str;
    resp = resp.replaceAll(splitter, '?');
    let locations = []
    let even = true
    let values = {}
    let nonsubstringvalues = []

    let regex = /\?/g
    let colons = [...resp.matchAll(regex)];;
    for (let j = 0; j < colons.length; j++) {
        locations.push(colons[j].index)

    }
    for (let j = 0; j < locations.length; j++) {
        if (even) {
            even = false
        } else {
            let colon = locations[j] + 1
            let nextcolon = locations[j + 1]
            let prevcolon = locations[j - 1] + 1
            console.log(colon, nextcolon, prevcolon)
            let value = parseInt(resp.substring(prevcolon, colon))
            values[value] = resp.substring(colon, nextcolon)
            even = true
        }
    }
    return values
}

function commentsplitter(str, multiple = false) {
    let locations = []
    let even = true
    let values = []
    let regex
    if (multiple) {console.log(str)}
    multiple ? regex = /\|/g : regex = /:/g
    console.log(regex)
    console.log(str)
    console.log("split")
    let colons = [...str.matchAll(regex)];;
    for (let j = 0; j < colons.length; j++) {
        locations.push(colons[j].index)

    }
    for (let j = 0; j < locations.length; j++) {
        if (multiple) {
            if (even) {
                even = false
            } else {
                let colon = locations[j] + 1
                let prevcolon = locations[j - 1] + 1
                values.push(str.substring(prevcolon, colon - 1))
                even = true
            }
        } else {
            let colon = locations[j] + 1
            values.push(str.substring(0, colon - 1))
            values.push(str.substring(colon))
        }
    }
    return values
}   
function xor(strr, keyy, decodestr = true) {
    if (decodestr) {
        return decode(keyy, strr)
    } else {
        return encode(keyy, strr)
    }
}
function chk(values = Array, key, salt = '') {
    values.push(salt)
    return xor(crypto.createHash('sha1').update(values.toString().replace(/,/g, '')).digest("hex"), key, false)
}
function gjp(password) {
    return xor(password, '37526', false)
}

export { zlib, b64, splitter, xor, chk, gjp, commentsplitter }