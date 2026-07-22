---
layout: cv
permalink: /cv/
title: cv
nav: true
nav_order: 2
cv_pdf: /assets/pdf/cv.pdf
cv_format: jsonresume
description: |
  Last updated: 2026-07-21

  <style>
    /* Arrange the visible CV sections. */
    .cv {
      display: flex !important;
      flex-direction: column !important;
    }

    .cv > * {
      order: 99;
    }

    .cv > .card:first-of-type {
      order: 1;
    }

    .cv > #education,
    .cv > #education + .card {
      order: 2;
    }

    .cv > #skills,
    .cv > #skills + .card {
      order: 3;
    }

    .cv > #experience,
    .cv > #experience + .card {
      order: 4;
    }

    .cv > #projects,
    .cv > #projects + .card {
      order: 5;
    }

    /* Use regular weight and the site's normal font for titles. */
    .cv .card > h3.card-title,
    .cv h6.title {
      font-family: inherit !important;
      font-weight: 400 !important;
    }

    /* Rename Contact Information to Basics. */
    .cv > .card:first-of-type > h3.card-title {
      font-size: 0 !important;
    }

    .cv > .card:first-of-type > h3.card-title::after {
      content: "Basics";
      display: block;
      font-family: inherit;
      font-size: 1.75rem;
      font-weight: 400;
      line-height: 1.2;
    }

    /* Rename Skills to Technical Skills. */
    .cv > #skills + .card > h3.card-title {
      font-size: 0 !important;
    }

    .cv > #skills + .card > h3.card-title::after {
      content: "Technical Skills";
      display: block;
      font-family: inherit;
      font-size: 1.75rem;
      font-weight: 400;
      line-height: 1.2;
    }

    /* Rename the Professional Title row to Socials. */
    .cv > .card:first-of-type table tr:nth-child(2) td:first-child b {
      font-size: 0 !important;
    }

    .cv > .card:first-of-type
      table
      tr:nth-child(2)
      td:first-child
      b::after {
      content: "Socials";
      font-size: 1rem;
    }

    /* Remove all lines surrounding date badges. */
    .cv table.table-cv,
    .cv table.table-cv tbody,
    .cv table.table-cv tr,
    .cv table.table-cv td,
    .cv table.table-cv > :not(caption) > * > * {
      border: 0 !important;
      border-top: 0 !important;
      border-bottom: 0 !important;
      box-shadow: none !important;
    }

    /* Remove the dot and location-pin decorations beside dates. */
    .cv .date-column::before,
    .cv .date-column::after,
    .cv .date-column .location,
    .cv .date-column .iconlocation,
    .cv .date-column table::before,
    .cv .date-column table::after {
      display: none !important;
      content: none !important;
    }

    .cv li.list-group-item {
      list-style: none !important;
    }

    .cv li.list-group-item::marker,
    .cv li.list-group-item::before {
      content: "" !important;
      display: none !important;
    }

    /* Add a divider between individual entries. */
    .cv ul.list-group-flush > li.list-group-item {
      border: 0 !important;
      padding-top: 1rem !important;
      padding-bottom: 1rem !important;
    }

    .cv ul.list-group-flush > li.list-group-item + li.list-group-item {
      border-top: 1px solid var(--global-divider-color) !important;
    }

    /* Add a divider between major sections. */
    .cv > a.anchor + .card {
      border-top: 1px solid var(--global-divider-color) !important;
      border-radius: 0 !important;
    }

    /* Keep the TOC scrollable without showing scrollbars. */
    #toc-sidebar,
    .toc-sidebar,
    .toc,
    .js-toc {
      overflow-x: hidden !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }

    #toc-sidebar::-webkit-scrollbar,
    .toc-sidebar::-webkit-scrollbar,
    .toc::-webkit-scrollbar,
    .js-toc::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }

  /* Hide the original generated TOC labels. */
  .js-toc a[href="#contact-information"],
  .js-toc a[href="#skills"] {
    font-size: 0 !important;
  }

  /* Display the customized TOC labels. */
  .js-toc a[href="#contact-information"]::after {
    content: "Basics";
    display: inline-block;
    font-size: 0.875rem;
  }

  .js-toc a[href="#skills"]::after {
    content: "Technical Skills";
    display: inline-block;
    font-size: 0.875rem;
  }

    /* Arrange the TOC in the same order as the CV. */
    .js-toc > .toc-list {
      display: flex;
      flex-direction: column;
    }

    .js-toc .toc-list > li:has(a[href="#contact-information"]) {
      order: 1;
    }

    .js-toc .toc-list > li:has(a[href="#education"]) {
      order: 2;
    }

    .js-toc .toc-list > li:has(a[href="#skills"]) {
      order: 3;
    }

    .js-toc .toc-list > li:has(a[href="#experience"]) {
      order: 4;
    }

    .js-toc .toc-list > li:has(a[href="#projects"]) {
      order: 5;
    }
  </style>
toc:
  sidebar: left
---
