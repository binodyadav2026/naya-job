
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

// Middleware for Visual Edits (Ported from dev-server-setup.js)
const visualEditsMiddleware = () => {
    return {
        name: 'visual-edits-middleware',
        configureServer(server) {
            // Helper to parse body
            server.middlewares.use(async (req, res, next) => {
                if (req.method === 'POST' && req.url === '/edit-file') {
                    const buffers = [];
                    for await (const chunk of req) {
                        buffers.push(chunk);
                    }
                    const data = Buffer.concat(buffers).toString();
                    try {
                        req.body = JSON.parse(data);
                    } catch (e) {
                        req.body = {};
                    }
                }
                next();
            });

            server.middlewares.use((req, res, next) => {
                const url = req.url.split('?')[0];

                // Health Check
                if (req.method === 'GET' && url === '/ping') {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
                    return;
                }

                // Visual Edit Endpoint
                if (url === '/edit-file') {
                    // CORS
                    const origin = req.headers.origin;
                    if (origin && (
                        origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/) ||
                        origin.match(/^https:\/\/([a-zA-Z0-9-]+\.)*emergent\.sh$/) ||
                        origin.match(/^https:\/\/([a-zA-Z0-9-]+\.)*emergentagent\.com$/) ||
                        origin.match(/^https:\/\/([a-zA-Z0-9-]+\.)*appspot\.com$/)
                    )) {
                        res.setHeader('Access-Control-Allow-Origin', origin);
                        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
                    }

                    if (req.method === 'OPTIONS') {
                        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
                        res.statusCode = 200;
                        res.end();
                        return;
                    }

                    if (req.method === 'POST') {
                        // Auth check
                        const key = req.headers['x-api-key'];
                        let SUP_PASS = null;
                        try {
                            const conf = fs.readFileSync("/etc/supervisor/conf.d/supervisord_code_server.conf", "utf8");
                            const match = conf.match(/PASSWORD="([^"]+)"/);
                            SUP_PASS = match ? match[1] : null;
                        } catch (e) { }

                        if (!SUP_PASS || key !== SUP_PASS) {
                            // res.statusCode = 401;
                            // res.setHeader('Content-Type', 'application/json');
                            // res.end(JSON.stringify({ error: "Unauthorized" }));
                            // return; 
                            // Note: For local dev, we might verify auth, but skipping strict check if file missing
                            if (fs.existsSync("/etc/supervisor/conf.d/supervisord_code_server.conf") && (!SUP_PASS || key !== SUP_PASS)) {
                                res.statusCode = 401;
                                res.end(JSON.stringify({ error: "Unauthorized" }));
                                return;
                            }
                        }

                        const { changes } = req.body || {};
                        if (!changes || !Array.isArray(changes) || changes.length === 0) {
                            res.statusCode = 400;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ error: "No changes provided" }));
                            return;
                        }

                        // We need to require the original logic or reimplement it.
                        // Since the logic is complex (AST traversal), we should import it if possible.
                        // But the original file uses `express` `res.json`.
                        // We can adapt or reuse the file by creating a mock res object?
                        // Or just rewrite the core logic?
                        // Using `require` on the existing file might fail if it depends on express types.
                        // Let's rely on the file existing being a JS module.

                        // IMPORTANT: For now, I will NOT implement the full AST editing in this quick migration script 
                        // as it requires 'express' dependencies in the original file.
                        // Use the existing 'dev-server-setup.js' if we can shim express.

                        res.statusCode = 501;
                        res.end(JSON.stringify({ error: "Visual edits not fully ported to Vite yet." }));
                        return;
                    }
                }
                next();
            });
        }
    }
}

// Babel Metadata Plugin (Start only)
// We need to check if we are in dev mode.
// Vite config function gives 'mode'.

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isDev = mode === 'development';

    return {
        plugins: [
            react({
                babel: {
                    plugins: [
                        // Add babel-metadata-plugin if in dev
                        ...(isDev ? [path.resolve(__dirname, 'plugins/visual-edits/babel-metadata-plugin.js')] : [])
                    ]
                }
            }),
            envCompatible(),
            visualEditsMiddleware()
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },


        server: {
            port: 3000,
            open: true,
        },
        build: {
            outDir: 'build',
        }
    };
});
