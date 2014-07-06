#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import click
import csv

from functools import partial

from elasticsearch import Elasticsearch

from .context import pass_context


progressbar = partial(click.progressbar, fill_char='=', empty_char=' ')
PB_LABEL = '%-15s'


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
                'public': {'type': 'boolean', 'index': 'not_analyzed'},
                'schooltype': {'type': 'string', 'index': 'not_analyzed'},
                'languages': {'type': 'string', 'index': 'not_analyzed'},
                'branches': {'type': 'string', 'index': 'not_analyzed', 'store': True},
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
                        'district': {'type': 'string', 'index': 'not_analyzed'},
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
            }
        },
    }
    if not context.es.indices.exists(context.es_index):
        context.es.indices.create(context.es_index)
    context.es.indices.put_mapping(index=context.es_index,
                                   doc_type='school', body=body)


@cli.command()
@click.argument('schools', type=click.File('r'))
@click.argument('accessibility', type=click.File('r'))
@click.argument('addresses', type=click.File('r'))
@click.argument('equipments', type=click.File('r'))
@click.argument('languages', type=click.File('r'))
@click.argument('schools_ext', type=click.File('r'))
@pass_context
def load_data(context,
              schools,
              accessibility,
              addresses,
              equipments,
              languages,
              schools_ext
              ):
    click.secho('Loading schools ... ', fg='green')
    data = SchoolProcessor(schools).process()
    click.echo('Found %d schools' % len(data.keys()))

    click.secho('\nLoading addition data sets ...', fg='green')
    tmp = AccessibilityProcessor(accessibility).process()
    with progressbar(tmp, label=PB_LABEL % 'Accessibility') as bar:
        for bsn in bar:
            data[bsn]['accessibility'] = tmp[bsn]

    tmp = AddressProcessor(addresses).process()
    with progressbar(tmp, label=PB_LABEL % 'Addresses') as bar:
        for bsn in bar:
            data[bsn]['address'] = tmp[bsn]

    tmp = EquipmentProcessor(equipments).process()
    with progressbar(tmp, label=PB_LABEL % 'Equipment') as bar:
        for bsn in bar:
            data[bsn]['equipments'] = tmp[bsn]

    tmp = LanguageProcessor(languages).process()
    with progressbar(tmp, label=PB_LABEL % 'Language') as bar:
        for bsn in bar:
            data[bsn].update(tmp[bsn])

    tmp = SchoolExtProcessor(schools_ext).process()
    with progressbar(tmp, label=PB_LABEL % 'SchoolExt') as bar:
        for bsn in bar:
            data[bsn].update(tmp[bsn])

    click.secho('\nIndexing ...', fg='green')

    with progressbar(data, label=PB_LABEL % 'Schools') as bar:
        for bsn in bar:
            context.es.index(index=context.es_index, doc_type='school',
                             id=bsn, body=data[bsn])


class Processor(object):

    def __init__(self, infile):
        self.infile = infile

    def process(self):
        reader = csv.DictReader(self.infile)
        data = {}
        for row in reader:
            bsn, rowdata = self.process_row(row)
            if bsn is None:
                continue
            data[bsn] = rowdata
        return data

    def process_row(self, row):
        bsn = row.pop('bsn', None)
        return bsn, row


class AccessibilityProcessor(Processor):
    pass


class AddressProcessor(Processor):

    def process_row(self, row):
        bsn, row = super(AddressProcessor, self).process_row(row)
        row.pop('address_id', None)
        lat = row.pop('latitude', None)
        lon = row.pop('longitude', None)
        if lat and lon:
            row['location'] = {'lat': lat, 'lon': lon}
        return bsn, row


class EquipmentProcessor(Processor):

    def process_row(self, row):
        bsn, row = super(EquipmentProcessor, self).process_row(row)
        row.pop('address_id', None)
        row.pop('district_id', None)
        return bsn, row


class LanguageProcessor(Processor):

    def process_row(self, row):
        bsn, row = super(LanguageProcessor, self).process_row(row)
        row['languages'] = row['languages'].split()
        return bsn, row


class SchoolProcessor(Processor):

    def process_row(self, row):
        row.pop('address_id', None)
        return row['bsn'], row


class SchoolExtProcessor(Processor):

    def process(self):
        reader = csv.DictReader(self.infile)
        data = {}
        for row in reader:
            bsn, newrowdata = self.process_row(row)
            if bsn is None:
                continue
            rowdata = data.get(bsn, newrowdata)
            branches = list(set(rowdata['branches']) | newrowdata['branches'])
            rowdata['branches'] = branches
            data[bsn] = rowdata
        return data

    def process_row(self, row):
        bsn, row = super(SchoolExtProcessor, self).process_row(row)
        data = {
            'public': row['Schultraeger'] == "öffentlich",
            'branches': set([row['Schulzweig']]),
            'schooltype': row['Schulart']
        }
        return bsn, data


if __name__ == '__main__':
    cli()
