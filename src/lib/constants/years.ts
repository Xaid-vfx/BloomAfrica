export default function CountryList() {
    let yearsArray = [];

    for (let year = 2000; year <= 2030; year++) {
        yearsArray.push(year);
    }

    return yearsArray;
}
