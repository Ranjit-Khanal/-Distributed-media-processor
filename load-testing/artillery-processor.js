/**
 * Artillery Processor for Search Load Testing
 * 
 * This processor generates random search queries and handles dynamic data.
 */

module.exports = {
    generateRandomString,
    generateRandomQuery,
};

/**
 * Generate a random string for search queries
 */
function generateRandomString() {
    const words = [
        'photo', 'video', 'image', 'media', 'picture', 'clip',
        'nature', 'portrait', 'landscape', 'urban', 'abstract',
        'test', 'sample', 'demo', 'example', 'document',
    ];
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    
    return `${randomWord}${randomNum}`;
}

/**
 * Generate a random search query
 */
function generateRandomQuery() {
    const queries = [
        'nature',
        'portrait',
        'landscape',
        'urban',
        'abstract',
        'test',
        'sample',
    ];
    
    return queries[Math.floor(Math.random() * queries.length)];
}

