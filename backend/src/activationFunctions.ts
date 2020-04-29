export default class ActivationFunctions {
    binaryStep = ( val, threshold ) => {
        if(val > threshold) {
            return 1;
        }

        return 0;
    }

    reLu = ( x ) => {
        return Math.max( x, 0 )
    }

    tanh = ( x ) => {
        return 2 * this.logisticSigmoid(2 * x) - 1;
    }

    logisticSigmoid = ( val ) => {
        return ( Math.pow( Math.E , val ) / ( 1 + Math.pow( Math.E, val ) ) ) 
    }

}