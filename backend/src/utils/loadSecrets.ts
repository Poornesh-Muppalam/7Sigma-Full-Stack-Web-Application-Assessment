import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecretValue(secretName: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: `projects/7sigma-fullstack-project/secrets/${secretName}/versions/latest`,
  });

  const payload = version.payload?.data?.toString();
  if (!payload) {
    throw new Error(`Secret ${secretName} is empty or not found.`);
  }

  return payload;
}
