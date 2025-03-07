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

    // Split CSP into multiple headers
    const cspHeaders = [
      // First CSP header with default-src, object-src, and script-src directives
      `Content-Security-Policy: default-src 'self'; object-src 'self'; script-src 'self' ${Array.from(
        scriptHashes
      )
        .map(hash => `'${hash}'`)
        .join(' ')};`,

      // Second CSP header with connect-src, style-src, and base-uri directives
      `Content-Security-Policy: connect-src 'self'; style-src 'self' ${Array.from(
        styleHashes
      )
        .map(hash => `'${hash}'`)
        .join(' ')}; base-uri 'self';`,

      // Third CSP header with remaining directives
      `Content-Security-Policy: img-src 'self' https://ik.imagekit.io/truedaniyyel/; frame-ancestors 'none'; worker-src 'self'; manifest-src 'none'; form-action 'self';`,
    ];

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
  } catch (error) {
    console.error('Error generating CSP headers:', error);
  }
}

generateCSPHeaders();
