export default {
    jwt: {
        secret: process.env.APP_SECRET || 'd32c2a37d3fe1372197751e4576080a0',
        expiresIn: '1d',
    },
}