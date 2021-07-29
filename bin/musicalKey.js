const music = require('musicjson');
const fs = require("fs");
const file_name = ''
const peach = require('./peach_name');
const func = require('./plus_sp');

music.musicJSON(xml,async function(err,json){
    var line =json['score-partwise']['part']['measure'];
    if(!Array.isArray(line)) line=[line];
    var fifths=0;
    for(notes in line){
        if('attributes' in line[notes] && 'key' in line[notes]['attributes']){
            fifths=line[notes]['attributes']['key']['fifths'];
        }
        const line_note_sp=new Map();
        if('note' in line[notes]){
            for(i in line[notes]['note']){
                if(line[notes]['note'][i]['rest']) continue;
                var plus = "";
                var head = "";
                const now = line[notes]['note'][i]['pitch']['step']+line[notes]['note'][i]['pitch']['octave'];
                if('accidental' in line[notes]['note'][i]){
                    line_note_sp.set(now,line[notes]['note'][i]['accidental']);
                }
                plus = await func.plus_sp((line_note_sp.has(now) ? line_note_sp.get(now) : ""),fifths,line[notes]['note'][i]['pitch']['step']);
                if('staff' in line[notes]['note'][i]) head = line[notes]['note'][i]['staff'];
            
                if('notations' in line[notes]['note'][i]){
                    line[notes]['note'][i]['notations'].technical = {"fingering" : `${head}${peach.name[line[notes]['note'][i]['pitch']['step']]}${plus}`};
                }
                else{
                    line[notes]['note'][i].notations= {"technical" : {"fingering": `${head}${peach.name[line[notes]['note'][i]['pitch']['step']]}${plus}`}};
                }
                console.log("note = " + JSON.stringify(line[notes]['note'][i]));
            }
        }
    }
    music.musicXML(json,function(err, result_xml){
        var replaced_xml = String(result_xml).replace(/<fingering>2/g, '<fingering placement="below">');
        var final_xml = replaced_xml.replace(/<fingering>1/g, '<fingering placement="above">');
        fs.writeFile(`./result/result_${file_name}.musicxml`,final_xml,'utf8',function(err){
            console.log(`result_${file_name}.musicxml created!`);
        })
    })
})

