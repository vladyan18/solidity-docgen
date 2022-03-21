import { DocItemWithContext, DOC_ITEM_CONTEXT, Build } from '../site';

export function readItemDocs(item: DocItemWithContext): string | undefined {
  const { build } = item[DOC_ITEM_CONTEXT];
  if ('documentation' in item && item.documentation) {
    const { source, start, length } = decodeSrc(item.documentation.src, build);
    return build.input.sources[source]?.content?.slice(start, start + length);
  }
}

function decodeSrc(src: string, build: Build): { source: string; start: number; length: number } {
  const [start, length, sourceId] = src.split(':').map(s => parseInt(s));
  if (start === undefined || length === undefined || sourceId === undefined) {
    throw new Error(`Bad source string ${src}`);
  }
  const source = Object.keys(build.output.sources).find(s => build.output.sources[s].id === sourceId);
  if (source === undefined) {
    throw new Error(`No source with id ${sourceId}`);
  }
  return { source, start, length };
}