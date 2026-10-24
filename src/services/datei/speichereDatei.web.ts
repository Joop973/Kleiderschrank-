/** Im Browser: über das Teilen-Menü (iPhone) oder als Download. */
export async function speichereDatei(name: string, inhalt: string, typ: string): Promise<boolean> {
  const datei = new File([inhalt], name, { type: typ });
  if (navigator.canShare?.({ files: [datei] })) {
    try {
      await navigator.share({ files: [datei] });
      return true;
    } catch {
      return false;
    }
  }
  const url = URL.createObjectURL(datei);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return true;
}
