#!/usr/bin/env python3

import click
import csv

from elasticsearch import Elasticsearch

from .context import pass_context


@click.group()
@click.option('--es-hosts')
@click.argument('infile', type=click.File('r'))
@pass_context
def cli(context, es_hosts, infile):
    if es_hosts:
        context.es_hosts = es_hosts
    context.es = Elasticsearch(context.es_hosts)
    context.reader = csv.DictReader(infile)


@cli.command()
@pass_context
def address(context):
    next(context.reader)  # drop header
    for row in context.reader:
        click.echo(context.reader.line_num)
        context.es.index(index=context.es_index, doc_type='address',
                        id=row['bsn'], body=row)


@cli.command()
@pass_context
def equipment(context):
    next(context.reader)  # drop header
    for row in context.reader:
        row.pop('', None)
        row.pop('#N/A', None)
        click.echo(context.reader.line_num)
        context.es.index(index=context.es_index, doc_type='equipment',
                        id=row['bsn'], body=row)


if __name__ == '__main__':
    cli()
