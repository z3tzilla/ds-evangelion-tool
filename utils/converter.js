const fs = require('fs')
const path = require('path')
const jimp = require('jimp')

class EvangelionConverter {
    constructor(path, isBinary, width) {
        this.path = path
        this.isBinary = isBinary
        this.width = width

        if (isBinary && !width) {
            console.error("Width not defined")
            process.exit(1)
        }
    }

    async convert(newPath) {
        if (this.isBinary) {
            const stat = fs.statSync(this.path)
            const width = this.width
            const height = stat.size * 2 / width

            const image = new jimp(width, height)
            let index = 0
            
            const input = fs.createReadStream(this.path)
            input.on("data", data => {
              data.forEach(byte => {
            
                const tile = ~~(index / 32)
                const tileY = ~~(tile / (width / 8))
                const tileX = ~~(tile % (width / 8))
                const pos = index % 32              
                const y = ~~(pos / 4)               
                const x = pos % 4                   
                const col1 = byte & 0xF
                const col2 = (byte & 0xF0) >> 4
            
                image.setPixelColor(col1 * 0x11111100 + 0xFF, tileX * 8 + x * 2, tileY * 8 + y)
                image.setPixelColor(col2 * 0x11111100 + 0xFF, tileX * 8 + x * 2 + 1, tileY * 8 + y)
                index++
              })
            })
            
            input.on("close", () => {
              input.close()
              image.write(newPath, err => { if (err) throw err })
            })

            return
        }

        try {
            const inputImage = await jimp.read(this.path)
            const width = inputImage.bitmap.width
            const height = inputImage.bitmap.height
            const tileCount = ~~((width * height) / 64)
            const output = fs.createWriteStream(newPath)
            
            for (let tile = 0; tile < tileCount; tile++) {
                const tileY = ~~(tile / (width / 8))
                const tileX = ~~(tile % (width / 8))

                const data = Buffer.alloc(32)
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 4; x++) {
                        const col1 = ~~((inputImage.getPixelColor(tileX * 8 + x * 2, tileY * 8 + y) - 0xFF) / 0x11111100)
                        const col2 = ~~((inputImage.getPixelColor(tileX * 8 + x * 2 + 1, tileY * 8 + y) - 0xFF) / 0x11111100)
                        data[y * 4 + x] = col2 * 0x10 + col1
                    }
                }
                output.write(data)
            }

            output.close()

            return
        } catch (err) {
            console.error(err.message)
            process.exit(1)
        }
    }
}

module.exports = EvangelionConverter