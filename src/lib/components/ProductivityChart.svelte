<script lang="ts">
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		Title,
		CategoryScale,
		Tooltip,
		Legend
	} from 'chart.js';

	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		Title,
		CategoryScale,
		Tooltip,
		Legend
	);
	let { labels, productivityPoints }: { labels: Date[]; productivityPoints: number[] } = $props();
	let chartObject: Chart;

	function chart(node: HTMLCanvasElement, data: number[]) {
		function setupChart(_data: number[]) {
			chartObject = new Chart(node, {
				type: 'line',
				data: {
					labels,
					datasets: [
						{
							label: 'Productivity points over time period',
							data: _data,
							tension: 0.3,
							borderWidth: 1,
							backgroundColor: 'rgba(184, 185, 210, .3)',
							borderColor: 'rgb(35, 26, 136)',
							borderCapStyle: 'butt',
							borderDashOffset: 0.0,
							borderJoinStyle: 'miter',
							pointBorderColor: 'rgb(205, 130,1 58)',
							pointBackgroundColor: 'rgb(255, 255, 255)',
							pointBorderWidth: 10,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: 'rgb(0, 0, 0)',
							pointHoverBorderColor: 'rgba(220, 220, 220,1)',
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10
						}
					]
				},
				options: {
					responsive: true,
					scales: {
						y: {
							title: {
								text: 'Points',
								display: true
							},
							beginAtZero: true
						},
						x: {
							title: {
								text: 'Date',
								display: true
							}
						}
					}
				}
			});
		}
		setupChart(data);
		return {
			destroy() {
				chartObject.destroy();
			}
		};
	}
</script>

<canvas use:chart={$state.snapshot(productivityPoints)}></canvas>
