---
layout: cv
permalink: /cv/
title: cv

_styles: |
  #toc-sidebar {
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  #toc-sidebar::-webkit-scrollbar {
    display: none;
  }

  .cv,
  #toc-sidebar ul {
    display: flex;
    flex-direction: column;
  }

  .cv > .card:first-of-type,
  #toc-sidebar li:has(a[href="#contact-information"]) {
    display: none;
  }

  .cv > #basics,
  #toc-sidebar li:has(a[href="#basics"]) {
    order: 10;
  }

  .cv > #basics + .card {
    order: 11;
  }

  .cv > #education,
  #toc-sidebar li:has(a[href="#education"]) {
    order: 20;
  }

  .cv > #education + .card {
    order: 21;
  }

  .cv > #technical-skills,
  #toc-sidebar li:has(a[href="#technical-skills"]) {
    order: 30;
  }

  .cv > #technical-skills + .card {
    order: 31;
  }

  .cv > #experience,
  #toc-sidebar li:has(a[href="#experience"]) {
    order: 40;
  }

  .cv > #experience + .card {
    order: 41;
  }

  .cv > #projects,
  #toc-sidebar li:has(a[href="#projects"]) {
    order: 50;
  }

  .cv > #projects + .card {
    order: 51;
  }

  .cv > #ecs,
  #toc-sidebar li:has(a[href="#ecs"]) {
    order: 60;
  }

  .cv > #ecs + .card {
    order: 61;
  }

  /* Remove Bootstrap's borders above and below individual CV entries. */
  .cv .card > div > ul.list-group > li.list-group-item {
    padding: 1rem 0 !important;
    border: 0 !important;
    background: transparent !important;
  }

  /* Use one clean divider between consecutive entries. */
  .cv .card > div > ul.list-group + ul.list-group {
    border-top: 1px solid var(--global-divider-color);
  }

  /* Make date labels cleaner and more compact. */
  .cv .badge {
    min-width: auto !important;
    padding: 0.4rem 0.65rem !important;
    color: var(--global-theme-color) !important;
    background: transparent !important;
    border: 1px solid var(--global-theme-color) !important;
    border-radius: 0.4rem !important;
    box-shadow: none !important;
    text-transform: none !important;
  }

  /* Add dividers to Basics and Technical Skills rows. */
  #basics + .card .card-text + .card-text,
  #technical-skills + .card .card-text + .card-text {
    padding-top: 0.75rem;
    margin-top: 0.75rem;
    border-top: 1px solid var(--global-divider-color);
  }

  /* Improve spacing between entry headings and bullet points. */
  .cv .list-group-item h6 {
    margin-bottom: 0.25rem;
  }

  .cv .list-group-item ul {
    margin-top: 0.65rem;
    margin-bottom: 0;
  }

  .cv .list-group-item li {
    margin-bottom: 0.25rem;
  }

  .cv .list-group-item li:last-child {
    margin-bottom: 0;
  }

nav: true
nav_order: 2
cv_pdf: /assets/pdf/cv.pdf # you can also use external links here
cv_format: rendercv # options: rendercv, jsonresume
description: "Last updated: 2026-07-21"
toc:
  sidebar: left
---
