const isDatePast = (date) => {
    const currentDate = new Date();
    return date < currentDate;
}

module.exports = {
    isDatePast
} 