---
title: 'Kitchen Sink - All Markdown Examples'
author: 'Test Author'
date: '2024-01-01'
tags: ['test', 'documentation', 'markdown', 'examples', 'kitchen-sink']
description: 'A comprehensive example of all markdown features and formatting'
---

# Kitchen Sink - All Markdown Examples

This page demonstrates all the markdown features supported by the garden markdown viewer.

## Text Formatting

### Basic Formatting

- **Bold text** using double asterisks
- _Italic text_ using underscores
- `inline code` using backticks
- ~~Strikethrough text~~ using double tildes

### Headings

We've already seen h1, h2, and h3. Here are more:

#### This is H4

##### This is H5

###### This is H6

## Lists

### Unordered Lists

- Bullet point one
- Bullet point two
- Bullet point three
  - Nested bullet point
  - Another nested point
    - Deep nested point

### Ordered Lists

1. First item
2. Second item
3. Third item
   1. Nested numbered item
   2. Another nested numbered item
4. Fourth item

## Links and References

### Internal Links

- [Link to foo page](foo.md)
- [Link to bar page](bar.md)
- [Link to baz page in subdirectory](dir/baz.md)

### External Links

- [External link to example.com](https://example.com)
- [GitHub](https://github.com)

## Code Examples

### JavaScript

```javascript
function hello(name) {
  console.log(`Hello from ${name}!`)
  return `Greetings, ${name}!`
}

// Example usage
const message = hello('Kitchen Sink')
console.log(message)
```

### Python

```python
def greet(name):
    """Greet someone by name."""
    return f"Hello, {name}!"

def fibonacci(n):
    """Generate fibonacci sequence up to n."""
    a, b = 0, 1
    while a < n:
        yield a
        a, b = b, a + b

# Example usage
print(greet("World"))
for num in fibonacci(100):
    print(num, end=' ')
```

### Shell/Bash

```bash
#!/bin/bash
echo "This is the kitchen sink page"
ls -la
find . -name "*.md" -type f | head -10
```

### JSON

```json
{
  "name": "Kitchen Sink Example",
  "version": "1.0.0",
  "features": [
    "markdown parsing",
    "frontmatter",
    "code highlighting",
    "tables"
  ],
  "metadata": {
    "author": "Test Author",
    "created": "2024-01-01"
  }
}
```

## Blockquotes

> This is a simple blockquote to test styling.

> This is a longer blockquote that spans multiple lines and demonstrates
> how the markdown renderer handles extended quoted text sections.
>
> It can even contain multiple paragraphs within the same quote block.

> **Note:** Blockquotes can also contain other formatting like **bold text**,
> _italic text_, and `inline code`.

## Tables

### Feature Status Table

| Feature           | Status | Notes                 |
| ----------------- | ------ | --------------------- |
| Markdown parsing  |        | Core functionality    |
| Frontmatter       |        | YAML metadata support |
| Code highlighting |        | Multiple languages    |
| Tables            |        | With alignment        |
| Images            | S      | Not tested yet        |
| Math              | S      | May need plugin       |

### Alignment Examples

| Left Aligned | Center Aligned | Right Aligned |
| :----------- | :------------: | ------------: |
| Left         |     Center     |         Right |
| Text         |      Text      |          Text |
| More         |      More      |          More |

## Horizontal Rules

Here's a horizontal rule:

---

And another one:

---

## Special Characters and Escaping

Here are some special characters that need to be handled properly:

- Ampersands: AT&T, Ben & Jerry's
- Quotes: "Hello" and 'world'
- Apostrophes: don't, can't, won't
- Em dashes: This  is an em dash
- Ellipsis: Loading...

## Mixed Content Example

This section combines multiple elements:

1. **Step One**: Start with some `inline code`

   ```bash
   npm install react-markdown
   ```

2. **Step Two**: Configure your settings

   > **Important:** Make sure to backup your configuration first!

3. **Step Three**: Test everything works

   | Test Case | Expected | Actual |
   | --------- | -------- | ------ |
   | Basic     |          |        |
   | Complex   |          |        |

## Conclusion

This kitchen sink page demonstrates:

-  All basic markdown formatting
-  Code blocks with syntax highlighting
-  Tables with various alignments
-  Lists (ordered and unordered)
-  Blockquotes and special formatting
-  Frontmatter metadata parsing
-  Internal and external linking

The garden markdown viewer successfully handles all these markdown features!

---

_Last updated: 2024-01-01_
