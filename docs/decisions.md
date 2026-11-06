# Decisions

## 2026-11-06: what the homepage graph covers

Ruben chose the scope of the graph: published papers that were missing, new
research topics (LLM-based KG construction, tables to knowledge graphs, temporal
knowledge graphs, benchmarks), teaching and supervision, the projects on
/projects, his own tools (Jarvis, forge, the design system, ni-han-bao), and the
interests philosophy and Riftbound. Manuscripts in progress stay out of the
graph; only the existing Text2KG and Rank-Route-Rerank nodes remain. Sources for
every node are named in public/kg/ruben.ttl and docs/paper-graph.md.

To keep the larger graph readable, the homepage now fits it to the visible stage
and, once the layout settles, hides a label that would overlap another node or a
more important label until that node is hovered or focused.

## 2026-11-06: graph images are illustrations

Every image in the homepage knowledge graph is an illustration in the design
system's style (cream paper disc, ink colours, dark outline), replacing the
organization logos, the portrait photo and the paper figures. The graph now
matches the rest of the site, and every image fills its round node. Sources are
listed in docs/graph-images.md.
