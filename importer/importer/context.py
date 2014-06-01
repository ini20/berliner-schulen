import click


class Context(object):

    def __init__(self):
        self.es_hosts = ['localhost:9200']
        self.es_index = 'school'
        self.es = None


pass_context = click.make_pass_decorator(Context, ensure=True)
