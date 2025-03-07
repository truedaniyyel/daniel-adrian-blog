import fs from 'fs/promises';
import path from 'path';
import {
  perResourceSriHashes,
  inlineScriptHashes,
  inlineStyleHashes,
  extScriptHashes,
  extStyleHashes,
} from '../src/generated/sriHashes.mjs';

const headersPath = path.join(process.cwd(), 'dist', '_headers');

async function generateCSPHeaders() {
  try {
    // Combine all script hashes
    const scriptHashes = new Set([
      ...inlineScriptHashes,
      ...extScriptHashes,
      ...Object.values(perResourceSriHashes.scripts),
    ]);

    // Combine all style hashes
    const styleHashes = new Set([
      ...inlineStyleHashes,
      ...extStyleHashes,
      ...Object.values(perResourceSriHashes.styles),
    ]);

    // Split script hashes into chunks to avoid length limits
    const scriptHashesArray = Array.from(scriptHashes);
    const scriptHashChunks = [];
    const CHUNK_SIZE = 15;

    for (let i = 0; i < scriptHashesArray.length; i += CHUNK_SIZE) {
      scriptHashChunks.push(scriptHashesArray.slice(i, i + CHUNK_SIZE));
    }

    // Create CSP headers with distributed script-src directives
    const cspHeaders = scriptHashChunks.map((chunk, index) => {
      if (index === 0) {
        // First header contains base directives and first chunk of script hashes
        return `Content-Security-Policy: default-src 'self'; 
          object-src 'self';
          script-src 'self' ${chunk.map(hash => `'${hash}'`).join(' ')};
          style-src 'self' ${Array.from(styleHashes)
            .map(hash => `'${hash}'`)
            .join(' ')};
          img-src 'self' https://ik.imagekit.io/truedaniyyel/;
          connect-src 'self';
          base-uri 'self';
          frame-ancestors 'none';
          worker-src 'self';
          manifest-src 'none';
          form-action 'self'`.replace(/\n\s+/g, ' ');
      } else {
        // Additional headers contain only script-src directives
        return `Content-Security-Policy: script-src 'self' ${chunk.map(hash => `'${hash}'`).join(' ')}`;
      }
    });

    // Read existing _headers file
    let headersContent = await fs.readFile(headersPath, 'utf-8');

    // Add each CSP header on a new line
    cspHeaders.forEach(header => {
      headersContent += '\n  ' + header;
    });

    // Write updated content back to _headers file
    await fs.writeFile(headersPath, headersContent);

    console.log(
      'CSP headers generated and _headers file updated successfully.'
    );
    console.log(`Generated ${cspHeaders.length} CSP headers`);
  } catch (error) {
    console.error('Error generating CSP headers:', error);
  }
}

generateCSPHeaders();
