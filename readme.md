Evangelion conversion tool for nintendo DS.
Converts from binary ds files to png and 

Written as a learning tool for nodejs.

```
Usage: app.js [options]

Options:
  --help, -h     Show help                                             [boolean]
  --version, -v  Show version number                                   [boolean]
  --input, -i    Load a file                                 [string] [required]
  --output, -o   Output file                                 [string] [required]
  --bin, -b      Is binary type                             [boolean] [required]
  --width, -w    Optional, use with binary type, image width

Examples:
  app.js -i data.bin -o image.png -b -w 32  convert input file to png format
  app.js -i image.png -o data.bin           convert image to binary data

copyright 2018
```