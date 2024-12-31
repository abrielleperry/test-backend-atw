import React, { useState, useEffect } from "react";
import styles from "./Card.module.css";
import { format, parseISO, differenceInSeconds } from "date-fns";


// define card component with props for festival details
const Card = ({ name, streetAddress, addressLocality, country, startDate, endDate, image, locationName }) => {

    // state variables to store remaining time until the festival starts
    const [remainingTime, setRemainingTime] = useState("");

    // func to format the startDate from 2024-12-01 -> Jan 12, 24
    const formattedStartDate =
        startDate && !isNaN(Date.parse(startDate))
            ? format(parseISO(startDate), "MMM d, yy")
            : "TBD";

    // func to format the endDate from 2024-12-01 -> Jan 12, 24
    const formattedEndDate =
        endDate && !isNaN(Date.parse(endDate))
            ? format(parseISO(endDate), "MMM d, yy")
            : "TBD";

    // updates countdown timer when component mounts or when startDate changes
    useEffect(() => {
        if (startDate) {
            const interval = setInterval(() => { // interval checks remaining time every second
                const now = new Date(); // get current date and time
                const start = parseISO(startDate);
                const end = endDate ? parseISO(endDate) : null;
                const diffInSeconds = differenceInSeconds(start, now); // calc diff in secs between now and startDate
                const diffInSecondsToEnd = end ? differenceInSeconds(end, now) : null; // if endDate avilable, calc diff in secs until end date

                // checks if start date has passed
                if (diffInSeconds <= 0) {
                    // if endDate exists and still in future display message
                    if (end && diffInSecondsToEnd > 0) {
                        setRemainingTime("Already underway however you can still buy tickets!");
                    } else {
                        // if past endDate display concluded message
                        setRemainingTime("This festival has already concluded!");
                    }
                    clearInterval(interval);
                } else {
                    // calc remaining days, hours, minutes, seconds
                    const days = Math.floor(diffInSeconds / (3600 * 24));
                    const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
                    const minutes = Math.floor((diffInSeconds % 3600) / 60);
                    const seconds = diffInSeconds % 60;

                    // update remaining rtime state with calculated values
                    setRemainingTime(`Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [startDate, endDate]);

    // render card component with all festival details
    return (
        <div className={styles.card}>
            <img className={styles.image} src={image} alt={name} />  {/* displays festival image*/}
            <h2 className={styles.name}>{name}</h2> {/* displays name of festival */}
            <p className={styles.locationName}>at <strong>{locationName}</strong></p> {/* displays name of venue */}
            <p className={styles.streetAddress}> {streetAddress}</p> {/* displays street address */}
            <p className={styles.addressDetails}> {addressLocality}, {country}</p> {/* displays state/provence and country */}
            <p className={styles.startDate}>{formattedStartDate} - {formattedEndDate}</p> {/* displays start and end date */}
            <p className={styles.countdown}> {remainingTime}</p> {/* displays time remaining until startDate */}
        </div>
    );
};

export default Card;
