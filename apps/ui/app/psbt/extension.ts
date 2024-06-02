// extensions.ts
import "prism-code-editor/search.css";
import "prism-code-editor/copy-button.css";
import "prism-code-editor/languages/html";
import "prism-code-editor/languages/clike";
import "prism-code-editor/languages/css";

import { PrismEditor } from "prism-code-editor";
import {
  searchWidget,
  highlightSelectionMatches,
} from "prism-code-editor/search";
import { defaultCommands } from "prism-code-editor/commands";
import { cursorPosition } from "prism-code-editor/cursor";
import { highlightBracketPairs } from "prism-code-editor/highlight-brackets";

export const addExtensions = (editor: PrismEditor) => {
  editor.addExtensions(
    highlightSelectionMatches(),
    searchWidget(),
    defaultCommands(),
    highlightBracketPairs(),
    cursorPosition()
  );
};
