import CodeMirror from 'codemirror'
CodeMirror.defineMode("todo", function(config, parserConfig) {

  var keywords = {
      "month": true,
      "week": true,
      "weekly": true,
      "day": true,
      "daily": true,
      "monday": true,
      "tuesday": true,
      "wednesday": true,
      "thursday": true,
      "friday": true,
      "saturday": true,
      "sunday": true,
      "january": true,
      "february": true,
      "march": true,
      "april": true
  };

  var atoms = {
      "make": true,
      "new": true,
  };

  var indentUnit = 4;
  var isOperatorChar = /[+\-*&^%:=<>!|\/]/;

  var curPunc;

  function tokenBase(stream, state) {
      var ch = stream.next();
      // It looks like ch is checking the beginning of a word.
      console.log(ch);
      if (ch == '"' || ch == "'" || ch == "`") {
          state.tokenize = tokenString(ch);
          return state.tokenize(stream, state);
      }
      // if is a number
      if (/[\d\.]/.test(ch)) {
          if (ch == ".") {
              //TODO: Test what this match does? 
              stream.match(/^[0-9]+([eE][\-+]?[0-9]+)?/);
          } else if (ch == "0") {
              stream.match(/^[xX][0-9a-fA-F]+/) || stream.match(/^0[0-7]+/);
          } else {
              stream.match(/^[0-9]*\.?[0-9]*([eE][\-+]?[0-9]+)?/);
          }
          return "number";
      }
      if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
          curPunc = ch;
          return null;
      }
      if (ch == "/") {
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
      stream.eatWhile(/[\w\$_\xa1-\uffff]/);
      var cur = stream.current();
      if (keywords.propertyIsEnumerable(cur)) {
          if (cur == "case" || cur == "default") curPunc = "case";
          return "keyword";
      }
      if (atoms.propertyIsEnumerable(cur)) return "atom";
      return "variable";
  }

  function tokenString(quote) {
      return function (stream, state) {
          var escaped = false,
              next, end = false;
          while ((next = stream.next()) != null) {
              if (next == quote && !escaped) {
                  end = true;
                  break;
              }
              escaped = !escaped && quote != "`" && next == "\\";
          }
          if (end || !(escaped || quote == "`"))
              state.tokenize = tokenBase;
          return "string";
      };
  }

  function tokenComment(stream, state) {
      var maybeEnd = false,
          ch;
      while (ch = stream.next()) {
          if (ch == "/" && maybeEnd) {
              state.tokenize = tokenBase;
              break;
          }
          maybeEnd = (ch == "*");
      }
      return "comment";
  }

  function Context(indented, column, type, align, prev) {
      this.indented = indented;
      this.column = column;
      this.type = type;
      this.align = align;
      this.prev = prev;
  }

  function pushContext(state, col, type) {
      return state.context = new Context(state.indented, col, type, null, state.context);
  }

  function popContext(state) {
      if (!state.context.prev) return;
      var t = state.context.type;
      if (t == ")" || t == "]" || t == "}")
          state.indented = state.context.indented;
      return state.context = state.context.prev;
  }

  // Interface

  return {
      startState: function (basecolumn) {
          return {
              tokenize: null,
              context: new Context((basecolumn || 0) - indentUnit, 0, "top", false),
              indented: 0,
              startOfLine: true
          };
      },

      token: function (stream, state) {
          var ctx = state.context;
          if (stream.sol()) {
              if (ctx.align == null) ctx.align = false;
              state.indented = stream.indentation();
              state.startOfLine = true;
              if (ctx.type == "case") ctx.type = "}";
          }
          if (stream.eatSpace()) return null;
          curPunc = null;
          var style = (state.tokenize || tokenBase)(stream, state);
          if (style == "comment") return style;
          if (ctx.align == null) ctx.align = true;

          if (curPunc == "{") pushContext(state, stream.column(), "}");
          else if (curPunc == "[") pushContext(state, stream.column(), "]");
          else if (curPunc == "(") pushContext(state, stream.column(), ")");
          else if (curPunc == "case") ctx.type = "case";
          else if (curPunc == "}" && ctx.type == "}") popContext(state);
          else if (curPunc == ctx.type) popContext(state);
          state.startOfLine = false;
          return style;
      },

      indent: function (state, textAfter) {
          if (state.tokenize != tokenBase && state.tokenize != null) return CodeMirror.Pass;
          var ctx = state.context,
              firstChar = textAfter && textAfter.charAt(0);
          if (ctx.type == "case" && /^(?:case|default)\b/.test(textAfter)) {
              state.context.type = "}";
              return ctx.indented;
          }
          var closing = firstChar == ctx.type;
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
CodeMirror.defineMIME("text/x-todolang", "todolang");
