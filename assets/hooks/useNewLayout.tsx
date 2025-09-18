import { Layout } from "../../components/context/ExerciseLayoutZustand";

const formatCreationDate = (timestamp: number) => {
    const date = new Date(timestamp);

    // Format as "MMM DD, YYYY at HH:MM"
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    return date.toLocaleDateString('en-US', options);
};

export const useNewLayout = () => {
    const timestamp = new Date().getTime();
    const newLayout: Layout = {
        id: "gym_" + timestamp,
        name: formatCreationDate(timestamp), // Default name is creation date/time
        layout: [],
    };

    return newLayout;
};