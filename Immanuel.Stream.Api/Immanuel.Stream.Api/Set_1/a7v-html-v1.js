var editor;
$(function () {

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
            height: "100%",
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
                var $ddv = $("<div class='mnu-contain'><div><a style='position:absolute;right:10px;' class='min-cmds' href='javascript:void(0);'>min</a></div></div>").css({
                    backgroundColor: "rgba(128, 128, 128, 0.5)",
                    width: "28%",
                    height: "95%",
                    position: "fixed",
                    marginLeft: "10px",
                    right: 0,
                    top: 10
                });
                $cmds = $("<select multiple></select>").css({
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
                    var $o = $("<option value=" + v + ">" + v + "</option>");
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

        var addmetaresponsive = function () {
            PrintContent('<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">');
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
            tag += '<meta name="keywords" content="free online youtube video download,free online youtube audio download, free online youtube mp3 extract download, split download, download specific portion both video & audio" />' + newLine;
            PrintContent(tag);
        }

        var addmetaresponsive = function () {
            var tag = '';
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

        var cmds = {
            //Regular Commands
            selectall: {
                fn: selectall,
                desc: 'Select All'
            },
            deleteall: {
                fn: deleteall,
                desc: ''
            },
            tellit: {
                fn: deletes,
                desc: ''
            },
            delete: {
                fn: deletes,
                desc: ''
            },
            deleteword: {
                fn: deleteword,
                desc: ''
            },
            backspace: {
                fn: backspace,
                desc: ''
            },
            focus: {
                fn: focus,
                desc: ''
            },
            controlhome: {
                fn: godocstart,
                desc: ''
            },
            gotostart: {
                fn: godocstart,
                desc: ''
            },
            godocstart: {
                fn: godocstart,
                desc: ''
            },
            controlend: {
                fn: godocend,
                desc: ''
            },
            gotoend: {
                fn: godocend,
                desc: ''
            },
            godocend: {
                fn: godocend,
                desc: ''
            },
            selectline: {
                fn: selectline,
                desc: ''
            },
            selectlines: {
                fn: selectline,
                desc: ''
            },
            enter: {
                fn: nextline,
                desc: ''
            },
            explain: {
                fn: nextline,
                desc: ''
            },
            neckline: {
                fn: nextline,
                desc: ''
            },
            nextline: {
                fn: nextline,
                desc: ''
            },
            anbu: {
                fn: undo,
                desc: ''
            },
            undo: {
                fn: undo,
                desc: ''
            },
            revert: {
                fn: undo,
                desc: ''
            },
            redo: {
                fn: redo,
                desc: ''
            },
            controlc: {
                fn: controlc,
                desc: ''
            },
            copy: {
                fn: controlc,
                desc: ''
            },
            controlx: {
                fn: controlx,
                desc: ''
            },
            cut: {
                fn: controlx,
                desc: ''
            },
            controlv: {
                fn: controlv,
                desc: ''
            },
            paste: {
                fn: controlv,
                desc: ''
            },
            semicolon: {
                fn: semicolon,
                desc: ''
            },
            space: {
                fn: space,
                desc: ''
            },
            karma: {
                fn: karma,
                desc: ''
            },
            comma: {
                fn: karma,
                desc: ''
            },
            exclamation: {
                fn: exclamation,
                desc: ''
            },
            clamation: {
                fn: exclamation,
                desc: ''
            },
            period: {
                fn: period,
                desc: ''
            },
            singlequote: {
                fn: singlequote,
                desc: ''
            },
            singlequotes: {
                fn: singlequotes,
                desc: ''
            },
            doublequote: {
                fn: doublequote,
                desc: ''
            },
            doublequotes: {
                fn: doublequotes,
                desc: ''
            },
            openparenthesis: {
                fn: openparenthesis,
                desc: ''
            },
            openparentheses: {
                fn: openparenthesis,
                desc: ''
            },
            openbracket: {
                fn: openparenthesis,
                desc: ''
            },
            closeparenthesis: {
                fn: closeparenthesis,
                desc: ''
            },
            closeparentheses: {
                fn: closeparenthesis,
                desc: ''
            },
            closebracket: {
                fn: closeparenthesis,
                desc: ''
            },
            scrolltop: {
                fn: scrolltop,
                desc: ''
            },
            scrollup: {
                fn: scrollup,
                desc: ''
            },
            scrolldown: {
                fn: scrolldown,
                desc: ''
            },
            scrollbottom: {
                fn: scrollbottom,
                desc: ''
            },
            scrollright: {
                fn: scrollright,
                desc: ''
            },
            scrollend: {
                fn: scrollend,
                desc: ''
            },
            scrollhome: {
                fn: scrollhome,
                desc: ''
            },
            scrollleft: {
                fn: scrollleft,
                desc: ''
            },
            letter: {
                fn: letter,
                desc: ''
            },
            capitalletter: {
                fn: capitalletter,
                desc: ''
            },
            gotoline: {
                fn: gotoline,
                desc: ''
            },
            linenumber: {
                fn: gotoline,
                desc: ''
            },
            gotocolumn: {
                fn: gotocolumn,
                desc: ''
            },
            columnnumber: {
                fn: gotocolumn,
                desc: ''
            },
            singleselection: {
                fn: singleselection,
                desc: ''
            },
            movelineup: {
                fn: movelineup,
                desc: ''
            },
            movelinedown: {
                fn: movelinedown,
                desc: ''
            },
            killline: {
                fn: killline,
                desc: ''
            },
            deleteline: {
                fn: deleteline,
                desc: ''
            },
            dellineleft: {
                fn: dellineleft,
                desc: ''
            },
            delwrappedlineleft: {
                fn: delwrappedlineleft,
                desc: ''
            },
            delwrappedlineright: {
                fn: delwrappedlineright,
                desc: ''
            },
            undoselection: {
                fn: undoselection,
                desc: ''
            },
            redoselection: {
                fn: redoselection,
                desc: ''
            },
            golinestart: {
                fn: golinestart,
                desc: ''
            },
            home: {
                fn: golinestart,
                desc: ''
            },
            smarthome: {
                fn: golinestartsmart,
                desc: ''
            },
            controlhome: {
                fn: godocstart,
                desc: ''
            },
            controlend: {
                fn: godocend,
                desc: ''
            },
            golineend: {
                fn: golineend,
                desc: ''
            },
            end: {
                fn: golineend,
                desc: ''
            },
            endofline: {
                fn: golineend,
                desc: ''
            },
            golineright: {
                fn: golineright,
                desc: ''
            },
            golineleft: {
                fn: golineleft,
                desc: ''
            },
            golineleftsmart: {
                fn: golineleftsmart,
                desc: ''
            },
            golineup: {
                fn: golineup,
                desc: ''
            },
            uparrow: {
                fn: golineup,
                desc: ''
            },
            apparel: {
                fn: golineup,
                desc: ''
            },
            narrow: {
                fn: golinedown,
                desc: ''
            },
            golinedown: {
                fn: golinedown,
                desc: ''
            },
            downarrow: {
                fn: golinedown,
                desc: ''
            },
            gopageup: {
                fn: gopageup,
                desc: ''
            },
            pageup: {
                fn: gopageup,
                desc: ''
            },
            gopagedown: {
                fn: gopagedown,
                desc: ''
            },
            pagedown: {
                fn: gopagedown,
                desc: ''
            },
            gocharleft: {
                fn: gocharleft,
                desc: ''
            },
            leftarrow: {
                fn: gocharleft,
                desc: ''
            },
            gocharright: {
                fn: gocharright,
                desc: ''
            },
            rightarrow: {
                fn: gocharright,
                desc: ''
            },
            gocolumnleft: {
                fn: gocolumnleft,
                desc: ''
            },
            gocolumnright: {
                fn: gocolumnright,
                desc: ''
            },
            gowordleft: {
                fn: gowordleft,
                desc: ''
            },
            controlleftarrow: {
                fn: gowordleft,
                desc: ''
            },
            gowordright: {
                fn: gowordright,
                desc: ''
            },
            controlrightarrow: {
                fn: gowordright,
                desc: ''
            },
            gogroupleft: {
                fn: gogroupleft,
                desc: ''
            },
            gogroupright: {
                fn: gogroupright,
                desc: ''
            },
            delcharbefore: {
                fn: delcharbefore,
                desc: ''
            },
            delcharafter: {
                fn: delcharafter,
                desc: ''
            },
            deletes: {
                fn: delcharafter,
                desc: ''
            },
            defaulttab: {
                fn: defaulttab,
                desc: ''
            },
            tab: {
                fn: defaulttab,
                desc: ''
            },
            delwordafter: {
                fn: delwordafter,
                desc: ''
            },
            delgroupbefore: {
                fn: delgroupbefore,
                desc: ''
            },
            delgroupafter: {
                fn: delgroupafter,
                desc: ''
            },
            indentauto: {
                fn: indentauto,
                desc: ''
            },
            indentmore: {
                fn: indentmore,
                desc: ''
            },
            indentless: {
                fn: indentless,
                desc: ''
            },
            insertsofttab: {
                fn: insertsofttab,
                desc: ''
            },
            transposechars: {
                fn: transposechars,
                desc: ''
            },
            newlineindent: {
                fn: newlineandindent,
                desc: ''
            },
            newlinetab: {
                fn: newlineandindent,
                desc: ''
            },
            entertab: {
                fn: newlineandindent,
                desc: ''
            },
            toggleoverwrite: {
                fn: toggleoverwrite,
                desc: ''
            },
            //HTML Cmds
            createhtml: {
                fn: createhtml,
                desc: ''
            },
            createelement: {
                fn: createelement,
                desc: ''
            },
            closeelement: {
                fn: closeelement,
                desc: 'Close Element !elemenetName'
            },
            formathtml: {
                fn: formathtml,
                desc: ''
            },
            selectelement: {
                fn: selectelement,
                desc: ''
            },
            editelement: {
                fn: editelement,
                desc: ''
            },
            addattribute: {
                fn: addattribute,
                desc: ''
            },
            addclass: {
                fn: addclass,
                desc: ''
            },
            appendelement: {
                fn: appendelement,
                desc: ''
            },
            addmetaresponsive: {
                fn: addmetaresponsive,
                desc: ''
            },
            previewhtml: {
                fn: previewhtml,
                desc: ''
            },
            //Javascript
            addfunction: {
                fn: addfunction,
                desc: ''
            },
            //Rresource
            addjquery: {
                fn: addjquery,
                desc: ''
            },
            addbootstrap: {
                fn: addbootstrap,
                desc: ''
            },
            addbrahmaprogress: {
                fn: addbrahmaprogress,
                desc: ''
            },
            addtitle: {
                fn: addtitle,
                desc: 'Add title',
                param: 'addtitle !titletext'
            },
            addseotags: {
                fn: addseotags,
                desc: 'Add Common Seo Tags, meta names - description, ROBOTS, author, keywords',
                param: 'addseotags'
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
        $(".mnu-contain").hide();
    });
});