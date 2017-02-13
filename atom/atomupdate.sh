#!/bin/bash

# To create the list of packages
# apm list --installed --bare > package.list

# To restore
apm install --packages-file packages.list
