import type { Metadata, QueueItem } from './types';

export function escapeXml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const alt = (tag: string, value: string) => value
  ? `      <${tag}><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(value)}</rdf:li></rdf:Alt></${tag}>` : '';
const bag = (tag: string, values: string[]) => values.length
  ? `      <${tag}><rdf:Bag>${values.map((v) => `<rdf:li>${escapeXml(v)}</rdf:li>`).join('')}</rdf:Bag></${tag}>` : '';
const seq = (tag: string, values: string[]) => values.length
  ? `      <${tag}><rdf:Seq>${values.map((v) => `<rdf:li>${escapeXml(v)}</rdf:li>`).join('')}</rdf:Seq></${tag}>` : '';
const attr = (name: string, value: string) => value ? ` ${name}="${escapeXml(value)}"` : '';

export function validateMetadata(metadata: Metadata): string[] {
  const errors: string[] = [];
  if (!metadata.title.trim()) errors.push('Add a title');
  if (!metadata.description.trim()) errors.push('Add a caption');
  if (!metadata.keywords.length) errors.push('Add at least one keyword');
  if (metadata.title.length > 256) errors.push('Shorten the title to 256 characters');
  if (metadata.description.length > 2000) errors.push('Shorten the caption to 2,000 characters');
  if (metadata.dateCreated && !/^\d{4}-\d{2}-\d{2}$/.test(metadata.dateCreated)) errors.push('Use YYYY-MM-DD for the date');
  return errors;
}

export function makeXmp(item: Pick<QueueItem, 'fileName' | 'metadata'>): string {
  const m = item.metadata;
  const parts = [
    '<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>',
    '<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Caption Queue 1.0">',
    '  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">',
    `    <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"${attr('photoshop:City', m.city)}${attr('photoshop:State', m.state)}${attr('photoshop:Country', m.country)}${attr('photoshop:DateCreated', m.dateCreated)}${attr('Iptc4xmpCore:CountryCode', '')}>`,
    alt('dc:title', m.title),
    alt('dc:description', m.description),
    alt('dc:rights', m.rights),
    bag('dc:subject', m.keywords),
    seq('dc:creator', m.creator ? [m.creator] : []),
    '    </rdf:Description>',
    '  </rdf:RDF>',
    '</x:xmpmeta>',
    '<?xpacket end="w"?>'
  ];
  return parts.filter(Boolean).join('\n');
}

export function sidecarName(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return `${dot > 0 ? fileName.slice(0, dot) : fileName}.xmp`;
}

export function renderTokens(template: string, item: QueueItem, shootName: string, sequence: number): string {
  return template.replace(/\{(filename|sequence|shoot|date)\}/g, (_, key: string) => ({
    filename: item.fileName.replace(/\.[^.]+$/, ''),
    sequence: String(sequence).padStart(3, '0'),
    shoot: shootName,
    date: item.metadata.dateCreated || new Date().toISOString().slice(0, 10)
  }[key] ?? ''));
}
