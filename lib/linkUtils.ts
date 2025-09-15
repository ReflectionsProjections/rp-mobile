/**
 * Utility functions for parsing and handling links in event descriptions
 */

export interface ParsedLink {
  url: string;
  title: string;
}

/**
 * Parses a link from event description in the format: ":link: URL | Title"
 * @param description - The event description to parse
 * @returns ParsedLink object with url and title, or null if no link found
 */
export function parseEventLink(description: string): ParsedLink | null {
  if (!description || !description.includes(':link:')) {
    return null;
  }

  const lines = description.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Look for the link pattern: :link: URL | Title
    if (trimmedLine.startsWith(':link:')) {
      const linkContent = trimmedLine.replace(':link:', '').trim();
      
      // Split by pipe to separate URL and title
      const parts = linkContent.split('|').map(part => part.trim());
      
      if (parts.length >= 2) {
        const url = parts[0];
        const title = parts[1];
        
        // Basic URL validation
        if (url && title && (url.startsWith('http://') || url.startsWith('https://'))) {
          return {
            url,
            title
          };
        }
      }
    }
  }
  
  return null;
}

export function stripEventLinks(description: string): string {
  if (!description) return '';

  const lines = description.split('\n');
  return lines
    .filter(line => !line.trim().startsWith(':link:')) // drop link lines
    .join('\n')
    .trim();
}