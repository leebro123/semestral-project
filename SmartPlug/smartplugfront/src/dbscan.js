let dataset;
let epsilon;
let minPts;

let clusters;
let noise;

let datasetLength;
let visitedPointsMap;
let assignedPointsMap;

export const runDBSCAN = (data, epsilonRange, minPoints) => {
    clusters = [];
    noise = [];
    dataset = data;
    epsilon = epsilonRange;
    minPts = minPoints;
    datasetLength = dataset.length
    visitedPointsMap = [];
    assignedPointsMap = [];

    for (let pointId = 0; pointId < datasetLength; pointId++) {
        if (visitedPointsMap[pointId] !== 1) {
            const neighbors = getPointsInEpsilonRange(pointId);

            if (neighbors.length < minPts) {
                noise.push(dataset[pointId]);
            } else {
                const clusterId = clusters.length;
                clusters.push([]);

                addPointToCluster(pointId, clusterId);
                expandCluster(neighbors, clusterId);
            }
        }
    }

    return {clusters: clusters, noise: noise};
};

const expandCluster = (neighbors, clusterId) => {
    for (let i = 0; i < neighbors.length; i++) {
        let pointId = neighbors[i];

        if (visitedPointsMap[pointId] !== 1) {
            const neighbors2 = getPointsInEpsilonRange(pointId);

            if (neighbors2.length >= minPts) {
                neighbors = neighbors.concat(neighbors2);
            }
        }

        if (assignedPointsMap[pointId] !== 1) {
            addPointToCluster(pointId, clusterId);
        }
    }
};

const addPointToCluster = (pointId, clusterId) => {
    clusters[clusterId].push(dataset[pointId]);
    assignedPointsMap[pointId] = 1;
};

const getPointsInEpsilonRange = (pointId) => {
    visitedPointsMap[pointId] = 1;
    let points = [];

    for (let id = 0; id < datasetLength; id++) {
        const distance = getEuclideanDistance(dataset[pointId].average, dataset[id].average);

        if (distance < epsilon) {
            points.push(id);
        }
    }

    return points;
};


const getEuclideanDistance = (first, second) => {
    return Math.sqrt((first - second) * (first - second));
};

