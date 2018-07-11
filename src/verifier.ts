import { createVerify } from 'crypto';

function checkSignature(certBody: string, signature: string, requestBody: string): void {
  const veri = createVerify('RSA-SHA256');
  veri.update(requestBody, 'utf8');

  if (!veri.verify(certBody, signature, 'base64')) {
    throw new Error(`Invalid signature: "${signature}".`);
  }
}

function checkApplicationId(jsonRequestBody: any, applicationId: string) {
  if (jsonRequestBody.context.System.application.applicationId !== applicationId) {
    throw new Error(`Invalid application id: ${applicationId}.`);
  }
}

function getCertificate(): string {
  return `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwiMvQNKD/WQcX9KiWNMb
nSR+dJYTWL6TmqqwWFia69TyiobVIfGfxFSefxYyMTcFznoGCpg8aOCAkMxUH58N
0/UtWWvfq0U5FQN9McE3zP+rVL3Qul9fbC2mxvazxpv5KT7HEp780Yew777cVPUv
3+I73z2t0EHnkwMesmpUA/2Rp8fW8vZE4jfiTRm5vSVmW9F37GC5TEhPwaiIkIin
KCrH0rXbfe3jNWR7qKOvVDytcWgRHJqRUuWhwJuAnuuqLvqTyAawqEslhKZ5t+1Z
0GN8b2zMENSuixa1M9K0ZKUw3unzHpvgBlYmXRGPTSuq/EaGYWyckYz8CBq5Lz2Q
UwIDAQAB
-----END PUBLIC KEY-----`;
}

export default async function verifier(signature: string, applicationId: string, requestBody: string): Promise<any> {
  if (!signature) {
    throw new Error('Missing signature.');
  }

  if (!applicationId) {
    throw new Error('Missing applicationId.');
  }

  if (!requestBody) {
    throw new Error('Missing requestBody.');
  }

  const certBody = await getCertificate();
  checkSignature(certBody, signature, requestBody);

  const jsonRequestBody = JSON.parse(requestBody);
  checkApplicationId(jsonRequestBody, applicationId);
  return jsonRequestBody;
}
