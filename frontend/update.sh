#!/bin/env bash
git pull
npm run build
systemctl restart nginx
update.sh