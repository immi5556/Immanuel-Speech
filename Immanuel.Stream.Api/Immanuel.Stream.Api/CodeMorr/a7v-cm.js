$(function () {
    window.a7v = function (container) {

        var selectall = function () {
            document.execCommand('selectAll', false, null);
        }

        var cmds = {
            selectall: selectall
        }

        var ProcessCommand = function (text) {
            var cmd = (text || '').replace(/ /g, '').toLowerCase();
            if (cmds[cmd]) {
                cmds[cmd]()
            } else {
                print(text);
            }
        }

        return {
            processCommand: ProcessCommand
        }
    }

    //Outer scope

    var translate = function (event) {
        var txtRec = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            txtRec += event.results[i][0].transcript;
        }
        return txtRec;
    }

    var recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";
    var newLine = "\r\n";
    recognition.onresult = function (event) {
        //console.log(event)
        var text = translate(event);
        ww.processCommand(text);
        //var tt = $("#disp").val() + text + newLine;
        //$("#disp").val(tt)
    }
    recognition.onspeechend = function (event) {
        //console.log('Speech recognition has stopped.',event);
    }
    recognition.onstart = function (event) {
        //console.log("onstart", event);
    }
    recognition.onerror = function (event) {
        //console.log("onerror", event);
    }
    recognition.onend = function () {
        //console.log("onend");
        recognition.stop();
        recognition.start();
    }
    var ww = a7v();
    recognition.start();
});