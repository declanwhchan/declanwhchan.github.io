---
layout: page
permalink: /cv/
title: cv
nav: true
nav_order: 2
description: "Last updated: 2026-07-21"
toc:
  sidebar: left
_styles: |
  .custom-cv {
    font-family: inherit;
  }

  .custom-cv-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: -3.5rem;
    margin-bottom: 1.5rem;
  }

  .custom-cv-actions a {
    color: var(--global-theme-color);
    font-size: 2rem;
  }

  .custom-cv-section {
    margin-bottom: 2rem;
  }

  .custom-cv-section-title {
    margin: 0 0 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--global-divider-color);
    font-family: inherit;
    font-size: 1.75rem;
    font-weight: 400;
    line-height: 1.2;
  }

  .custom-cv-entry {
    display: grid;
    grid-template-columns: 8rem minmax(0, 1fr);
    column-gap: 1.75rem;
    padding: 1rem 0;
  }

  .custom-cv-entry + .custom-cv-entry {
    border-top: 1px solid var(--global-divider-color);
  }

  .custom-cv-date {
    text-align: left;
  }

  .custom-cv-date-badge {
    display: inline-block;
    min-width: 7rem;
    padding: 0.2rem 0.45rem;
    border-radius: 0.25rem;
    background: var(--global-theme-color);
    color: var(--global-bg-color);
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
    text-transform: uppercase;
  }

  .custom-cv-entry-title {
    margin: 0 0 0.25rem;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.4;
  }

  .custom-cv-entry-subtitle {
    margin: 0 0 0.4rem;
    color: var(--global-text-color);
    font-size: 0.95rem;
  }

  .custom-cv-entry-location {
    color: var(--global-text-color-light);
    font-size: 0.9rem;
  }

  .custom-cv-entry ul {
    margin: 0.4rem 0 0;
    padding-left: 1.15rem;
  }

  .custom-cv-entry li {
    margin-bottom: 0.2rem;
  }

  .custom-cv-row {
    display: grid;
    grid-template-columns: minmax(8rem, 12rem) minmax(0, 1fr);
    gap: 1rem;
    padding: 0.55rem 0;
  }

  .custom-cv-row + .custom-cv-row {
    border-top: 1px solid var(--global-divider-color);
  }

  .custom-cv-label {
    font-weight: 500;
  }

  #toc-sidebar,
  .toc-sidebar,
  .toc,
  .js-toc {
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  #toc-sidebar::-webkit-scrollbar,
  .toc-sidebar::-webkit-scrollbar,
  .toc::-webkit-scrollbar,
  .js-toc::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  @media (max-width: 576px) {
    .custom-cv-actions {
      margin-top: 0;
      justify-content: flex-start;
    }

    .custom-cv-entry {
      grid-template-columns: 1fr;
      row-gap: 0.65rem;
    }

    .custom-cv-row {
      grid-template-columns: 1fr;
      gap: 0.15rem;
    }
  }
---

{% assign cv = site.data.cv.cv %}

<div class="custom-cv-actions">
  <a
    href="{{ '/assets/pdf/cv.pdf' | relative_url }}"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Open CV PDF"
  >
    <i class="fa-solid fa-file-pdf"></i>
  </a>
</div>

<div class="custom-cv">
  {% for section_pair in cv.sections %}
    {% assign section_title = section_pair[0] %}
    {% assign section_entries = section_pair[1] %}
    {% assign section_id = section_title | slugify %}

    <section class="custom-cv-section">
      <h2 id="{{ section_id }}" class="custom-cv-section-title">
        {{ section_title }}
      </h2>

      {% for entry in section_entries %}
        {% if section_title == "Basics" %}
          <div class="custom-cv-row">
            <div class="custom-cv-label">{{ entry.label }}</div>
            <div>{{ entry.details }}</div>
          </div>

        {% elsif section_title == "Technical Skills" or section_title == "Skills" %}
          <div class="custom-cv-row">
            <div class="custom-cv-label">
              {{ entry.label | default: entry.name }}
            </div>

            <div>
              {% if entry.keywords %}
                {{ entry.keywords | join: ", " }}
              {% else %}
                {{ entry.details }}
              {% endif %}
            </div>
          </div>

        {% else %}
          {% assign start_date = entry.start_date | default: entry.startDate %}
          {% assign end_date = entry.end_date | default: entry.endDate %}
          {% assign displayed_date = entry.date %}

          {% if displayed_date == nil and start_date %}
            {% assign displayed_end_date = end_date | default: "Present" %}
            {% assign displayed_date = start_date
              | append: " - "
              | append: displayed_end_date
            %}
          {% endif %}

          {% assign entry_title = entry.position
            | default: entry.title
            | default: entry.name
          %}

          {% assign entry_subtitle = entry.company
            | default: entry.organization
            | default: entry.institution
          %}

          {% if section_title == "Education" %}
            {% capture education_credential %}
              {{ entry.studyType }}{% if entry.area %}{% if entry.studyType %}, {% endif %}{{ entry.area }}{% endif %}
            {% endcapture %}
            {% assign secondary_text = education_credential | strip %}
          {% else %}
            {% assign secondary_text = entry_subtitle %}
          {% endif %}

          <div class="custom-cv-entry">
            <div class="custom-cv-date">
              {% if displayed_date %}
                <span class="custom-cv-date-badge">
                  {{ displayed_date }}
                </span>
              {% endif %}

              {% if entry.location %}
                <div class="custom-cv-entry-location">
                  {{ entry.location }}
                </div>
              {% endif %}
            </div>

            <div>
              {% if section_title == "Education" %}
                <h3 class="custom-cv-entry-title">
                  {{ entry.institution }}
                </h3>
              {% elsif entry_title %}
                <h3 class="custom-cv-entry-title">
                  {{ entry_title }}
                </h3>
              {% endif %}

              {% if secondary_text != blank %}
                <div class="custom-cv-entry-subtitle">
                  {{ secondary_text }}
                </div>
              {% endif %}

              {% if entry.summary %}
                <div>{{ entry.summary }}</div>
              {% endif %}

              {% if entry.highlights %}
                <ul>
                  {% for highlight in entry.highlights %}
                    <li>
                      {{ highlight | markdownify | remove: "<p>" | remove: "</p>" }}
                    </li>
                  {% endfor %}
                </ul>
              {% endif %}
            </div>
          </div>
        {% endif %}
      {% endfor %}
    </section>

{% endfor %}

</div>
