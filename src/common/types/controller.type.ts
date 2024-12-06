export type TApiResponse<T> = {
  data: T | null;
  meta: Record<string, any> | null;
  message: string | null;
};
