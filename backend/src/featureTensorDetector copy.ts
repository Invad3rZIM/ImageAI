import {Tensor} from "./tensor"

export default class FeatureTensorDetector {
    public constructor() {
    }

    /*
    public  convFilter = (m1: Tensor, filter : , threshhold : number) : Tensor => {
    let m2Rows : number = m1.rows - filter.rows + 1;
    let m2Cols : number = m1.cols - filter.cols + 1;   
    let m2Matrix : number[] = []

    for(let row = 0; row < m2Rows; row++) {
        for(let col = 0; col < m2Cols; col++){
            let dot = 0;

            for(let filterRow = 0; filterRow < filter.rows; filterRow++) {
                for(let filterCol = 0; filterCol < filter.cols; filterCol++) {
                    //dot = m1w1 + m2w2 + m3w3 + ... 
                    dot += filter.data[filterRow * filter.cols + filterCol] * 
                               m1.data[((row + filterRow) * m1.cols) + (col + filterCol)
                        ]
                }
            }

            if(dot > threshhold) { m2Matrix.push(dot)} else { m2Matrix.push(0)}
        }
    }


    return (new Mask(m2Rows, m2Cols, m2Matrix))
}
    public poolMask = (mask : Mask, size: number, poolingType : string = "max") : Mask => {
        let stride = size;
        let outputMatrix : number[] = []

        //copy data
        for(let index = 0; index < mask.data.length; index++) {
            outputMatrix.push(mask.data[index]);
        }

        for(let row = 0; row < mask.rows; row+= size) {
            for(let col = 0; col < mask.cols; col+=size) {
                let val = 0;

                if(poolingType == "min") {
                    val = Number.MAX_VALUE;
                }

                for(let r = 0; r < size; r++) {
                    for(let c = 0; c < size; c++) {
                        switch(poolingType) {
                            case "max": val = Math.max( outputMatrix[(row + r) * mask.cols + (col + c)], val); break;
                            case "min": val = Math.min( outputMatrix[(row + r) * mask.cols + (col + c)], val); break;
                            case "avg": val += outputMatrix[(row + r) * mask.cols + (col + c)]; break;
                            default: val = Math.max( outputMatrix[(row + r) * mask.cols + (col + c)], val); break;
                        }
                    }
                }

                if(poolingType == "avg") { val /= (size * size)}

                for(let r = 0; r < size; r++) {
                    for(let c = 0; c < size; c++) {
                        outputMatrix[(row + r) * mask.cols + (col + c)] = val;
                    }
                }
            }
        }

        let outputMask : Mask = new Mask(mask.rows, mask.cols, outputMatrix)

        return outputMask;
    }  
    public convolveMask = (mask : Mask, size : number, stride: number, padding: number = 0) : Mask =>  {
        let outputMatrix : number[] = []

        let rc = 0;
        let cc = 0;

        for(let row = 0; row < mask.rows - size + 1; row = row + stride) {
            rc++;

            for(let col = 0; col < mask.cols - size + 1; col = col + stride) {
                let sum = 0;

                if(rc == 1) {
                    cc +=1;
                }

                let index = 0;

                for(let r = 0; r < size; r = r + 1) {
                    for(let c = 0; c < size; c = c + 1) {
                        index = (row + r) * mask.cols + (col + c);
                        sum += mask.data[index]
                    } 
                }


                sum = sum / (size * size);

                outputMatrix.push(sum);
            }
        }

        let outputMask = new Mask(rc, cc, outputMatrix)

        return outputMask;
    }  
    */
}

function max(a, b) {
    if(a > b) {
        return a;
    }
    return b;
}
