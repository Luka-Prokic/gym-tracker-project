import React from "react";
import { CardioTable } from "../gym/cardio_table/CardioTable";

interface LayoutCardioTableProps {
    exerciseId: string;
    supersetId?: string;
}

export const LayoutCardioTable: React.FC<LayoutCardioTableProps> = ({ exerciseId, supersetId }) => {
    return (
        <CardioTable 
            exerciseId={exerciseId} 
            supersetId={supersetId}
            readOnly={false}
        />
    );
};

export default LayoutCardioTable;
