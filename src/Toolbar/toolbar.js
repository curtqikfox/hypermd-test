import CodeMirror from 'codemirror';
import { createStyleToggler, keyMap } from 'qik-hypermd-fork/keymap/hypermd';
import './toolbar.css';

function countLeadingCharacters(str, char) {
  var charCount = 0;
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

    for (var j = 0; j < selectionLists.length; j++) {
      var selection = selectionLists[j];
      var line = cm.getLine(selection.head.line);
      var date = new Date();
      var dateString = date.toDateString();
      // Append text to the line
      cm.replaceRange(dateString, { line: selection.head.line, ch: line.length }, { line: selection.head.line, ch: line.length });
    }
  });

  // Create Checkbox button
  var checkboxButton = createSimpleToolbarButton(require('../images/check-circle.svg'), function () {
    var selectionLists = cm.listSelections();

    for (var j = 0; j < selectionLists.length; j++) {
      var selection = selectionLists[j];
      var line = cm.getLine(selection.head.line);
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

  document.getElementById("fileInput").addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      // textNode.current.value = e.target.result;
      var img = new Image();
      img.onload = function () {
        console.log(this.width, this.height);
      };
      var cursor = cm.getCursor();
      var codeSnippet = `![Hello World](${e.target.result})\n`;
      cm.replaceRange(codeSnippet, cursor);
    };
    reader.readAsDataURL(file);
  })
}

// Creates a header button with a dropdown menu for selecting different
// header levels to apply to the selected text
function createHeaderButton(cm) {
  var headerButton = document.createElement('div');
  headerButton.classList.add("toolbar-button");
  headerButton.classList.add("dropdown");

  var headerButtonLabel = document.createElement('span');
  headerButtonLabel.innerHTML = "Normal text";

  var caratIcon = document.createElement('img');
  caratIcon.classList.add("carat-icon");
  caratIcon.src = require('../images/expand-carat.svg');

  var headerButtonDropdown = document.createElement('div');
  headerButtonDropdown.classList.add("dropdown-content");

  // Create default dropdown option (Normal text)
  var option = document.createElement('a');
  option.classList.add("dropdown-label", "dropdown-label-no-icon");
  option.innerHTML = "Normal text";
  option.onclick = function () {
    var selectionLists = cm.listSelections();

    for (var j = 0; j < selectionLists.length; j++) {
      var selection = selectionLists[j];
      var line = cm.getLine(selection.head.line);

      line = line.replace(/^#+\s/, ''); // Remove header characters at the beginning of the line
      // Update the line in the CodeMirror editor
      cm.replaceRange(line, { line: selection.head.line, ch: 0 }, { line: selection.head.line, ch: line.length });
      // Change dropdown name
      headerButtonLabel.innerHTML = "Normal text";
    }
    // Clear the selection to avoid appending additional copied text
    cm.setCursor(cm.getCursor().line, cm.getCursor().ch);
  };
  headerButtonDropdown.appendChild(option);

  // Create the remaining Header dropdown options (Header 1-4)
  for (var i = 1; i <= 4; i++) {
    var option = document.createElement('a');
    option.classList.add("dropdown-label", "dropdown-label-no-icon");
    option.innerHTML = "Header " + i;
    option.onclick = function (headerLevel) {
      return function () {
        var selectionLists = cm.listSelections();

        for (var j = 0; j < selectionLists.length; j++) {
          var selection = selectionLists[j];
          var line = cm.getLine(selection.head.line);
          var leadingChars = countLeadingCharacters(line, '#');
          // Append text to the line
          if (leadingChars === headerLevel) {
            line = line.substring(headerLevel + 1); // Remove header characters
            // Update the line in the CodeMirror editor
            cm.replaceRange(
              line,
              { line: selection.head.line, ch: 0 },
              { line: selection.head.line, ch: line.length - 2 });
          } else {
            line = "#".repeat(headerLevel) + " " + line.substring(leadingChars); // Replace header characters
            // Update the line in the CodeMirror editor
            cm.replaceRange(
              line,
              { line: selection.head.line, ch: 0 },
              { line: selection.head.line, ch: line.length });
          }
          // Change dropdown name
          headerButtonLabel.innerHTML = "Header " + headerLevel;
        }
      };
    }(i);

    headerButtonDropdown.appendChild(option);
  }

  headerButton.appendChild(headerButtonLabel);
  headerButton.appendChild(headerButtonDropdown);
  headerButton.appendChild(caratIcon);
  return headerButton;
}

const kLink = "Link";
const kNoteLink = "Note Link";
const kTable = "Table";
const kDivider = "Divider";
const kImage = "Image";
const kMath = "Math";
const kCheckbox = "Checkbox";
const kCodeBlock = "Code Block";
const dropdownOptions = [kLink, kNoteLink, kTable, kDivider, kImage, kMath, kCheckbox, kCodeBlock];

function getIconForInsertOption(option) {
  if (option === kLink)
    return require('../images/link.svg');
  else if (option === kNoteLink)
    return require('../images/link.svg');
  else if (option === kTable)
    return require('../images/table.svg');
  else if (option === kDivider)
    return require('../images/divider.svg');
  else if (option === kImage)
    return require('../images/images.svg');
  else if (option === kMath)
    return require('../images/math.svg');
  else if (option === kCheckbox)
    return require('../images/check-circle.svg');
  else if (option === kCodeBlock)
    return require('../images/code.svg');
}

// Creates an insert button with a dropdown menu for selecting different 
// types of content to insert into the editor  
function createInsertButton(cm) {
  // Create a wrapper div for the insert label, icon, and dropdown menu
  var insertButtonWrapper = document.createElement('div');
  insertButtonWrapper.classList.add("insert-button-wrapper");
  insertButtonWrapper.classList.add("toolbar-button");
  insertButtonWrapper.classList.add("dropdown");

  var insertButtonDropdown = document.createElement('div');
  insertButtonDropdown.classList.add("dropdown-content");

  var insertButton = document.createElement('img');
  insertButton.classList.add("insert-button");
  insertButton.src = require('../images/insert.svg');
  insertButton.onclick = function () { }

  var insertButtonLabel = document.createElement('p');
  insertButtonLabel.innerHTML = "Insert";

  var caratIcon = document.createElement('img');
  caratIcon.classList.add("carat-icon");
  caratIcon.src = require('../images/expand-carat.svg');

  // Loop through the dropdown options and create a new dropdown option for each one
  for (var i = 0; i < dropdownOptions.length; i++) {
    var optionWrapper = document.createElement('div');
    optionWrapper.classList.add("dropdown-option");

    // Create an icon for each dropdown option
    var icon = document.createElement('img');
    icon.classList.add("dropdown-icon");
    icon.src = getIconForInsertOption(dropdownOptions[i]);
    optionWrapper.appendChild(icon);

    var optionLabel = document.createElement('a');
    optionLabel.classList.add("dropdown-label");
    optionLabel.innerHTML = dropdownOptions[i];
    optionWrapper.onclick = function (headerLevel) {
      console.log(optionLabel + " Clicked")
      return function (e) {
        switch (headerLevel) {
          case kCodeBlock:
            var cursor = cm.getCursor(); // gets the line number in the cursor position
            var codeSnippet = "``";
            cm.replaceRange(codeSnippet, cursor);
            var newCursor = { line: cursor.line, ch: cursor.ch }; // move the cursor one character forward
            cm.setCursor(newCursor); // set the new cursor position
            break;
          case kTable:
            var cursor = cm.getCursor();
            var lineContent = cm.getLine(cursor.line);
            var codeSnippet = "| a | b | c |\n|---|---|---|\n| 1 | 2 | 3 |";
            if (lineContent.trim() === "") {
              cm.replaceRange(codeSnippet, cursor);
            } else {
              cursor.line += 1;
              if (cursor.line < cm.lineCount()) {
                cm.replaceRange("\n" + codeSnippet, { line: cursor.line - 1, ch: cm.getLine(cursor.line - 1).length });
              } else {
                cursor.line -= 1;
                cm.replaceRange("\n" + codeSnippet, cursor);
              }
            }
            break;
          case kDivider:
            var codeSnippet = "--- ";
            cm.replaceRange(codeSnippet, cursor);
            break;
          case kImage:
            var fileButton = document.getElementById("fileInput");
            fileButton.click();
            break;
          case kLink:
            var codeSnippet = "[link_text](url)";
            cm.replaceRange(codeSnippet, cursor);
            break;
          case kMath:
            var codeSnippet = "$$";
            cm.replaceRange(codeSnippet, cursor);
            break;
          case kCheckbox:
            var codeSnippet = "- [ ] ";
            cm.replaceRange(codeSnippet, cursor);
            break;
        }
        document.getElementsByClassName("CodeMirror")[0].focus()
      };
    }(dropdownOptions[i]);

    optionWrapper.appendChild(optionLabel);
    insertButtonDropdown.appendChild(optionWrapper);
  }
  insertButtonWrapper.appendChild(insertButton);
  insertButtonWrapper.appendChild(insertButtonLabel);
  insertButtonWrapper.appendChild(caratIcon);
  insertButtonWrapper.appendChild(insertButtonDropdown);
  return insertButtonWrapper;
}

// Register addon
CodeMirror.defineInitHook(initToolbar);