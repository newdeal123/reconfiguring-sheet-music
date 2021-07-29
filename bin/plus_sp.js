function plus_sp(accidental,fifths,step) {
    return new Promise(function(resolve){
        var ret = "";
        const order = ["F","C","G","D","A","E","B"];
        for(var i=0;i<fifths;i++){
            if(order[i]==step) ret = "♯";
        }
        for(var i=6;i>=7-(-fifths);i--){
            if(order[i]==step) ret = "♭";
        }

        if(accidental=="natural") ret = "";
        else if(accidental=="sharp") ret = "♯";
        else if(accidental=="flat") ret = "♭";
        resolve(ret);
    });
}

module.exports = {plus_sp};