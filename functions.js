module.exports = {
    chatbot,
    createNewEntity,
    createNewIntent,
    createNewDialog,
    trataResposta,
    listWorkspaces,
    listDialogs,
    generateEntity,
    generateIntent,
    skillObject,
    updateDialog,
    generateQuestion
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

function generateEntity(obj){
    var out = [];
    for (var i in obj.entities)
        out.push({
            value: obj.entities[i],
            synonyms: obj[obj.entities[i]]
        });
        return out;
}

function generateIntent(obj) {
    var out = [];
    for (var i in obj.examples)
        out.push({
            text: obj.examples[i]
        });
    return out;
}
function listDialogs(workspace_id){
    var params = {
        workspace_id,
    };

    chatbot.listDialogNodes(params, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
        }
    });
}
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


function skillObject(
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
    node_type,
    digress_in,
    digress_out,
    metadata,
    digress_out_slots,
    variable,
    event_name,
    actions,
    user_label
) {
    var obj = new Object();
    obj.workspace_id = workspace_id;
    obj.dialog_node = dialog_node;
    obj.new_conditions = conditions;
    obj.new_output = output;
    obj.new_title = title;
    obj.new_description = description;
    obj.new_parent = parent;
    obj.new_next_step = next_step;
    obj.new_previous_sibling = previous_sibling;
    obj.new_context = context;
    obj.new_type = node_type;
    obj.new_digress_in = digress_in;
    obj.new_digress_out = digress_out;
    obj.new_metadata = metadata;
    obj.new_digress_out_slots = digress_out_slots;
    obj.new_variable = variable;
    obj.new_event_name = event_name;
    obj.new_actions = actions;
    obj.user_label = user_label;
    return obj;
}

function createNewDialog(obj) {
    const obj2 = new Object();
    obj2.workspace_id = obj.workspace_id;
    obj2.dialog_node = obj.dialog_node;
    obj2.title = obj.new_title;
    obj2.description = obj.new_description;
    chatbot.createDialogNode(obj2, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
        }
    });
}

function updateDialog(obj) {
    chatbot.updateDialogNode(obj, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
        }
    });
}


function generateQuestion(obj, arrayDialog,workspace_id){
    const parent = 'folder_qsts';
    let i = 0;
    let previous_sibling = undefined;
    let context = undefined;
    const varAux = 'varAux';
    let varContext = '';
    obj.forEach(element => {
        arrayDialog.push(skillObject(
            workspace_id,
            'node'+i,
            'true',
            {
                "text": {
                  "values": [
                    element.qst
                  ],
                  "response_type": "text",
                  "selection_policy": "random"
                }
            },
            'node'+i,
            'Dialogo de perguntas gerado automáticamente - node'+i,
            parent,
            undefined,
            previous_sibling,
            context
        ));
        previous_sibling = 'node'+i;
        varContext = varAux + (i);
        context = {
            varContext: "<?input.text?>"
        }
        i++;
    });
    arrayDialog.push(skillObject(
        workspace_id,
        'node'+i,
        'true',
        {
            "text": {
              "values": [
                "FIM!"
              ],
              "response_type": "text",
              "selection_policy": "random"
            }
        },
        'node'+i,
        'Dialogo de perguntas gerado automáticamente - node'+i,
        parent,
        {
            behavior: "jump_to",
            selector: "body",
            dialog_node: "dialog_end"
        },
        previous_sibling,
        context
    ));

    return arrayDialog
}