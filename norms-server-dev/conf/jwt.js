
module.exports.JWTHeader = {
    type: 'JWT',
    // ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'HS256', 'HS384', 'HS512', 'none']
    algorithm: 'HS256', // Command: openssl list -digest-algorithms
    expire: 30, // seconds
}

module.exports.SecretKey = 'aEFswerasdUSJDKLdnsadnashdU';
