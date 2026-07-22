import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { extname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
};

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                output[key] = source[key];
            }
        });
    }
    
    return output;
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Load and merge data files
 */
function loadData(rootDir) {
    const publicDataPath = join(rootDir, 'data.json');
    const privateDataPath = join(rootDir, 'data.private.json');
    
    const publicData = JSON.parse(readFileSync(publicDataPath, 'utf-8'));
    
    if (existsSync(privateDataPath)) {
        console.log('✓ Found private data file, merging...');
        const privateData = JSON.parse(readFileSync(privateDataPath, 'utf-8'));
        return { data: deepMerge(publicData, privateData), hasPrivate: true };
    } else {
        console.log('ℹ No private data file found, using public data only');
        return { data: publicData, hasPrivate: false };
    }
}

function findAvailablePort(startPort = 3000) {
    return new Promise((resolve, reject) => {
        const server = createServer();
        server.listen(startPort, () => {
            const { port } = server.address();
            server.close(() => resolve(port));
        });
        server.on('error', () => {
            resolve(findAvailablePort(startPort + 1));
        });
    });
}

function startServer(rootDir, mergedData, port) {
    return new Promise((resolve, reject) => {
        const server = createServer((req, res) => {
            // Intercept data.json requests and return merged data
            if (req.url === '/data.json') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(mergedData));
                return;
            }
            
            let filePath = join(rootDir, req.url === '/' ? 'index.html' : req.url);
            
            if (!existsSync(filePath)) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            
            const ext = extname(filePath);
            const contentType = mimeTypes[ext] || 'text/plain';
            
            try {
                const content = readFileSync(filePath);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            } catch (err) {
                res.writeHead(500);
                res.end('Server error');
            }
        });
        
        server.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
            resolve(server);
        });
        
        server.on('error', reject);
    });
}

async function generatePDF() {
    console.log('🚀 Starting PDF generation...');
    
    const rootDir = join(__dirname, '..');
    const { data: mergedData, hasPrivate } = loadData(rootDir);
    const outputFilename = hasPrivate ? 'cv_florian_handke_private.pdf' : 'cv_florian_handke.pdf';
    
    console.log(`📄 Output: ${outputFilename}`);
    
    const port = await findAvailablePort(3001);
    const server = await startServer(rootDir, mergedData, port);
    
    let browser;
    
    try {
        browser = await chromium.launch();
        const page = await browser.newPage();
        
        // Navigate to the CV HTML file via HTTP
        await page.goto(`http://localhost:${port}/cv.html`, {
            waitUntil: 'networkidle'
        });
        
        // Wait for the content to be loaded by checking for a specific element
        await page.waitForSelector('.cv-header', { timeout: 10000 });
        await page.waitForSelector('.timeline-item', { timeout: 10000 });
        
        // Wait a bit more to ensure all content is rendered
        await page.waitForTimeout(1000);
        
        // Generate PDF
        await page.pdf({
            path: join(__dirname, '..', 'assets', 'pdf', outputFilename),
            format: 'A4',
            printBackground: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        });
        
        console.log(`✅ PDF generated successfully: assets/pdf/${outputFilename}`);
    } finally {
        if (browser) {
            await browser.close();
        }
        server.close();
    }
}

generatePDF().catch(console.error);
