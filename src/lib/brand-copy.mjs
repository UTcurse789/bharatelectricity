// Rebrand human-facing copy only. Source URLs, legacy routes and asset paths stay stable.
export function brandCopy(text) {
 return text
  .replace(/Bharat Electricity\s*(?:,|·)?\s*(?:together with\s+)?(?:POWERGEN(?:\s+India)?|PGID)\s*(?:,|·|&|and)?\s*Indian Utility Week/gi,'Bharat Electricity & Indian Utility Week')
  .replace(/POWERGEN\s+International/gi,'International power generation event')
  .replace(/POWERGEN\s+(Asia|Europe|Africa)/gi,'$1 energy event')
  .replace(/POWERGEN(?:\s+India)?|\bPGID\b/gi,'Bharat Electricity')
  .replace(/(?:,|&|and)?\s*Indian Utility Week/gi,'')
  .replace(/Bharat Electricity\s*(?:,|·|&|and)\s*Bharat Electricity/gi,'Bharat Electricity');
}
