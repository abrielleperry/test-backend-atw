import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateFilter = ({ onDateChosen }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (onDateChosen) {
            onDateChosen(date);
        }
    };

    return (
        <div>
            <label>
                Filter by Start Date:
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    isClearable
                    placeholderText="Select a date"
                />
            </label>
        </div>
    );
};

export default DateFilter;
