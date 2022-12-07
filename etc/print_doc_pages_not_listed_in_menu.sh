#!/bin/bash
# Print the files in ../src/docs/documentation that are not listed anywhere in the menu

file_names=$(find ../src/docs/documentation -name *.md|sed 's/.PomBase././'|sed 's/.JaponicusDB././'|sort|uniq|grep -v menu.md|cut -c 13-|rev | cut -c 4- | rev)

# iterate over the array of strings
for file_name in $file_names
do
  # check if the current string exists in the file
  if ! grep -q "$file_name" ../src/docs/documentation/menu.md
  then
    # if the string does not exist, print it
    echo "$file_name"
  fi
done





