define(['i18n!nls/months'], function (months) {

    var month_n     = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var monthDays = [      31,        28,        31,     30,     31,     30,     31,      31,        30,         31,        30,          31 ];
    var monthCumulDays = [  0,        31,        59,     90,    120,    151,    181,     212,       243,        273,       304,         334, 365];
    var monthDayStart = [   3,         6,         6,      2,      4,      0,      2,       5,         1,          3,         6,           1];
    var monthOverflow = [   0,         0,         0,     30,      0,      0,      0,       0,        31,          0,         0,           30];

    return {
        /**
         * get the name of the month
         */
        monthName: function (oneBasedMonthIndex){
            return months[month_n[oneBasedMonthIndex-1]];
        }, // monthName

        /**
         * one-based index of a day in the year
         */
        dayOfYear: function (oneBasedMonthIndex, d) {
            var i = oneBasedMonthIndex - 1;
            return monthCumulDays[i] + d;
        }, // dayOfYear

        /**
         * the day this month starts with
         */
        dayStart: function (oneBasedMonthIndex) {
            return monthDayStart[oneBasedMonthIndex-1];
        }, // dayStart

        /**
         * first day from previous month to overflow or 0  if none
         */
        daysOverflow: function (oneBasedMonthIndex) {
            return monthOverflow[oneBasedMonthIndex-1];
        }, // daysOverflow

        /**
         * number of days in given month
         */
        days: function (oneBasedMonthIndex) {
            return monthDays[oneBasedMonthIndex-1];
        }, // daysOverflow

    };

});
