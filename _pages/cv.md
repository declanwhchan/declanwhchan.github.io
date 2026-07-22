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

{% assign resume = site.data.resume %}

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
  <section class="custom-cv-section">
    <h2 id="basics" class="custom-cv-section-title">Basics</h2>

    {% if resume.basics.name %}
      <div class="custom-cv-row">
        <div class="custom-cv-label">Name</div>
        <div>{{ resume.basics.name }}</div>
      </div>
    {% endif %}

    {% if resume.basics.email %}
      <div class="custom-cv-row">
        <div class="custom-cv-label">Email</div>
        <div>
          <a href="mailto:{{ resume.basics.email }}">
            {{ resume.basics.email }}
          </a>
        </div>
      </div>
    {% endif %}

    {% if resume.basics.url %}
      <div class="custom-cv-row">
        <div class="custom-cv-label">Website</div>
        <div>
          <a
            href="{{ resume.basics.url }}"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ resume.basics.url }}
          </a>
        </div>
      </div>
    {% endif %}

    {% for profile in resume.basics.profiles %}
      <div class="custom-cv-row">
        <div class="custom-cv-label">{{ profile.network }}</div>
        <div>
          <a
            href="{{ profile.url }}"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ profile.username }}
          </a>
        </div>
      </div>
    {% endfor %}

  </section>

{% if resume.education.size > 0 %}
<section class="custom-cv-section">
<h2 id="education" class="custom-cv-section-title">Education</h2>

      {% for entry in resume.education %}
        {% assign end_date = entry.endDate | default: "Present" %}

        <div class="custom-cv-entry">
          <div class="custom-cv-date">
            {% if entry.startDate %}
              <span class="custom-cv-date-badge">
                {{ entry.startDate }} – {{ end_date }}
              </span>
            {% endif %}
          </div>

          <div>
            <h3 class="custom-cv-entry-title">
              {{ entry.institution }}
            </h3>

            {% capture credential %}
              {{ entry.studyType }}{% if entry.area %}{% if entry.studyType %}, {% endif %}{{ entry.area }}{% endif %}
            {% endcapture %}

            {% assign credential = credential | strip %}

            {% if credential != blank %}
              <div class="custom-cv-entry-subtitle">
                {{ credential }}
              </div>
            {% endif %}

            {% if entry.score %}
              <div>{{ entry.score }}</div>
            {% endif %}

            {% if entry.highlights %}
              <ul>
                {% for highlight in entry.highlights %}
                  <li>
                    {{ highlight
                      | markdownify
                      | remove: "<p>"
                      | remove: "</p>"
                    }}
                  </li>
                {% endfor %}
              </ul>
            {% endif %}
          </div>
        </div>
      {% endfor %}
    </section>

{% endif %}

{% if resume.skills.size > 0 %}
<section class="custom-cv-section">
<h2 id="technical-skills" class="custom-cv-section-title">
Technical Skills
</h2>

      {% for skill in resume.skills %}
        <div class="custom-cv-row">
          <div class="custom-cv-label">{{ skill.name }}</div>

          <div>
            {% if skill.keywords %}
              {{ skill.keywords | join: ", " }}
            {% elsif skill.details %}
              {{ skill.details }}
            {% endif %}
          </div>
        </div>
      {% endfor %}
    </section>

{% endif %}

{% if resume.work.size > 0 %}
<section class="custom-cv-section">
<h2 id="experience" class="custom-cv-section-title">Experience</h2>

      {% for entry in resume.work %}
        {% assign end_date = entry.endDate | default: "Present" %}

        <div class="custom-cv-entry">
          <div class="custom-cv-date">
            {% if entry.startDate %}
              <span class="custom-cv-date-badge">
                {{ entry.startDate }} – {{ end_date }}
              </span>
            {% endif %}
          </div>

          <div>
            <h3 class="custom-cv-entry-title">
              {{ entry.position }}
            </h3>

            {% if entry.name %}
              <div class="custom-cv-entry-subtitle">
                {{ entry.name }}
              </div>
            {% endif %}

            {% if entry.location %}
              <div class="custom-cv-entry-location">
                {{ entry.location }}
              </div>
            {% endif %}

            {% if entry.summary %}
              <div>
                {{ entry.summary | markdownify }}
              </div>
            {% endif %}

            {% if entry.highlights %}
              <ul>
                {% for highlight in entry.highlights %}
                  <li>
                    {{ highlight
                      | markdownify
                      | remove: "<p>"
                      | remove: "</p>"
                    }}
                  </li>
                {% endfor %}
              </ul>
            {% endif %}
          </div>
        </div>
      {% endfor %}
    </section>

{% endif %}

{% if resume.projects.size > 0 %}
<section class="custom-cv-section">
<h2 id="projects" class="custom-cv-section-title">Projects</h2>

      {% for entry in resume.projects %}
        {% assign end_date = entry.endDate | default: "Present" %}

        <div class="custom-cv-entry">
          <div class="custom-cv-date">
            {% if entry.date %}
              <span class="custom-cv-date-badge">
                {{ entry.date }}
              </span>
            {% elsif entry.startDate %}
              <span class="custom-cv-date-badge">
                {{ entry.startDate }} – {{ end_date }}
              </span>
            {% endif %}
          </div>

          <div>
            <h3 class="custom-cv-entry-title">
              {% if entry.url %}
                <a
                  href="{{ entry.url }}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ entry.name }}
                </a>
              {% else %}
                {{ entry.name }}
              {% endif %}
            </h3>

            {% if entry.description %}
              <div class="custom-cv-entry-subtitle">
                {{ entry.description }}
              </div>
            {% endif %}

            {% if entry.highlights %}
              <ul>
                {% for highlight in entry.highlights %}
                  <li>
                    {{ highlight
                      | markdownify
                      | remove: "<p>"
                      | remove: "</p>"
                    }}
                  </li>
                {% endfor %}
              </ul>
            {% endif %}
          </div>
        </div>
      {% endfor %}
    </section>

{% endif %}

{% assign extracurriculars = resume.ecs | default: resume.volunteer %}

{% if extracurriculars.size > 0 %}
<section class="custom-cv-section">
<h2 id="ecs" class="custom-cv-section-title">ECs</h2>

      {% for entry in extracurriculars %}
        {% assign end_date = entry.endDate | default: "Present" %}

        <div class="custom-cv-entry">
          <div class="custom-cv-date">
            {% if entry.date %}
              <span class="custom-cv-date-badge">
                {{ entry.date }}
              </span>
            {% elsif entry.startDate %}
              <span class="custom-cv-date-badge">
                {{ entry.startDate }} – {{ end_date }}
              </span>
            {% endif %}
          </div>

          <div>
            <h3 class="custom-cv-entry-title">
              {{ entry.title | default: entry.position }}
            </h3>

            {% assign organization = entry.organization | default: entry.name %}

            {% if organization %}
              <div class="custom-cv-entry-subtitle">
                {{ organization }}
              </div>
            {% endif %}

            {% if entry.highlights %}
              <ul>
                {% for highlight in entry.highlights %}
                  <li>
                    {{ highlight
                      | markdownify
                      | remove: "<p>"
                      | remove: "</p>"
                    }}
                  </li>
                {% endfor %}
              </ul>
            {% endif %}
          </div>
        </div>
      {% endfor %}
    </section>

{% endif %}

</div>
