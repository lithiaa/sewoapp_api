export interface IWrappedError {
  meta: {
    status: 'error';
    statusCode: number;
    message: string;
  };
  data: null;
}
