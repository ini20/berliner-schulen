#!/usr/bin/env python3

import click
import operator

from elasticsearch import Elasticsearch

from .context import pass_context


@click.group()
@click.option('--es-hosts')
@pass_context
def cli(context, es_hosts):
    if es_hosts:
        context.es_hosts = es_hosts
    context.es = Elasticsearch(context.es_hosts)


@cli.command()
@click.argument('fields', nargs=-1)
@pass_context
def aggregate(context, fields):
    body = {'aggs': {}}
    for field in fields:
        body['aggs'][field] = {'terms': {'field': field}}
    result = context.es.search(index=context.es_index, doc_type='equipment',
                               body=body)
    aggs = result['aggregations']
    sorter = operator.itemgetter('key')
    for field in fields:
        buckets = aggs[field]['buckets']
        if buckets == []:
            click.echo('%s\n  not found' % field)
        else:
            click.echo(field)
            for bucket in sorted(buckets, key=sorter):
                click.echo('  {key}: {doc_count}'.format(**bucket))
    print('Query took %d ms' % result['took'])


if __name__ == '__main__':
    cli()
