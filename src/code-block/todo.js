import CodeMirror from 'codemirror'
CodeMirror.defineMode("todo", function(config, parserConfig) {

  var keywords = {
      "month": true,
      "week": true,
      "weekly": true,
      "day": true,
      "daily": true,
  };
  var daysOfTheWeek = {
      "monday": true,
      "tuesday": true,
      "wednesday": true,
      "thursday": true,
      "friday": true,
      "saturday": true,
      "sunday": true,
  };
  
  var months = {
      "january": true,
      "february": true,
      "march": true,
      "april": true,
      "may": true,
      "june": true,
      "july": true,
      "august": true,
      "september": true,
      "october": true,
      "november": true,
      "december": true
  };

  var atoms = {
      "make": true,
      "new": true,
      "todo": true,
      "pay": true,
      "water": true,
      "power": true,
      "rent": true,
  };

  var indentUnit = 4;
  var isOperatorChar = /[+\-&^%:=<>!|\/]/;

// Stream is an object that contains a line of object
  function tokenBase(stream, state) {
    var ch = stream.next();
      
    if (ch === "`") {
        stream.match(/`{2}/);
        return "codeState";
    }
    // TODO: Make state work for the entire line
    if (state.codeState) {
        stream.eatWhile(/[^`]*/);
        return "code";
    } else if (state.headerLine) { 
        stream.eatWhile(/[^\n]*/);
        return "h-text";
    }
    // if is a number
    if (/[\d\.]/.test(ch)) {
        if (ch === ".") {
            stream.match(/^[0-9]+([eE][\-+]?[0-9]+)?/);
        } else if (ch === "0") {
            stream.match(/^[xX][0-9a-fA-F]+/) || stream.match(/^0[0-7]+/);
        } else {
            stream.match(/^[0-9]*\.?[0-9]*([eE][\-+]?[0-9]+)?/);
        }
        return "number";
    }
    if (/[\[\]{}\(\)]/.test(ch)) {
        return "comment";
    }

    if (ch === "h") {
        var isHttp = stream.match(/(ttps|ttp)[^\s)]*/);
        if (isHttp && isHttp.input.startsWith("ttp")) return "link";
    }
      
    if (ch === "/") {
        if (stream.eat("*")) {
            state.tokenize = tokenComment;
            return tokenComment(stream, state);
        }
        if (stream.eat("/")) {
            stream.skipToEnd();
            return "comment";
        }
    }
    if (isOperatorChar.test(ch)) {
        stream.eatWhile(isOperatorChar);
        return "operator";
    }

    // TODO: Separate hashes and the words
    if (ch === "#" && state.startOfLine) {
        var no = stream.match(/[#]*/);
        if (no.input.startsWith("#")) return "header-2";
        else return "header";
    }

    if (ch === "*" && state.startOfLine) {
        stream.match(/\**/);
        return "tag";
    }
      
    // Essentially eats anything that isn't a punctuation except for ?
    stream.eatWhile(/[\w\$_\xa1-\uffff]/);
    var cur = stream.current();
    if (keywords.propertyIsEnumerable(cur)) return "keyword";
    if (atoms.propertyIsEnumerable(cur)) return "atom";
    if (months.propertyIsEnumerable(cur)) return "month";
    if (daysOfTheWeek.propertyIsEnumerable(cur)) return "day"
        return "variable";
    }


  // This checks if it is a comment
    function tokenComment(stream, state) {
        var maybeEnd = false,
            ch;
        while (ch = stream.next()) {
            if (ch === "/" && maybeEnd) {
                state.tokenize = tokenBase;
                break;
            }
            maybeEnd = (ch === "*");
        }
        return "comment";
    }

    function Context(indented, column, type, align, prev, codeState, headerLine) {
        this.indented = indented;
        this.column = column;
        this.type = type;
        this.align = align;
        this.prev = prev;
        this.codeState = codeState;
        this.headerLine = headerLine
    }

    // Interface

    return {
        startState: function (basecolumn) {
            return {
                tokenize: null,
                context: new Context((basecolumn || 0) - indentUnit, 0, "top", false, false, false),
                indented: 0,
                startOfLine: true
            };
        },

        token: function (stream, state) {
            var ctx = state.context;
            if (stream.sol()) {
                if (ctx.align === null) ctx.align = false;
                state.indented = stream.indentation();
                state.startOfLine = true;
            }
            if (stream.eatSpace()) return null;
            var style = (state.tokenize || tokenBase)(stream, state);
            if (style === "comment") return style;
            if (style === "codeState") state.codeState = !state.codeState;
            if (style.startsWith("header") || style == "h-text") state.headerLine = !state.headerLine;
            if (ctx.align == null) ctx.align = true;

            state.startOfLine = false;
            return style;
        },

        indent: function (state, textAfter) {
            if (state.tokenize !== tokenBase && state.tokenize !== null) return CodeMirror.Pass;
            var ctx = state.context,
                firstChar = textAfter && textAfter.charAt(0);
            var closing = firstChar === ctx.type;
            if (ctx.align) return ctx.column + (closing ? 0 : 1);
            else return ctx.indented + (closing ? 0 : indentUnit);
        },

        electricChars: "{}):",
        closeBrackets: "()[]{}''\"\"``",
        fold: "brace",
        blockCommentStart: "/*",
        blockCommentEnd: "*/",
        lineComment: "//"
    }
});
