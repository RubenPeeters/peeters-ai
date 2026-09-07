# Paper graph enrichment

The first pass focuses on **Rights to Richness**, the **Text2KG extraction-failure
diagnostic**, and **ArtKB**, as selected by Ruben. Their publication nodes use
graph weight 4. **Rank-Route-Rerank** has weight 1 and author position 2, matching
the manuscript and Ruben's confirmed preference. The existing retrieval paper
remains in the graph at its original prominence.

The main shared connection is CACAO: Rights to Richness develops its rights/context
model; the failure-modes study uses CACAO and CIDOC-CRM as extraction targets;
ArtKB uses it to organise cultural-heritage data.

## Evidence

| RDF source | Source and inspected sections |
| --- | --- |
| `urn:peeters-ai:source:rights-to-richness-manuscript` | Local sibling project `2025-swj-si-cacao-ontology`: `main.tex` abstract/authors, `sections/cacao.tex` methodology, `sections/validation.tex`. |
| `urn:peeters-ai:source:text2kg-failure-manuscript` | Local sibling project `2025-llm-agent-kgc`: `main.tex` title/authors, `00_abstract.tex`, `06_discussion.tex`. |
| `urn:peeters-ai:source:rank-route-rerank-manuscript` | Local sibling project `2027-vldb-rank-route-rerank`: `main.tex` title/authors, `sections_vldb2027/0_Abstract.tex`. |
| ArtKB paper | [Publisher abstract](https://doi.org/10.1007/978-3-032-25159-6_4): RDF, multimodal data, CACAO, Wikidata. |
| ArtKB implementation | [Authors' repository](https://github.com/links-ads/eswc26-artkb): GraphDB, Qdrant, MinIO and FastAPI. |

Local-source URNs are identifiers, not public download links. Manuscripts and
private source files are not copied into the site. File hashes below record the
versions inspected. The paper titles/abstracts may change before publication.

## Modelling decisions

- `pp:addressesQuestion` points to **editorial paraphrases**, explicitly labelled
  as such in both languages. These are not claimed to be verbatim research questions.
- `pp:usesMethod`, `pp:usesOntology`, and `pp:usesDataset` separate methods,
  ontologies, and data. Sources accompany all added entities and the enriched
  ArtKB paper/project.
- Keep existing resource IDs. CACAO is one shared node across the three main papers.
- New manuscript nodes do not claim a publication date, acceptance, DOI, or venue.
  Existing bibliography metadata is preserved; Rights to Richness is now featured.
- ArtKB and Rights to Richness link to stable anchors in the full research list.
  Featured copies do not repeat the same HTML ID.
- Second author is recorded for Rank-Route-Rerank, without inferring a specific
  contribution from author position alone.
- POP-RAG is **pending**. Ruben confirms second authorship but has no local copy.
  No matching public source was found. Do not invent its title expansion, methods,
  datasets, venue, or acceptance. When a source becomes available, use weight 1.
- No 3D or image work is included.

## Verification

Run `node --test tests/*.test.mjs`, `pnpm check`, and `pnpm build`.
Review the English and Dutch graph, keyboard navigation to publication anchors,
and the mobile section-list fallback.

## Local source fingerprints

- `2025-swj-si-cacao-ontology/main.tex`: `7a1a9a6937d0099c9e09a699d797cb5e98fab3a3a3ec085382f7a7b5405a54bc`
- `2025-swj-si-cacao-ontology/sections/cacao.tex`: `6b10dd2c4cdfd521c7adb222767f9ee9c0c517b38a5b8e9fd27a2cf033eb6e2b`
- `2025-swj-si-cacao-ontology/sections/validation.tex`: `beee24f3a858f04589017860db2cd6ee82d4bb1482bb60965357bf3fcc47bff6`
- `2025-llm-agent-kgc/main.tex`: `f14ea966dccdc666ec31cf363c0e471c941829950d757232427a5b39219553da`
- `2025-llm-agent-kgc/00_abstract.tex`: `2bb311061d769167c79056523894e244c63d80de1c5c17fe038624130b2f351c`
- `2025-llm-agent-kgc/06_discussion.tex`: `1d15c6d080a5d4b29e689d4691852b1e543dd6370b6e35618a5fa1263d2d530c`
- `2027-vldb-rank-route-rerank/main.tex`: `805047cba72c684d2c1bd3d643733dacffff6c2ec80ebcba528df8d3b404a4ce`
- `2027-vldb-rank-route-rerank/sections_vldb2027/0_Abstract.tex`: `d3a287f38d9c615d3bc7c422400495e90a84151f8ebe96111634272892fd5e6a`
