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
- `d`: delete. `d` (+modifiers, somne below, other see cursor movements) copies deleted content to the buffer
- `dw`: delete word
- `dd`: delete line
- `d$`: delete to end of line
- `:3,5d`: delete lines starting from 3 to 5 

### Search and replace

- `/pattern`: search for pattern
- `?pattern`: backward search
- `%s/old/new/g`: replace old with new throughout file

### Tabs

- `:tabnew` /  `:tabnew {filename}`: open file in new tab
- `gt` / `:tabn`: move to next tab
- `gT` / `:tabp`: move to previous file
- `#gt` / move to tab number `#`
- `:tabm #`: move current tab to position `#`
- `:tabc`: close current tab
- `:tabo`: close all tabs except the current one
- `:tabdo [cmd]`: run command for all tabs
