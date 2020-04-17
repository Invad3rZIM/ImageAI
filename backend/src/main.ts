
const fs = require('fs');
const PNG = require('pngjs').PNG;

async function readPNGImage(url : string) : Promise<Kernel> {
    let response : Kernel = await new Promise(async (res, rej) => {
         fs.createReadStream(url).pipe(new PNG({
                filterType: 4
            })).once('parsed',  function(){

                //let dataLength = this.data.length;
                //let width = this.width;
                //let height = this.height;

                //console.log("D/W/H: " + dataLength + ", " + width + ", " + height);

                //console.log(this.data[0])
                console.log(this.data)
                //console.log(this.data.constructorName);

                res({buffer: this.data, cols: this.width, rows: this.height})
            });
        })  
    return response

}

function readJPGImage(url : string) : Kernel {
    let fs = require('fs')
    let jpeg = require('jpeg-js');
    let jpegData = fs.readFileSync(url);
    let rawImageData = jpeg.decode(jpegData);

    return {cols: rawImageData.width, rows: rawImageData.height, buffer: rawImageData.data}
}

async function writeTmpFile(imageBuffer : number[]) {
    let fs = require('fs')
    fs.writeFile('backend/src/tmp/logo.png', imageBuffer, 'binary', function(err){
        if (err) throw err
    })
}

export async function testImage(){

    var output = require('image-output')
    
    // create chess pattern png from raw pixels data
    output({
        data: [0,0,0,1, 1,1,1,1, 1,1,1,1, 0,0,0,1],
        width: 2,
        height: 2
    }, 'chess.png')

    /*
    fs.createReadStream("in.png")
        .pipe(
            new PNG({
                filterType: 4,
            })
        )
        .on("parsed", function () {
            for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;

                // invert color
                this.data[idx] = 255 - this.data[idx];
                this.data[idx + 1] = 255 - this.data[idx + 1];
                this.data[idx + 2] = 255 - this.data[idx + 2];

                // and reduce opacity
                this.data[idx + 3] = this.data[idx + 3] >> 1;
            }
            }

            this.pack().pipe(fs.createWriteStream("./brett_test_001.png"));
        });
    */
}

export async function filterImage(imageBuffer : number[] ) {  
    await writeTmpFile(imageBuffer)

    let imageMatrix : Kernel = parseData( await readPNGImage("./backend/src/tmp/logo.png") )

    let rowKernel = {rows: 3, cols: 3, buffer: [ 0,-1,0,0,-1,0,0,-1,0]}
    let columnKernel = {rows: 3, cols: 3, buffer: [0,0,0,-1,-1,-1,0,0,0]}
    
   /* let a : Kernel = cnnFilter(imageMatrix, rowKernel, 1)
    let b : Kernel = cnnFilter(imageMatrix, columnKernel, 2)

    let A : number[] = []

    for(let row = 0; row < a.rows; row++) {
        for(let col = 0; col < a.cols; col++) {
            A.push(a.buffer[row * a.cols + col] + b.buffer[row * a.cols + col])
        }
    }

    let filterBuffer: number[] = [];

   /* for(let index = 0; index < A.length; index++) {
        filterBuffer.push(A[index] * 255);
        filterBuffer.push(A[index]* 255);
        filterBuffer.push(A[index]* 255);
        //filterBuffer.push(A[index] * 255);
    }*/
    
    let PNG = require('pngjs').PNG;

    var newPNG = new PNG({width: imageMatrix.cols, height: imageMatrix.rows})
    newPNG.data = imageBuffer;

//    console.log(newPNG)
    var fs = require("fs")


    newPNG.pack().pipe(fs.createWriteStream("./backend/src/tmp/out.png"));
    
}

function cnnFilter(m1: Kernel, filter : Kernel, value : number) : Kernel {
    let m2Buffer : number[] = []
    let m2Rows : number = m1.rows - filter.rows + 1;
    let m2Cols : number = m1.cols - filter.cols + 1;

    for(let row = 0; row < m2Rows; row++) {
        for(let col = 0; col < m2Cols; col++){
            let dot = 0;

            for(let filterRow = 0; filterRow < filter.rows; filterRow++) {
                for(let filterCol = 0; filterCol < filter.cols; filterCol++) {
                    //dot = m1w1 + m2w2 + m3w3 + ... 
                    dot += filter.buffer[filterRow * filter.cols + filterCol] * 
                               m1.buffer[((row + filterRow) * m1.cols) + (col + filterCol)
                        ]
                }
            }

            if(dot > -1) { m2Buffer.push(value)} else { m2Buffer.push(0)}
        }
    }

    return {buffer: m2Buffer, cols: m2Cols, rows: m2Rows}
}



interface Kernel {
    rows: number;
    cols: number;
    buffer: number[];
}

function parseData(data : Kernel) : Kernel {
    let {rows, cols, buffer} = data;

    let rbga : number[][] = [[],[],[],[]];
    let grayscale : number[] = [];

    for(let row = 0; row < cols; row++) {
        let s : string = "";
        let gs : string = "";

        for(let col = 0; col < cols; col++) {
            //bitshift <<2 == * 4
            let idx = row * cols + col << 2

            for(let i = 0; i < 4; i++) {
                rbga[i].push(buffer[idx+i])
            }

            grayscale.push( (buffer[idx]+buffer[idx+1]+buffer[idx+2]) /3/255)
            gs += grayscale[grayscale.length-1] + " ";
        }
    }
    return {...data, buffer: grayscale}
}

///THE #1 QUESTION WE SHOULD ASK INTERNS - what does CALLBACK HELL mean to YOU?