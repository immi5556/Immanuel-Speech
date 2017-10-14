var editor;
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

        var printcontainer = $("<div><textarea class='a7-printeMedia'></textarea></div>").css({
            width: "70%",
            height: "95%",
            paddingLeft: "2px",
            paddingTop: "10px",
            marigin: "3px",
            overflow: "auto",
            display: "inline-block"
        });
        parent.append(printcontainer);
        var printctrl = printcontainer.find(".a7-printeMedia")

        var init = function () {
            var $cmds;
            var appendCommands = function () {
                $cmds = $("<select multiple></select>").css({
                    display: "inline-block",
                    backgroundColor: "rgba(128, 128, 128, 0.5)",
                    width: "28%",
                    height: "95%"
                });
                for (var v in cmds) {
                    var $o = $("<option value=" + v + ">" + v + "</option>");
                    $cmds.append($o);
                }
                $cmds.on("change", function () {
                    ProcessCommand($(this).val()[0]);
                });

                parent.append($cmds);
            }

            var BuildHtml = function (html) {
                editor = CodeMirror.fromTextArea(printctrl[0], {
                    lineNumbers: true,
                    styleActiveLine: true,
                    mode: "htmlmixed"

                });
                editor.setSize(null, "100%");
            }

            appendCommands();
            BuildHtml();
        }

        //print
        var print = function (text) {
            var tt = printctrl.val() + text;
            printctrl.val(tt)
        }

        //cmds
        var selectall = function () {
            editor.execCommand("selectAll");
        }

        var singleselection = function () {
            editor.execCommand("singleSelection");
        }

        var killline = function () {
            editor.execCommand("killLine");
        }
        var deleteline = function () {
            editor.execCommand("deleteLine");
        }
        var dellineleft = function () {
            editor.execCommand("delLineLeft");
        }
        var delwrappedlineleft = function () {
            editor.execCommand("delWrappedLineLeft");
        }
        var delwrappedlineright = function () {
            editor.execCommand("delWrappedLineRight");
        }
        var selectline = function () {
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
            printctrl.focus();
        }

        var golinestart = function () {
            editor.execCommand("goLineStart");
        }

        var golinestartsmart = function () {
            editor.execCommand("goLineStartSmart");
        }

        var golineend = function () {
            editor.execCommand("goLineEnd");
        }

        var godocstart = function () {
            editor.execCommand("goDocStart");
        }

        var godocend = function () {
            editor.execCommand("goDocEnd");
        }

        var golineright = function () {
            editor.execCommand("goLineRight");
        }

        var golineleft = function () {
            editor.execCommand("goLineLeft");
        }

        var golineleftsmart = function () {
            editor.execCommand("goLineLeftSmart");
        }

        var golineup = function () {
            editor.execCommand("goLineUp");
        }

        var golinedown = function () {
            editor.execCommand("goLineDown");
        }

        var gopageup = function () {
            editor.execCommand("goPageUp");
        }
        var gopagedown = function () {
            editor.execCommand("goPageDown");
        }
        var gocharleft = function () {
            editor.execCommand("goCharLeft");
        }
        var gocharright = function () {
            editor.execCommand("goCharRight");
        }
        var gocolumnleft = function () {
            editor.execCommand("goColumnLeft");
        }
        var gocolumnright = function () {
            editor.execCommand("goColumnRight");
        }
        var gowordleft = function () {
            editor.execCommand("goWordLeft");
        }
        var gowordright = function () {
            editor.execCommand("goWordRight");
        }
        var gogroupleft = function () {
            editor.execCommand("goGroupLeft");
        }
        var gogroupright = function () {
            editor.execCommand("goGroupRight");
        }
        var delcharbefore = function () {
            editor.execCommand("delCharBefore");
        }

        var scrollleft = function () {
            var x = printctrl.scrollLeft();
            printctrl.scrollLeft(x - 100);
        }

        var scrollhome = function () {
            var x = printctrl.scrollLeft();
            printctrl.scrollLeft(0);
        }

        var scrollright = function () {
            var x = printctrl.scrollLeft();
            printctrl.scrollLeft(x + 100);
        }

        var scrollend = function () {
            var x = printctrl[0].scrollWidth;
            printctrl.scrollLeft(x - printctrl.width());
        }

        var scrolldown = function () {
            var y = printctrl.scrollTop();
            printctrl.scrollTop(y + 100);
        }

        var scrollbottom = function () {
            var y = printctrl[0].scrollHeight;
            printctrl.scrollTop(y - printctrl.height());
        }

        var scrolltop = function () {
            printctrl.scrollTop(0);
        }

        var scrollup = function () {
            var y = printctrl.scrollTop();
            printctrl.scrollTop(y - 100);
        }

        var copiedcontent = undefined;
        var controlc = function () {
            if (editor.somethingSelected()) {
                copiedcontent = editor.getSelection();
                console.log("Copied Content : " + copiedcontent);
            }
        }

        var controlx = function () {
            if (editor.somethingSelected()) {
                copiedcontent = editor.getSelection();
                console.log("Cut Content : " + copiedcontent);
                PrintContent('');
            }
        }

        var controlv = function () {
            if (copiedcontent) {
                PrintContent(copiedcontent);
                console.log("Paste Content : " + copiedcontent);
            }
        }

        var deleteall = function () {
            editor.setValue("");
        }

        var delcharafter = function () {
            if (editor.somethingSelected()) {
                editor.replaceSelection("");
            } else {
                editor.execCommand("delCharAfter");
            }
        }

        var deletes = function () {
            delcharafter();
        }

        var deleteword = function () {
            editor.execCommand("delWordBefore");
        }

        var delwordafter = function () {
            editor.execCommand("delWordAfter");
        }

        var delgroupbefore = function () {
            editor.execCommand("delGroupBefore");
        }

        var delgroupafter = function () {
            editor.execCommand("delGroupAfter");
        }

        var backspace = function () {
            editor.execCommand("delCharBefore");
        }

        function undo() {
            editor.execCommand("undo");
        }

        var undoselection = function () {
            editor.execCommand("undoSelection");
        }

        function redo() {
            editor.execCommand("redo");
        }

        var redoselection = function () {
            editor.execCommand("redoSelection");
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

        var defaulttab = function () {
            editor.defaultTab();
        }

        var tab = function () {
            defaulttab();
        }

        var indentauto = function () {
            editor.execCommand("indentAuto");
        }

        var indentmore = function () {
            editor.execCommand("indentMore");
        }

        var indentless = function () {
            editor.execCommand("indentLess");
        }

        var newlineandindent = function () {
            editor.execCommand("newlineAndIndent");
        }

        var insertsofttab = function () {
            editor.execCommand("insertSoftTab");
        }

        var transposechars = function () {
            editor.execCommand("transposeChars");
        }

        var toggleoverwrite = function () {
            editor.execCommand("toggleOverwrite");
        }

        var letter = function (arg) {
            PrintContent((arg || '').toLowerCase());
        }

        var capitalletter = function (arg) {
            PrintContent((arg || '').toUpperCase());
        }

        var gotoline = function (arg) {
            if (arg) {
                if (!isNaN(parseInt(arg))) {
                    console.log("Moved to line: " + parseInt(arg));
                    editor.setCursor(parseInt(arg) - 1, 0);
                }
            }
        }

        var createhtml = function () {
            GetHtmlTemplate(function (data) {
                PrintContent(data);
            });
        }

        var cmds = {
            //Regular Commands
            selectall: selectall,
            deleteall: deleteall,
            tellit: deletes,
            delete: deletes,
            deleteword: deleteword,
            backspace: backspace,
            focus: focus,
            controlhome: godocstart,
            gotostart: godocstart,
            godocstart: godocstart,
            controlend: godocend,
            gotoend: godocend,
            godocend: godocend,
            selectline: selectline,
            enter: nextline,
            explain: nextline,
            neckline: nextline,
            nextline: nextline,
            anbu: undo,
            undo: undo,
            redo: redo,
            controlc: controlc,
            copy: controlc,
            controlx: controlx,
            cut: controlx,
            controlv: controlv,
            paste: controlv,
            semicolon: semicolon,
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
            gotoline: gotoline,
            singleselection: singleselection,
            killline: killline,
            deleteline: deleteline,
            dellineleft: dellineleft,
            delwrappedlineleft: delwrappedlineleft,
            delwrappedlineright: delwrappedlineright,
            undoselection: undoselection,
            redoselection: redoselection,
            golinestart: golinestart,
            home: golinestart,
            smarthome: golinestartsmart,
            controlhome: godocstart,
            controlend: godocend,
            golineend: golineend,
            end: golineend,
            golineright: golineright,
            golineleft: golineleft,
            golineleftsmart: golineleftsmart,
            golineup: golineup,
            uparrow: golineup,
            apparel: golineup,
            narrow: golinedown,
            golinedown: golinedown,
            downarrow: golinedown,
            gopageup: gopageup,
            pageup: gopageup,
            gopagedown: gopagedown,
            pagedown: gopagedown,
            gocharleft: gocharleft,
            leftarrow: gocharleft,
            gocharright: gocharright,
            rightarrow: gocharright,
            gocolumnleft: gocolumnleft,
            gocolumnright: gocolumnright,
            gowordleft: gowordleft,
            controlleftarrow: gowordleft,
            gowordright: gowordright,
            controlrightarrow: gowordright,
            gogroupleft: gogroupleft,
            gogroupright: gogroupright,
            delcharbefore: delcharbefore,
            delcharafter: delcharafter,
            deletes: delcharafter,
            defaulttab: defaulttab,
            tab: defaulttab,
            delwordafter: delwordafter,
            delgroupbefore: delgroupbefore,
            delgroupafter: delgroupafter,
            indentauto: indentauto,
            indentmore: indentmore,
            indentless: indentless,
            insertsofttab: insertsofttab,
            transposechars: transposechars,
            newlineandindent: newlineandindent,
            toggleoverwrite: toggleoverwrite,
            //HTML Cmds
            createhtml: createhtml
        }
        init();

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
            var selection = editor.getSelection();
            if (selection.length > 0) {
                editor.replaceSelection(content);
            }
            else {
                var cursor = editor.getCursor();
                editor.replaceRange(content, cursor);
            }
        }

        var GetHtmlTemplate = function (callback) {
            $.ajax({
                url: "html_template.html",
                data: {
                    txtsearch: $('#appendedInputButton').val()
                },
                type: "GET",
                dataType: "html",
                success: function (data) {
                    //alert(data);
                    //printctrl.val(data);
                    if (callback) {
                        callback(data);
                    }
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