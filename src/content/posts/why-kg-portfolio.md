---
title: "Why this site is a knowledge graph"
description: "Most portfolios are flat lists of projects and papers. This one is an RDF knowledge graph rendered as an interactive force-directed layout. Here's why."
date: 2026-06-25
tags: [knowledge-graphs, web, meta]
featured: true
locale: en
---

## The problem with flat portfolios

A typical academic portfolio is a set of disconnected lists: publications here, projects there, a bio somewhere else. The structure says nothing about how these things relate. A reader who wants to understand *what connects your work* has to do the synthesis themselves.

That bothered me. My research is fundamentally about making connections explicit — building knowledge graphs that let people and machines traverse relationships between heterogeneous data. It felt wrong to present that work as a flat page.

## What this site actually does

The landing page of this site loads two Turtle files — an ontology and a dataset — and parses them client-side with [N3.js](https://github.com/rdfjs/N3.js). The parsed triples become nodes and edges in a [D3.js](https://d3js.org/) force-directed graph.

Every entity on the graph — a research project, a skill, a publication, a site section — is a real RDF resource with a URI. The edges are real RDF predicates: `pp:worksOn`, `pp:usesTechnology`, `schema:about`. Node size reflects connectivity: the more things an entity connects to, the bigger it appears.

Section nodes are clickable. Click "Research" in the graph and you navigate to the research page. The graph *is* the navigation.

## Why RDF, not just JSON

I could have modelled the graph as a JSON file with a `nodes` and `edges` array. It would have been simpler. But RDF gives me something JSON doesn't: a schema.

The ontology defines what kinds of things exist (skills, interests, projects, publications) and what relationships are valid between them. When I add a new entity, the structure tells me what properties it should have. That's exactly the value proposition of knowledge graphs in any domain — and if I'm going to argue for that value in my research, the least I can do is practice it myself.

## The tech stack

- **Data**: Turtle files served as static assets, no server needed
- **Parsing**: N3.js in the browser
- **Visualisation**: D3.js force simulation with SVG rendering
- **Framework**: Astro, with the graph as a client-side island
- **Hosting**: GitHub Pages

The entire site is static. The RDF is just files. There's no SPARQL endpoint (yet) — though the data is structured enough that adding one with [Comunica](https://comunica.dev/) is a matter of importing the library.

## What I skipped

Plenty. There's no reasoning, no inference, no federated queries. The ontology is minimal and personal — it's not trying to be reusable beyond this site. The graph doesn't update dynamically; I edit the Turtle files and redeploy.

These are deliberate choices. The point isn't to showcase every feature of the semantic web stack. The point is that structured, connected data — even at this small scale — tells a richer story than flat lists.

## Eat your own dog food

If your research is about making knowledge more connected and explorable, your own portfolio should demonstrate that. This site is a small, opinionated argument for knowledge graphs as a way of thinking about information — not just in cultural heritage institutions, but anywhere you have things and relationships between them.
