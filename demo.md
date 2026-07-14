# mdview Feature Demo

This document exercises every markdown feature `mdview` can display.
View it interactively (`mdview demo.md`) or piped (`mdview demo.md | less`).

---

## Headings

# Heading 1 — bold, underlined, colored
## Heading 2 — bold, colored
### Heading 3 — bold with # prefix
#### Heading 4
##### Heading 5
###### Heading 6

## Inline Styles

Text can be **bold**, *italic*, ~~struck through~~, or `inline code`.
They compose too: **bold with *italic inside***, *italic with `code`*,
and ~~struck **bold**~~.

## Links

- A [named link](https://example.com) shows its URL after the text.
- An autolink shows just itself: <https://bun.sh>
- Images render as a placeholder: ![the mdview logo](https://example.com/logo.png)

## Lists

Unordered, with nesting:

- terminal pagers
  - less
  - glow
    - written in Go
- markdown parsers

Ordered, including a custom start:

7. seventh
8. eighth
9. ninth

Task lists:

- [x] render markdown
- [x] search with `/`
- [ ] syntax highlighting (future)

A loose list (items separated by blank lines) keeps its spacing:

- First loose item, with enough text that it wraps onto a continuation
  line to show the hanging indent.

- Second loose item.

## Blockquote

> A quote long enough to wrap across multiple lines, so you can see that
> every wrapped line carries the quote bar on the left margin.
>
> A second paragraph inside the same quote.
>
> > Quotes nest, too.

## Code Block

```ts
function greet(name: string): string {
  return `hello ${name}`; // fenced code is shown verbatim, never re-wrapped
}
const overlong = "lines wider than the terminal are truncated with an ellipsis rather than wrapped, keeping code readable";
```

## Tables

| Tool   | Language   | First release | Stars |
|:-------|:----------:|:-------------:|------:|
| less   | C          | 1983          | n/a   |
| glow   | Go         | 2019          | 16000 |
| bat    | Rust       | 2018          | 50000 |
| mdview | TypeScript | 2026          |     1 |

Alignment comes from the header row: left, centered, and right columns.
Over-wide tables shrink their widest column and truncate cells with `…`.

## Line Breaks

A hard break (two trailing spaces) forces a new line:
roses are red  
violets are blue

A soft break in the source
is joined into one flowing paragraph.

## Unicode Widths

CJK text is measured correctly: 日本語のテキストは正しく折り返されます。
Emoji too: 🎉 👨‍👩‍👧 🚀 — and accents: héllo wörld.

## Long Unbreakable Content

https://example.com/an/extremely/long/url/that/cannot/possibly/fit/on/a/single/terminal/line/gets/hard-broken/at/grapheme/boundaries/instead/of/overflowing

## Horizontal Rule

The line below spans the full terminal width:

---

*The end.* Press `q` to quit, `/` to search this document.
