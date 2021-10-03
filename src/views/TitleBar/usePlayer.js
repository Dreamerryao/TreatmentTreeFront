/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {useCallback, useMemo, useState} from "react";


//region stat
const datasetList = {
    'MIMIC-IV': 16000
}

const initialRecord = {
    'MIMIC-IV': ['gender,0.000000,mechvent,1.000000,max_dose_vaso,0.000000,re_admission,0.000000,age,79.000000,Weight_kg,63.500000,GCS,15.000000,HR,64.000000,SysBP,92.428571,MeanBP,86.400000,DiaBP,60.666667,RR,17.500000,Temp_C,36.777778,FiO2_1,0.500000,Potassium,4.600000,Sodium,134.000000,Chloride,104.000000,Glucose,138.000000,Magnesium,2.300000,Calcium,8.800000,Hb,11.500000,WBC_count,3.100000,Platelets_count,125.000000,PTT,132.000000,PT,15.700000,Arterial_pH,7.430000,paO2,69.000000,paCO2,44.000000,Arterial_BE,-4.000000,HCO3,26.000000,Arterial_lactate,1.500000,SOFA,7.000000,SIRS,1.000000,Shock_Index,0.692427,PaO2_FiO2,138.000000,cumulated_balance,-9147.094950,SpO2,91.000000,BUN,87.000000,Creatinine,1.700000,SGOT,27.000000,SGPT,17.000000,Total_bili,5.011826,INR,1.000000,input_total,11369.905050,input_4hourly,0.000000,output_total,20517.000000,output_4hourly,225.000000']
}
//endregion

//region utils
const sameArray = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    arr1.sort();
    arr2.sort();
    return JSON.stringify(arr1) === JSON.stringify(arr2);
};
const isSame = (a, b) => {
    if (a === null || b === null) return a === b;
    if (typeof a === 'object' && typeof b === 'object') return sameArray(a, b);
    return a === b;
};
//endregion

const useCache = (defaultValue) => {
    // c for current, t for temporary, n for new, o for origin
    const [c, setC] = useState(defaultValue);
    const [t, setT] = useState(null);
    const n = useMemo(() => (t !== null) ? t : c, [t, c]);
    const isModified = useMemo(() => t !== null, [t]);
    const submit = useCallback(() => {
        if (t === null) return;
        setC(t);
        setT(null);
    }, [t]);
    const set = useCallback(n => {
        setT(oT => {
            if (n === null) return null;
            if (isSame(n, oT)) return oT;
            if (isSame(n, c)) return null;
            return n;
        });
    }, [c]);
    return [n, set, isModified, submit];
};

const usePlayer = (store, recordsIndex) => {
    // m for is modified, a for all
    // d for dataset, p for player, o for opponents
    const [d, setD, mD, submitD] = useCache(0);
    const [r, setR, mR, submitR] = useCache(0);

    console.log('refresh usePlayer')

    const aD = useMemo(() => Object.keys(datasetList), []);
    const aR = recordsIndex[aD[d]] !== null ? recordsIndex[aD[d]].map(s => 'gender: ' + s.gender + ', age: ' + s.age + ', weight: ' + s.weight).slice(0, 10) : [''];

    const onCancel = useCallback(() => {
        setD(null);
        setR(null);
    }, [setD, setR]);
    const onSubmit = useCallback(() => {
        store.initData(aD[d], r);
        submitD();
        submitR();
    }, [aD, aR, d, r, submitD, submitR]);
    const isModified = useMemo(() => mD || mR, [mD, mR]);

    const setDataset = useCallback(({target: {value: nD}}) => {
        setD(nD);
    }, [setD]);

    const setInitialRecord = useCallback(({target: {value: nR}}) => {
        setR(nR);
    }, [setR]);

    return {
        onCancel, onSubmit,
        dataset: d, initialRecord: r,
        allDataset: aD, allInitialRecord: aR,
        setDataset, setInitialRecord,
        isModified,
    };
};

export default usePlayer;
