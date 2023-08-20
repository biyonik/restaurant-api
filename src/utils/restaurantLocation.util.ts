const nodeGeocoder = require('node-geocoder')
export default class RestaurantLocation {
    static async getRestaurantLocation(address:string) {
        try {
            const options = {
                provider: process.env.GEOCODER_PROVIDER,
                httpAdapter: 'https',
                apiKey: process.env.GEOCODER_API_KEY,
                language: 'en',
                location: address,
                formatter: null
            }
            const geocoder = nodeGeocoder(options)
            const loc = await geocoder.geocode(address)
            const location = {
                type: 'Point',
                coordinates: [loc[0].longitude, loc[0].latitude],
                formattedAddress: loc[0].formattedAddress,
                city: loc[0].city,
                state: loc[0].state,
                countryCode: loc[0].countryCode,
                zipCode: loc[0].zipCode
            }
            return location;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
