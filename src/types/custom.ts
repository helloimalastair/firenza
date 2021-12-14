declare type b2AuthResponse = {
  absoluteMinimumPartSize: number,
  accountId: string,
  allowed: {
    bucketId: string,
    bucketName: string,
    capabilities: string[],
    namePrefix: string | null
  },
  apiUrl: string,
  authorizationToken: string,
  downloadUrl: string,
  recommendedPartSize: number,
  s3ApiUrl: string
};

declare type EnvironmentBindings = {
  B2APIKEY: string;
  B2URL: string;
  BUCKET_NAME: string;
  MAX_AGE: number;
  KV: KVNamespace;
};

declare module "*.html" {
  const content: string;
  export default content;
};