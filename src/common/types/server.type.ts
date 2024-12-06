import { TUser } from './model.type';
import { Request } from 'express';

export type TRequest = Request;

export type TReqWithUser = {
  user: TUser;
} & TRequest;

export type TReqWithUserRefresh = {
  user: {
    attributes: TUser;
    refreshTokenExpires: Date;
  };
} & TRequest;
