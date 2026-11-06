# Graph images and links

Images use schema:image with a local asset path. Every image is a full-bleed
circle drawn for a round node, so it fills the node diameter and appears at a
larger size in the hover/focus preview. A failed SVG image leaves the labelled
node available.

Clickable nodes are determined by their localized pp:pathEn / pp:pathNl values,
not their category or presence of an image. They have a blue outer ring,
underlined blue label, arrow, pointer cursor, and an accessible action label.
Image-only nodes retain their details interaction.

## Asset sources

All images in public/kg/images are original illustrations drawn for this site
in the design system's style (cream paper disc, ink colours, dark outline).
They are not official logos, photographs or paper figures.

- ruben.svg: illustrated portrait for id:ruben.
- ku-leuven.svg and ugent.svg: illustrated university buildings.
- python.svg, rdf.svg and sparql.svg: illustrated technology symbols.
- cultural-heritage.svg, human-biomonitoring.svg, knowledge-graphs.svg and
  multimodal-ml.svg: illustrated domain symbols.
- cacao.svg: id:cacao and id:paper-rights.
- text2kg.svg: id:paper-text2kg-failures.
- artkb.svg: id:artkb and id:paper-artkb.
