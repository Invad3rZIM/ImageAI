var fs = require("fs");   
let jpeg = require('jpeg-js');
var pngparse = require("pngparse")
var output = require('image-output')

async function writeTmpFile(imageBuffer : number[]) {
    let fs = require('fs')
    fs.writeFile(__dirname + '/images/tmp/logo.png', imageBuffer, 'binary', function(err){
        if (err) throw err
    })
}

async function readPNGImage(url : string) : Promise<Kernel> {
    let response : Kernel = await new Promise(async (res, rej) => {
        pngparse.parseFile(url, function(err, data) {
            console.log(err)

            if(err) {
                throw err
            }

            let k : Kernel = new Kernel(data.height, data.width, data.data, KernelType.ImageKernel)
            res(k)
        })
    });
    return response
}

function readJPGImage(url : string) : Kernel {
    let jpegData = fs.readFileSync(url);
    let rawImageData = jpeg.decode(jpegData);

    return new Kernel(rawImageData.height, rawImageData.width, rawImageData.data, KernelType.ImageKernel)
}

function grayscaleToRGBA(kernel : Kernel, A : number = 1) : Kernel {
    let imageMatrix = [];

    for(let index = 0; index < kernel.matrix.length; index++) {
        imageMatrix.push(kernel.matrix[index])
        imageMatrix.push(kernel.matrix[index])
        imageMatrix.push(kernel.matrix[index])
        imageMatrix.push(1)
    }

    return new Kernel(kernel.rows, kernel.cols, imageMatrix);
}

export async function writeImageToPNGFile(kernel : Kernel, filepath: string){

    let buffer = Buffer.from(kernel.matrix);
    
    console.log("new : ",buffer)

    await output({
        data: buffer,
        width: 662,
        height: 662,
    }, filepath)
}

filterImage([])

export async function filterImage(imageMatrix : number[] ) {  
  //  writeTmpFile(imageMatrix)


  
    //console.log(imageMatrix)

    let base = await readPNGImage(__dirname + "/images/tmp/logo.png") 

    console.log("base: ",base.matrix)



    
    let matrix  =  parseImageToGrayscale( base)

    await writeImageToPNGFile( matrix, __dirname + "/images/tmp/logoGrayscale.png" ) 
    let newMatrix = readPNGImage(__dirname + "/images/tmp/logoGrayscale.png")

  //  return newMatrix
    return null;

 //   console.log(matrix)


  //  await writeImageToPNGFile(imageMatrix, "./backend/src/kaykay.png")

  //  let rowKernel = {rows: 3, cols: 3, matrix: [ 0,-1,0,0,-1,0,0,-1,0]}
  //  let columnKernel = {rows: 3, cols: 3, matrix: [0,0,0,-1,-1,-1,0,0,0]}
    
   /* let a : Kernel = cnnFilter(imageMatrix, rowKernel, 1)
    let b : Kernel = cnnFilter(imageMatrix, columnKernel, 2)

    let A : number[] = []

    for(let row = 0; row < a.rows; row++) {
        for(let col = 0; col < a.cols; col++) {
            A.push(a.matrix[row * a.cols + col] + b.matrix[row * a.cols + col])
        }
    }

    let filtermatrix: number[] = [];

   /* for(let index = 0; index < A.length; index++) {
        filtermatrix.push(A[index] * 255);
        filtermatrix.push(A[index]* 255);
        filtermatrix.push(A[index]* 255);
        //filtermatrix.push(A[index] * 255);
    }*/
    
  //  let PNG = require('pngjs').PNG;

  //  var newPNG = new PNG({width: imageMatrix.cols, height: imageMatrix.rows})
    
//    console.log(newPNG)
  //  var fs = require("fs")


//    newPNG.pack().pipe(fs.createWriteStream("./backend/src/tmp/out.png"));
    
}

function cnnFilter(m1: Kernel, filter : Kernel, value : number) : Kernel {
    let m2Rows : number = m1.rows - filter.rows + 1;
    let m2Cols : number = m1.cols - filter.cols + 1;   
    let m2Matrix : number[] = []

    for(let row = 0; row < m2Rows; row++) {
        for(let col = 0; col < m2Cols; col++){
            let dot = 0;

            for(let filterRow = 0; filterRow < filter.rows; filterRow++) {
                for(let filterCol = 0; filterCol < filter.cols; filterCol++) {
                    //dot = m1w1 + m2w2 + m3w3 + ... 
                    dot += filter.matrix[filterRow * filter.cols + filterCol] * 
                               m1.matrix[((row + filterRow) * m1.cols) + (col + filterCol)
                        ]
                }
            }

            if(dot > -1) { m2Matrix.push(value)} else { m2Matrix.push(0)}
        }
    }

    return new Kernel(m2Rows, m2Cols, m2Matrix)
}

enum KernelType {
    AnyKernel = 0,
    ImageKernel = 1,
}

class Kernel {
    rows: number;
    cols: number;
    matrix: number[];
    kernelType: KernelType;

    public constructor(rows : number, cols: number, matrix : number[], kernelType : KernelType = KernelType.AnyKernel) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = matrix;
        this.kernelType = kernelType;
    }
}

function parseImageToGrayscale(data : Kernel) : Kernel {
    let {rows, cols, matrix} = data;

    let rgba : number[][] = [[],[],[],[]];
    let grayscale : number[] = [];

    for(let row = 0; row < cols; row++) {
        let s : string = "";

        for(let col = 0; col < cols; col++) {
            //bitshift <<2 == * 4
            let idx = row * cols + col << 2

            for(let i = 0; i < 4; i++) {
                rgba[i].push(matrix[idx+i])
            }

            let G = rgbToGrayscale(matrix[idx], matrix[idx+1], matrix[idx+2])

            grayscale.push( G) 
            grayscale.push( G) 
            grayscale.push( G) 
            grayscale.push( 255)

       //     console.log(matrix[idx], matrix[idx+1], matrix[idx+2], matrix[idx+3]) 
        }
    }

    return {...data, matrix: grayscale}
}

function rgbToGrayscale(R : number, G : number, B : number) {
    return   ( (0.3 * R) + (0.59 * G) + (0.11 * B) )
}

///THE #1 QUESTION WE SHOULD ASK INTERNS - what does CALLBACK HELL mean to YOU?

