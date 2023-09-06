const express = require('express')
const axios = require('axios')

const app = express()

const clientID = '7858968fbfedce596988'
const clientSecret = '40f1df458c680ccd17baf7bc4d53c92680e7cfad'

module.exports = {
    gitAuthCallback,
    gitAuthSuccess
};

async function gitAuthCallback(requestToken) {
    try {
        let res = await axios({
                method: 'post',
                url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
                scope: ["repo","workflow","write:packages","delete:packages","gist","notifications","user","project","codespace"],
                headers: {
                     accept: 'application/json'
                }
              })
        return res.data
    }
    catch(err) {
        throw err
    }
}

async function gitAuthSuccess(accessToken) {
    try {
        let res = await axios({
                method: 'get',
                url: `https://api.github.com/user`,
                headers: {
                  Authorization: 'token ' + accessToken
                }
              })
        return res.data
    }
    catch(err) {
        throw err
    }
}
