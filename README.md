# Data importer


## Installation

```shell
$ cd importer
$ pip install --user .
```


## Usage


Set up the new index mapping:

```shell
$ importer setup
```

Index all data:

```shell
$ importer load_data clean_schools.csv clean_accessibility.csv \
                     clean_addresses.csv clean_equipments.csv \
                     clean_languages.csv clean_schools_ext.csv \
                     clean_personal.csv
```

Clear existing data:

```shell
$ importer clear
```

If Elasticsearch doesn't listen on `127.0.0.1:9200` include `--es-hosts
'example.com:1234'` as an argument to `importer`:

```shell
$ importer --es-hosts 'example.com:1234' setup
```

If you are running Elasticsearch on a publicly accessible ip and port, you
should lock it down and import data via an SSH tunnel:

```shell
ssh -NfL 9222:localhost:9200 example.com
```

Now use `--es-hosts 'localhost:9222'` for the commands



## Help

### `importer`

```shell
Usage: importer [OPTIONS] COMMAND [ARGS]...

Options:
  --es-hosts TEXT
  --help           Show this message and exit.

Commands:
  clear
  load_data
  setup
```


### `importer clear`

```shell
Usage: importer clear [OPTIONS]

Options:
  --help  Show this message and exit.
```


### `importer load_data`

```shell
Usage: importer load_data [OPTIONS] SCHOOLS ACCESSIBILITY ADDRESSES EQUIPMENTS
                          LANGUAGES SCHOOLS_EXT PERSONELL

Options:
  --help  Show this message and exit.
```


### `importer setup`

```shell
Usage: importer setup [OPTIONS]

Options:
  --help  Show this message and exit.
```
