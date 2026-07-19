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

function startServer(rootDir, port) {
    return new Promise((resolve, reject) => {
        const server = createServer((req, res) => {
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
    console.log('Starting PDF generation...');
    
    const rootDir = join(__dirname, '..');
    const port = await findAvailablePort(3001);
    const server = await startServer(rootDir, port);
    
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
            path: join(__dirname, '..', 'assets', 'pdf', 'cv_florian_handke.pdf'),
            format: 'A4',
            printBackground: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        });
        
        console.log('PDF generated successfully: assets/pdf/cv_florian_handke.pdf');
    } finally {
        if (browser) {
            await browser.close();
        }
        server.close();
    }
}

generatePDF().catch(console.error);
