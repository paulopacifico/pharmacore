export function formatRelativeDate(initialDate: Date | string): string {
    const date =
        initialDate instanceof Date ? initialDate : new Date(initialDate);

    if (!(date instanceof Date) || isNaN(date.getTime())) return "???";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (isNaN(diffMs)) return "???";
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "agora";
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHour < 24) return `há ${diffHour}h`;
    if (diffDay === 1) return "ontem";
    if (diffDay < 7) return `há ${diffDay} dias`;
    return date.toLocaleDateString("pt-BR");
}
