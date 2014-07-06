#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import click
import csv
import json

from collections import defaultdict
from functools import partial

from elasticsearch import Elasticsearch

from .context import pass_context


progressbar = partial(click.progressbar, fill_char='=', empty_char=' ')
PB_LABEL = '%-16s'


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
                'branches': {'type': 'string', 'index': 'not_analyzed'},
                'accessibility': {'type': 'string', 'index': 'not_analyzed'},
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
                'classes': {
                    'type': 'object',
                    'properties': {
                        'name': {'type': 'string', 'index': 'not_analyzed'},
                        'type': {'type': 'string', 'index': 'not_analyzed'},
                        'amount': {'type': 'integer', 'ignore_malformed': True},
                        'totalStudents': {'type': 'integer', 'ignore_malformed': True},
                        'maleStudents': {'type': 'integer', 'ignore_malformed': True},
                        'femaleStudents': {'type': 'integer', 'ignore_malformed': True},
                        'foreignStudents': {'type': 'integer', 'ignore_malformed': True},
                        'nonNativeStudents': {'type': 'integer', 'ignore_malformed': True},
                    }
                },
                'equipments': {'type': 'string', 'index': 'not_analyzed'},
                'personell': {
                    'type': 'object',
                    'properties': {
                        'name': {'type': 'string', 'index': 'not_analyzed'},
                        'data': {
                            'type': 'object',
                            'properties': {
                                'year': {'type': 'string', 'index': 'not_analyzed'},
                                'amount_m': {'type': 'integer', 'ignore_malformed': True},
                                'amount_f': {'type': 'integer', 'ignore_malformed': True}
                            }
                        }
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
@click.argument('personell', type=click.File('r'))
@click.argument('students', type=click.File('r'))
@click.argument('heatmap', type=click.File('w'))
@pass_context
def load_data(context,
              schools,
              accessibility,
              addresses,
              equipments,
              languages,
              schools_ext,
              personell,
              students,
              heatmap
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

    tmp = PersonellProcessor(personell).process()
    with progressbar(tmp, label=PB_LABEL % 'Personell') as bar:
        for bsn in bar:
            if bsn in data:
                # We have data about schools that don't exist -.-
                data[bsn]['personell'] = [{'name': k, 'data': v}
                                          for k, v in tmp[bsn].items()]

    tmp = StudentsProcessor(students).process()
    with progressbar(tmp, label=PB_LABEL % 'Students') as bar:
        for bsn in bar:
            if bsn in data:
                data[bsn]['classes'] = tmp[bsn]

    click.secho('\nIndexing ...', fg='green')

    with progressbar(data, label=PB_LABEL % 'Schools') as bar:
        for bsn in bar:
            context.es.index(index=context.es_index, doc_type='school',
                             id=bsn, body=data[bsn])

    click.secho('\nPost processing ...', fg='green')

    heatmapData = []
    maxQuot = 0
    with progressbar(data, label=PB_LABEL % 'Creating heatmap') as bar:
        for bsn in bar:
            # ignore all those schools where we're missing data
            if not 'personell' in data[bsn]:
                continue
            if not 'classes' in data[bsn]:
                continue
            if not 'location' in data[bsn]['address']:
                continue

            # sum up all the personell
            personell = 0
            for v in data[bsn]['personell']:
                if v['name'] in ('Lehrkräfte', 'Erzieher(innen)'):
                    d = v['data'][0]
                    personell = personell + float(d['amount_f']) + float(d['amount_m'])

            students = 0
            for clazz in data[bsn]['classes']:
                students = students + float(clazz['totalStudents'])

            loc = data[bsn]['address']['location']
            quot = students / personell
            maxQuot = max(maxQuot, quot)
            heatmapData.append({
                'bsn': bsn,
                'lon': loc['lon'],
                'lat': loc['lat'],
                'quot': quot
            })

    hm = {
        'max': maxQuot,
        'data': heatmapData
    }
    heatmap.write(json.dumps(hm))


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

    def process_row(self, row):
        bsn, row = super(AccessibilityProcessor, self).process_row(row)
        return bsn, [k for k, v in row.items() if v]


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
        return bsn, [k for k, v in row.items() if v]


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


class PersonellProcessor(Processor):

    def process(self):
        reader = csv.DictReader(self.infile)
        data = {}
        for row in reader:
            bsn, rowdata = self.process_row(row)
            if bsn is None:
                continue
            existingRowData = data.get(bsn, defaultdict(list))
            existingRowData[rowdata['name']].append(rowdata['data'])
            data[bsn] = existingRowData
        return data

    def process_row(self, row):
        bsn, row = super(PersonellProcessor, self).process_row(row)
        data = {
            'name': row['Text'],
            'data': {
                'year': row['Schuljahr'],
                'amount_f': row['Personal_W'],
                'amount_m': row['Personal_M'],
            }
        }
        return bsn, data


class StudentsProcessor(Processor):

    def process(self):
        reader = csv.DictReader(self.infile)
        data = {}
        for row in reader:
            bsn, rowdata = self.process_row(row)
            if bsn is None:
                continue
            existingRowData = data.get(bsn, [])
            existingRowData.append(rowdata)
            data[bsn] = existingRowData
        return data

    def process_row(self, row):
        bsn, row = super(StudentsProcessor, self).process_row(row)
        data = {
            'name': row['Jahrgangsstufe'],
            'type': row['Klassenart'],
            'amount': row['K'],
            'totalStudents': row['S'],
            'maleStudents': row['SM'],
            'femaleStudents': row['SW'],
            'foreignStudents': ['N'],
            'nonNativeStudents': row['H']
        }
        return bsn, data

if __name__ == '__main__':
    cli()
