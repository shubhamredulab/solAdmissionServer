const getYear = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    let year;
    if (currentMonth >= 0 && currentMonth <= 9) {
        year = currentDate.getFullYear();
    } else {
        year = currentDate.getFullYear() + 1;
    }
    return year;
};

export default getYear;