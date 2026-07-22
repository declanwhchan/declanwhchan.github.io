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
    /* Use the website font and regular-weight titles. */
    .cv h3.card-title,
    .cv h6.title {
      font-family: inherit !important;
      font-weight: 400 !important;
    }

    /* Remove borders and lines surrounding date badges. */
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

    /* Remove timeline dots, pins, and other date-column decorations. */
    .cv .date-column::before,
    .cv .date-column::after,
    .cv .date-column .location,
    .cv .date-column .iconlocation {
      display: none !important;
      content: none !important;
    }

    /* Remove the template's default entry borders. */
    .cv ul.list-group-flush > li.list-group-item {
      border: 0 !important;
      padding-top: 1rem !important;
      padding-bottom: 1rem !important;
    }

    /* Add one divider between entries. */
    .cv ul.list-group-flush > li.list-group-item + li.list-group-item {
      border-top: 1px solid var(--global-divider-color) !important;
    }

    /* Add a divider between major CV sections. */
    .cv > a.anchor + .card {
      border-top: 1px solid var(--global-divider-color) !important;
      border-radius: 0 !important;
    }

    /* Hide TOC scrollbars without disabling scrolling. */
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
  </style>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const cv = document.querySelector(".cv");
      if (!cv) return;

      const findHeading = (title) =>
        Array.from(
          cv.querySelectorAll(":scope > .card > h3.card-title")
        ).find((heading) => heading.textContent.trim() === title);

      const renameSection = (oldTitle, newTitle) => {
        const heading = findHeading(oldTitle);
        if (heading) heading.textContent = newTitle;
      };

      renameSection("Contact Information", "Basics");
      renameSection("Skills", "Technical Skills");
      renameSection("Awards", "ECs");

      /* Add social links because this renderer ignores basics.profiles. */
      const basicsHeading = findHeading("Basics");
      const basicsCard = basicsHeading?.closest(".card");
      const basicsTable = basicsCard?.querySelector("table tbody");

      const addSocialRow = (label, text, url) => {
        if (!basicsTable || basicsCard.querySelector(`a[href="${url}"]`)) return;

        const row = document.createElement("tr");

        const labelCell = document.createElement("td");
        labelCell.className = "p-1 pr-2 font-weight-bold";

        const labelElement = document.createElement("b");
        labelElement.textContent = label;
        labelCell.append(labelElement);

        const valueCell = document.createElement("td");
        valueCell.className = "p-1 pl-2 font-weight-light";

        const link = document.createElement("a");
        link.href = url;
        link.textContent = text;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        valueCell.append(link);
        row.append(labelCell, valueCell);
        basicsTable.append(row);
      };

      addSocialRow(
        "LinkedIn",
        "declanwhchan",
        "https://www.linkedin.com/in/declanwhchan/"
      );

      addSocialRow(
        "GitHub",
        "declanwhchan",
        "https://github.com/declanwhchan"
      );

      /* Enforce the requested section order. */
      const desiredOrder = [
        "Basics",
        "Education",
        "Technical Skills",
        "Experience",
        "Projects",
        "ECs"
      ];

      const cards = Array.from(cv.querySelectorAll(":scope > .card"));

      for (const title of desiredOrder) {
        const card = cards.find(
          (element) =>
            element
              .querySelector(":scope > h3.card-title")
              ?.textContent.trim() === title
        );

        if (!card) continue;

        const anchor = card.previousElementSibling;

        if (anchor?.classList.contains("anchor")) {
          cv.append(anchor);
        }

        cv.append(card);
      }

      window.setTimeout(() => {
        window.tocbot?.refresh?.();
      }, 0);
    });
  </script>
toc:
  sidebar: left
---
