import { useEffect, useState } from 'react';
import { loadHistory } from '../services/history';

const HistoryPage = () => {
	const [items, setItems] = useState([]);

	useEffect(() => {
		setItems(loadHistory());
	}, []);

	return (
		<section className="p-8">
			<h2 className="text-2xl font-orbitron">Scan History</h2>
			{items.length === 0 ? (
				<p className="mt-4 text-gray-400">No scans yet. Run a scan to see history here.</p>
			) : (
				<div className="mt-6 space-y-3">
					{items.map((it) => (
						<div key={it.id} className="flex items-center justify-between rounded border border-gray-700 bg-gray-800 px-4 py-3">
							<div>
								<p className="font-mono text-sm text-gray-200">{it.url}</p>
								<p className="text-xs text-gray-400">{new Date(it.timestamp).toLocaleString()}</p>
							</div>
							<div className="flex gap-2 text-xs">
								<span className="rounded-full bg-red-900/30 px-2 py-0.5 text-red-300">High: {it.counts?.high || 0}</span>
								<span className="rounded-full bg-orange-900/30 px-2 py-0.5 text-orange-300">Medium: {it.counts?.medium || 0}</span>
								<span className="rounded-full bg-green-900/30 px-2 py-0.5 text-green-300">Low: {it.counts?.low || 0}</span>
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
};

export default HistoryPage;
