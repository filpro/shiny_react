import IData from '../utils/IData';

export default interface Mtcars extends IData {
    am: number;
    carb: number;
    cyl: number;
    disp: number;
    drat: number;
    gear: number;
    hp: number;
    mpg: number;
    qsec: number;
    vs: number;
    wt: number;
}
