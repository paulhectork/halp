# bulma

---

## SASS

a list of available variables is available [in the official docs](https://bulma.io/documentation/customize/list-of-sass-variables/)

---

## CSS

a summary of bulma v1 CSS variables

### backgrounds and text

- `--bulma-scheme-main`: page background
- `--bulma-scheme-main-bis`, `--bulma-scheme-main-ter`: secondary and tertiary surface backgrounds (cards, panels)
- `--bulma-text`: body text color
- `--bulma-text-strong`: `<strong>`, table headers, and anything that defaults to strong text
- `--bulma-text-weak`: muted or secondary text
- `--bulma-title-color`: heading color (`.title`, `.subtitle`)
- `--bulma-title-weight`: heading font weight

### links

- `--bulma-link`: base link color
- `--bulma-link-text`: link text color
- `--bulma-link-text-hover`: link color on hover
- `--bulma-link-text-active`: link color when pressed

### semantic colors

- `--bulma-primary`, `--bulma-link`, `--bulma-info`, `--bulma-success`, `--bulma-warning`, `--bulma-danger`: the base color for each role. Buttons and tags with `is-primary`, `is-link`, and similar classes read from these.
- each color also has derived variants, such as `-invert` (text color on that background), `-light`, `-dark`, `-soft`, and `-bold`.

### borders

- `--bulma-border`: default border color
- `--bulma-border-weak`: subtle dividers
- `--bulma-border-strong`: emphasized borders

### shape and sizing

- `--bulma-radius`: default border radius
- `--bulma-radius-small`, `--bulma-radius-medium`, `--bulma-radius-large`, `--bulma-radius-rounded`: radius scale
- `--bulma-control-height`: height of inputs, buttons, and selects
- `--bulma-shadow`: default box shadow for elements like `.box`

### typography

- `--bulma-family-primary`: main font stack
- `--bulma-family-secondary`: secondary font stack
- `--bulma-family-code`: monospace font stack for `<code>` and `<pre>`

### focus

- `--bulma-focus-shadow-size`, `--bulma-focus-shadow-alpha`: size and strength of the focus ring on form controls

