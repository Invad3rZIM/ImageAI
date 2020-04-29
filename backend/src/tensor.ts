import {Mask, MaskType } from "./mask";


export class Tensor {
    rows: number;
    cols: number;
    depth: number;
    data: number[][];
    tensorType: TensorType;

    public constructor(rows : number, cols: number, depth: number, data : number[][], tensorType : TensorType = TensorType.Any) {
        this.rows = rows;
        this.cols = cols;
        this.depth = depth;
        this.data = data;
        this.tensorType = tensorType;
    }

    //returns the matrix transpose
    public T() : Tensor {
        let data : number[][] = [];

        for(let col = 0; col < this.cols; col++) {
            for(let row = 0; row < this.rows; row++) {
                let val : number[] = this.data[(row * this.cols + col)]
                data.push(val);
            }
        }

        return new Tensor(
            this.cols,
            this.rows,
            this.depth,
            data,
            this.tensorType
        )
    }

    //convert RGBA or RGB into grayscale mask.
    public toGrayscaleImageMask() : Mask {
        let rows = this.rows;
        let cols = this.cols;

        let data = [];

        for(let index = 0; index < this.data.length; index++) {
            let vector = this.data[index];
            
            let G = rgbToGrayscale(vector[0], vector[1], vector[2])
            data.push(G);
        }

    return new Mask(rows, cols, data, MaskType.Grayscale)
    }

    public S(coefficient : number) : Tensor {
        let newTensorMatrix : number[][] = [];

        for(let index = 0; index < this.data.length; index++) {
            let data : number[] = [];

            for(let dimension = 0; dimension < this.data[index].length; dimension++) {
                data.push(this.data[index][dimension] * coefficient)
            }

            newTensorMatrix.push(data);
        }
        return new Tensor(this.rows, this.cols, this.depth, newTensorMatrix, this.tensorType);
    }
}

export enum TensorType {
    Any = 0,
    Image = 10,
    RGB = 11,
    RGBA = 12
}


function rgbToGrayscale(R : number, G : number, B : number) {
    return   ( (0.3 * R) + (0.59 * G) + (0.11 * B) )
}

