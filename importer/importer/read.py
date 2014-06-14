#!/usr/bin/env python3

import click
import csv

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
@pass_context
def clear(context):
    if context.es.indices.exists(context.es_index):
        context.es.indices.delete(context.es_index)


@cli.command()
@pass_context
def setup(context):
    body = {
        'school': {
            'properties': {
                'bsn': {'type': 'string', 'index': 'not_analyzed'},
                'meal': {'type': 'string', 'index': 'analyzed'},
                'name': {'type': 'string', 'index': 'analyzed'},
                'phonenumber': {'type': 'string', 'index': 'not_analyzed'},
                'remarks': {'type': 'string', 'index': 'analyzed'},
                'schoolnumber': {'type': 'string', 'index': 'not_analyzed'},
                'wwwaddress': {'type': 'string', 'index': 'no'},
                'public': {'type' : 'boolean', 'index': 'not_analyzed'},
                'schooltype': {'type' : 'string', 'index': 'not_analyzed'},
                'branches': {'type' : 'string', 'index' : 'not_analyzed', 'store': True},
                'accessibility': {
                    'type': 'nested',
                    'properties': {
                        'parking-lot': {'type': 'integer', 'ignore_malformed': True},
                        'elevator': {'type': 'integer', 'ignore_malformed': True},
                        'toilet': {'type': 'integer', 'ignore_malformed': True},
                        'open-for-wcu': {'type': 'integer', 'ignore_malformed': True},
                        'advice-center-hearing': {'type': 'integer', 'ignore_malformed': True},
                        'advice-center-speaking': {'type': 'integer', 'ignore_malformed': True},
                    }
                },
                'address': {
                    'type': 'nested',
                    'properties': {
                        'district': {'type': 'string', 'index': 'analyzed'},
                        'name': {'type': 'string', 'index': 'analyzed'},
                        'location': {'type': 'geo_point', 'lat_lon': True},
                        'street': {'type': 'string', 'index': 'analyzed'},
                        'plz': {'type': 'integer'},
                    }
                },
                'equipments': {
                    'type': 'nested',
                    'properties': {
                        'equipment': {'type': 'string', 'index': 'analyzed'},
                        'comment': {'type': 'string', 'index': 'analyzed'},
                        'wood': {'type': 'integer', 'ignore_malformed': True},
                        'textile': {'type': 'integer', 'ignore_malformed': True},
                        'metal': {'type': 'integer', 'ignore_malformed': True},
                        'electronic': {'type': 'integer', 'ignore_malformed': True},
                        'ceramic': {'type': 'integer', 'ignore_malformed': True},
                        'workshop': {'type': 'integer', 'ignore_malformed': True},
                        'workshops': {'type': 'integer', 'ignore_malformed': True},
                        'weaving': {'type': 'integer', 'ignore_malformed': True},
                        'bakery': {'type': 'integer', 'ignore_malformed': True},
                        'kitchen': {'type': 'integer', 'ignore_malformed': True},
                        'learning-workshop': {'type': 'integer', 'ignore_malformed': True},
                        'learning-workshops': {'type': 'integer', 'ignore_malformed': True},
                        'laptops': {'type': 'integer', 'ignore_malformed': True},
                        'whiteboards': {'type': 'integer', 'ignore_malformed': True},
                        'presenter': {'type': 'integer', 'ignore_malformed': True},
                        'pc-pool': {'type': 'integer', 'ignore_malformed': True},
                        'pc-pools': {'type': 'integer', 'ignore_malformed': True},
                        'media-library': {'type': 'integer', 'ignore_malformed': True},
                        'cybercafe': {'type': 'integer', 'ignore_malformed': True},
                    }
                },
                'languages': {
                    'type': 'nested',
                    'properties': {
                        'starting-first-class': {'type': 'integer', 'ignore_malformed': True},
                        'english': {'type': 'integer', 'ignore_malformed': True},
                        'french': {'type': 'integer', 'ignore_malformed': True},
                        'spanish': {'type': 'integer', 'ignore_malformed': True},
                        'turish': {'type': 'integer', 'ignore_malformed': True},
                        'latin': {'type': 'integer', 'ignore_malformed': True},
                        'russian': {'type': 'integer', 'ignore_malformed': True},
                        'ancient-greek': {'type': 'integer', 'ignore_malformed': True},
                        'chinese': {'type': 'integer', 'ignore_malformed': True},
                        'polish': {'type': 'integer', 'ignore_malformed': True},
                        'italian': {'type': 'integer', 'ignore_malformed': True},
                        'hebrew': {'type': 'integer', 'ignore_malformed': True},
                        'japanese': {'type': 'integer', 'ignore_malformed': True},
                        'dutch': {'type': 'integer', 'ignore_malformed': True},
                        'arabic': {'type': 'integer', 'ignore_malformed': True},
                        'greek': {'type': 'integer', 'ignore_malformed': True},
                        'portuguese': {'type': 'integer', 'ignore_malformed': True},
                    }
                },
            }
        },
    }
    if not context.es.indices.exists(context.es_index):
        context.es.indices.create(context.es_index)
    context.es.indices.put_mapping(index=context.es_index,
                                   doc_type='school', body=body)
    body = {
        'district': {
            'properties': {
                'name': {'type': 'string', 'index': 'not_analyzed', 'store': True},
            }
        }
    }
    context.es.indices.put_mapping(index=context.es_index,
                                   doc_type='district', body=body)


@cli.command()
@click.argument('infile', type=click.File('r'))
@pass_context
def accessibility(context, infile):
    context.reader = csv.DictReader(infile)
    for row in context.reader:
        click.echo(context.reader.line_num)
        bsn = row.pop('bsn', None)
        body = {
            'doc': {
                'accessibility': row,
            }
        }
        context.es.update(index=context.es_index, doc_type='school', id=bsn,
                          body=body)


@cli.command()
@click.argument('infile', type=click.File('r'))
@pass_context
def addresses(context, infile):
    context.reader = csv.DictReader(infile)
    for row in context.reader:
        click.echo(context.reader.line_num)
        bsn = row.pop('bsn', None)
        row.pop('address_id', None)
        district_id = row.pop('district_id', None)
        lat = row.pop('latitude', None)
        lon = row.pop('longitude', None)
        if lat and lon:
            row['location'] = {'lat': lat, 'lon': lon}
        body = {
            'doc': {
                'address': row,
            }
        }
        context.es.update(index=context.es_index, doc_type='school', id=bsn,
                          body=body)
        context.es.index(index=context.es_index, doc_type='district',
                         id=district_id, body={'name': row['district']})


@cli.command()
@click.argument('infile', type=click.File('r'))
@pass_context
def equipments(context, infile):
    context.reader = csv.DictReader(infile)
    for row in context.reader:
        click.echo(context.reader.line_num)
        bsn = row.pop('bsn', None)
        row.pop('address_id', None)
        row.pop('district_id', None)
        body = {
            'doc': {
                'equipments': row,
            }
        }
        context.es.update(index=context.es_index, doc_type='school', id=bsn,
                          body=body)


@cli.command()
@click.argument('infile', type=click.File('r'))
@pass_context
def languages(context, infile):
    context.reader = csv.DictReader(infile)
    for row in context.reader:
        click.echo(context.reader.line_num)
        bsn = row.pop('bsn', None)
        row.pop('', None)
        body = {
            'doc': {
                'languages': row,
            }
        }
        context.es.update(index=context.es_index, doc_type='school', id=bsn,
                          body=body)


@cli.command()
@click.argument('infile', type=click.File('r'))
@pass_context
def schools(context, infile):
    context.reader = csv.DictReader(infile)
    for row in context.reader:
        click.echo(context.reader.line_num)
        row.pop('address_id', None)
        context.es.index(index=context.es_index, doc_type='school',
                        id=row['bsn'], body=row)

@cli.command()
@click.argument('infile', type=click.File('r'))
@pass_context
def schools_ext(context, infile):
    context.reader = csv.DictReader(infile)
    lastBsn = None
    body = None
    for row in context.reader:
        click.echo(context.reader.line_num)
        bsn = row.pop('BSN', None)
        oeffentlich = True
        if row['Schultraeger'] != "öffentlich":
            oeffentlich = False

        # submit the data for a single school.
        if lastBsn is None or lastBsn != bsn:
            if (body != None):
                context.es.update(index=context.es_index, doc_type='school', id=lastBsn,
                body=body)

            body = {
                'doc' : {
                    'public' : oeffentlich,
                    'branches': [],
                    'schooltype': row['Schulart']
                }
            }

        lastBsn = bsn
        body['doc']['branches'].append(row['Schulzweig'])


    # submit the data of the last school to the index.
    context.es.update(index=context.es_index, doc_type='school', id=lastBsn,
        body=body)



if __name__ == '__main__':
    cli()
