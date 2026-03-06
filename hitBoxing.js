export default function hitBoxing(objectA, objectB, padingA = 6 , padingB = 6) {
    const colitionsA = []
    const colitionsB = []
    objectA.forEach((A, indexA) => {
        const hitBoxA = {
            x: A.x - padingA,
            y: A.y - padingA,
            width: A.width + (padingA * 2),
            height: A.height + (padingA * 2)
        }
        objectB.forEach((B, indexB) => {
            const hitBoxB = {
                x: B.x - padingB,
                y: B.y - padingB,
                width: B.width + (padingB * 2),
                height: B.height + (padingB * 2)
            }    
            const validations = [
                hitBoxA.y < hitBoxB.y + hitBoxB.height,
                hitBoxA.y > hitBoxB.y,
                hitBoxA.x > hitBoxB.x,
                hitBoxA.x < hitBoxB.x + hitBoxB.width,
            ]
            if (validations.reduce((acc, val) => acc && val, true)) {
                colitionsA.push(indexA);
                colitionsB.push(indexB);
            };
        })
    });
    return {
        A: colitionsA,
        B: colitionsB
    };
}