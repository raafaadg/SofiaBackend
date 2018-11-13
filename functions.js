module.exports = {
    createNewEntity,
    createNewIntent,
    createNewDialog,
    trataResposta,
    listWorkspaces
}
var prompt = require('prompt-sync')();
require('dotenv').config();
var watson = require('watson-developer-cloud/assistant/v1');
var chatbot = new watson({
    username: process.env.USERNAME_WATSON,
    password: process.env.PASSWORD,
    version: process.env.VERSION,
});
let fimDeConversar = false;

function createNewIntent(workspace_id, intent, examples, description) {

    var params = {
        workspace_id,
        intent,
        examples,
        description
    };
    chatbot.createIntent(params, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
        }
    });
};

function createNewEntity(workspace_id, entity, values,description) {
    var params = {
        workspace_id,
        entity,
        values,
        fuzzy_match: true,
        description
    };
        
    chatbot.createEntity(params, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
        }
    });
}

function createNewDialog(
    workspace_id,
    dialog_node,
    conditions,
    output,
    title,
    description,
    parent,
    next_step,
    previous_sibling,
    context,
    actions,
    node_type,
    event_name,
    variable,
    digress_in,
    digress_out_slots,
    user_label
) {

    var params = {
        workspace_id,
        dialog_node,
        description,
        conditions,
        parent,
        previous_sibling,
        output,
        title,
        context,
        next_step,
        actions,
        node_type,
        event_name,
        variable,
        digress_in,
        digress_out_slots,
        user_label
    };
    chatbot.createDialogNode(params, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
        }
    });
}

function trataResposta(err, resposta) {
    if (err) {
        console.log(err);
        return;
    }

    if (resposta.intents.length) {
        console.log('Eu detectei a inteção: ' + resposta.intents[0].intent);
        if (resposta.intents[0].intent == 'General_Ending') {
            fimDeConversar = true;
        }
    }
    //exibe toda a json 
    console.log(resposta);

    if (resposta.output.text.length > 0) {
        console.log(resposta.output.text[0])
    }

    if (!fimDeConversar) {
        var mensagemUsuario = prompt('>>');
        chatbot.message({
            workspace_id,
            input: {
                text: mensagemUsuario
            },
            context: resposta.context
        }, trataResposta);
    }
}
function listWorkspaces(){
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
}