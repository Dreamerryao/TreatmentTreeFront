import {useCallback, useMemo, useState} from "react";


//region stat
const datasetList = {
    'MIMIC-IV': 16000
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
