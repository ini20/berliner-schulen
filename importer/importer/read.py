#!/usr/bin/env python3

import csv
import sys

from elasticsearch import Elasticsearch

from .config import ES_HOSTS, ES_INDEX


def main(fp, es):
    reader = csv.DictReader(fp)
    next(reader)
    for row in reader:
        row.pop('', None)
        row.pop('#N/A', None)
        print(reader.line_num)
        es.index(index=ES_INDEX, doc_type='equipment', id=row['bsn'], body=row)


if __name__ == '__main__':
    with open(sys.argv[1], 'r') as fp:
        es = Elasticsearch(ES_HOSTS)
        main(fp, es)
