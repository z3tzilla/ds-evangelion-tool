const yargs = require('yargs')

class Args {
    constructor() {
        this.argv = undefined
        this.yargs = yargs
        this.init()
    }

    init() {
        this.yargs
            .usage('Usage: $0 [options]')
            .example('$0 -i data.bin -o image.png -b -w 32', 'convert input file to png format')
            .example('$0 -i image.png -o data.bin', 'convert image to binary data')
            .version('1.0.0')
            .epilog('copyright 2018')
            .option('input', {
                alias: 'i',
                desc: 'Load a file',
                nargs: 1,
                type: 'string',
                require: true
            })
            .option('output', {
                alias: 'o',
                desc: 'Output file',
                nargs: 1,
                type: 'string',
                require: true
            })
            .option('bin', {
                alias: 'b',
                desc: 'Is binary type',
                type: 'boolean',
                require: false
            })
            .option('width', {
                alias: 'w',
                desc: 'Optional, use with binary type, image width',
                nargs: 1,
                type: 'number % 8',
                require: false
            })
            .alias('help', 'h')
            .alias('version', 'v')
            .demandOption(['input', 'output'], 'Please provide required arguments')

        this.argv = this.yargs.argv
        if (this.argv.bin && !this.argv.width) {
            this.yargs.require('w', 'To convert binary data, you need a width that is a multiple of 8')
            this.argv = this.yargs.argv
        }
    }

    get parse() {
        return this.argv
    }
}

module.exports = new Args()