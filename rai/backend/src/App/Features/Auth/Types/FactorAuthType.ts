export enum AuthFactorType {
    firstFactor = "1st-factor-authenticated",
    secondFactor = "2nd-factor-authenticated"
  }
  
  export type TokenPayload = {
    sub: number;
    step: AuthFactorType;
  };