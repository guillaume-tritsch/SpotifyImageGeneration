function getAvgValence() {
    APIInstance.getAllTopTrackFeature().then((trackArray) => {
        valenceTotal = 0
        for (let track of trackArray) {
            valenceTotal += track.valence;
        }

        console.log(valenceTotal / trackArray.length)
    })
}

function getAvgTempo() {
    APIInstance.getAllTopTrackFeature().then((trackArray) => {
        tempoTotal = 0
        for (let track of trackArray) {
            tempoTotal += track.tempo;
        }

        console.log(tempoTotal / trackArray.length)
    })
}

function getAvgDancability() {
    APIInstance.getAllTopTrackFeature().then((trackArray) => {
        total = 0
        for (let track of trackArray) {
            total += track.danceability;
        }

        console.log(total / trackArray.length)
    })
}

function getAvgEnergy() {
    APIInstance.getAllTopTrackFeature().then((trackArray) => {
        total = 0
        for (let track of trackArray) {
            total += track.energy;
        }

        console.log(total / trackArray.length)
    })
}
function getAvgInstrumentalness() {
    APIInstance.getAllTopTrackFeature().then((trackArray) => {
        total = 0
        for (let track of trackArray) {
            total += track.instrumentalness;
        }

        console.log(total / trackArray.length)
    })
}

APIInstance.isAllDataObtained().then(() => {
    console.log("AAAA")
    getAvgValence()
    getAvgTempo()
    getAvgDancability()
    getAvgEnergy()
    getAvgInstrumentalness()
})
