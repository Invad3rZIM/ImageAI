import {Mask, MaskType} from "./mask"
import {Tensor, TensorType} from "./tensor"



var fs = require("fs");   
let jpeg = require('jpeg-js');
var pngparse = require("pngparse")
var output = require('image-output')

/*  TODO
    -writeImageToJPG
    -better error handling
*/

export default class ImageIO {

    public writeImageToPNGFile = async (img : (Mask | Tensor), __filepath: string, isLocalDirectory : boolean) => {
        if(img instanceof Tensor) {
            return await this.writeImageTensorToPNGFile(img, __filepath, isLocalDirectory);
        }
        if(img instanceof Mask) {
            return await this.writeImageMaskToPNGFile(img, __filepath, isLocalDirectory);
        }
    }
    //Write Buffers
    public writeImageBufferToFile = async (imageBuffer : number[], __filepath : string, isLocalDirectory : boolean) : Promise<boolean> => {
        let success = true;

        let filePath = __filepath

        if(!isLocalDirectory) {
            filePath = __dirname + '/images/' + filePath;
        }

        await fs.writeFile(filePath, imageBuffer, 'binary', function(err){
            if (err) { 
                throw err;
                success = false;
                }
        })
        return success
    }

    private writeImageTensorToPNGFile = async (tensor : Tensor, __filepath: string, isLocalDirectory : boolean) : Promise<boolean> => {
        let arr : number[] = [];

        for(let index = 0; index < tensor.data.length; index++) {
            let A = tensor.data[index];

            for(let j = 0; j < A.length; j++) {
                arr.push(A[j]);
            }
        }

        let buffer = Buffer.from(arr);

        let filePath = __filepath

        if(!isLocalDirectory) {
            filePath = __dirname + '/images/' + filePath;
        }

        await output({
            data: buffer,
            width: tensor.cols,
            height: tensor.rows,
        }, filePath)

        return true;
    }


    //Writes PNGmasks
    private writeImageMaskToPNGFile = async (mask : Mask, __filepath: string, localDirectory : boolean) : Promise<boolean> => {

        let arr : number[] = [];

        for(let index = 0; index < mask.data.length; index++) {
            arr.push(mask.data[index]);
            arr.push(mask.data[index]);
            arr.push(mask.data[index]);
            arr.push(1);

        }
        let buffer : Buffer = Buffer.from(mask.data);


        console.log(buffer, " IS HE BUFFER")
        console.log(buffer.length, mask.cols)

        let filePath = __filepath

        if(!localDirectory) {
            filePath = __dirname + '/images/' + filePath;
        }

        console.log(filePath)
        await output({
            data: buffer,
            width: mask.cols,
            height: mask.rows,
        }, filePath)

        return true;
    }


    public readPNGImage = async (url : string) : Promise<Tensor> => {
        let response : Tensor = await new Promise(async (res, rej) => {
            pngparse.parseFile(url, function(err, data) {

                if(err) {
                    throw err
                }

                let pixelCount = data.height * data.width;
                let bufferSize = data.data.length;
                let arr = [];

                if(pixelCount * 4 === bufferSize) {
                    for(let row = 0; row < data.height; row++) {
                        for(let col = 0; col < data.width; col++) {
                            let index = (row * data.width + col) << 2;
                            
                            arr.push([data.data[index], data.data[index+1], data.data[index+2], data.data[index+3]])
                        }
                    }

                    console.log("HI")
                }
                let buffer = data.data;
                console.log(buffer[40*10+0],buffer[40*10+1],buffer[40*10+2],buffer[40*10+3])
                console.log(arr[400])

                let k : Tensor = new Tensor(data.height, data.width, 4, arr, TensorType.RGBA)
                res(k)
            })
        });
        return response;
    }

    public readJPGImage = async (url : string) : Promise<Mask> => {
        let response : Mask = await new Promise(async (res, rej) => {
            let jpegData = fs.readFileSync(url);
            let rawImageData = jpeg.decode(jpegData);

            
            let k : Mask = new Mask(rawImageData.height, rawImageData.width, rawImageData.data, MaskType.Image)
            res(k);
        });

        return response;
    }
}