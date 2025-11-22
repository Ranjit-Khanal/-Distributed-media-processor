import http from 'k6/http';
import { check, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

/**
 * K6 Load Test Script for Media Upload Endpoint
 * 
 * This script tests the media upload endpoint with various load scenarios.
 * 
 * Usage:
 *   k6 run load-testing/k6-upload.js
 * 
 * With custom options:
 *   k6 run --vus 10 --duration 30s load-testing/k6-upload.js
 */

export const options = {
    stages: [
        { duration: '30s', target: 10 },   // Ramp up to 10 users
        { duration: '1m', target: 10 },    // Stay at 10 users
        { duration: '30s', target: 20 },    // Ramp up to 20 users
        { duration: '1m', target: 20 },     // Stay at 20 users
        { duration: '30s', target: 0 },     // Ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],  // 95% of requests should be below 2s
        http_req_failed: ['rate<0.01'],     // Error rate should be less than 1%
        http_reqs: ['rate>5'],              // Throughput should be at least 5 req/s
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const API_TOKEN = __ENV.API_TOKEN || 'your-auth-token-here';

export default function () {
    // Create a simple test image (1x1 pixel PNG)
    const imageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const imageBuffer = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));

    // Create form data
    const formData = new FormData();
    formData.append('file', imageBuffer, {
        filename: `test-${Date.now()}.png`,
        contentType: 'image/png',
    });
    formData.append('tags[]', 'test');
    formData.append('tags[]', 'k6-load-test');

    const params = {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            ...formData.headers,
        },
        timeout: '30s',
    };

    const response = http.post(`${BASE_URL}/api/media/upload`, formData.body(), params);

    check(response, {
        'upload status is 201': (r) => r.status === 201,
        'response has media id': (r) => {
            try {
                const body = JSON.parse(r.body);
                return body.data && body.data.id;
            } catch (e) {
                return false;
            }
        },
        'response time < 5s': (r) => r.timings.duration < 5000,
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }),
        'load-testing/k6-upload-results.json': JSON.stringify(data),
    };
}

function textSummary(data, options) {
    // Simple text summary
    return `
    ====================
    K6 Upload Load Test Results
    ====================
    Total Requests: ${data.metrics.http_reqs.values.count}
    Failed Requests: ${data.metrics.http_req_failed.values.rate * 100}%
    Average Response Time: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
    P95 Response Time: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
    P99 Response Time: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms
    Requests per Second: ${data.metrics.http_reqs.values.rate.toFixed(2)}
    ====================
    `;
}

