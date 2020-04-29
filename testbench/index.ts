import ImageIO from "../backend/src/imageIO";
import FeatureMaskDetector from "../backend/src/featureMaskDetector";

import {Mask, MaskType} from "../backend/src/mask";
import {Tensor} from "../backend/src/tensor";

main();

async function jpgTopng(filepath : string) {
    let io = new ImageIO();
    let a = await io.readJPGImage(__dirname + filepath);
    await io.writeImageToPNGFile(a,__dirname + filepath.substring(0,filepath.indexOf("."))+".png", true)
}

async function main() {
   // jpgTopng("/cat2.jpg");
    let io = new ImageIO();
    let fmd = new FeatureMaskDetector();

    let s = ["/cat.png", "/cat2.png"];
    let sthresholds=[50,0];

    for(let index = 0; index < s.length; index++) {
        let name = s[index].substring(0, s[index].indexOf("."));

        let a = await io.readPNGImage(__dirname + s[index]);
        
        let b : Mask = a.toGrayscaleImageMask()
        b.normalize();
        b.scale(255)
    // let c = a.T()
    //   console.log(y)

        let c = fmd.convolveMask(b, 10, 5, 2)

        let filter : number[][] =  [[-1, -1,  1,  1],
                                    [-1, -1,  1,  1],
                                    [-1, -1,  1,  1],
                                    [-1, -1,  1,  1]]
        let filterMask = new Mask(filter.length, filter[0].length, filter, MaskType.Filter)

        let threshold = sthresholds[index]

        let d = fmd.convFilter(b, filterMask, threshold)

        let e = fmd.convFilter(b, filterMask.T(), threshold)

        let f = fmd.convFilter(b, filterMask.T().scale(-1), threshold)

        let g = fmd.convFilter(b, filterMask.scale(-1), threshold)

        let h = fmd.convolveMask(g, 3, 3, 3)


        let filter2 : number[][] =  [[-1, 1, 1],
                                    [-1,-1, 1],
                                    [-1,-1,-1]];

        let filterMask2 = new Mask(filter2.length, filter2[0].length, filter2, MaskType.Filter)


        let i = fmd.convFilter(b, filterMask2, sthresholds[index])
        let j = fmd.convFilter(b, filterMask2.T(), sthresholds[index])

        let k = fmd.poolMask(b, 8, "max")
        let l = fmd.poolMask(b, 8, "min")
        let m = fmd.convolveMask(fmd.poolMask(b, 8, "avg"), 3,3,3)

        console.log(k)
        

        

        io.writeImageToPNGFile(a, __dirname + "/cattest/" + name +"/test.png", true)
        io.writeImageToPNGFile(b, __dirname + "/cattest/" + name +"/test2.png", true)
        io.writeImageToPNGFile(c, __dirname + "/cattest/" + name +"/test9.png", true)
        io.writeImageToPNGFile(d, __dirname + "/cattest/" + name +"/test4.png", true)
        io.writeImageToPNGFile(e, __dirname + "/cattest/" + name +"/test5.png", true)
        io.writeImageToPNGFile(f, __dirname + "/cattest/" + name +"/test6.png", true)
        io.writeImageToPNGFile(g, __dirname + "/cattest/" + name +"/test7.png", true)
        io.writeImageToPNGFile(h, __dirname + "/cattest/" + name +"/test8.png", true)
        io.writeImageToPNGFile(i, __dirname + "/cattest/" + name +"/test10.png", true)
        io.writeImageToPNGFile(j, __dirname + "/cattest/" + name +"/test11.png", true)
        io.writeImageToPNGFile(k, __dirname + "/cattest/" + name +"/test12.png", true)
        io.writeImageToPNGFile(l, __dirname + "/cattest/" + name +"/test13.png", true)
        io.writeImageToPNGFile(m, __dirname + "/cattest/" + name +"/test14.png", true)

        console.log(name)
    }
}