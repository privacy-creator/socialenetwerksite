// import { Injectable } from '@angular/core';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class EncryptionService {
//   private key!: CryptoKey;
//
//   async getKey(): Promise<CryptoKey> {
//     if (this.key) return this.key;
//
//     const savedKey = localStorage.getItem('aes-key');
//     if (savedKey) {
//       const raw = this.base64ToUint8Array(savedKey);
//       this.key = await crypto.subtle.importKey(
//         'raw',
//         raw,
//         { name: 'AES-GCM' },
//         true,
//         ['encrypt', 'decrypt']
//       );
//     } else {
//       this.key = await crypto.subtle.generateKey(
//         { name: 'AES-GCM', length: 256 },
//         true,
//         ['encrypt', 'decrypt']
//       );
//       const exported = await crypto.subtle.exportKey('raw', this.key);
//       const exportedBase64 = this.uint8ArrayToBase64(new Uint8Array(exported));
//       localStorage.setItem('aes-key', exportedBase64);
//     }
//     return this.key;
//   }
//
//   async encrypt(plainText: string): Promise<{ cipherText: ArrayBuffer; iv: Uint8Array }> {
//     const key = await this.getKey();
//     const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes IV for AES-GCM
//     const encoded = new TextEncoder().encode(plainText);
//     const cipherText = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
//     return { cipherText, iv };
//   }
//
//   async decrypt(cipherText: ArrayBuffer, iv: Uint8Array): Promise<string> {
//     const key = await this.getKey();
//     const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherText);
//     return new TextDecoder().decode(decrypted);
//   }
//
//   uint8ArrayToBase64(bytes: Uint8Array): string {
//     let binary = '';
//     for (const b of bytes) {
//       binary += String.fromCharCode(b);
//     }
//     return window.btoa(binary);
//   }
//
//   base64ToUint8Array(base64: string): Uint8Array {
//     const binaryString = window.atob(base64);
//     const len = binaryString.length;
//     const bytes = new Uint8Array(len);
//     for (let i = 0; i < len; i++) {
//       bytes[i] = binaryString.charCodeAt(i);
//     }
//     return bytes;
//   }
//
//   async setPassword(password: string): Promise<void> {
//     const enc = new TextEncoder();
//     const salt = enc.encode('sociaal-app'); // constante salt (kan ook dynamisch als je wil)
//
//     const keyMaterial = await crypto.subtle.importKey(
//       'raw',
//       enc.encode(password),
//       { name: 'PBKDF2' },
//       false,
//       ['deriveKey']
//     );
//
//     this.key = await crypto.subtle.deriveKey(
//       {
//         name: 'PBKDF2',
//         salt,
//         iterations: 100000,
//         hash: 'SHA-256',
//       },
//       keyMaterial,
//       { name: 'AES-GCM', length: 256 },
//       false,
//       ['encrypt', 'decrypt']
//     );
//   }
//
// }
