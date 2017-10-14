$(function () {

    window.a7v = function (container) {

        //ui setup
        var parent = undefined;
        if (!container) {
            parent = $("body");
        }
        else if (container instanceof Element) { //DOM
            parent = $(container);
        } else if (container[0] && container[0] instanceof Element) { //jQuery
            parent = $(container[0]);
        } else if ($(container).length) { //selector found
            parent = $(container);
        } else { // Nothing found
            parent = $("body");
        }

        var printctrl = $("<textarea class='a7-printeMedia' style=white-space:pre;overflow:scroll;' wrap='off'></textarea>").css({
            width: "90%",
            height: "95%",
            paddingLeft: "2px",
            marigin: "3px",
        });
        parent.append(printctrl);

        var appendCommands = function () {
            var $cmds = $("<select multiple></select>").css({
                height: "95%",
                display: "inline-block",
                backgroundColor: "rgba(128, 128, 128, 0.5)",
                width: "8%"
            });
            for (var v in cmds) {
                var $o = $("<option value=" + v + ">" + v + "</option>");
                $cmds.append($o);
            }
            parent.append($cmds);
        }

        //print
        var print = function (text) {
            var tt = printctrl.val() + text;
            printctrl.val(tt)
        }

        //Stack Actions
        var undostacklst = [];
        var redostacklst = [];
        var stackitem = function () {
            undostacklst.push(printctrl.val());
        }

        //cmds
        var selectall = function () {
            undostacklst.pop();
            printctrl.select();
        }

        var selectline = function () {
            undostacklst.pop();
            var input = printctrl[0];
            var posstart = input.selectionStart - 1;
            posstart = posstart > -1 ? posstart : 0;
            var ent = input.value.lastIndexOf('\n', posstart);
            var lnp = input.value.indexOf('\n', posstart);
            lnp = lnp > 0 ? lnp : input.value.length
            input.focus();
            input.setSelectionRange(ent + 1, lnp + 1);
        }

        var focus = function () {
            undostacklst.pop();
            printctrl.focus();
        }

        var home = function () {
            undostacklst.pop();
            var input = printctrl[0];
            var posstart = input.selectionStart;
            var ent = input.value.lastIndexOf('\n', posstart);
            input.focus();
            input.setSelectionRange(ent + 1, ent + 1);
        }

        var gotoend = function () {
            undostacklst.pop();
            var input = printctrl[0];
            printctrl[0].focus();
            var lnp = input.value.length;
            printctrl[0].selectionStart = lnp;
            printctrl[0].selectionEnd = lnp;
        }

        var uparrow = function () {
            undostacklst.pop();
            var input = printctrl[0];
            var posstart = input.selectionStart;
            var curstart = input.value.lastIndexOf('\n', posstart);
            var linepos = posstart - curstart;
            var prevstart = input.value.lastIndexOf('\n', curstart - 1);
            var prevpos = curstart - prevstart;
            var finpos = posstart;
            if (prevpos > linepos) {
                finpos = prevstart + linepos;
            } else {
                finpos = prevstart + prevpos;
            }
            input.focus();
            input.setSelectionRange(finpos, finpos);
        }

        var downarrow = function () {
            undostacklst.pop();
            var input = printctrl[0];
            var posstart = input.selectionStart;
            var curstart = input.value.lastIndexOf('\n', posstart);
            var linepos = posstart - curstart;
            var curend = input.value.indexOf('\n', posstart);

            var nextend = input.value.indexOf('\n', curend + 1);
            var nextpos = nextend - curend;
            var finpos = posstart;
            if (nextpos > linepos) {
                finpos = nextend + linepos;
            } else {
                finpos = nextend + nextpos;
            }
            input.focus();
            input.setSelectionRange(finpos, finpos);
        }

        var leftarrow = function () {
            undostacklst.pop();
            var input = printctrl[0];
            var posstart = input.selectionStart;
            posstart = (posstart - 1) < 0 ? 0 : (posstart - 1);
            input.setSelectionRange(posstart, posstart);
        }

        var rightarrow = function () {
            undostacklst.pop();
            var input = printctrl[0];
            var posstart = input.selectionStart;
            var lnn = input.value.length;
            posstart = (posstart + 1) > lnn ? lnn : (posstart + 1);
            input.setSelectionRange(posstart, posstart);

        }

        var scrollleft = function () {
            undostacklst.pop();
            var x = printctrl.scrollLeft();
            printctrl.scrollLeft(x - 100);
        }

        var scrollhome = function () {
            undostacklst.pop();
            var x = printctrl.scrollLeft();
            printctrl.scrollLeft(0);
        }

        var scrollright = function () {
            undostacklst.pop();
            var x = printctrl.scrollLeft();
            printctrl.scrollLeft(x + 100);
        }

        var scrollend = function () {
            undostacklst.pop();
            var x = printctrl[0].scrollWidth;
            printctrl.scrollLeft(x - printctrl.width());
        }

        var scrolldown = function () {
            undostacklst.pop();
            var y = printctrl.scrollTop();
            printctrl.scrollTop(y + 100);
        }

        var scrollbottom = function () {
            undostacklst.pop();
            var y = printctrl[0].scrollHeight;
            printctrl.scrollTop(y - printctrl.height());
        }

        var scrolltop = function () {
            undostacklst.pop();
            printctrl.scrollTop(0);
        }

        var scrollup = function () {
            undostacklst.pop();
            var y = printctrl.scrollTop();
            printctrl.scrollTop(y - 100);
        }

        var copiedcontent = undefined;

        var controlc = function () {
            undostacklst.pop();
            var input = printctrl[0];
            var posstart = input.selectionStart;
            var posend = input.selectionEnd;
            var ccp = input.value.substr(posstart, posend);
            console.log("Copied Content : " + ccp);
            copiedcontent = (ccp || copiedcontent);
        }

        var controlx = function () {
            undostacklst.pop();
            var input = printctrl[0];
            var posstart = input.selectionStart;
            var posend = input.selectionEnd;
            var ccp = input.value.substr(posstart, posend);
            console.log("Cut Content : " + ccp);
            copiedcontent = (ccp || copiedcontent);
            PrintContent('');
        }

        var controlv = function () {
            undostacklst.pop();
            if (copiedcontent)
                PrintContent(copiedcontent);
            console.log("Paste Content : " + copiedcontent);
        }

        var deleteall = function () {
            printctrl.val("");
        }

        var deletes = function () {
            backspace();
        }

        var deleteword = function () {
            var input = printctrl[0]; //document.getElementById("mytextbox1");
            var ent = input.value.lastIndexOf('\n');
            var spc = input.value.lastIndexOf(' ');
            var lidx = ent > spc ? ent : spc;
            var lnp = input.value.length;
            input.focus();
            input.value = input.value.substr(0, lidx);
        }

        var backspace = function () {
            var input = printctrl[0];
            var lnp = input.value.length;
            var posstart = input.selectionStart;
            var posend = input.selectionEnd;
            input.value = input.value.substr(0, posstart - 1) + input.value.substr(posend, lnp - 1);
            input.selectionEnd = posstart > 0 ? posstart - 1 : posstart;
        }

        function undo() {
            //document.execCommand('undo', false, null);
            if (!undostacklst.length) return;
            undostacklst.pop(); // to remove last entered
            var titm = undostacklst.pop();
            redostacklst.push(printctrl.val());
            printctrl.val(titm);
        }

        function redo() {
            //document.execCommand('redo', false, null);
            if (!redostacklst.length) return;
            var titm = redostacklst.pop();
            undostacklst.push(printctrl.val());
            printctrl.val(titm);
        }

        var nextline = function () {
            PrintContent(newLine)
        }

        var semicolon = function () {
            PrintContent(";")
        }

        var space = function () {
            PrintContent(" ")
        }

        var karma = function () {
            PrintContent(",")
        }

        var exclamation = function () {
            PrintContent("!")
        }

        var period = function () {
            PrintContent(". ")
        }

        var letter = function (arg) {
            PrintContent((arg || '').toLowerCase());
        }

        var capitalletter = function (arg) {
            PrintContent((arg || '').toUpperCase());
        }

        var createhtml = function () {
            GetHtmlTemplate();
        }

        var cmds = {
            //Regular Commands
            selectall: selectall,
            deleteall: deleteall,
            tellit: deletes,
            delete: deletes,
            deleteword: deleteword,
            backspace: backspace,
            rightarrow: rightarrow,
            leftarrow: leftarrow,
            apparel: uparrow,
            uparrow: uparrow,
            narrow: downarrow,
            downarrow: downarrow,
            gotoend: gotoend,
            selectline: selectline,
            enter: nextline,
            explain: nextline,
            neckline: nextline,
            nextline: nextline,
            //and: undo,
            undo: undo,
            redo: redo,
            controlc: controlc,
            copy: controlc,
            controlx: controlx,
            cut: controlx,
            controlv: controlv,
            paste: controlv,
            semicolon: semicolon,
            focus: focus,
            home: home,
            space: space,
            karma: karma,
            comma: karma,
            exclamation: exclamation,
            clamation: exclamation,
            period: period,
            scrolltop: scrolltop,
            scrollup: scrollup,
            scrolldown: scrolldown,
            scrollbottom: scrollbottom,
            scrollright: scrollright,
            scrollend: scrollend,
            scrollhome: scrollhome,
            scrollleft: scrollleft,
            letter: letter,
            capitalletter: capitalletter,
            //HTML Cmds
            createhtml: createhtml,
        }
        appendCommands();

        var procLowToHighCommand = function (text) {
            var lst = (text || '').split(' ');
            var iscmd = false;
            var cmdvalidate = function (cmd, val, idx, arr) {
                cmd = cmd + val;
                cmd = (cmd || '').toLowerCase();
                if (!iscmd && cmds[cmd]) {
                    var pars = undefined;
                    if (arr.length > idx + 1) {
                        pars = arr.slice(idx + 1).join(' ');
                    }
                    console.log("Command: " + text + ", Arguments : " + (pars || 'Nil'));
                    cmds[cmd](pars)
                    iscmd = true;
                }
                return cmd;
            }
            lst.reduce(cmdvalidate, '');
            return iscmd;
        }

        var procHightToLowCommand = function (text) {
            var lst1 = (text || '').split(' ');
            var lst2 = (text || '').split(' ')
            var iscmd = false;
            var i = 0;
            while ((a = lst1.pop()) != undefined) {
                var cmd = lst1.join('') + a;
                cmd = (cmd || '').toLowerCase();
                if (!iscmd && cmds[cmd]) {
                    var pars = lst2.slice(lst1.length + 1).join(' ');
                    console.log("Command: " + cmd + ", Arguments : " + (pars || 'Nil'));
                    cmds[cmd](pars)
                    iscmd = true;
                }
            }

            return iscmd;
        }

        var ProcessCommand = function (text) {
            stackitem();
            //var cmd = (text || '').replace(/ /g, '').toLowerCase();
            //if (!procLowToHighCommand(text)) {
            if (!procHightToLowCommand(text)) {
                PrintContent(text);
            }
        }

        //Utils

        var GetCurrentLineNo = function () {

        }

        var PrintContent = function (content) {
            var input = printctrl[0];
            var lnp = input.value.length;
            var posstart = input.selectionStart;
            var posend = input.selectionEnd;
            input.value = input.value.substr(0, posstart) + content + input.value.substr(posend, lnp - 1);
            //input.selectionEnd = posstart + 1;
            input.setSelectionRange(posstart + content.length, posstart + content.length)
        }

        var GetHtmlTemplate = function () {
            $.ajax({
                url: "html_template.html",
                data: {
                    txtsearch: $('#appendedInputButton').val()
                },
                type: "GET",
                dataType: "html",
                success: function (data) {
                    //alert(data);
                    printctrl.val(data);
                },
                error: function (xhr, status) {
                    alert("Sorry, there was a problem!");
                },
                complete: function (xhr, status) {
                    //$('#showresults').slideDown('slow')
                }
            });
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