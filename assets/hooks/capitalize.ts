export default function capitalizeWords(input?: string | null): string {
    const str = typeof input === "string" ? input : "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}