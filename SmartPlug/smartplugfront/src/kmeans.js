export const kmeans = (data, clusterCount) => {
    let clusters = [];
    let centroids = [];
    let oldCentroids = [];
    let changed = false;

    for (let i = 0; i < clusterCount; i++) {
        clusters[i] = [];
    }

    for (let i = 0; i < clusterCount; i++) {
        let random = Math.floor((Math.random() * (data.length - 1)));
        centroids[i] = data[random];
    }

    do {
        for (let j = 0; j < clusterCount; j++) {
            clusters[j] = [];
        }
        changed = false;

        for (let i = 0; i < data.length; i++) {
            let distance = -1;
            let oldDistance = -1
            let newGroup;

            for (let j = 0; j < clusterCount; j++) {
                distance = Math.sqrt(Math.pow(centroids[j].average - data[i].average, 2));
                if (oldDistance === -1) {
                    newGroup = j;
                    oldDistance = distance;
                } else if (distance <= oldDistance) {
                    newGroup = j;
                    oldDistance = distance;
                }
            }

            clusters[newGroup].push(data[i]);
        }

        oldCentroids = centroids;
        for (let j = 0; j < clusterCount; j++) {

            let total = 0;
            let newCentroid = 0;

            for (let i = 0; i < clusters[j].length; i++) {
                total += clusters[j][i].average;
            }

            newCentroid = {average: total / clusters[j].length};
            centroids[j] = newCentroid;
        }

        for (let j = 0; j < clusterCount; j++) {
            if (centroids[j] !== oldCentroids[j]) {
                changed = true;
            }
        }
    } while (changed === true);

    return clusters;
}
