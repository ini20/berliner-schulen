#!/usr/bin/env python3

import operator
import sys

from elasticsearch import Elasticsearch

from .config import ES_HOSTS, ES_INDEX


def main(es, *fields):
    body = {'aggs': {}}
    for field in fields:
        body['aggs'][field] = {'terms': {'field': field}}
    result = es.search(index=ES_INDEX, doc_type='equipment', body=body)
    aggs = result['aggregations']
    sorter = operator.itemgetter('key')
    for field in fields:
        buckets = aggs[field]['buckets']
        if buckets == []:
            print('%s\n  not found' % field)
        else:
            print(field)
            for bucket in sorted(buckets, key=sorter):
                print('  {key}: {doc_count}'.format(**bucket))
    print('Query took %d ms' % result['took'])


if __name__ == '__main__':
    es = Elasticsearch(ES_HOSTS)
    main(es, *sys.argv[1:])
