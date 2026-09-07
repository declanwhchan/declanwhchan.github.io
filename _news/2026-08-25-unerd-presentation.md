---
layout: post
title: "Presented at UnERD 2026: Adversarial Robustness of Machine Learning Force Fields"
date: 2026-08-25
inline: false
related_posts: true
---

I presented my summer research, **"Do Machine Learning Force Fields Reliably Recover from Adversarial Attacks?"**, at the University of Toronto's [Undergraduate Engineering Research Day (UnERD)](https://undergrad.engineering.utoronto.ca/experiential-learning/undergraduate-engineering-research-day-unerd/).

Machine learning force fields (MLFFs) are used in materials discovery to accelerate atomistic simulations. However, understanding their reliability on out-of-distribution structures remains a core practical challenge. Although conventional benchmarks rely primarily on static energy and force errors to assess MLFFs, they overlook how small prediction errors can accumulate into unphysical artifacts. MLFFs are evaluated by their ability to recover from structural distortions through relaxation. Performance is assessed by comparing forces, topology, and relaxation steps between unperturbed and perturbed structures.

We introduce an adversarial robustness framework that probes these failure modes by perturbing atomic configurations. This approach uses a dataset of 20 Materials Project structures and benchmarks two general-purpose pretrained models, MACE-MH and UMA, against their corresponding density functional theory (DFT) relaxations. First-order adversarial perturbations -- including the standard and iterative Fast Gradient Sign Method and Projected Gradient Descent -- are compared with a non-adversarial contour-exploration baseline.

MLFF relaxations on perturbed structures converge to low forces for all contour-explored materials and 94% of adversarial attack cases. While these results demonstrate convergence toward low forces, they do not directly indicate structural recovery. As perturbation strength increases, MLFFs correctly relax a structure until the perturbation exceeds 10% of the minimum lattice parameter. Above this threshold, the models abruptly fail as structures enter undersampled regions of configuration space. Unphysical force predictions emerge at 10<sup>2</sup> eV/Å and several orders of magnitude higher. Relaxations consequently produce different configurations, as indicated by changes in structural descriptors, whereas DFT relaxations exhibit minimal topological change.

Structural recovery is therefore a more direct measure of relaxation fidelity than force and convergence metrics. This adversarial robustness framework offers a reproducible method for benchmarking MLFFs under out-of-distribution perturbations and identifying failure modes that conventional static-error metrics can miss.

[Read the full UnERD 2026 presentation post and view the slides.]({% post_url 2026-08-25-unerd-presentation %})
