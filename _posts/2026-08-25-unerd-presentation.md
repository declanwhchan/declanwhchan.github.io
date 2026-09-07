---
layout: post
title: "Do Machine Learning Force Fields Reliably Recover from Adversarial Attacks?"
date: 2026-08-25
tags: [machine-learning, materials-science]
categories: [university-of-toronto, research]
featured: true
---

I presented my summer research on the robustness of machine learning force fields (MLFFs) at [Undergraduate Engineering Research Day (UnERD)](https://undergrad.engineering.utoronto.ca/experiential-learning/undergraduate-engineering-research-day-unerd/), the University of Toronto Engineering's annual undergraduate research conference.

The project examines whether MLFFs can reliably return perturbed atomic structures to their original configurations. It was a valuable opportunity to discuss this work with students, faculty, and industry professionals while learning about research from across engineering. The presentation slides are embedded below.

<iframe
  src="{{ '/assets/pdf/unerd_mlff_attack_presentation.pdf' | relative_url }}"
  title="MLFF attack presentation from UnERD 2026"
  width="100%"
  height="720"
  style="border: 1px solid #d8dee4; border-radius: 8px;"
></iframe>

<p style="text-align: center; margin-top: 0.75rem;">
  <a href="{{ '/assets/pdf/unerd_mlff_attack_presentation.pdf' | relative_url }}">Download the slides (PDF)</a>
</p>

## Research motivation

Materials discovery requires researchers to screen many atomic structures. Density functional theory (DFT) provides energies and forces by mapping the potential energy surface, helping identify promising materials. These calculations, however, can be computationally expensive. MLFFs learn approximations of DFT potential energy surfaces and can therefore accelerate atomistic simulations substantially.

This efficiency introduces a practical reliability challenge. When structures fall outside a model's training distribution, its predictions may become unreliable. Conventional benchmarks commonly assess static energy and force errors against DFT, but these measures can miss hidden failure modes: even small errors may accumulate during a simulation and produce unphysical artifacts or structural changes.

## A perturbation-based robustness framework

With guidance from Dr. Ashley Dale and Dr. Hao Wan of the AutoDIAL Lab, I investigated a central question: **How do MLFFs relax structures after they have been perturbed?**

The framework consists of three stages:

1. Relax an atomic structure to obtain a stable reference configuration without pre-existing extreme forces.
2. Perturb its atoms away from equilibrium to probe out-of-distribution failure modes.
3. Relax the perturbed structure with the same MLFF and evaluate whether it returns to its initial configuration.

By varying the perturbation magnitude, the framework measures an MLFF's ability to recover its original structure after an attack.

## Experimental setup

Following a suggestion from Dr. Dan McHaffie of the AutoDIAL Lab, I selected 20 inorganic crystals from the Materials Project. Their relatively simple, rigid structures make sharp gradients introduced by perturbations easier to identify.

I evaluated two general-purpose MLFFs, UMA and MACE-MH, avoiding the computational cost of training and testing a larger collection of specialized models. With support from Dr. McHaffie and Dr. Wan, I also performed DFT calculations to provide ground-truth validation. For both unperturbed and perturbed structures, I compared relaxed energies, forces, and topology.

## Adversarial attacks and a non-adversarial baseline

I implemented three adversarial perturbation methods:

- **FGSM**, which takes a single signed-gradient step;
- **I-FGSM**, which applies signed-gradient steps iteratively; and
- **PGD**, which begins from a random initialization and takes constrained gradient steps within an epsilon ball.

These attacks seek large local energy changes with respect to atomic coordinates, increasing the likelihood of exposing MLFF failure modes. As a non-adversarial baseline, I used contour exploration, which moves atoms along an isoenergetic path. This comparison helps distinguish failures caused simply by displacement from equilibrium from those caused specifically by following an adversarial gradient.

## Relaxation and evaluation

I built a high-performance-computing framework to run the experiments in parallel. Each relaxation used the L-BFGS optimizer, which repeatedly updated atomic positions using MLFF predictions until the maximum force fell below the conventional threshold of 0.05 eV/A or the run reached 300 steps. The step limit prevented runaway trajectories.

Between the initial and final relaxations, I applied adversarial perturbations at 21 epsilon budgets spanning the structures' lattice parameters. Because PGD and MLFF calculations can be stochastic, I repeated the experiments across two numerical data types and five random seeds to distinguish physical findings from stochastic or numerical effects.

## Results

I first measured the maximum atomic force at each stage, as this captures changes in both the magnitude and direction of the local energy gradient. UniFFBenchmark (2025) classifies forces above 100 eV/A as unphysical and likely to cause simulation failure. FGSM, I-FGSM, and PGD all produced gradients in this extreme regime. After perturbation, 6% of adversarial cases failed to converge below the 0.05 eV/A threshold during relaxation; contour exploration did not produce the same behavior. This indicates that adversarial gradients, rather than displacement alone, expose unphysical regions of the MLFFs.

Force convergence nevertheless did not guarantee structural recovery. At both small and large perturbations, MLFF and DFT relaxations often converged to similarly low-force distributions. Beyond a perturbation magnitude of approximately 10% of the minimum lattice parameter, however, their recovered structures began to diverge topologically. Coordination-number changes showed the same transition, while the Jaccard distance confirmed changes in atomic-neighbor and edge sets. A relaxation can therefore reach a stable, low-force configuration without recovering the original topology.

Radial distribution functions provided further evidence for this divergence. Beyond the 10% threshold, the interatomic distances in MLFF-relaxed structures differed substantially from their DFT counterparts. Large adversarial perturbations can generate physically implausible gradients that redirect the optimizer toward a different low-energy basin rather than back to the original one. As a structure moves farther out of distribution, MLFF prediction errors increasingly influence the relaxation path and reduce the reliability of structural recovery.

## Conclusions and future work

Low forces and apparent agreement with DFT do not, by themselves, establish that a relaxed structure is physically meaningful. Across the 20 structures studied, adversarial gradients could redirect relaxations at perturbation magnitudes near 10% of the minimum lattice parameter, even when the final forces appeared stable.

Future work could apply this framework to additional MLFF architectures and individual structures to determine whether failures are model- or structure-dependent. This project did not examine dynamic stability; phonon analysis may reveal further hidden failure modes. Used alongside conventional static-error benchmarks, adversarial robustness testing can provide additional confidence that simulations preserve structural topology and help researchers make better-informed decisions about when to trust an MLFF in materials discovery.

## Acknowledgements

I am grateful to Professor Jae for supervising this research, Dr. Ashley Dale for her mentorship and guidance, and Dr. Dan McHaffie and Dr. Hao Wan for their suggestions and help with DFT.
