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

function createSimpleToolbarButton(icon, onClick) {
  var button = document.createElement('img');
  button.classList.add("toolbar-button")
  button.src = icon;
  button.onclick = onClick;
  return button;
}

function initToolbar(cm) {
  // Create toolbar element
  var toolbar = document.createElement('div');
  toolbar.className = 'editor-toolbar';

  // Insert Button
  var insertButton = createInsertButton(cm);

  // Calendar Button
  var calendarButton = createSimpleToolbarButton(require('../images/calendar.svg'), function () {
    var selectionLists = cm.listSelections();

    console.log(selectionLists);
    for (var j = 0; j < selectionLists.length; j++) {
      var selection = selectionLists[j];
      console.log(selection);

      var line = cm.getLine(selection.head.line);
      console.log(line);

      var date = new Date();
      var dateString = date.toDateString();
      console.log(dateString);
      // Append text to the line
      cm.replaceRange(dateString, { line: selection.head.line, ch: line.length }, { line: selection.head.line, ch: line.length });
    }
  });

  // Create Checkbox button
  var checkboxButton = createSimpleToolbarButton(require('../images/check-circle.svg'), function () {
    var selectionLists = cm.listSelections();

    console.log(selectionLists);
    for (var j = 0; j < selectionLists.length; j++) {
      var selection = selectionLists[j];
      console.log(selection);

      var line = cm.getLine(selection.head.line);
      console.log(line);

      var checkbox = "- [ ] ";
      // Append text to the line
      cm.replaceRange(checkbox, { line: selection.head.line, ch: line.length }, { line: selection.head.line, ch: line.length });
    }
  });

  // Create Redo button
  var redoButton = createSimpleToolbarButton(require('../images/redo.svg'), function () { })

  // Create Undo button
  var undoButton = createSimpleToolbarButton(require('../images/undo.svg'), function () { })

  // Create Bold button
  var boldButton = createSimpleToolbarButton(require('../images/bold.svg'), function () {
    var cmdBFunction = keyMap[`Cmd-B`];
    cmdBFunction(cm);
  })

  // Create Italic button
  var italicButton = createSimpleToolbarButton(require('../images/italic.svg'), function () {
    var cmdIFunction = keyMap[`Cmd-I`];
    cmdIFunction(cm);
  })

  // Create Header button
  var headerButton = createHeaderButton(cm);

  // Append buttons to toolbar
  toolbar.appendChild(insertButton);
  toolbar.appendChild(calendarButton);
  toolbar.appendChild(checkboxButton);
  toolbar.appendChild(createSeparator());
  toolbar.appendChild(undoButton);
  toolbar.appendChild(redoButton);
  toolbar.appendChild(createSeparator());
  toolbar.appendChild(headerButton);
  toolbar.appendChild(createSeparator());
  toolbar.appendChild(boldButton);
  toolbar.appendChild(italicButton);

  // Append toolbar to CodeMirror's wrapper
  document.getElementById('toolbar-wrapper').appendChild(toolbar);
}

// Creates a header button with a dropdown menu for selecting different
// header levels to apply to the selected text
function createHeaderButton(cm) {
  var headerButton = document.createElement('div');
  headerButton.classList.add("toolbar-button");
  headerButton.classList.add("dropdown");

  var headerButtonLabel = document.createElement('span');
  headerButtonLabel.innerHTML = "Normal text";

  var headerButtonDropdown = document.createElement('div');
  headerButtonDropdown.classList.add("dropdown-content");

  // Create default dropdown option (Normal text)
  var option = document.createElement('a');
  option.innerHTML = "Normal text";
  option.onclick = function () {
    var selectionLists = cm.listSelections();

    console.log(selectionLists);
    for (var j = 0; j < selectionLists.length; j++) {
      var selection = selectionLists[j];
      console.log(selection);

      var line = cm.getLine(selection.head.line);
      console.log(line);

      line = line.replace(/^#+\s/, ''); // Remove header characters at the beginning of the line
      // Update the line in the CodeMirror editor
      cm.replaceRange(line, { line: selection.head.line, ch: 0 }, { line: selection.head.line, ch: line.length });
      // Change dropdown name
      headerButtonLabel.innerHTML = "Normal text";
    }
  };
  headerButtonDropdown.appendChild(option);

  // Create the remaining Header dropdown options (Header 1-4)
  for (var i = 1; i <= 4; i++) {
    var option = document.createElement('a');
    option.innerHTML = "Header " + i;
    option.onclick = function (headerLevel) {
      return function () {
        var selectionLists = cm.listSelections();

        console.log(selectionLists);
        for (var j = 0; j < selectionLists.length; j++) {
          var selection = selectionLists[j];
          console.log(selection);

          var line = cm.getLine(selection.head.line);
          console.log(line);

          var leadingChars = countLeadingCharacters(line, '#');
          console.log("Leading chars: " + leadingChars);
          // Append text to the line
          if (leadingChars === headerLevel) {
            line = line.substring(headerLevel + 1); // Remove header characters
            // Update the line in the CodeMirror editor
            cm.replaceRange(line, { line: selection.head.line, ch: 0 }, { line: selection.head.line, ch: line.length });
          } else {
            line = "#".repeat(headerLevel) + " " + line.substring(leadingChars); // Replace header characters
            // Update the line in the CodeMirror editor
            cm.replaceRange(line, { line: selection.head.line, ch: 0 }, { line: selection.head.line, ch: line.length });
          }

          console.log("Line: " + line);
          console.log(line);

          // Change dropdown name
          headerButtonLabel.innerHTML = "Header " + headerLevel;
        }
      };
    }(i);

    headerButtonDropdown.appendChild(option);
  }

  headerButton.appendChild(headerButtonLabel);
  headerButton.appendChild(headerButtonDropdown);
  return headerButton;
}

// Creates an insert button with a dropdown menu for selecting different 
// types of content to insert into the editor  
function createInsertButton(cm) {
  document.createElement('div');
  insertButtonWrapper.classList.add("insert-button-wrapper");
  insertButtonWrapper.classList.add("toolbar-button");
  insertButtonWrapper.classList.add("dropdown");

  var insertButtonDropdown = document.createElement('div');
  insertButtonDropdown.classList.add("dropdown-content");

  var insertButton = document.createElement('img');
  insertButton.classList.add("insert-button");
  insertButton.src = require('../images/insert.svg');
  insertButton.onclick = function () {}

  const kCodeSnippet = "Code snippet";
  const kTable = "Table";
  const kImage = "Image";
  const kLink = "Link";

  const InsertOptions = {
    CODE_SNIPPET: 0,
    TABLE: 1,
    IMAGE: 2,
    LINK: 3
  };

  var insertButtonLabel = document.createElement('p');
  const dropdownOptions = [kCodeSnippet, kTable, kImage, kLink];
  insertButtonLabel.innerHTML = "Insert";

  for (var i = 0; i < dropdownOptions.length; i++) {
    var option = document.createElement('a');
    option.innerHTML = dropdownOptions[i];
    option.onclick = function (headerLevel) {
      return function () {
        switch (headerLevel) {
          case InsertOptions.CODE_SNIPPET:
            console.log("Code snippet");
            var cursor = cm.getCursor(); // gets the line number in the cursor position
            var codeSnippet = "`  `";
            cm.replaceRange(codeSnippet, cursor);
            break;
          case InsertOptions.TABLE:
            console.log("Table");
            break;
          case InsertOptions.IMAGE:
            console.log("Image");
            break;
          case InsertOptions.LINK:
            console.log("Link");
            var cursor = cm.getCursor(); // gets the line number in the cursor position
            var codeSnippet = "[Link text](url)";
            cm.replaceRange(codeSnippet, cursor);
            break;
        }
      };
    }(i);
    insertButtonDropdown.appendChild(option);
  }
  insertButtonWrapper.appendChild(insertButton);
  insertButtonWrapper.appendChild(insertButtonLabel);
  insertButtonWrapper.appendChild(insertButtonDropdown);
  return insertButtonWrapper;
}

// Register addon
CodeMirror.defineInitHook(initToolbar);