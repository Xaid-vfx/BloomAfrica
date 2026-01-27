export async function getStates(countryName: string) {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                country: countryName
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || 'Failed to fetch states');
        }

        return data.data.states.map((state: { name: string }) => state.name);
    } catch (error) {
        console.error('Error fetching states:', error);
        return [];
    }
}

// Cache for storing previously fetched states
const stateCache: { [key: string]: string[] } = {};

// Function with caching
export async function getStatesWithCache(countryName: string) {
    // Check if states are already in cache
    if (stateCache[countryName]) {
        return stateCache[countryName];
    }

    // If not in cache, fetch and store in cache
    const states = await getStates(countryName);
    stateCache[countryName] = states;
    return states;
} 