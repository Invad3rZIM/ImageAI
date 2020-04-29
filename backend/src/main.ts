function grayscaleToRGBA(mask : Mask, A : number = 255) : Mask {
    let imageMatrix = [];

    for(let index = 0; index < mask.matrix.length; index++) {
        if(typeof mask.matrix[index] == "number") {
            imageMatrix.push(mask.matrix[index])
            imageMatrix.push(mask.matrix[index])
            imageMatrix.push(mask.matrix[index])
            imageMatrix.push(A)
        } else {
            imageMatrix.push(mask.matrix[index][0])
            imageMatrix.push(mask.matrix[index][1])
            imageMatrix.push(mask.matrix[index][2])
            imageMatrix.push(A)
        }
    }

    return new Mask(mask.rows, mask.cols, imageMatrix);
}


/*function grayscaleImageToMask(mask : Mask) {
    let outputMatrix = []

    for(let i = 0; i < mask.matrix.length; i+=4) {
        outputMatrix.push(i);
    }


}*/


//filterImage([])

export async function filterImage(imageMatrix : number[] ) {  
  //  writeTmpFile(imageMatrix)


  
    //console.log(imageMatrix)

    let base = await readPNGImage(__dirname + "/images/tmp/logo.png") 

    //console.log("base: ",base.matrix)



    
    let matrix  =  parseImageToGrayscale( base)

    await writeImageToPNGFile( matrix, __dirname + "/images/tmp/logoGrayscale.png" ) 
    let newMatrix = readPNGImage(__dirname + "/images/tmp/logoGrayscale.png")

  //  return newMatrix
    return newMatrix;

 //   console.log(matrix)


  //  await writeImageToPNGFile(imageMatrix, "./backend/src/kaykay.png")

  //  let rowMask = {rows: 3, cols: 3, matrix: [ 0,-1,0,0,-1,0,0,-1,0]}
  //  let columnMask = {rows: 3, cols: 3, matrix: [0,0,0,-1,-1,-1,0,0,0]}
    
   /* let a : Mask = cnnFilter(imageMatrix, rowMask, 1)
    let b : Mask = cnnFilter(imageMatrix, columnMask, 2)

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

function cnnFilter(m1: Mask, filter : Mask, value : number) : Mask {
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

    return new Mask(m2Rows, m2Cols, m2Matrix)
}


function parseImageToGrayscale(data : Mask) : Mask {
    let {rows, cols, matrix} = data;


  //  let rgba : number[][] = [[],[],[],[]];
    let grayscale : number[] = [];

    for(let row = 0; row < rows; row++) {
        let s : string = "";

        for(let col = 0; col < cols; col++) {
            //bitshift <<2 == * 4
            let idx = (row * cols + col) << 2

          //  for(let i = 0; i < 4; i++) {
          //      rgba[i].push(matrix[idx+i])
          //  }

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


///THE #1 QUESTION WE SHOULD ASK INTERNS - what does CALLBACK HELL mean to YOU?

convolutionFilterImageTest();

async function convolutionFilterImageTest() {

    for(let size = 1; size < 6; size++) {
        for(let stride = 1; stride < 6; stride++) {
            let base = await readPNGImage(__dirname + "/images/static/test2.png") 
            
            let matrix  =  parseImageToGrayscale( base)

            let newMatrix = [];

          //  console.log("HI", matrix.cols, matrix.rows, matrix.matrix.length, matrix.cols * matrix.rows)

            for(let i = 0; i < matrix.matrix.length; i+=4) {
                newMatrix.push(matrix.matrix[i]);
            }

            matrix.matrix = newMatrix
            
            let convolvedMatrix = matrix; 
            convolvedMatrix = convolveMask(matrix, size, stride);

            //console.log(convolvedMatrix.matrix.length, convolvedMatrix.rows, convolvedMatrix.cols)
            //console.log(matrix.matrix.length)


            await writeImageToPNGFile( convolvedMatrix, __dirname + "/images/convolutionTest/test001/" + randomHash(2) + "_" + size + "_" + stride + "_.png" ) 
        }
    }
   // let newMatrix = readPNGImage(__dirname + "/images/tmp/logoGrayscale.png")
}

//createRectangleImages(2)

function createTestImage(filesNeeded: number) {
    for(let _i = 0; _i < filesNeeded; _i++)
    {
        let height = 500;
        let width = 500;

        let grid = [];

        for(let row = 0; row < height; row++) {
            for(let col = 0; col < width; col++) {
                grid.push(0)
            }
        }

        let rectangleCount = randRangeInclusive(0,40);
        let rotation = 0


        for(let r = 0; r < rectangleCount; r++) {

            let rectangleWidth = randRangeInclusive(20, 40);
            let rectangleHeight = randRangeInclusive(30,45);

            let position = {x : randInt(width - rectangleWidth) + rectangleWidth/2, y : randInt(height - rectangleHeight) }
            console.log(position, " is the position")

            let vertices = [
                [position.x - rectangleWidth/2, position.y - rectangleHeight/2],
                [position.x + rectangleWidth/2, position.y - rectangleHeight/2],
                [position.x + rectangleWidth/2, position.y + rectangleHeight/2],
                [position.x - rectangleWidth/2, position.y + rectangleHeight/2]
            ]

            let rotation = 35;
            let rotationMatrix = [ Math.cos(rotation), -1 * Math.sin(rotation), Math.sin(rotation), Math.cos(rotation)]


            let color = [randInt(255), randInt(255), randInt(255)]

            for(let index = 0; index < vertices.length; index++) {
                let v0 = vertices[index];
                let v1 = vertices[(index + 1) % vertices.length];

                let dx = v1[0] - v0[0];
                let dy = v1[1] - v0[1];

                let slope = Number.MAX_VALUE;

                if(dx !== 0) {
                    slope = dy / dx;
                }

                //use X
                if(slope < 1 && slope > -1) {
                    let px = v0[0];
                    let py = v0[1];

                    if(dx > 0) {
                        while(px < v1[0]) {
                            let rotatedPoint : {x:number, y:number} = applyRotationMatrix( {x:px+.5,y:py+.5}, rotation)
                            let roundedX = Math.floor(rotatedPoint.x);
                            let roundedY = Math.floor(rotatedPoint.y);
                            py += slope;
                            px += 1;

                            console.log(roundedX, roundedY)

                            grid[roundedY * width + roundedX] = color
                        }
                    } else {
                        while(px > v1[0]) {
                            let rotatedPoint : {x:number, y:number} = applyRotationMatrix( {x:px+.5,y:py+.5}, rotation)
                            let roundedX = Math.floor(rotatedPoint.x);
                            let roundedY = Math.floor(rotatedPoint.y);

                        //  console.log(rotatedPoint)
                            py -= slope;
                            px -= 1;
                            grid[roundedY * width + roundedX] = color
                        }       
                    }

                } else {
                    let invertedSlope = dx / dy;

                    let px = v0[0];
                    let py = v0[1];

                    if(dy > 0) {
                        while(py < v1[1]) {
                            let rotatedPoint : {x:number, y:number} = applyRotationMatrix( {x:px+.5,y:py+.5}, rotation)
                            let roundedX = Math.floor(rotatedPoint.x);
                            let roundedY = Math.floor(rotatedPoint.y);
                            py += 1;
                            px += invertedSlope;


                            grid[roundedY * width + roundedX] = color
                        }
                    } else {
                        while(py > v1[1]) {
                            let rotatedPoint : {x:number, y:number} = applyRotationMatrix( {x:px+.5,y:py+.5}, rotation)
                            let roundedX = Math.floor(rotatedPoint.x);
                            let roundedY = Math.floor(rotatedPoint.y);
                            py -= 1;
                            px -= invertedSlope;
                            grid[roundedY * width + roundedX] = color
                        }       
                    }
                }
            }
        }

    // console.log(grid)
    /*        for(let x = 0; x < rectangleWidth; x++) {
                let yVector = 0 + position.y;
                let xVector = x + position.x;
                let translationX = 0;
                let translationY = 0;
                
                let X = Math.floor( xVector * rotationMatrix[0] + yVector * rotationMatrix[1] + .5 )
                let Y = Math.floor( xVector * rotationMatrix[2] + yVector * rotationMatrix[3] + .5 )

                yVector += rectangleHeight
                let Y2 = Math.floor( xVector * rotationMatrix[2] + yVector * rotationMatrix[3] + .5 )


            //   Y = (position.y + rectangleHeight) * Math.sin(rotation)
                
                grid[Y * width + X] = 255
                grid[Y2 * width + X] = 255
            }

            for(let y = 0; y < rectangleHeight; y++) {
                let yVector = y + position.y;
                let xVector = 0 + position.x;
                let translationX = 0;
                let translationY = 0;
                
                let X = Math.floor( xVector * rotationMatrix[0] + yVector * rotationMatrix[1] + .5 )
                let Y = Math.floor( xVector * rotationMatrix[2] + yVector * rotationMatrix[3] + .5 )

                xVector += rectangleWidth
                let Y2 = Math.floor( xVector * rotationMatrix[2] + yVector * rotationMatrix[3] + .5 )


                
                grid[Y * width + X] = 255
                grid[Y2 * width + X] = 255
            }

            */


        /*   let rotationMatrix = [ Math.cos(rotation), -1 * Math.sin(rotation), Math.sin(rotation), Math.cos(rotation)]
        

            let yVector = 25;
            let xVector  = 25;  
            
            let X = Math.floor( xVector * rotationMatrix[0] + yVector * rotationMatrix[1] + .5 )
            let Y = Math.floor( xVector * rotationMatrix[2] + yVector * rotationMatrix[3] + .5 )

            Y += 100;
            X += 100;
            yVector += 100;
            xVector += 100;

            console.log(X, Y, xVector, yVector)

            grid[Y * width + X] = 128
            grid[yVector * width + xVector] = 256




        //   grid[Y * width + X] = 128
            grid[yVector * width + xVector] = 256

            yVector = 50;
            xVector  = 25;

            X = Math.floor( xVector * rotationMatrix[0] + yVector * rotationMatrix[1] + .5 )
            Y = Math.floor( xVector * rotationMatrix[2] + yVector * rotationMatrix[3] + .5 )

            Y += 100;
            X += 100;
            yVector += 100;
            xVector += 100;


            console.log(X, Y, xVector, yVector)
    console.log()
            grid[Y * width + X] = 128

            grid[yVector * width + xVector] = 256

        /*  for(let y = 0; y < rectangleHeight; y++) {
                grid[(position.y+y) * width + position.x ] = 255
                grid[(position.y+y) * width + position.x + rectangleWidth] = 255
            }*/

        // grid[0] = 255
        //}

        let mask : Mask = new Mask(height, width, grid, MaskType.GrayscaleMask)

        writeImageToPNGFile(grayscaleToRGBA(verticalInversion(mask)), __dirname + "/images/trainingdata/" + randomHash(10) + + "__" + rectangleCount + ".png")
    }
}

function randomHash(length : number, alphabet : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
    let hash = "";

    for(let index = 0; index < length; index++) {
        hash += alphabet[randInt(alphabet.length)]
    }
    return hash
}

function applyRotationMatrix(point : {x : number, y : number}, rad : number) : {x : number, y : number} {
    let rotationMatrix = [ Math.cos(rad),     -Math.sin(rad), 
                           Math.sin(rad),      Math.cos(rad)]


    let X = Math.floor( point.x * rotationMatrix[0] + point.y * rotationMatrix[1] + .5 )
    let Y = Math.floor( point.x * rotationMatrix[2] + point.y * rotationMatrix[3] + .5 )

    X = point.x;
    Y = point.y;
    return {x: X, y: Y};
}

function verticalInversion(mask : Mask ) {
    //Iterate through half the rows and swap every element vertically
    for(let row = 0; row < mask.rows/2; row++) {
        for(let col = 0; col < mask.cols; col++) {
            let tmp = mask.matrix[row*mask.cols+col];
            mask.matrix[row*mask.cols+col] = mask.matrix[(mask.rows-row-1)*mask.cols+col]
            mask.matrix[(mask.rows-row-1)*mask.cols+col] = tmp;
        }
    }

    return mask;
}

function horizontalInversion(mask : Mask ) {
    //Iterate through half the rows and swap every element vertically
    for(let col = 0; col < mask.cols/2; col++) {
        for(let row = 0; row < mask.rows; row++) {
            let tmp = mask.matrix[row*mask.cols+col];
            mask.matrix[row*mask.cols+col] = mask.matrix[(row)*mask.cols+(mask.cols-col-1)]
            mask.matrix[(row)*mask.cols+(mask.cols-col-1)] = tmp;
        }
    }

    return mask;
}

function randInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randRangeInclusive(min, max) {
    return min + randInt(max - min) + 1;
}


interface Vec3 {
    x : number;
    y : number;
    z : number;
}

interface Vec2 {
    x : number;
    y : number;
}

interface Rectangle {
    position : Vec2;
    length : number;
    width : number;
    rotation : number;
}