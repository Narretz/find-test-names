const { stripIndent } = require('common-tags')
const test = require('ava')
const { getTestNames } = require('../src')

test('extract complex structure', (t) => {
  t.plan(1)
  const source = stripIndent`
    it('top', () => {})

    describe('foo', {tags: ['@one', '@two']}, () => {

      describe('foobar', {tags: ['@four']}, () => {
        it('bar', {tags: ['@three']}, () => {})

        it('quox', {tags: ['@five']}, () => {})
      });

      it('blipp', {tags: []}, () => {})
    })

    it('baz', {tags: ['@one']}, () => {})
  `
  const result = getTestNames(source, true)

  t.deepEqual(result.structure, [
    {
      name: 'top',
      tags: undefined,
      type: 'test',
      pending: false,
    },
    {
      name: 'foo',
      type: 'suite',
      pending: false,
      suites: [
        {
          name: 'foobar',
          type: 'suite',
          pending: false,
          suites: [],
          tests: [
            {
              name: 'bar',
              tags: ['@three'],
              type: 'test',
              pending: false,
            },
            {
              name: 'quox',
              tags: ['@five'],
              type: 'test',
              pending: false,
            },
          ],
          tags: ['@four'],
        },
      ],
      tests: [
        {
          name: 'blipp',
          tags: undefined,
          type: 'test',
          pending: false,
        },
      ],
      tags: ['@one', '@two'],
    },
    {
      name: 'baz',
      tags: ['@one'],
      type: 'test',
      pending: false,
    },
  ])
})

test('structure with empty suites', (t) => {
  t.plan(1)
  const source = stripIndent`
    it('top', () => {})

    describe('foo', {tags: ['@one', '@two']}, () => {
      describe('empty before', () => {
        describe('empty before nested', () => {})
      })

      describe('foobar', {tags: ['@four']}, () => {
        it('bar', {tags: ['@three']}, () => {})

        it('quox', {tags: ['@five']}, () => {})
      });

      it('blipp', {tags: []}, () => {})

      describe('empty after', () => {
        describe('empty after nested', () => {})
      })

    })

    it('baz', {tags: ['@one']}, () => {})
  `
  const result = getTestNames(source, true)

  t.deepEqual(result.structure, [
    {
      name: 'top',
      type: 'test',
      pending: false,
      tags: undefined,
    },
    {
      name: 'foo',
      type: 'suite',
      pending: false,
      suites: [
        {
          name: 'empty before',
          type: 'suite',
          pending: false,
          suites: [
            {
              name: 'empty before nested',
              type: 'suite',
              pending: false,
              suites: [],
              tests: [],
              tags: undefined,
            },
          ],
          tests: [],
          tags: undefined,
        },
        {
          name: 'foobar',
          type: 'suite',
          pending: false,
          suites: [],
          tests: [
            {
              name: 'bar',
              tags: ['@three'],
              type: 'test',
              pending: false,
            },
            {
              name: 'quox',
              tags: ['@five'],
              type: 'test',
              pending: false,
            },
          ],
          tags: ['@four'],
        },
        {
          name: 'empty after',
          type: 'suite',
          pending: false,
          suites: [
            {
              name: 'empty after nested',
              type: 'suite',
              pending: false,
              suites: [],
              tests: [],
              tags: undefined,
            },
          ],
          tests: [],
          tags: undefined,
        },
      ],
      tests: [
        {
          name: 'blipp',
          tags: undefined,
          type: 'test',
          pending: false,
        },
      ],
      tags: ['@one', '@two'],
    },
    {
      name: 'baz',
      tags: ['@one'],
      type: 'test',
      pending: false,
    },
  ])
})
