export function htmlParser(html: string): (Node | TextNode)[];
/**
 * Represents a comment with a name and content.
 */
export type TextNode = {
    /**
     * - The name of the comment (e.g., 'comment').
     */
    name: string;
    /**
     * - The content of the comment.
     */
    value: string;
};
/**
 * Represents a structured entity with a name, properties, and optional children.
 */
export type Node = {
    /**
     * - The name of the structured entity.
     */
    name: string;
    /**
     * - Properties associated with the structured entity.
     */
    properties: Object;
    /**
     * - An array of child structured entities.
     */
    children: (Node | TextNode)[];
};
