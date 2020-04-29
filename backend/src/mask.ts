export class Mask {
    rows: number;
    cols: number;
    data: number[];
    maskType: MaskType;

    public constructor(rows : number, cols: number, data , maskType : MaskType = MaskType.Any) {
        this.data = data;

        if(typeof data[0] == "object") {
            let arr : number[] = [];

            for(let row = 0; row < data.length; row++) {
                for(let col = 0; col < data[row].length; col++) {
                    arr.push(data[row][col]);
                }
            }

            this.data = arr;
        }
        this.rows = rows;
        this.cols = cols;
        this.maskType = maskType;
    }

    //returns the data transpose
    public _T() : Mask {
        let data : number[] = [];

        for(let col = 0; col < this.cols; col++) {
            for(let row = 0; row < this.rows; row++) {
                let val : number = this.data[row * this.cols + col]
                data.push(val);
            }
        }

        return new Mask(
            this.cols,
            this.rows,
            data,
            this.maskType
        )
    }

    public T() : Mask {
        let data : number[] = [];

        for(let col = 0; col < this.cols; col++) {
            for(let row = 0; row < this.rows; row++) {
                let val : number = this.data[row * this.cols + col]
                data.push(val);
            }
        }
        let cols = this.cols;
        let rows = this.rows;

        this.cols = rows;
        this.rows = cols;
        this.data = data;

        return this;
    }

    public normalize(scale : number = 1/255) : Mask {
        if(scale == -1) {
            let _max = 1;

            for(let index = 0; index < this.data.length; index++) {
                if(this.data[index] > _max) {
                    _max = this.data[index];
                }
            }

            for(let index = 0; index < this.data.length; index++) {
           //     this.data[index] = this.data[index] / _max;
            }
            return this;
        } else {
            this.scale(scale)

            return this;
        }
    }

    public invert() : Mask {
        return this;
    }

    public _scale(coefficient : number) : Mask {
        let data : number[] = [];

        for(let index = 0; index < this.data.length; index++) {
            data.push(this.data[index] * coefficient);
        }
        return new Mask(this.rows, this.cols, data, this.maskType);
    }

    public scale(coefficient : number) : Mask {
        let data : number[] = [];

        for(let index = 0; index < this.data.length; index++) {
            data.push(this.data[index] * coefficient);
        }
        this.data = data;


        return this;
    }
}

export enum MaskType {
    Any = 0,
    Image = 10,
    Grayscale = 11,
    Filter = 20,
}
