import CodeMirror from 'codemirror';
import { createStyleToggler, keyMap } from 'qik-hypermd-fork/keymap/hypermd';

function countLeadingCharacters(str, char) {
  var charCount = 0;

  console.log(str);
  for (var i = 0; i < str.length; i++) {
    if (str[i] !== char) {
      return charCount;
    }
    charCount++;
  }
  return charCount;
}

function createSeparator() {
  var separator = document.createElement('div');
  separator.className = 'toolbar-separator';
  return separator;

}

function initToolbar(cm) {
  // Create toolbar element
  var toolbar = document.createElement('div');
  toolbar.className = 'editor-toolbar';

  // Create Redo button
  var redoButton = document.createElement('img');
  redoButton.classList.add("toolbar-button")
  redoButton.src = require('../images/redo.svg')
  redoButton.onclick = function () {
    // var redoFunction = keyMap[`Cmd-Y`];
    // redoFunction(cm);
  };

  // Create Undo button
  var undoButton = document.createElement('img');
  undoButton.classList.add("toolbar-button")
  undoButton.src = require('../images/undo.svg')
  undoButton.onclick = function () {
    // var undoFunction = keyMap[`Cmd-z`];
    // undoFunction(cm);
  };

  // Create Bold button
  var boldButton = document.createElement('img');
  boldButton.classList.add("toolbar-button")
  boldButton.src = require('../images/bold.svg')
  boldButton.onclick = function () {
    var cmdBFunction = keyMap[`Cmd-B`];
    cmdBFunction(cm);
  };

  // Create Italic button
  var italicButton = document.createElement('img');
  italicButton.classList.add("toolbar-button")
  italicButton.src = require('../images/italic.svg')
  italicButton.onclick = function () {
    var cmdIFunction = keyMap[`Cmd-I`];
    cmdIFunction(cm);
  };

  // Create Header button
  var headerButton = document.createElement('img');
  headerButton.classList.add("toolbar-button")
  headerButton.src = require('../images/h1.svg')
  headerButton.onclick = function () {
    var selectionLists = cm.listSelections();

    console.log(selectionLists);
    for (var i = 0; i < selectionLists.length; i++) {
      // var selection = cm.getSelection(selectionLists[i]);
      var selection = selectionLists[i];
      console.log(selection);

      var line = cm.getLine(selection.head.line);
      console.log(line);

      var leadingChars = countLeadingCharacters(line, '#');
      console.log("Leading chars: " + leadingChars);
      // Append text to the line
      if (!leadingChars) {
        line = "# " + line;
        // Update the line in the CodeMirror editor
        cm.replaceRange(line, { line: selection.head.line, ch: 0 }, { line: selection.head.line, ch: line.length });
      }
      else if (leadingChars < 4) {
        line = "#" + line;
        // Update the line in the CodeMirror editor
        cm.replaceRange(line, { line: selection.head.line, ch: 0 }, { line: selection.head.line, ch: line.length });
      }
      else {
        var length = line.length;
        line = line.substring(5); // Remove first 6 characters
        console.log(selection);
        cm.replaceRange(line, { line: selection.head.line, ch: 0 }, { line: selection.head.line, ch: length });
      }

      console.log("Line: " + line);
      console.log(line);
    }
  };

  // Insert Button
  var insertButtonWrapper = document.createElement('div');
  insertButtonWrapper.classList.add("insert-button-wrapper");

  var insertButton = document.createElement('img');
  insertButton.classList.add("insert-button");
  insertButton.src = require('../images/insert.svg');

  var insertButtonLabel = document.createElement('p');
  insertButtonLabel.innerHTML = "Insert";

  insertButtonWrapper.appendChild(insertButton);
  insertButtonWrapper.appendChild(insertButtonLabel);

  toolbar.appendChild(insertButtonWrapper);
  toolbar.appendChild(createSeparator());
  toolbar.appendChild(undoButton);
  toolbar.appendChild(redoButton);
  toolbar.appendChild(createSeparator());
  toolbar.appendChild(headerButton);
  toolbar.appendChild(createSeparator());
  toolbar.appendChild(boldButton);
  toolbar.appendChild(italicButton);

  // Append toolbar to CodeMirror's wrapper
  // cm.getWrapperElement().appendChild(toolbar);
  document.getElementById('toolbar-wrapper').appendChild(toolbar);
}

// Register addon
CodeMirror.defineInitHook(initToolbar);