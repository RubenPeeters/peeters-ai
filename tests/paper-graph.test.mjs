import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Parser, Store, DataFactory } from 'n3';
const { namedNode, literal } = DataFactory;
const data = new Store(new Parser().parse(await readFile(new URL('../public/kg/ruben.ttl', import.meta.url), 'utf8')));
const ontology = new Store(new Parser().parse(await readFile(new URL('../public/kg/ontology.ttl', import.meta.url), 'utf8')));
const id = (name) => namedNode('https://peeters.ai/id/' + name);
const pp = (name) => namedNode('https://peeters.ai/ontology/' + name);
const schema = (name) => namedNode('https://schema.org/' + name);
const objects = (subject, predicate) => data.getObjects(subject, predicate, null);
const priority = ['paper-rights', 'paper-text2kg-failures', 'paper-artkb'];

test('priority papers connect to sourced questions, methods, and ontology nodes', () => {
  for (const paper of priority) {
    assert.ok(objects(id(paper), pp('addressesQuestion')).length);
    assert.ok(objects(id(paper), pp('usesMethod')).length);
    assert.ok(objects(id(paper), pp('usesOntology')).length);
    assert.ok(objects(id(paper), namedNode('http://purl.org/dc/terms/source')).length);
  }
  assert.ok(data.has(id('paper-rights'), pp('usesOntology'), id('cacao')));
  assert.ok(data.has(id('paper-text2kg-failures'), pp('usesOntology'), id('cacao')));
  assert.ok(data.has(id('paper-artkb'), pp('usesOntology'), id('cacao')));
});

test('second-author paper stays below the priority papers in weight and automatic label threshold', () => {
  const weight = Number(objects(id('paper-table-annotation'), pp('graphWeight'))[0].value);
  assert.equal(objects(id('paper-table-annotation'), pp('authorPosition'))[0].value, '2');
  assert.equal(weight, 1);
  for (const paper of priority) assert.ok(Number(objects(id(paper), pp('graphWeight'))[0].value) > weight);
  const visible = new Set(data.getSubjects(pp('showInGraph'), literal('true', namedNode('http://www.w3.org/2001/XMLSchema#boolean')), null).map(n => n.value));
  const degree = data.getQuads(null, null, null, null).filter(q =>
    visible.has(q.subject.value) && visible.has(q.object.value)
    && (q.subject.equals(id('paper-table-annotation')) || q.object.equals(id('paper-table-annotation')))
  ).length;
  assert.ok(degree < 6);
});

test('new research nodes have bilingual descriptions, labels and provenance', () => {
  for (const group of ['question', 'method', 'ontology', 'dataset']) {
    for (const subject of data.getSubjects(pp('graphGroup'), literal(group), null)) {
      const names = objects(subject, schema('name'));
      const descriptions = objects(subject, schema('description'));
      for (const locale of ['en', 'nl']) {
        assert.ok(names.some(n => n.language === locale), subject.value);
        assert.ok(descriptions.some(n => n.language === locale), subject.value);
      }
      assert.ok(objects(subject, namedNode('http://purl.org/dc/terms/source')).length, subject.value);
    }
  }
});

test('new relation vocabulary is declared and every local RDF reference resolves', () => {
  for (const predicate of ['addressesQuestion', 'usesMethod', 'usesDataset', 'usesOntology', 'authorPosition']) {
    assert.ok(ontology.getQuads(pp(predicate), null, null, null).length);
  }
  for (const q of data.getQuads(null, null, null, null)) {
    if (q.object.termType === 'NamedNode' && q.object.value.startsWith('https://peeters.ai/id/')) {
      assert.ok(data.getQuads(q.object, null, null, null).length, q.object.value);
    }
  }
});

test('homepage section routes are unchanged and paper anchors stay bilingual', () => {
  assert.equal(objects(id('section-blog'), pp('pathEn'))[0].value, '/blog');
  assert.equal(objects(id('section-blog'), pp('pathNl'))[0].value, '/nl/blog');
  for (const [paper, anchor] of [['paper-artkb', 'artkb'], ['paper-rights', 'rights-to-richness']]) {
    assert.equal(objects(id(paper), pp('pathEn'))[0].value, '/research#paper-' + anchor);
    assert.equal(objects(id(paper), pp('pathNl'))[0].value, '/nl/onderzoek#paper-' + anchor);
  }
});
