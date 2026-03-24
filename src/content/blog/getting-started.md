---
title: "Getting Started With This Blog"
date: "2026-03-24"
excerpt: "How posts and attachments work in this portfolio blog."
tags: ["meta", "vite", "react"]
attachments:
  - label: "Example attachment (txt)"
    url: "/blog/getting-started/anexo-exemplo.txt"
    kind: "text"
---

This blog is file-based.

## Create a new post

1. Add a new markdown file in `src/content/blog/` (the filename becomes the `slug`).
2. Add frontmatter at the top (title, date, tags, attachments).

## Attachments

Put files in `public/blog/<slug>/` and reference them in `attachments`.

Example link inside markdown: [download the attachment](/blog/getting-started/anexo-exemplo.txt)
