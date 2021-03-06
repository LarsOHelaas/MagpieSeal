const database = require('./dataHandler');
const crypto = require('crypto');
const { response } = require('express');
const secret = process.env.hashSecret || require("../localenv").hashSecret;

class User {

    constructor(username, password) {
        this.username = username;
        this.password = crypto.createHmac('sha256', secret)
            .update(password)
            .digest('hex');
        this.valid = false;
    }

    async create() {
        try {
            let response = await database.insertUser(this.username, this.password);
            return response;
        } catch (error) {
            console.error(error)
        }
    }
    async login() {
        try {
            let response = await database.loginUser(this.username, this.password);
            return response;
        } catch (error) {
            console.error(error)
        }
    }
    async updatePassword() {
        try {
            let response = await database.updatePassword(this.password, this.username);
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = User;