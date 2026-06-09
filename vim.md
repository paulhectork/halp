# VIM

The config file is `~/.vimrc`.

## Cool plugins

- [vim-markdown](https://github.com/preservim/vim-markdown)
- [vundle](https://github.com/preservim/vim-markdown), a package manager for vim

## Shortcuts

### Cursor movement

- `gg`: go to start of file
- `G`: go to end of file
- `M`: to middle of screen
- `L`: to bottom of screen
- `H`: to top of screen
- `$` to end of line
- `0`: to start of line

### Cut and paste 

- `yy`: yank / copy a line
- `2yy`: copy 2 lines
- `y$`: copy to the end of the line
- `p`: put / paste after cursor
- `P`: paste before cursor
- `]p`: paste and align the pasted block's indentation with the surrounding block

### Delete 

To delete not in disual mode:

- `d`: delete. `d` (+modifiers, somne below, other see cursor movements) copies deleted content to the buffer
- `dw`: delete word
- `dd`: delete line
- `d$`: delete to end of line
- `%d`: delete all lines in a file
- `:[begin],[end]d`: multi-line delete, where `begin` and `end` can be:
    - line numbers: `:3,5d` deletes lines 3 to 5.
    - `.`: the current line: `:.,3d`: delete from current line to line 3
    - `$`: last line in file. `:.,$d` delete all lines from current line to last line
    - `%`: all lines

### Indent

- `>>`: indent current line
- `n>>`: indent `n` lines, starting from the current line (i.e., `5>>` indents 5 lines)
- in visual mode, select the lines to indent, and then `>>`

### Search and replace

- `/pattern`: search for pattern
- `?pattern`: backward search
- `:%s/old/new/g`: replace old with new throughout file

### Tabs

- `:tabnew` /  `:tabnew [filename]`: open file in new tab
- `gt` / `:tabn`: move to next tab
- `gT` / `:tabp`: move to previous file
- `#gt` / move to tab number `#`
- `:tabm #`: move current tab to position `#`
- `:tabc`: close current tab
- `:tabo`: close all tabs except the current one
- `:tabdo [cmd]`: run command for all tabs
