---
layout: about
title: about
permalink: /
subtitle: '<span id="toronto-time">Loading...</span>'

profile:
  align: right
  image: logo.png
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>Engineering Science 2T9</p>
    <p>@ University of Toronto</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: true
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

<script>
  function updateTorontoTime() {
    const element = document.getElementById("toronto-time");

    if (element) {
      element.textContent = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
        hour12: false,
      }).format(new Date());
    }
  }

  updateTorontoTime();
  setInterval(updateTorontoTime, 1000);
</script>

I'm currently an undergraduate student in [Engineering Science](https://engsci.utoronto.ca/) at the University of Toronto.

I’m interested in building reliable computational tools for scientific discovery and engineering systems. My work spans aerospace, robotics, machine learning, and materials science, with a focus on translating theoretical concepts into testable software.

As a research fellow with the [AutoDIAL](https://autodiallab.ca/) lab, I studied the robustness of machine learning force fields, benchmarked predictions against density functional theory, and ran large-scale experiments on high-performance computing clusters. With [UTAT](https://utat.ca/), I developed attitude determination and control software for CubeSats, including Python simulations of spacecraft dynamics. Beyond research, I worked with [RSX](https://rsx-utoronto.github.io/rsx-website/) on mechanical design.
