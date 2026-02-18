export async function encryptData(data: unknown): Promise<string> {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(jsonString);
  let binary = '';
  for (let i = 0; i < encodedData.length; i++) {
    binary += String.fromCharCode(encodedData[i]);
  }
  return btoa(binary);
}

export async function decryptData(encryptedData: string): Promise<unknown> {
  const binaryString = atob(encryptedData);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(bytes));
}

export function encrypt(input: string): string {
  return btoa(encodeURIComponent(input));
}

export function decrypt(input: string): string {
  return decodeURIComponent(atob(input));
}
