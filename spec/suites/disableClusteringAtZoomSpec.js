/* We need real delays to update group elements in the js event loop.
   Therefore I replaced the simulated clock.tick with async setTimeout
	 ('await (new Promise(resolve => setTimeout(resolve, 1000)));').
 */

describe('disableClusteringAtZoom option', function() {
	/////////////////////////////
	// SETUP FOR EACH TEST
	/////////////////////////////
	let div;
	let map;
	let group;

	beforeEach(function() {
		div = document.createElement('div');
		div.style.width = '200px';
		div.style.height = '200px';
		document.body.appendChild(div);
	
		map = L.map(div, { maxZoom: 18, trackResize: false });
	
		// Corresponds to zoom level 8 for the above div dimensions.
		map.fitBounds(new L.LatLngBounds([
			[1, 1],
			[2, 2]
		]));
	});

	afterEach(function() {
		group.clearLayers();
		map.removeLayer(group);
		map.remove();
		div.remove();

		div = null;
		map = null;
		group = null;
	});

	/////////////////////////////
	// TESTS
	/////////////////////////////
	it('unclusters at zoom level equal or higher', async function() {
		this.timeout(3000);
		let maxZoom = 15;

		group = new L.MarkerClusterGroup({
			disableClusteringAtZoom: maxZoom
		});

		group.addLayers([
			new L.Marker([1.5, 1.5]),
			new L.Marker([1.5, 1.5])
		]);
		map.addLayer(group);

		expect(group._maxZoom).to.equal(maxZoom - 1);

		expect(map._panes.markerPane.childNodes.length).to.equal(1); // 1 cluster.

		map.setZoom(14);
		await (new Promise(resolve => setTimeout(resolve, 1000)));
		expect(map._panes.markerPane.childNodes.length).to.equal(1); // 1 cluster.

		map.setZoom(15);
		await (new Promise(resolve => setTimeout(resolve, 1000)));
		expect(map._panes.markerPane.childNodes.length).to.equal(2); // 2 markers.
	});
});
