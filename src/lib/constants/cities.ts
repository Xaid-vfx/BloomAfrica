export async function getCities(countryName: string, stateName: string) {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                country: countryName,
                state: stateName
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || 'Failed to fetch cities');
        }

        return data.data || [];
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
}

// Cache for storing previously fetched cities
const cityCache: { [key: string]: string[] } = {};

// Function with caching
export async function getCitiesWithCache(countryName: string, stateName: string) {
    const cacheKey = `${countryName}-${stateName}`;

    // Check if cities are already in cache
    if (cityCache[cacheKey]) {
        return cityCache[cacheKey];
    }

    // If not in cache, fetch and store in cache
    const cities = await getCities(countryName, stateName);
    cityCache[cacheKey] = cities;
    return cities;
} 