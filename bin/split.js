const music = require('musicjson');
const fs = require("fs");
const file_name = 'result_sample09'
const cloneObj = obj =>JSON.parse(JSON.stringify(obj));
var xml = fs.readFileSync(`./result/${file_name}.musicxml`, "utf-8");


music.musicJSON(xml,async function(err,json){
    var line =json['score-partwise']['part']['measure'];
    if(!Array.isArray(line)) line=[line];
    var leftJson = cloneObj(json);
    var rightJson = cloneObj(json);
    leftJson['score-partwise']['part']['measure']=[];
    rightJson['score-partwise']['part']['measure']=[];

    for(notes in line){
        var leftObj={}; var rightObj={};
        for(i in line[notes]){
            
            if(i == "attributes" && Object.keys(line[notes][i]).includes('clef')){
                leftObj.attributes = line[notes][i];
                rightObj.attributes = line[notes][i];
            }
            else if(Array.isArray(line[notes][i])){
                var leftArr=[];
                var rightArr=[];
                for(j in line[notes][i]){
                    if(Object.keys(line[notes][i][j]).includes('staff')){
                        if(line[notes][i][j]['staff']==1){
                            rightArr.push(line[notes][i][j])
                        }
                       else leftArr.push(line[notes][i][j]);
                    }
                }
                if(leftArr.length!=0)leftObj[i]=leftArr;
                if(rightArr.length!=0)rightObj[i]=rightArr;
            }
            else if(Object.keys(line[notes][i]).includes('staff')){
                if(line[notes][i]['staff']==1){
                    leftObj[i]=line[notes][i];
                }
                else rightObj[i]=line[notes][i];
            }
            else{
                leftObj[i]=line[notes][i];
                rightObj[i]=line[notes][i];
            }
        }
        leftJson['score-partwise']['part']['measure'].push(leftObj);
        rightJson['score-partwise']['part']['measure'].push(rightObj);
    }
    
    music.musicXML(leftJson,async function(err, result_xml){
        await fs.promises.writeFile(`left_result/result_left_${file_name}.musicxml`,String(result_xml),'utf8',function(err){
            console.log("err = " + err);
        })
        console.log(`result_left_${file_name}.musicxml created!`);
    })
    music.musicXML(rightJson,async function(err, result_xml){
        await fs.promises.writeFile(`right_result/result_right_${file_name}.musicxml`,String(result_xml),'utf8',function(err){
            console.log("err2 = " + err);
        })
        console.log(`result_right_${file_name}.musicxml created!`);
    })
})

