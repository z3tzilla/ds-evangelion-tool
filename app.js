#!/usr/bin/env node

const Args = require('./utils/args')
const EvangelionConverter = require("./utils/converter")

const argv = Args.parse
const converter = new EvangelionConverter(argv.input, argv.bin, argv.width)
converter.convert(argv.output)
