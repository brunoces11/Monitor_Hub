import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const syncDir = path.resolve(rootDir, process.env.SYNC_DIR || './sync');
const distDir = path.resolve(rootDir, 'dist');
const port = Number(process.env.PORT || 3000);
const defaultVpsMonitor = {
  schema_version: 1,
  title: 'Server Monitor',
  updated_at: null,
  refresh_interval_ms: Number(process.env.MONITOR_INTERVAL_MS || 15000),
  columns: [
    { key: 'service_name', label: 'SERVICE NAME' },
    { key: 'state', label: 'STATE' },
    { key: 'cpu', label: 'CPU' },
    { key: 'mem', label: 'MEM' },
    { key: 'mem_percent', label: 'MEM%' },
    { key: 'uptime', label: 'UPTIME' },
  ],
  services: [],
  totals: null,
};
const defaultServiceMonitor = {
  schema_version: 1,
  title: 'API Monitor',
  updated_at: null,
  refresh_interval_ms: Number(process.env.MONITOR_INTERVAL_MS || 15000),
  columns: [
    { key: 'service_name', label: 'SERVICE NAME' },
    { key: 'stats', label: 'STATS' },
    { key: 'last_check', label: 'LAST CHECK' },
  ],
  services: [],
};

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

async function ensureSyncStructure() {
  await fs.ensureDir(syncDir);
  await fs.ensureDir(path.join(syncDir, 'videos'));
  await fs.ensureDir(path.join(syncDir, 'thumbs'));

  const vpsMonitorPath = path.join(syncDir, 'vps_monitor.json');
  if (!(await fs.pathExists(vpsMonitorPath))) {
    await fs.writeJson(vpsMonitorPath, defaultVpsMonitor, { spaces: 2 });
  }

  const serviceMonitorPath = path.join(syncDir, 'service_monitor.json');
  if (!(await fs.pathExists(serviceMonitorPath))) {
    await fs.writeJson(serviceMonitorPath, defaultServiceMonitor, { spaces: 2 });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'monitor-hub-api', timestamp: new Date().toISOString() });
});

app.get('/api/sync/vps-monitor', async (_req, res) => {
  const filePath = path.join(syncDir, 'vps_monitor.json');
  const data = (await fs.pathExists(filePath))
    ? await fs.readJson(filePath)
    : defaultVpsMonitor;
  res.json(data);
});

app.get('/api/sync/service-monitor', async (_req, res) => {
  const filePath = path.join(syncDir, 'service_monitor.json');
  const data = (await fs.pathExists(filePath))
    ? await fs.readJson(filePath)
    : defaultServiceMonitor;
  res.json(data);
});

app.get('/api/sync/videos', async (_req, res) => {
  const dir = path.join(syncDir, 'videos');
  const files = (await fs.pathExists(dir)) ? await fs.readdir(dir) : [];
  const videos = await Promise.all(
    files.filter((file) => file.endsWith('.json')).map(async (file) => fs.readJson(path.join(dir, file)))
  );
  res.json({ items: videos });
});

app.get('/api/sync/videos/:id', async (req, res) => {
  const filePath = path.join(syncDir, 'videos', `${req.params.id}.json`);
  if (!(await fs.pathExists(filePath))) {
    return res.status(404).json({ error: 'video_not_found' });
  }
  res.json(await fs.readJson(filePath));
});

app.get('/api/sync/thumbs', async (_req, res) => {
  const dir = path.join(syncDir, 'thumbs');
  const files = (await fs.pathExists(dir)) ? await fs.readdir(dir) : [];
  const thumbs = await Promise.all(
    files.filter((file) => file.endsWith('.json')).map(async (file) => fs.readJson(path.join(dir, file)))
  );
  res.json({ items: thumbs });
});

app.get('/api/sync/thumbs/:id', async (req, res) => {
  const filePath = path.join(syncDir, 'thumbs', `${req.params.id}.json`);
  if (!(await fs.pathExists(filePath))) {
    return res.status(404).json({ error: 'thumb_not_found' });
  }
  res.json(await fs.readJson(filePath));
});

app.post('/api/sync/sheets', (_req, res) => {
  res.status(501).json({ error: 'not_implemented_yet' });
});

app.post('/api/sync/drive', (_req, res) => {
  res.status(501).json({ error: 'not_implemented_yet' });
});

if (await fs.pathExists(distDir)) {
  app.use(express.static(distDir));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' });
});

await ensureSyncStructure();

app.listen(port, () => {
  console.log(`Monitor Hub API running on http://localhost:${port}`);
});
