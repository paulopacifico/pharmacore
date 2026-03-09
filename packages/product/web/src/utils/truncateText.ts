export interface TruncateTextConfig {
    removeHTML?: boolean;
    removeMarkdown?: boolean;
}

export const truncateText = (
    text: string,
    maxLength: number,
    config?: TruncateTextConfig,
) => {
    let truncatedText = text;
    if (config?.removeHTML) {
        truncatedText = truncatedText.replace(/<[^>]+>/g, "");
    }
    if (config?.removeMarkdown) {
        truncatedText = truncatedText
            .replace(/(\*\*|__)(.*?)\1/g, "$2")
            .replace(/(\*|_)(.*?)\1/g, "$2")
            .replace(/~~(.*?)~~/g, "$1")
            .replace(/`(.*?)`/g, "$1")
            .replace(/!\[.*?\]\(.*?\)/g, "")
            .replace(/#{1,6}\s+/g, "");
    }
    if (truncatedText.length <= maxLength) return truncatedText;
    return truncatedText.slice(0, maxLength) + "...";
};
