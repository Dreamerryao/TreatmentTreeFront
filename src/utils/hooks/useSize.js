import {useEffect, useMemo} from "react";

export default function useSizeWithDefaultSize(ref) {
    // console.log(ref)

    const [width, height] = !!ref.current ? [ref.current.clientWidth, ref.current.clientHeight] : [0, 0];

    return [width, height];
}