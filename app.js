var watson = require('watson-developer-cloud/assistant/v1');
var prompt = require('prompt-sync')();
require('dotenv').config();
require('./functions')

var chatbot = new watson({
    username: process.env.USERNAME_WATSON,
    password: process.env.PASSWORD,
    version: process.env.VERSION,
});

var workspace_id = process.env.WORKSPACE_ID;

//começando a conversação com uma mensagem vazia
//chatbot.message({workspace_id}, trataResposta);

let fimDeConversar = false;

var params = {
    workspace_id,
    intent: 'hello',
    examples: [
        {
            text: 'Good morning'
        },
        {
            text: 'Hi there'
        }
    ]
};

var params2 = {
    workspace_id,
    entity: 'beverage',
    values: [
        {
            value: 'water'
        },
        {
            value: 'orange juice'
        },
        {
            value: 'soda'
        }
    ]
};

var params3 = {
    workspace_id,
    dialog_node: 'greeting',
    conditions: '#hello',
    output: {
        text: 'Hi! How can I help you?'
    },
    title: 'Greeting2'
};

chatbot.listWorkspaces(function (err, response) {
    if (err) {
        console.error(err);
    } else {
        // var jsonAUX = JSON.stringify(response, null, 2),
        //   key;
        // console.log(JSON.stringify(response, null, 2));
        var jsonAUX = JSON.parse(JSON.stringify(response, null, 2));
        console.log(jsonAUX.workspaces[0]);
        for (key in jsonAUX.workspaces) 
            console.log(jsonAUX.workspaces[key].workspace_id);        
    }
});