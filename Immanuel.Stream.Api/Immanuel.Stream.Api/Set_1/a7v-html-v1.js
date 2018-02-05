var editor, cmds;
$(function () {

    var fnTooltip = function () {
        $(document).on('mouseenter', '.sel-mul option', function () {
            console.log($(this).data("cdata"));
            var td = $(this).data("cdata");
            $(".h-tooltip").css("display", "block")
            $(".h-tooltip").find("xmp").remove();
            $(".h-tooltip").append('<xmp> Desc: ' + td.desc + '</xmp>');
            $(".h-tooltip").append('<xmp> Speak: ' + td.param + '</xmp>');
        });
        $(document).on('mouseleave', '.sel-mul option', function () {
            $(".h-tooltip").css("display", "none")
        });
    }

    window.a7v = function (container) {
        var newLine = "\r\n";
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
            width: "100%",
            height: "95%",
            paddingLeft: "2px",
            paddingTop: "10px",
            marigin: "3px",
            overflow: "auto",
            position: "fixed",
            top: 0,
            left: 0
            //display: "inline-block"
        });
        parent.append(printcontainer);
        var printctrl = printcontainer.find(".a7-printeMedia")

        var init = function () {
            var $cmds;
            var appendCommands = function () {
                var $ddv = $('<div class="mnu-contain">' +
                    '<div class="input- group">' +
                    '<input id="txtSrc" type="text" class="form-control" style="height:50px;" placeholder= "Search" id= "inputGroup" />' +
                '</div> ' +
                    '</div>').css({
                    backgroundColor: "rgba(128, 128, 128, 0.5)",
                    width: "28%",
                    height: "95%",
                    position: "fixed",
                    marginLeft: "10px",
                    right: 0,
                    top: 10
                });
                $cmds = $("<select class='sel-mul' multiple></select>").css({
                    backgroundColor: "rgba(128, 128, 128, 0.5)",
                    width: "100%",
                    height: "100%"
                });
                $ddv.append($cmds);
                var ppr = [];
                for (var v in cmds) {
                    ppr.push(v);
                }
                ppr.sort();
                ppr.forEach(function (v) {
                    //var $o = $("<option value=" + v + ">" + v + "</option>");
                    var $o = $("<option value=" + v + ">" + (cmds[v].param || v) + "</option>");
                    $o.data("cdata", cmds[v]);
                    $cmds.append($o);
                })
                $cmds.on("click", function () {
                    ProcessCommand($(this).val()[0]);
                });

                parent.append($ddv);
            }

            var BuildHtml = function (html) {
                editor = CodeMirror.fromTextArea(printctrl[0], {
                    lineNumbers: true,
                    styleActiveLine: true,
                    mode: "htmlmixed",
                    matchTags: { bothTags: true }
                });
                editor.setSize(null, "100%");
            }

            appendCommands();
            BuildHtml();
            fnTooltip();
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
        var movelineup = function () {
            var startpos = editor.getCursor(true);
            if (startpos.line < 1) return;
            startpos.ch = 0;
            golineend();
            var endpos = editor.getCursor(true);
            editor.setSelection(startpos, endpos);
            var txt = editor.getSelection();
            deleteline();
            golineup();
            golinestart();
            nextline();
            golineup();
            PrintContent(txt);
        }
        var movelinedown = function () {
            var startpos = editor.getCursor(true);
            var totcnt = editor.lineCount();
            if (startpos.line >= (totcnt - 1)) return;
            startpos.ch = 0;
            golineend();
            var endpos = editor.getCursor(true);
            editor.setSelection(startpos, endpos);
            var txt = editor.getSelection();
            deleteline();
            golineend();
            nextline();
            PrintContent(txt);
            //editor.replaceSelection('');
        }
        var selectline = function (arg) {
            //arguments = Array.prototype.slice.call(arguments);
            var args = (arg || '').split(' ').filter(function (itm) { return itm; });
            var startpos = editor.getCursor(true);
            startpos.ch = 0;
            golineend();
            var endpos = editor.getCursor(true);
            if (args.length > 0) {
                var fl = args.filter(function (itm) { return itm > 0 }).map(function (itm) { return parseInt(itm); }).sort();
                var mn = Math.min.apply(null, fl) - 1;
                startpos.line = (mn < 0 ? 0 : mn);
                endpos.line = (Math.max.apply(null, fl) < editor.lineCount() ? Math.max.apply(null, fl) : (editor.lineCount() - 1));
                gotoline(endpos.line);
                golineend();
                endpos = editor.getCursor(true);
            }
            editor.setSelection(startpos, endpos);
        }

        var focus = function () {
            editor.focus();
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

        var openparenthesis = function () {
            PrintContent("(");
        }

        var openparentheses = function () {
            openparenthesis();
        }

        var openbracket = function () {
            openparenthesis();
        }

        var closeparenthesis = function () {
            PrintContent(")");
        }

        var closeparentheses = function () {
            closeparenthesis();
        }

        var closebracket = function () {
            closeparenthesis();
        }

        var space = function () {
            PrintContent(" ");
        }

        var karma = function () {
            PrintContent(",");
        }

        var exclamation = function () {
            PrintContent("!");
        }

        var period = function () {
            PrintContent(".");
        }

        var singlequote = function () {
            PrintContent("'");
        }

        var singlequotes = function () {
            PrintContent("''");
        }

        var doublequote = function () {
            PrintContent('"');
        }

        var doublequotes = function () {
            PrintContent('""');
        }

        var defaulttab = function () {
            editor.execCommand("defaultTab");
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
                var tnum = TranslateNumbers(arg)
                if (!isNaN(parseInt(tnum))) {
                    console.log("Moved to line: " + parseInt(tnum));
                    editor.setCursor(parseInt(tnum) - 1, 0);
                }
            }
        }

        var gotocolumn = function (arg) {
            if (arg) {
                if (!isNaN(parseInt(arg))) {
                    console.log("Moved to column: " + parseInt(arg));
                    var cp = editor.getCursor();
                    editor.setCursor(cp.line, parseInt(arg - 1));
                }
            }
        }


        // Html tags
        var createhtml = function (args) {
            GetHtmlTemplate(args, function (data) {
                PrintContent(data);
            });
        }


        var createelement = function (arg) {
            if (!arg) {
                console.log("[Warning - createElement]: Empty parameter not valid")
                return;
            }
            var args = arg.split(' ');
            //arg = (arg || '').replace(/ /g, '').toLowerCase();
            PrintContent(TranslateElement(arg));
            var pos = editor.getCursor();
            pos.ch = pos.ch - args[0].length - 3; //</> 3 len
            editor.setCursor(pos);
        }

        var closeelement = function (arg) {
            if (!arg) {
                console.log("[Warning - closeElement]: Empty parameter not valid")
                return;
            }
            var args = arg.split(' ');
            //arg = (arg || '').replace(/ /g, '').toLowerCase();
            PrintContent('</' + arg + '>');
            var pos = editor.getCursor();
            pos.ch = pos.ch - args[0].length - 3; //</> 3 len
            editor.setCursor(pos);
        }

        var selectelement = function () {
            editor.toMatchingElement(editor)
        }

        var editelement = function () {
            var toedithtml = editor.getSelection();
            if (!toedithtml) {
                selectelement();
                toedithtml = editor.getSelection();
            }
            if (!IsValidDomText(toedithtml)) {
                console.log("Invalid Selection for Html Edit");
                return false;
            }
            console.log(toedithtml);
            return toedithtml;
        }

        var addattribute = function (arg) {
            if (arg.length < 1)
                return;
            var ehtm = editelement();
            if (!ehtm)
                return;
            var args = (arg || '').split(' ');
            var attrname = args[0];
            var attrval = args[1] || "";
            var els = $(ehtm).attr(attrname, attrval);
            var torep = els[0].outerHTML;
            if (!torep) {
                console.log("Some issue in add addattribute: Happens in body tag, looking for resolution");
                return;
            }
            PrintContent(torep);
        }

        var addclass = function (arg) {
            if (arg.length < 1)
                return;
            var ehtm = editelement();
            if (!ehtm)
                return;
            var els = $(ehtm).addClass(arg);
            var torep = els[0].outerHTML;
            if (!torep) {
                console.log("Some issue in addclass: Happens in body tag, looking for resolution");
                return;
            }
            PrintContent(torep);
        }

        var appendelement = function (arg) {
            if (arg.length < 1)
                return;
            var ehtm = editelement();
            if (!ehtm)
                return;
            var args = arg.split(' ');
            var elem = TranslateElement(arg);
            var els = $(ehtm).append(elem);
            var torep = els[0].outerHTML;
            if (!torep) {
                console.log("Some issue in appendelement: Happens in body tag, looking for resolution");
                return;
            }
            PrintContent(torep);
        }

        var addtitle = function (args) {
            if (args) {
                PrintContent('<title>' + args + '</title>');
            }
            else {
                PrintContent('<title></title>');
            }
        }

        var addseotags = function () {
            var tag = '<META NAME="ROBOTS" CONTENT="All, index, follow" />' + newLine;
            tag += '<META NAME="author" CONTENT="Immanuel" />' + newLine;
            tag += '<meta name="keywords" content="" />' + newLine;
            PrintContent(tag);
        }

        var addmetaresponsive = function () {
            PrintContent('<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">');
        }

        var formathtml = function () {
            if (!editor.somethingSelected()) {
                selectall();
            }
            var rng = getSelectedRange();
            editor.autoFormatRange(rng.from, rng.to);
        }

        var previewhtml = function () {

        }

        //Javascript scopes
        var addfunction = function (arg) {
            var fn = '';
            var args = (arg || '').split(' ');
            if (args.length)
                fn = args[0];
            var fnn = 'function ' + fn + '() { \
    }';
            PrintContent(fnn);
        }

        //Resource tags
        var addjquery = function (arg) {
            var args = (arg || '').split(' ');
            var vers = "latest"
            if (args.length)
                vers = args[0];
            var filt = jsresource.jquery.filter(function (itm) { return itm.version == vers });
            var ret = (filt && filt.length) ? filt[0] : jsresource.jquery[0];
            var tag = "<script type='text/javascript' src='" + ret.path.cdn.minified.script[0] + "'></script>" + newLine;
            //AppendHtmltoElement("head", tag);
            PrintContent(tag);
        }

        var addbootstrap = function (arg) {
            var args = (arg || '').split(' ');
            var vers = "latest";
            if (args.length)
                var vers = args[0];
            var filt = jsresource.bootstrap.filter(function (itm) { return itm.version == vers });
            var ret = (filt && filt.length) ? filt[0] : jsresource.bootstrap[0];
            //var tag = "<link rel='stylesheet' href='" + ret.path.cdn.minified.css[0] + "' crossorigin='anonymous'>";
            //tag += newLine;
            var tag = "<script type='text/javascript' src='" + ret.path.cdn.minified.script[0] + "'></script>" + newLine;
            PrintContent(tag);
            //AppendHtmltoElement("head", tag);
        }

        var addbrahmaprogress = function () {

            var prog = '<section class="loadersGlb loaders-bg-3"> \n' +
                '<span id="ldr-prog" class="loader loader-circles"> </span > \n' +
                '</section>';
            AppendHtmltoElement("body", prog);
            AppendHtmltoElement("body", '<script type="text/javascript"> \n//basic usage - bgprogess \n' +
                '//bg.startProgress(); \n' +
                '//bg.stopProgress(); \n' +
                '</script > ');
            var tag = newLine + '<link rel="stylesheet" href="' + jsresource.bgprogress[0].path.local.dev.css[0] + '" crossorigin="anonymous">';
            tag += newLine;
            tag += "<script type='text/javascript' src='" + jsresource.bgprogress[0].path.local.dev.script[0] + "'></script>" + newLine;
            AppendHtmltoElement("head", tag);
        }

        cmds = {
            //Regular Commands
            selectall: {
                fn: selectall,
                desc: 'Select All - Similar to CTRL+A(PC), CMD+A(MAC)',
                param: 'Select All'
            },
            deleteall: {
                fn: deleteall,
                desc: 'Delete All - Clear the Content',
                param: 'Delete All'
            },
            tellit: {
                fn: deletes,
                desc: 'Alternate: Deletes the current',
                param: 'Tell It'
            },
            delete: {
                fn: deletes,
                desc: 'Deletes the current cursor position',
                param: 'Delete'
            },
            deleteword: {
                fn: deleteword,
                desc: 'Deletes the current word',
                param: 'Delete Word'
            },
            backspace: {
                fn: backspace,
                desc: 'Backspace from the current cursor',
                param: 'Backspace'
            },
            focus: {
                fn: focus,
                desc: 'Focus and the cursor blinks',
                param: 'Focus'
            },
            controlhome: {
                fn: godocstart,
                desc: 'Move the cursor to the start of the document \nCtrl-Home (PC), Cmd-Up (Mac), Cmd-Home (Mac)',
                param: 'Control Home'
            },
            gotostart: {
                fn: godocstart,
                desc: 'Move the cursor to the start of the document \nCtrl-Home (PC), Cmd-Up (Mac), Cmd-Home (Mac)',
                param: 'Go To Start'
            },
            godocstart: {
                fn: godocstart,
                desc: 'Move the cursor to the start of the document \nCtrl-Home (PC), Cmd-Up (Mac), Cmd-Home (Mac)',
                param: 'Go Doc Start'
            },
            controlend: {
                fn: godocend,
                desc: 'Move the cursor to the end of the document. \nCtrl-End (PC), Cmd-End (Mac), Cmd-Down (Mac)',
                param: 'Control End'
            },
            gotoend: {
                fn: godocend,
                desc: 'Move the cursor to the end of the document. \nCtrl-End (PC), Cmd-End (Mac), Cmd-Down (Mac)',
                param: 'Go To End'
            },
            godocend: {
                fn: godocend,
                desc: 'Move the cursor to the end of the document. \nCtrl-End (PC), Cmd-End (Mac), Cmd-Down (Mac)',
                param: 'Go Doc End'
            },
            selectline: {
                fn: selectline,
                desc: 'Selects the current line',
                param: 'Select Line'
            },
            selectlines: {
                fn: selectline,
                desc: 'Selects the current line',
                param: 'Select Lines'
            },
            enter: {
                fn: nextline,
                desc: 'Line break in current cursor position',
                param: 'Enter'
            },
            explain: {
                fn: nextline,
                desc: 'Alternate (Enter): Line break in current cursor position',
                param: 'Explain'
            },
            neckline: {
                fn: nextline,
                desc: 'Alternate (Enter): Line break in current cursor position',
                param: 'Neck Line'
            },
            nextline: {
                fn: nextline,
                desc: 'Alternate (Enter): Line break in current cursor position',
                param: 'Next Line'
            },
            anbu: {
                fn: undo,
                desc: 'Alternate (Undo): Undo the last change \n Ctrl-Z (PC), Cmd-Z (Mac)',
                param: 'Anbu'
            },
            undo: {
                fn: undo,
                desc: 'Undo the last change \n Ctrl-Z (PC), Cmd-Z (Mac)',
                param: 'Undo'
            },
            revert: {
                fn: undo,
                desc: 'Undo the last change \n Ctrl-Z (PC), Cmd-Z (Mac)',
                param: 'Revert'
            },
            redo: {
                fn: redo,
                desc: 'Redo the last undone change \n Ctrl-Y (PC), Shift-Cmd-Z (Mac), Cmd-Y (Mac)',
                param: 'Redo'
            },
            controlc: {
                fn: controlc,
                desc: 'Alternate (copy): copy the selection',
                param: 'Control C'
            },
            copy: {
                fn: controlc,
                desc: 'copy the selection',
                param: 'copy'
            },
            controlx: {
                fn: controlx,
                desc: 'Alternate (cut): cut the selection',
                param: 'Control X'
            },
            cut: {
                fn: controlx,
                desc: 'cut the selection',
                param: 'Cut'
            },
            controlv: {
                fn: controlv,
                desc: 'Paste the Selection',
                param: 'Control V'
            },
            paste: {
                fn: controlv,
                desc: 'Paste the Selection',
                param: 'Paste'
            },
            semicolon: {
                fn: semicolon,
                desc: 'Single char - ;',
                param: ';'
            },
            space: {
                fn: space,
                desc: 'Single char - Space',
                param: 'Space'
            },
            karma: {
                fn: karma,
                desc: '',
                param: ''
            },
            comma: {
                fn: karma,
                desc: 'Alternate (,) - Singel Char - ,',
                param: ','
            },
            exclamation: {
                fn: exclamation,
                desc: 'Single Char - !',
                param: '!'
            },
            clamation: {
                fn: exclamation,
                desc: 'Alternate (clamation): Single Char - !',
                param: 'clamation'
            },
            period: {
                fn: period,
                desc: 'Single Char - .',
                param: 'Period'
            },
            fullstop: {
                fn: period,
                desc: 'Single Char - .',
                param: 'Full Stop'
            },
            singlequote: {
                fn: singlequote,
                desc: 'Single Char - \'',
                param: 'Single Quote'
            },
            singlequotes: {
                fn: singlequotes,
                desc: 'Single Quotes, \'\'',
                param: 'Single Quotes'
            },
            doublequote: {
                fn: doublequote,
                desc: 'Single Char - "',
                param: 'Double Quote'
            },
            doublequotes: {
                fn: doublequotes,
                desc: 'Double Quotes - ""',
                param: 'Double Quotes'
            },
            openparenthesis: {
                fn: openparenthesis,
                desc: 'Single Char - (',
                param: 'Open Parenthesis'
            },
            openparentheses: {
                fn: openparenthesis,
                desc: 'Open Pranetheses',
                param: 'Open Parentheses'
            },
            openbracket: {
                fn: openparenthesis,
                desc: 'Single Char - (',
                param: 'Open Bracket'
            },
            closeparenthesis: {
                fn: closeparenthesis,
                desc: 'Single Char - )',
                param: 'Close Parenthesis'
            },
            closeparentheses: {
                fn: closeparenthesis,
                desc: 'Single Char - )',
                param: 'Close Parentheses'
            },
            closebracket: {
                fn: closeparenthesis,
                desc: 'Single Char - )',
                param: 'Close Bracket'
            },
            scrolltop: {
                fn: scrolltop,
                desc: 'Scroll Top',
                param: 'Scroll Top'
            },
            scrollup: {
                fn: scrollup,
                desc: 'Scroll Up',
                param: 'Scroll Up'
            },
            scrolldown: {
                fn: scrolldown,
                desc: 'Scroll Down',
                param: 'Scroll Down'
            },
            scrollbottom: {
                fn: scrollbottom,
                desc: 'Scroll Bottom',
                param: 'Scroll Bottom'
            },
            scrollright: {
                fn: scrollright,
                desc: 'Scroll Right',
                param: 'Scroll Right'
            },
            scrollend: {
                fn: scrollend,
                desc: 'Scroll End',
                param: 'Scroll End'
            },
            scrollhome: {
                fn: scrollhome,
                desc: 'Scroll Home',
                param: 'Scroll Home'
            },
            scrollleft: {
                fn: scrollleft,
                desc: 'Scroll Left',
                param: 'Scroll Left'
            },
            letter: {
                fn: letter,
                desc: 'Value will be considered as letters',
                param: 'Letter !Value'
            },
            capitalletter: {
                fn: capitalletter,
                desc: 'argument value will be CAPITALIZED',
                param: 'Capital Letter !Value'
            },
            gotoline: {
                fn: gotoline,
                desc: 'Move the cursor position to line',
                param: 'Go To Line !LineNo'
            },
            linenumber: {
                fn: gotoline,
                desc: 'Move the cursor position to line',
                param: 'Line Number !LineNumber'
            },
            gotocolumn: {
                fn: gotocolumn,
                desc: 'Move the cursor position to column',
                param: 'Go To Column !ColumnPosition'
            },
            columnnumber: {
                fn: gotocolumn,
                desc: 'Move the cursor position to column',
                param: 'Column Number !ColumnPosition'
            },
            singleselection: {
                fn: singleselection,
                desc: 'When multiple selections are present, this deselects all but the primary selection',
                param: 'Single Selection'
            },
            movelineup: {
                fn: movelineup,
                desc: 'Moves the cursor position up',
                param: 'Move Line Up'
            },
            movelinedown: {
                fn: movelinedown,
                desc: 'Moves the current line down',
                param: 'Move Line Down'
            },
            killline: {
                fn: killline,
                desc: 'Deletes the part of the line after the cursor',
                param: 'Kill Line'
            },
            deleteline: {
                fn: deleteline,
                desc: 'Deletes the whole line under the cursor, including newline at the end',
                param: 'Delete Line'
            },
            deletelineleft: {
                fn: dellineleft,
                desc: 'Delete the part of the line before the cursor',
                param: 'Delete Line Left'
            },
            dellineleft: {
                fn: dellineleft,
                desc: 'Delete the part of the line before the cursor',
                param: 'Del Line Left'
            },
            deletewrappedlineleft: {
                fn: delwrappedlineleft,
                desc: 'Delete the part of the line from the left side of the visual line the cursor is on to the cursor',
                param: 'Del Wrapped Line Left'
            },
            delwrappedlineleft: {
                fn: delwrappedlineleft,
                desc: 'Delete the part of the line from the left side of the visual line the cursor is on to the cursor',
                param: 'Del Wrapped Line Left'
            },
            deletewrappedlineright: {
                fn: delwrappedlineright,
                desc: 'Delete the part of the line from the cursor to the right side of the visual line the cursor is on',
                param: 'Delete Wrapped Line Right'
            },
            delwrappedlineright: {
                fn: delwrappedlineright,
                desc: 'Delete the part of the line from the cursor to the right side of the visual line the cursor is on',
                param: 'Del Wrapped Line Right'
            },
            undoselection: {
                fn: undoselection,
                desc: 'Undo one edit or selection change',
                param: 'Undo Selection'
            },
            redoselection: {
                fn: redoselection,
                desc: 'Redo the last change to the selection, or the last text change if no selection changes remain \nAlt-U (PC), Shift-Cmd-U (Mac)',
                param: 'Redo Selection'
            },
            golinestart: {
                fn: golinestart,
                desc: '',
                param: ''
            },
            home: {
                fn: golinestart,
                desc: '',
                param: ''
            },
            smarthome: {
                fn: golinestartsmart,
                desc: '',
                param: ''
            },
            controlend: {
                fn: godocend,
                desc: '',
                param: ''
            },
            golineend: {
                fn: golineend,
                desc: '',
                param: ''
            },
            end: {
                fn: golineend,
                desc: '',
                param: ''
            },
            endofline: {
                fn: golineend,
                desc: '',
                param: ''
            },
            golineright: {
                fn: golineright,
                desc: '',
                param: ''
            },
            golineleft: {
                fn: golineleft,
                desc: '',
                param: ''
            },
            golineleftsmart: {
                fn: golineleftsmart,
                desc: '',
                param: ''
            },
            golineup: {
                fn: golineup,
                desc: '',
                param: ''
            },
            uparrow: {
                fn: golineup,
                desc: '',
                param: ''
            },
            apparel: {
                fn: golineup,
                desc: '',
                param: ''
            },
            narrow: {
                fn: golinedown,
                desc: '',
                param: ''
            },
            golinedown: {
                fn: golinedown,
                desc: '',
                param: ''
            },
            downarrow: {
                fn: golinedown,
                desc: '',
                param: ''
            },
            gopageup: {
                fn: gopageup,
                desc: '',
                param: ''
            },
            pageup: {
                fn: gopageup,
                desc: '',
                param: ''
            },
            gopagedown: {
                fn: gopagedown,
                desc: '',
                param: ''
            },
            pagedown: {
                fn: gopagedown,
                desc: '',
                param: ''
            },
            gocharleft: {
                fn: gocharleft,
                desc: '',
                param: ''
            },
            leftarrow: {
                fn: gocharleft,
                desc: '',
                param: ''
            },
            gocharright: {
                fn: gocharright,
                desc: '',
                param: ''
            },
            rightarrow: {
                fn: gocharright,
                desc: '',
                param: ''
            },
            gocolumnleft: {
                fn: gocolumnleft,
                desc: '',
                param: ''
            },
            gocolumnright: {
                fn: gocolumnright,
                desc: '',
                param: ''
            },
            gowordleft: {
                fn: gowordleft,
                desc: '',
                param: ''
            },
            controlleftarrow: {
                fn: gowordleft,
                desc: '',
                param: ''
            },
            gowordright: {
                fn: gowordright,
                desc: '',
                param: ''
            },
            controlrightarrow: {
                fn: gowordright,
                desc: '',
                param: ''
            },
            gogroupleft: {
                fn: gogroupleft,
                desc: '',
                param: ''
            },
            gogroupright: {
                fn: gogroupright,
                desc: '',
                param: ''
            },
            delcharbefore: {
                fn: delcharbefore,
                desc: '',
                param: ''
            },
            delcharafter: {
                fn: delcharafter,
                desc: '',
                param: ''
            },
            deletes: {
                fn: delcharafter,
                desc: '',
                param: ''
            },
            defaulttab: {
                fn: defaulttab,
                desc: '',
                param: ''
            },
            tab: {
                fn: defaulttab,
                desc: '',
                param: ''
            },
            delwordafter: {
                fn: delwordafter,
                desc: '',
                param: ''
            },
            delgroupbefore: {
                fn: delgroupbefore,
                desc: '',
                param: ''
            },
            delgroupafter: {
                fn: delgroupafter,
                desc: '',
                param: ''
            },
            indentauto: {
                fn: indentauto,
                desc: '',
                param: ''
            },
            indentmore: {
                fn: indentmore,
                desc: '',
                param: ''
            },
            indentless: {
                fn: indentless,
                desc: '',
                param: ''
            },
            insertsofttab: {
                fn: insertsofttab,
                desc: '',
                param: ''
            },
            transposechars: {
                fn: transposechars,
                desc: '',
                param: ''
            },
            newlineindent: {
                fn: newlineandindent,
                desc: '',
                param: ''
            },
            newlinetab: {
                fn: newlineandindent,
                desc: '',
                param: ''
            },
            entertab: {
                fn: newlineandindent,
                desc: '',
                param: ''
            },
            toggleoverwrite: {
                fn: toggleoverwrite,
                desc: '',
                demolink: '',
                param: ''
            },
            //HTML Cmds
            createhtml: {
                fn: createhtml,
                desc: 'Loads the basic Html Template',
                demolink: '',
                param: 'Create Html'
            },
            createelement: {
                fn: createelement,
                desc: 'Create Element',
                demolink: '',
                param: 'Create Element !name'
            },
            closeelement: {
                fn: closeelement,
                desc: 'Appends close element to the current curosr dom',
                demolink: '',
                param: 'Close Element !elemenetName'
            },
            formathtml: {
                fn: formathtml,
                desc: 'Dees alighnment for the current selection',
                demolink: '',
                param: 'Format Html'
            },
            selectelement: {
                fn: selectelement,
                desc: 'Selects the current element in the cursor position',
                demolink: '',
                param: 'Select Element'
            },
            editelement: {
                fn: editelement,
                desc: 'Edit Html, Edit the Current dom element in Cursor positioned',
                demolink: '',
                param: 'Edit Html'
            },
            addattribute: {
                fn: addattribute,
                desc: 'Add attribute to the element, ex: <div name="value">',
                demolink: '',
                param: 'Add Attribute !name !value'
            },
            addclass: {
                fn: addclass,
                desc: 'Add class to the current element, ex: <div class="value">',
                demolink: '',
                param: ''
            },
            appendelement: {
                fn: appendelement,
                desc: 'Append element',
                demolink: 'Append element to the current selected dom',
                param: 'Append element !name'
            },
            addmetaresponsive: {
                fn: addmetaresponsive,
                desc: 'Add meta tag <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">',
                demolink: '',
                param: 'Add Meta Responsive'
            },
            previewhtml: {
                fn: previewhtml,
                desc: 'Preview the current html content',
                demolink: '',
                param: 'Preview'
            },
            //Javascript
            addfunction: {
                fn: addfunction,
                desc: 'Add javascript function in the current cursor position',
                demolink: '',
                param: 'Add Function !Name'
            },
            //Rresource
            addjquery: {
                fn: addjquery,
                desc: 'Add jquery script block in the current cursor position',
                demolink: 'https://jquery.com/',
                param: 'Add Jquery !version'
            },
            addbootstrap: {
                fn: addbootstrap,
                desc: 'Add Bootstap, add bootstrap script',
                demolink: 'https://getbootstrap.com/',
                param: 'Add Bootstap !version '
            },
            addbrahmaprogress: {
                fn: addbrahmaprogress,
                desc: 'Add Brahma Progress - Is a progress',
                demolink:'',
                param: 'Add Brahma Progress'
            },
            addtitle: {
                fn: addtitle,
                desc: 'Adds <title> tag',
                demolink: '',
                param: 'Add Title !titletext'
            },
            addseotags: {
                fn: addseotags,
                desc: 'Add Common Seo Tags, meta names - description, ROBOTS, author, keywords',
                demolink: '',
                param: 'Add S.E.O Tags'
            }
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
                    if (cmds[cmd] && cmds[cmd].fn && (typeof cmds[cmd].fn == 'function')) {
                        cmds[cmd].fn(pars)
                    } else {
                        cmds[cmd](pars)
                    }
                    iscmd = true;
                }
            }

            return iscmd;
        }

        var ProcessCommand = function (text) {
            text = (text || '').replace(/\n/g, 'enter'); //Minor cleanup
            //if (!procLowToHighCommand(text)) {
            if (!procHightToLowCommand(text)) {
                PrintContent(text);
            }
        }

        //Utils

        function getSelectedRange() {
            return { from: editor.getCursor(true), to: editor.getCursor(false) };
        }

        var toCamelCase = function (str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
                if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
                return index == 0 ? match.toLowerCase() : match.toUpperCase();
            });
        }

        var IsValidDomText = function (txt) {
            try {
                if (txt.indexOf('<') != 0) return false;
                if (txt.lastIndexOf('>') != (txt.length - 1)) return false;
                var xx = $(txt);
                return true;
            }
            catch (exp) {
                return false;
            }
        }

        /**
         * Reset the iFrame content to manipulate the html
         * @param {string} fhtml - html string
         * @todo throw error for invalid html format
         */
        var ResetiFrame = function (fhtml, tag, html) {
            var iframe = document.getElementById("ifrm");
            try {
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write("");
                iframe.contentWindow.document.close();
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(fhtml);
                iframe.contentWindow.document.close();
            } catch (exp) {
                console.log("Invalid html format, pls validate before updating");
            }
            setTimeout(function () {
                var cntrls = iframe.contentDocument.getElementsByTagName(tag);
                var tgs = Array.prototype.slice.call(cntrls);
                if (!tgs || !tgs.length)
                    return;
                (tgs || []).forEach(function (crtl) {
                    crtl.innerHTML = newLine + crtl.innerHTML + html + newLine;
                });
                editor.setValue("<!DOCTYPE html>" + newLine + iframe.contentDocument.getElementsByTagName('html')[0].outerHTML);
            }, 1000)
            return iframe;
        }

        /**
         * append htmlstring to an element
         * @param {string} tag - tagname (eg: body, div, script)
         * @param {string} html - html string to be appended
         */
        AppendHtmltoElement = function (tag, html) {
            var iframe = ResetiFrame(editor.getValue(), tag, html);
            //var cntrls = iframe.contentDocument.getElementsByTagName(tag);//.append(html);
            //var tgs = Array.prototype.slice.call(cntrls);
            //if (!tgs || !tgs.length)
            //    return;
            //(tgs || []).forEach(function (crtl) {
            //    crtl.innerHTML = newLine + crtl.innerHTML + html + newLine;
            //});
            //editor.setValue("<!DOCTYPE html>" + newLine + iframe.contentDocument.getElementsByTagName('html')[0].outerHTML);
        }

        var TranslateElement = function (args) {
            //arg = (args || '').replace(/ /g, '').toLowerCase();
            args = args.toLowerCase().split(' ');
            arg = args[0];
            var elem = '';
            if (arg == "script") {
                elem = '<' + arg + ' type="text/javascript"></' + arg + '>';
            } else if (arg == "table") {
                elem = TranslateTableElement(args.slice(1));
            } else {
                elem = '<' + arg + '></' + arg + '>';
            }
            return elem;
        }

        var TranslateTableElement = function (arg) {
            if (!arg || !arg.length)
                return '<table></table>';
            var tr = 0; tc = 0, w = -1;
            w = arg.indexOf("row")
            if (w > -1 && arg.length > w) {
                var tnum = TranslateNumbers(arg[w + 1]);
                if (!isNaN(parseInt(tnum))) {
                    console.log("Table Row Count: " + parseInt(tnum));
                    tr = parseInt(tnum);
                }
            }
            w = arg.indexOf("column");
            if (w > -1 && arg.length > w) {
                var tnum = TranslateNumbers(arg[w + 1]);
                if (!isNaN(parseInt(tnum))) {
                    console.log("Table Column Count: " + parseInt(tnum));
                    tc = parseInt(tnum);
                }
            }
            var $tbl = $('<table></table>');
            for (var i = 0; i < tr; i++) {
                var $tr = $("<tr></tr>");
                for (j = 0; j < tc; j++) {
                    $tr.append("<td></td>")
                }
                $tbl.append($tr);
            }
            return $tbl[0].outerHTML;
        }

        var TranslateNumbers = function (txt) {
            var eleven = ".level.lemon.eleven.";
            var six = ".six.vi.";

            if (!txt) return;
            var txt = (txt || '').toString().toLowerCase();
            if (!isNaN(parseInt(txt))) {
                return txt;
            }
            txt = "." + txt + ".";
            if (eleven.indexOf(txt) > -1) return "11";
            if (six.indexOf(txt) > -1) return "6";
            return txt;
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

        var GetHtmlTemplate = function (arg, callback) {
            $.ajax({
                url: "../html_template.html",
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

        PostHtml = function (arg, callback) {
            /*$.ajax({
                url: "/Home/Preview",
                data: {
                    HString: editor.getValue()
                },
                type: "POST",
                dataType: "html",
                success: function (data) {
                    //alert(data);
                    //printctrl.val(data);
                    if (callback) {
                        callback(data);
                    }
                    var iframe = document.getElementById("ipr");
                    try {
                        iframe.contentWindow.document.open();
                        iframe.contentWindow.document.write("");
                        iframe.contentWindow.document.close();
                        iframe.contentWindow.document.open();
                        iframe.contentWindow.document.write(data);
                        iframe.contentWindow.document.close();
                    } catch (exp) {
                        console.log("Invalid html format, pls validate before updating");
                    }
                    //$("#ipr").html(data);
                    //$("#prv").show();
                },
                error: function (xhr, status) {
                    alert("Sorry, there was a problem Preview!");
                },
                complete: function (xhr, status) {
                    //$('#showresults').slideDown('slow')
                }
            });*/
            var data = editor.getValue();
            var iframe = document.getElementById("ipr");
            iframe.style.display = "fixed";
            //$(iframe).attr("src", 'data:text/html,' + data);
            try {
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write("");
                iframe.contentWindow.document.close();
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(data);
                iframe.contentWindow.document.close();
            } catch (exp) {
                console.log("Invalid html format, pls validate before updating" + exp.toString());
            }
            $(".modal-block").show();
        }

        return {
            processCommand: ProcessCommand
        }
    }

    //Outer scope

    var loadresources = function (arg, callback) {
        $.ajax({
            url: "../Resources/resources.json",
            data: {

            },
            type: "GET",
            dataType: "json",
            success: function (data) {
                jsresource = data;
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem in resource load.!");
            },
            complete: function (xhr, status) {
                //$('#showresults').slideDown('slow')
            }
        });
    }

    var translate = function (event) {
        var txtRec = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            txtRec += event.results[i][0].transcript;
        }
        return txtRec;
    }

    var recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";
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
    ww = a7v("#cmm");
    recognition.start();
    loadresources();

    $(".min-cmds").on("click", function () {
        $(".mnu-contain").slideToggle(200);
        if ($("#imgvTb").hasClass("rt")) {
            $("#imgvTb").attr("src", "../Content/lt_vr_1.png");
            $("#imgvTb").removeClass("rt");
            $("#imgvTb").addClass("lt");
        } else if ($("#imgvTb").hasClass("lt")) {
            $("#imgvTb").attr("src", "../Content/rt_vr_1.png");
            $("#imgvTb").removeClass("lt");
            $("#imgvTb").addClass("rt");
        }
    });

    $(document).on("keyup", "#txtSrc", function () {
        console.log(cmds);
        var tos = $(this).val();
        if (tos) {
            $(".sel-mul option").css("display", "none");
        } else {
            $(".sel-mul option").css("display", "block");
        }
        var arrl = Object.keys(cmds);
        var sarr = [];
        var fl = arrl.filter(function (v) {
            if (((v || '').indexOf(tos) > -1) || ((cmds[v].desc || '').indexOf(tos) > -1)) {
                sarr.push(cmds[v]);
            }
        });

        if (sarr && sarr.length) {
            $(".sel-mul option").each(function () {
                if (sarr.indexOf($(this).data("cdata")) > -1) {
                    $(this).css("display", "block");
                }
            });
        }
    });
});