const { parse } = require('csv-parse');
const fs = require('fs');

function isHabitablePlanet(planet) {
	return planet['koi_disposition'] === 'CONFIRMED'
		&& planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
		&& planet['koi_prad'] < 1.6;
}


const habitablePlanets = [];
fs.createReadStream('cumulative_2024.12.10_10.30.30.csv')
	.pipe(parse({
		comment: '#',
		columns: true,
	}))
	.on('data', (data) => {
		if (isHabitablePlanet(data)) {
			habitablePlanets.push(data);
		}
	})
	.on('error', (err) => {
		console.log(err);
	})
	.on('end', () => {
		console.log(habitablePlanets.map((planet) => {
			return planet['kepler_name'];
		}))
		console.log(`The habitable planets is: ${habitablePlanets.length}`);
	})