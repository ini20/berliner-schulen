#!/usr/bin/env python
# -*- coding: utf-8 -*-

try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

setup(
    name='berlin-school-data-importer',
    version='0.0.0',
    description='Berlin school data importer',
    long_description='Berlin school data importer',
    author='Alexander Grießer, Markus Holtermann',
    author_email='gieser@bitigheimer-htc.de, info@markusholtermann.eu',
    url='https://github.com/Markush2010/berlin-school-data',
    packages=[
        'importer',
    ],
    package_dir={'importer': 'importer'},
    include_package_data=True,
    license="BSD",
    install_requires=[
        'elasticsearch>=1.0.0',
    ],
    zip_safe=False,
    keywords='Berlin, OpenData, School Data,',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Natural Language :: English',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
    ],
)
