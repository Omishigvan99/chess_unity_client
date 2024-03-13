export const useMultiRef = (initialValue) => {
    let currentRefs = [];
    // creating refs as set so that refs are not duplicated
    let refs = new Set(currentRefs);

    // returns list of refs
    function getRefs() {
        if (initialValue && refs.size === 0) {
            return initialValue;
        } else if (document === undefined) {
            console.error("useMultiRef is not available on server side");
            return Array.from(refs);
        } else {
            return Array.from(refs).filter((ref) => {
                return document.contains(ref);
            });
        }
    }

    // adding refs to list
    function addRef(ref) {
        if (ref) {
            refs.add(ref);
        }
    }

    return [getRefs, addRef];
};
