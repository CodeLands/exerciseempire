type ResponseSuccess<T> = {
    success: true;
    message: string;
    data: T;
  };
  
  type ResponseFailure = {
    success: false;
    errors: string[];
  };
  
  export type Response<T> = ResponseSuccess<T> | ResponseFailure;