const SPECIAL: Record<string, string> = {
    deadlift: "DL",
    "romanian deadlift": "RDL",
    "stiff leg deadlift": "SDL",
    "sumo deadlift": "SuDL",
};

export default function getInitials(text: string): string {
    const normalized = text.trim().toLowerCase();
    if (SPECIAL[normalized]) {
        return SPECIAL[normalized];
    }

    return normalized
        .split(/\s+/)
        .map(word => SPECIAL[word] || word[0].toUpperCase())
        .join("");
}