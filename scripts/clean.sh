#!/bin/bash
# Clean directory before deploy new version
shopt -s dotglob && rm -rf /var/www/projects/strapi*
