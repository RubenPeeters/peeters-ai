# Graph images and links

Images use schema:image with a local asset path. The person node uses a circular
portrait crop; figures fit inside the node and appear at a larger size in the
hover/focus preview. A failed SVG image leaves the labelled node available.

Clickable nodes are determined by their localized pp:pathEn / pp:pathNl values,
not their category or presence of an image. They have a blue outer ring,
underlined blue label, arrow, pointer cursor, and an accessible action label.
Image-only nodes retain their details interaction.

## Asset sources

- ruben.jpg: public KU Leuven EAVISE profile portrait at
  https://iiw.kuleuven.be/onderzoek/eavise/people/00169904/@@images/person_photo/mini .
  LinkedIn was inaccessible. This is the university portrait, not a claimed
  copy of the LinkedIn image. The source is 107 pixels wide, suitable for the
  small node; a higher-resolution original can replace it.
- cacao.png: existing figure in the user's
  2025-swj-si-cacao-ontology/figures/cacao.png manuscript project.
- text2kg-pipeline.png: existing figure in
  2025-llm-agent-kgc/assets/pipeline.png.
- artkb.png: authors' architecture figure from
  https://github.com/links-ads/eswc26-artkb/blob/main/assets/KB.png .
  Repository MIT license is included alongside the asset.

No manuscript pages or unpublished full papers are copied. All source images
are used without altering their content.

## Organization, technology and domain images

- ku-leuven.svg: https://stijl.kuleuven.be/releases/latest/img/svg/logo.svg
- ugent.png: https://styleguide.ugent.be/files/uploads/logo_UGent_EN_RGB_2400_kleur_witbg.png
- python.svg: official Python logo, linked from https://www.python.org/community/logos/
  (https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg).
- rdf.svg and sparql.svg: W3C technology buttons from
  https://www.w3.org/2007/10/sw-logos.html
  (https://www.w3.org/Icons/SW/Buttons/sw-rdf-blue-v.svg and
  https://www.w3.org/Icons/SW/Buttons/sw-sparql-blue-v.svg).
- cultural-heritage.svg, human-biomonitoring.svg, knowledge-graphs.svg and
  multimodal-ml.svg: original domain symbols drawn for this site, not official
  organizational logos.

Logos retain their original colors and proportions. Non-portrait images fit in
an inscribed square so circular node clipping does not remove their corners.
