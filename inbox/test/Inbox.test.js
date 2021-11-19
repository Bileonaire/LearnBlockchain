// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIALMESSAGE = 'Hi there!';

beforeEach(async () => {
    // get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // use account to deploy
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIALMESSAGE] })
        .send({ from: accounts[0], gas: '1000000' })
});

describe('inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    })

    it('initial message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIALMESSAGE);
    })

    it('can change the message', async() => {
        await inbox.methods.setMessage('second').send({ from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'second');
    });
});